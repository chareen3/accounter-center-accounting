const router = require('express').Router();
const _p      = require('../utils/promise_error');
const  {Database}   = require('../utils/Database');
const  {StockModel}   = require('../models/StockModel');
const    stockM = new StockModel();

let    db = new Database();

router.post('/api/get-individual-products',async(req,res,next)=>{
  let cluases = ``

  if(req.body.productId != undefined){
      cluases += ` and p.prod_id = '${req.body.productId}' `
  }

  if(req.body.service != undefined && req.body.service == true){
    cluases += ` and p.prod_is_service = 'true' `
}
    let [productsError,products] =  await _p(db.query(`select p.prod_id,p.prod_code,p.prod_sale_rate,p.prod_sale_rate as prod_rate,p.prod_whole_sale_rate,
    c.prod_cat_name,concat(pn.prod_name,' - ',ifnull(p.prod_code,' ')) as prod_name,u.prod_unit_name,
    ifnull(pr.prod_avarage_rate,0) as prod_purchase_rate
     from 
    tbl_products p 
    left join tbl_product_categories c on p.prod_cat_id = c.prod_cat_id
    left join tbl_products_names pn on p.prod_name_id = pn.prod_name_id
    left join tbl_product_units u on p.prod_unit_id = u.prod_unit_id
    left join tbl_product_purchase_rate pr on p.prod_id = pr.product_id 
    and pr.branch_id=?
    where   find_in_set(?,prod_branch_ids) <> 0 and 
    p.prod_status='active' 
    ${cluases}
    order by pn.prod_name asc`,[req.user.user_branch_id,req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(productsError && !products){
        next(productsError)
    }else{
       
        res.json({
            error:false,
            message:products
        });
    }
});


let pCurrentStock =  async(productId,branch_id)=>{
  let [qryErr,data] =  await _p(db.query(`select ((cs.purchase_qty+cs.sale_return_qty+
         cs.transfer_to_qty+cs.production_qty)-(cs.sale_qty +
              cs.purchase_return_qty + cs.damage_qty
               + cs.transfer_from_qty) ) as current_stock 
               from tbl_product_current_stock cs where cs.prod_id=? and 
               cs.branch_id=? 
             
               `,[productId,branch_id]).then((row)=>{
                 
                 return row.length==0?0:row[0].current_stock;
     }));
         if(qryErr && !data){
         return next(qryErr);
         }
         else{
           return data
         }
 }



router.post('/api/transfer-add',async(req,res,next)=>{
    let transfer = req.body.transfer;
    let cart = req.body.cart;
            let salePayload =  {
              transfer_b_from: req.user.user_branch_id,
              transfer_b_to: transfer.transfer_b_to,

              transfer_note: transfer.transfer_note,
              transfer_c_by: transfer.transfer_c_by,
              transfer_amount: transfer.transfer_amount,
              transfer_c_isodt:transfer.transfer_c_isodt
            }

          let [transferAddErr,transferAdd] = await _p(db.insert('tbl_product_transfer_master',salePayload).then((result)=>{
              return result;
          }));

          if(transferAddErr && !transferAdd){
          return next(transferAddErr);
          }
          else{
            // Cart looping start
            cart.forEach(async (element )=> {

               /// Previous Product Stock for avarage
               let beforePurchaseStock =  await  Promise.all([pCurrentStock(element.prod_id,transfer.transfer_b_to)]);
                   beforePurchaseStock = beforePurchaseStock[0]
               /// End


              let savePayload = {
                transfer_id: transferAdd.insertId,
                transfer_prod_id: element.prod_id,
                transfer_qty: element.prod_qty,
                transfer_pur_rate: element.prod_purchase_rate,
                transfer_total: element.prod_total,
              }
            
            let [transferDetailAddErr,transferDetailAdd] = await _p(db.insert('tbl_product_transfer_details',savePayload).then((result)=>{
                return result;
            }));

            if(transferDetailAddErr && !transferDetailAdd){
                return next(transferDetailAddErr);
            }

            // Transfer From Start
            let [fromTransferErr,fromTransfer] =  await _p(db.countRows(`select * from tbl_product_current_stock where prod_id=? and branch_id=?  `,[element.prod_id,req.user.user_branch_id]).then((res)=>{
                  return res;
            }));
            if(fromTransfer>0){
             await _p(db.query(`update tbl_product_current_stock set transfer_from_qty=transfer_from_qty+? where prod_id=? and branch_id=?  `,[element.prod_qty,element.prod_id,req.user.user_branch_id]).then((res=>{
                return res;
              })));
            }else{
              let savePayload = {
                prod_id: element.prod_id,
                transfer_from_qty: element.prod_qty,
                branch_id: req.user.user_branch_id,
              }
            await _p(db.insert('tbl_product_current_stock',savePayload).then((result)=>{
                return result;
            }));
         
            
            
            }
            // Transfer from End.
          // Transfer to Start 
          let [toTransferErr,toTransfer] =  await _p(db.countRows(`select * from tbl_product_current_stock where prod_id=? and branch_id=?  `,[element.prod_id,transfer.transfer_b_to]).then((res)=>{
                return res;
          }));
          if(toTransfer>0){
           await _p(db.query(`update tbl_product_current_stock set transfer_to_qty=transfer_to_qty+? where prod_id=? and branch_id=?  `,[element.prod_qty,element.prod_id,transfer.transfer_b_to]).then((res=>{
              return res;
            })))
          }else{
            let savePayload = {
              prod_id: element.prod_id,
              transfer_to_qty: element.prod_qty,
              branch_id: transfer.transfer_b_to,
            }
          await _p(db.insert('tbl_product_current_stock',savePayload).then((result)=>{
              return result;
          }));

          

            
          }
          // Transfer To End.


            // if this product not available in this branch so update
            let [checkProdAvaErr,checkProdAva] =  await _p(db.countRows(`select prod_branch_ids from tbl_products where prod_id=? and find_in_set(?,prod_branch_ids)<>0 `,[element.prod_id,transfer.transfer_b_to]).then((res=>{
              return res;
            })));

            if(checkProdAva==0){
            let[a,b] =  await _p(db.query(`update tbl_products set prod_branch_ids= concat(prod_branch_ids,',${transfer.transfer_b_to}') where prod_id=? `,[element.prod_id]).then((res=>{
                return res;
              })));
            }
            //end



            /// Product Avarage Calculation
            // purchase rate entry check 
            let [getRateForProdErr,getRateForProd] =  await _p(db.query(`select ifnull(prod_avarage_rate,0) as prod_avarage_rate from tbl_product_purchase_rate  where product_id=? and branch_id=?  `,[element.prod_id,transfer.transfer_b_to]).then((res)=>{
              return res;
            }));

           let previousProdAvgRate =  getRateForProd.length == 0?0:getRateForProd[0].prod_avarage_rate;
            // previous stock value
            let  previousStockValue =  beforePurchaseStock*previousProdAvgRate;
            //End

            // Current Purchase stock value
             let currentPurchaseStockValue = element.prod_qty * element.prod_purchase_rate;
            // Ennd
            // Previouse & current Total
            let totalQty = beforePurchaseStock + parseFloat(element.prod_qty);
            let totalStockValue = previousStockValue + parseFloat(currentPurchaseStockValue)

            // Get Finaly product Avarage
            let productPurchaseRate = totalStockValue / totalQty;

           if(getRateForProd.length == 0){
            let savePayload = {
              product_id: element.prod_id,
              prod_avarage_rate: productPurchaseRate,
              branch_id: transfer.transfer_b_to,
            }
           await _p(db.insert('tbl_product_purchase_rate',savePayload).then((result)=>{
              return result;
            }));
           }else{
            await _p(db.query(`update tbl_product_purchase_rate set prod_avarage_rate=? where product_id=? and branch_id=?  `,[productPurchaseRate,element.prod_id,transfer.transfer_b_to]))
           }


          
          });/// Cart looping End.
            res.json({error:false,message:{msg:'Transfer Successfully.',transferId: transferAdd.insertId}});
          }
    });

    router.post('/api/transfer-update',async(req,res,next)=>{
        let transfer = req.body.transfer;
        let cart = req.body.cart;
                let transferPayload =  {
                  transfer_b_to: transfer.transfer_b_to,
                 
                  transfer_note: transfer.transfer_note,
                  transfer_c_by: transfer.transfer_c_by,
                  transfer_c_isodt: transfer.transfer_c_isodt,
                }
 

              // Update  Condition
              let updateCond = {
                transfer_id: transfer.transfer_id
              }
              let [transferAddErr,transferAdd] = await _p(db.update('tbl_product_transfer_master',transferPayload,updateCond).then((result)=>{
                  return result;
              }));
    
              if(transferAddErr && !transferAdd){
              return next(transferAddErr);
              }
              else{
                // Old Transfer start
                let [oldTransferDetailsErr,oldTransferDetails] =  await _p(db.query(`select 
                tm.transfer_b_from,tm.transfer_b_to,trd.*

                from tbl_product_transfer_details trd
                left join  tbl_product_transfer_master tm on tm.transfer_id = trd.transfer_id
                where 
                 tm.transfer_status='a' and  tm.transfer_id=? 

                `,[transfer.transfer_id]).then((res)=>{
                    return res;
                }));
              

                await _p(db.delete(`tbl_product_transfer_details`,{transfer_id:transfer.transfer_id}).then((res)=>{
                    return res;
                }));


                oldTransferDetails.forEach(async(oldProduct)=>{

                   /// Previous Product Stock for avarage
                  let beforePurchaseStock =  await  Promise.all([pCurrentStock(oldProduct.transfer_prod_id,oldProduct.transfer_b_to)]);
                  beforePurchaseStock = beforePurchaseStock[0]
                  /// End


                    // From quantity minus
                   await _p(db.query(`update tbl_product_current_stock set transfer_from_qty=transfer_from_qty-? where prod_id=? and branch_id=?  `,[oldProduct.transfer_qty,oldProduct.transfer_prod_id,oldProduct.transfer_b_from]).then((res=>{
                        return res;
                      })));
                    // End
                    // To quantity minus
                    await _p(db.query(`update tbl_product_current_stock set transfer_to_qty=transfer_to_qty-? where prod_id=? and branch_id=?  `,[oldProduct.transfer_qty,oldProduct.transfer_prod_id,oldProduct.transfer_b_to]).then((res=>{
                        return res;
                      })));
                    // End


                       


                      /// Product Avarage Calculation
            // purchase rate entry check 
            let [getRateForProdErr,getRateForProd] =  await _p(db.query(`select ifnull(prod_avarage_rate,0) as prod_avarage_rate from tbl_product_purchase_rate  where product_id=? and branch_id=?  `,[oldProduct.transfer_prod_id,oldProduct.transfer_b_to]).then((res)=>{
              return res;
            }));

           let previousProdAvgRate =  getRateForProd.length == 0 ?0:getRateForProd[0].prod_avarage_rate;

            
            // previous stock value
            let  previousStockValue =  beforePurchaseStock*parseFloat(previousProdAvgRate);
            //End
            // Subtruct Stock Value
            let oldStockValue = oldProduct.transfer_qty * oldProduct.transfer_pur_rate

            let currentStockValue =   previousStockValue - oldStockValue;
            // End
            let subTructQty = beforePurchaseStock - oldProduct.transfer_qty
            if(currentStockValue==0){
              var avarageRate = previousProdAvgRate;
            }else{
              var avarageRate = currentStockValue / subTructQty;
            }

            
            // if(avarageRate < 0 ){
            //   avarageRate = 0
            // }






           let [e,d] =  await _p(db.query(`update tbl_product_purchase_rate set prod_avarage_rate=? where product_id=? and branch_id=?  `,[avarageRate,oldProduct.transfer_prod_id,oldProduct.transfer_b_to]).then(res=>{
              return res
            }));

              

                });
                // Old Transfer end.
                // Cart looping start

            

                cart.forEach(async (element )=> {

                   /// Previous Product Stock for avarage
                    let beforePurchaseStock =  await  Promise.all([pCurrentStock(element.prod_id,transfer.transfer_b_to)]);
                    beforePurchaseStock = beforePurchaseStock[0]
                /// End



            

                  let savePayload = {
                    transfer_id: transfer.transfer_id,
                    transfer_prod_id: element.prod_id,
                    transfer_qty: element.prod_qty,
                    transfer_pur_rate: element.prod_purchase_rate,
                    transfer_total: element.prod_total
                  }
                
                let [transferAddErr,transferAdd] = await _p(db.insert('tbl_product_transfer_details',savePayload).then((result)=>{
                    return result;
                }));
                
                if(transferAddErr && !transferAdd){
                    return next(transferAddErr);
                }
                // Transfer From Start
                let [fromTransferErr,fromTransfer] =  await _p(db.countRows(`select * from tbl_product_current_stock where prod_id=? and branch_id=?  `,[element.prod_id,req.user.user_branch_id]).then((res)=>{
                      return res;
                }));
                if(fromTransfer>0){
                 await _p(db.query(`update tbl_product_current_stock set transfer_from_qty=transfer_from_qty+? where prod_id=? and branch_id=?  `,[element.prod_qty,element.prod_id,req.user.user_branch_id]).then((res=>{
                    return res;
                  })));
                }else{
                  let savePayload = {
                    prod_id: element.prod_id,
                    transfer_from_qty: element.prod_qty,
                    branch_id: req.user.user_branch_id,
                  }
                await _p(db.insert('tbl_product_current_stock',savePayload).then((result)=>{
                    return result;
                }));
                }
                // Transfer from End.
              // Transfer to Start 
              let [toTransferErr,toTransfer] =  await _p(db.countRows(`select * from tbl_product_current_stock where prod_id=? and branch_id=?  `,[element.prod_id,transfer.transfer_b_to]).then((res)=>{
                    return res;
              }));
              if(toTransfer>0){
               await _p(db.query(`update tbl_product_current_stock set transfer_to_qty=transfer_to_qty+? where prod_id=? and branch_id=?  `,[element.prod_qty,element.prod_id,transfer.transfer_b_to]).then((res=>{
                  return res;
                })))
              }else{
                let savePayload = {
                  prod_id: element.prod_id,
                  transfer_to_qty: element.prod_qty,
                  branch_id: transfer.transfer_b_to,
                  
                }
              await _p(db.insert('tbl_product_current_stock',savePayload).then((result)=>{
                  return result;
              }));

           

              }
              // Transfer To End.



               // if this product not available in this branch so update
            let [checkProdAvaErr,checkProdAva] =  await _p(db.countRows(`select prod_branch_ids from tbl_products where prod_id=? and find_in_set(?,prod_branch_ids)<>0 `,[element.prod_id,transfer.transfer_b_to]).then((res=>{
              return res;
            })));
            if(checkProdAva==0){
            let[a,b] =  await _p(db.query(`update tbl_products set prod_branch_ids= concat(prod_branch_ids,',${transfer.transfer_b_to}') where prod_id=? `,[element.prod_id]).then((res=>{
                return res;
              })));
            }
            //end




             /// Product Avarage Calculation
            // purchase rate entry check 
            let [getRateForProdErr,getRateForProd] =  await _p(db.query(`select ifnull(prod_avarage_rate,0) as prod_avarage_rate from tbl_product_purchase_rate  where product_id=? and branch_id=?  `,[element.prod_id,transfer.transfer_b_to]).then((res)=>{
              return res;
            }));

           let previousProdAvgRate =  getRateForProd.length == 0?0:getRateForProd[0].prod_avarage_rate;
            // previous stock value
            let  previousStockValue =  beforePurchaseStock*previousProdAvgRate;
            //End

            // Current Purchase stock value
             let currentPurchaseStockValue = element.prod_qty * element.prod_purchase_rate;
            // Ennd
            // Previouse & current Total
            let totalQty = beforePurchaseStock + parseFloat(element.prod_qty);
            let totalStockValue = previousStockValue + parseFloat(currentPurchaseStockValue)

            // Get Finaly product Avarage 

            let productPurchaseRate = totalStockValue / totalQty;

           if(getRateForProd.length == 0){
            let savePayload = {
              product_id: element.prod_id,
              prod_avarage_rate: productPurchaseRate,
              branch_id: transfer.transfer_b_to,
            }
           
           await _p(db.insert('tbl_product_purchase_rate',savePayload).then((result)=>{
              return result;
            }));
           }else{
            await _p(db.query(`update tbl_product_purchase_rate set prod_avarage_rate=? where product_id=? and branch_id=?  `,[productPurchaseRate,element.prod_id,transfer.transfer_b_to]))
           }

              
              });/// Cart looping End.
                res.json({error:false,message:{msg:'Transfer Update Successfully. ',transferId:transfer.transfer_id}});
              }
        });
        
        router.post('/api/transfer-delete',async (req,res,next)=>{
             // Old Transfer start
            let transferId =  req.body.transferId;
            let [oldTransferErr,oldTransfer] =  await _p(db.query(`select * from tbl_product_transfer_master where transfer_id=? `,[transferId]).then((res)=>{
                return res;
            }));

            let [oldTransferDetailsErr,oldTransferDetails] =  await _p(db.query(`
            select 
                tm.transfer_b_from,tm.transfer_b_to,trd.*

                from tbl_product_transfer_details trd
                left join  tbl_product_transfer_master tm on tm.transfer_id = trd.transfer_id
                where 
                 tm.transfer_status='a' and  tm.transfer_id=? 
            
            `,[transferId]).then((res)=>{
                return res;
            }));

            await _p(db.delete(`tbl_product_transfer_master`,{transfer_id:transferId}).then((res)=>{
                return res;
            }));

            await _p(db.delete(`tbl_product_transfer_details`,{transfer_id:transferId}).then((res)=>{
                return res;
            }));
            oldTransferDetails.forEach(async(oldProduct)=>{

              /// Previous Product Stock for avarage
              let beforePurchaseStock =  await  Promise.all([pCurrentStock(oldProduct.transfer_prod_id,oldProduct.transfer_b_to)]);
              beforePurchaseStock = beforePurchaseStock[0]
              /// End 


               // From quantity minus
               await _p(db.query(`update tbl_product_current_stock set transfer_from_qty=transfer_from_qty-? where prod_id=? and branch_id=?  `,[oldProduct.transfer_qty,oldProduct.transfer_prod_id,oldProduct.transfer_b_from]).then((res=>{
                return res;
              })));
            // End
            // To quantity minus
            await _p(db.query(`update tbl_product_current_stock set transfer_to_qty=transfer_to_qty-? where prod_id=? and branch_id=?  `,[oldProduct.transfer_qty,oldProduct.transfer_prod_id,oldProduct.transfer_b_to]).then((res=>{
                return res;
              })));
            // End








               /// Product Avarage Calculation
            // purchase rate entry check 
            let [getRateForProdErr,getRateForProd] =  await _p(db.query(`select ifnull(prod_avarage_rate,0) as prod_avarage_rate from tbl_product_purchase_rate  where product_id=? and branch_id=?  `,[oldProduct.transfer_prod_id,oldProduct.transfer_b_to]).then((res)=>{
              return res;
            }));

           let previousProdAvgRate =  getRateForProd.length == 0 ?0:getRateForProd[0].prod_avarage_rate;
            
            // previous stock value
            let  previousStockValue =  beforePurchaseStock*parseFloat(previousProdAvgRate);
            //End
            // Subtruct Stock Value
            let oldStockValue = oldProduct.transfer_qty * oldProduct.transfer_pur_rate

            let currentStockValue =   previousStockValue - oldStockValue;
            // End
            let subTructQty = beforePurchaseStock - oldProduct.transfer_qty
            if(currentStockValue==0){
              var avarageRate = previousProdAvgRate;
            }else{
              var avarageRate = currentStockValue / subTructQty;
            }


           let [e,d] =  await _p(db.query(`update tbl_product_purchase_rate set prod_avarage_rate=? where product_id=? and branch_id=?  `,[avarageRate,oldProduct.transfer_prod_id,oldProduct.transfer_b_to]).then(res=>{
              return res
            }));



            });
            // Old Transfer end.

            res.json({error:false,message:'Transfer Deleted successfully.'})
        })

        router.post('/api/get-product-transfers',async(req,res,next)=>{
          let transferId = req.body.transferId;
          
          let [transferDataErr,transferData] =  await _p(db.query(`select tm.*,b.branch_name,e.employee_name
                from tbl_product_transfer_master tm
                left join tbl_branches b on b.branch_id = tm.transfer_b_to
                left join tbl_employees e on e.employee_id   = tm.transfer_c_by
                where tm.transfer_id = ?
              `,[transferId]).then((result)=>{
            return result;
          }));
          if(transferDataErr && !transferData){
            return next(transferDataErr);
          }else{
         var  transferWithDetails =  transferData.map(async(detail)=>{
                    let [transferDDataErr,transferDData] =  await _p(db.query(`select td.*,pn.prod_name,p.prod_code
                    from tbl_product_transfer_details td 
                    left join tbl_products p on p.prod_id = td.transfer_prod_id
                    left join tbl_products_names pn on pn.prod_name_id = p.prod_name_id
                    where td.transfer_id = ?
                  `,[detail.transfer_id]).then((res)=>{
                      return res;
                      }));
                     
                      if(transferDDataErr && !transferDData){
                        return next(transferDDataErr)
                      }
                    detail.details = transferDData;
                    return detail;
            }) 

            res.json({error:false,message:await Promise.all(transferWithDetails)})
          }

         
      });

        router.post('/api/get-product-transfer-list',async(req,res,next)=>{
            let payLoad = req.body.payLoad;
            let cluases = ``;
            if(payLoad.from_date != undefined && payLoad.to_date != undefined){
              cluases += ` and tm.transfer_c_isodt between  '${payLoad.from_date}' and '${payLoad.to_date}' `
            }
            if(payLoad.transfer_b_to != undefined && payLoad.transfer_b_to != null){
              cluases += ` and tm.transfer_b_to = ${payLoad.transfer_b_to}`
            }
          
            let [transferDataErr,transferData] =  await _p(db.query(`select tm.*,b.branch_name,
                  e.employee_name
                  from tbl_product_transfer_master tm
                  left join tbl_branches b on b.branch_id = tm.transfer_b_to
                  left join tbl_employees e on e.employee_id   = tm.transfer_c_by
                  where tm.transfer_b_from = ?  ${cluases}
                `,[req.user.user_branch_id]).then((res)=>{
              return res;
            }));
            if(transferDataErr && !transferData){
              return next(transferDataErr);
            }
            res.json({error:false,message:transferData})
        });

        router.post('/api/get-transfer-receives',async(req,res,next)=>{
          let payLoad = req.body.payLoad;
          let cluases = ``;
          if(payLoad.from_date != undefined && payLoad.to_date != undefined){
            cluases += ` and tm.transfer_c_isodt between  '${payLoad.from_date}' and '${payLoad.to_date}' `
          }
          if(payLoad.transfer_b_from != undefined && payLoad.transfer_b_from != null){
            cluases += ` and tm.transfer_b_from = ${payLoad.transfer_b_from}`
          }
         
          
          let [transferDataFromErr,transferFromData] =  await _p(db.query(`select tm.*,b.branch_name,
                e.employee_name
                from tbl_product_transfer_master tm
                left join tbl_branches b on b.branch_id = tm.transfer_b_from
                left join tbl_employees e on e.employee_id   = tm.transfer_c_by
                where tm.transfer_b_to = ? ${cluases}
              `,[req.user.user_branch_id]).then((res)=>{
            return res;
          }));
          if(transferDataFromErr && !transferFromData){
            return next(transferDataFromErr);
          }
          res.json({error:false,message:transferFromData})
      });
module.exports = router;