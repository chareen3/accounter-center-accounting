const router = require('express').Router();
const _p      = require('../utils/promise_error');
const  {Database}   = require('../utils/Database');
const  {PurchaseModel}   = require('../models/PurchaseModel');
const  {StockModel}   = require('../models/StockModel');
const    db = new Database();
const    stockM = new StockModel();
const    purMdl = new PurchaseModel();



router.post(`/api/get-purchase`,async (req,res,next)=>{
          let payload = req.body.reqPayload;
    
          let cluases = ``;
          if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
            cluases += ` and pm.pur_created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}'`;
          }
          
          if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Supplier' && payload.supplierId!='0'){
            cluases += ` and pm.pur_supplier_id=${payload.supplierId}`;
          }

          if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Supplier' && payload.supplierId=='0'){
            cluases += ` and pm.pur_supplier_type='general'`;
          }

          if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Employee'){
            cluases += ` and pm.pur_emp_id=${payload.employeeId}`;
          }
          if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By User'){
            cluases += ` and pm.pur_created_by=${payload.userId}`;
          }

          

          let [purchaseErr,purchase] = await _p(db.query(`select pm.*,sup.supplier_name,sup.supplier_mobile_no,sup.supplier_address,
          emp.employee_name,u.user_full_name,
          concat(bacc.bank_acc_number) as bank_display_name
          from tbl_purchase_master as pm
          left join tbl_bank_accounts as bacc on bacc.bank_acc_id =  pm.pur_bank_id 
          left join tbl_employees as emp on pm.pur_emp_id =  emp.employee_id 
          left join tbl_suppliers as sup on pm.pur_supplier_id =  sup.supplier_id 
          left join tbl_users as u on  pm.pur_created_by = u.user_id
          where pm.pur_status='a' and pm.pur_branch_id=?  ${cluases} order by pm.pur_id desc`,[req.user.user_branch_id])).then(purchase=>{
            return purchase;
          })
       
          res.json({error:false,
           message: purchase         
          });
})


router.post(`/api/get-service-item-purchase`,async (req,res,next)=>{
  let payload = req.body.reqPayload;

  let cluases = ``;
  if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
    cluases += ` and pm.pur_ser_created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}'`;
  }
  
  if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Supplier' && payload.supplierId!='0'){
    cluases += ` and pm.pur_ser_supplier_id=${payload.supplierId}`;
  }

  if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Supplier' && payload.supplierId=='0'){
    cluases += ` and pm.pur_ser_supplier_type='general'`;
  }

  if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Employee'){
    cluases += ` and pm.pur_ser_emp_id=${payload.employeeId}`;
  }
  if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By User'){
    cluases += ` and pm.pur_ser_created_by=${payload.userId}`;
  }

  

  let [purchaseErr,purchase] = await _p(db.query(`select pm.*,sup.supplier_name,sup.supplier_mobile_no,sup.supplier_address,
  emp.employee_name,u.user_full_name,
  concat(bacc.bank_acc_number) as bank_display_name
  from tbl_pur_ser_master as pm
  left join tbl_bank_accounts as bacc on bacc.bank_acc_id =  pm.pur_ser_bank_id 
  left join tbl_employees as emp on pm.pur_ser_emp_id =  emp.employee_id 
  left join tbl_suppliers as sup on pm.pur_ser_supplier_id =  sup.supplier_id 
  left join tbl_users as u on  pm.pur_ser_created_by = u.user_id
  where pm.pur_ser_status='a' and pm.pur_ser_branch_id=?  ${cluases} order by pm.pur_ser_id desc`,[req.user.user_branch_id])).then(purchase=>{
    return purchase;
  })

  res.json({error:false,
   message: purchase         
  });
})



router.post('/api/get-purchase-return-list',async (req,res,next)=>{
  let payLoad = req.body;
  let cluases = ``
      if(payLoad.supplierId != undefined && payLoad.supplierId != null && payLoad.supplierId != ''){
        cluases += ` and pr.pur_supplier_id = ${payLoad.supplierId} `
      }

      if(payLoad.productId != undefined && payLoad.productId != null && payLoad.productId != ''){
        cluases += ` and prd.pur_return_prod_id = ${payLoad.productId} `
      }

      if(payLoad.fromDate != undefined && payLoad.toDate != undefined &&  payLoad.fromDate != null && payLoad.toDate != ''){
        cluases += ` and pr.pur_return_created_isodt between '${payLoad.fromDate}' and '${payLoad.toDate}' `
      }


   let [returnDetailErr,returnDetail] =  await _p(db.query(`select prd.pur_return_qty,
    prd.pur_return_rate,
    prd.pur_return_amount,
    pr.pur_invoice_no,
    pr.pur_return_note,
    pr.pur_return_created_isodt,
    prod.prod_code,pn.prod_name,
    s.supplier_name,
    s.supplier_code
    
    from tbl_purchase_return_details  prd
    left join tbl_products prod on prd.pur_return_prod_id = prod.prod_id
    left join tbl_products_names pn on prod.prod_name_id = pn.prod_name_id
    left join  tbl_purchase_return pr on pr.pur_return_id   = prd.pur_return_id
    left join tbl_suppliers s on s.supplier_id  = pr.pur_supplier_id
    where pr.pur_return_branch_id = ? 
    ${cluases}
     
    order by prd.pur_return_d_id   desc
    `,[req.user.user_branch_id]).then(result=>{
      return result;
    }))

    if(returnDetailErr && !returnDetail){
      return next(returnDetailErr)
    }
    res.json(returnDetail)
  })



  router.get('/api/purchase-invoices',async (req,res,next)=>{
    let [purchaseErr,purchase] = await _p(db.query(`select pm.pur_id,pm.pur_invoice_no
  from tbl_purchase_master as pm
  where pm.pur_status ='a' and pm.pur_branch_id=? 
   order by pm.pur_id desc`,[req.user.user_branch_id])).then(purchase=>{
    return purchase;
  })

  res.json(purchase);
  })


  router.get('/api/service-item-invoices',async (req,res,next)=>{
    let [purchaseErr,purchase] = await _p(db.query(`select pm.pur_ser_id,pm.pur_ser_invoice_no
  from tbl_pur_ser_master as pm
  where pm.pur_ser_status ='a' and pm.pur_ser_branch_id=? 
   order by pm.pur_ser_id   desc`,[req.user.user_branch_id])).then(purchase=>{
    return purchase;
  })

  res.json(purchase);
  })

router.post(`/api/get-purchase-with-details`,async (req,res,next)=>{
      let payload = req.body.reqPayload;
        
      let cluases = ``;
      if(payload.purchaseId != undefined ){
        cluases += ` and pm.pur_id = ${payload.purchaseId} `;
      }
      if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
        cluases += ` and pm.pur_created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}'`;
      }

      let orderBy = ` order by pm.pur_id desc `

        if(payload.from == 'invoice' ){
          orderBy = ` order by pm.pur_id desc limit 1 `;
          }

      

      if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Supplier'){
        cluases += ` and pm.pur_supplier_id=${payload.supplierId}`;
      }
      if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Employee'){
        cluases += ` and pm.pur_emp_id=${payload.employeeId}`;
      }
      if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By User'){
        cluases += ` and pm.pur_created_by=${payload.userId}`;
      }
      let [purchaseErr,purchase] = await _p(db.query(`select pm.*,sup.supplier_name,sup.supplier_mobile_no,sup.supplier_code,
      sup.supplier_address,sup.supplier_mobile_no,emp.employee_name,u.user_full_name,
      concat(bacc.bank_acc_name,' - ',bacc.bank_acc_number) as bank_display_name
      from tbl_purchase_master as pm
      left join tbl_bank_accounts as bacc on bacc.bank_acc_id =  pm.pur_bank_id 
      left join tbl_employees as emp on pm.pur_emp_id =  emp.employee_id 
      left join tbl_suppliers as sup on pm.pur_supplier_id =  sup.supplier_id 
      left join tbl_users as u on  pm.pur_created_by = u.user_id
      where pm.pur_status='a' and pm.pur_branch_id=?  ${cluases}
      ${orderBy} `,[req.user.user_branch_id])).then(purchase=>{
        return purchase;
      })

    if(!purchaseErr){
      var purchaseWithDetails =  purchase.map(async (ele)=>{
          var [detailsErr,details] = await _p(db.query(`select pd.*,pn.prod_name,pu.prod_unit_name
          from tbl_purchase_details as pd 
          left join  tbl_products p on  p.prod_id=pd.pur_prod_id 
          left join  tbl_products_names pn on pn.prod_name_id = p.prod_name_id 
          left join tbl_product_units pu on pu.prod_unit_id = p.prod_unit_id 
          where pd.pur_id=?`,[ele.pur_id])).then(rows=>{
              return rows;
          })
          ele.details = details;
          return ele;
      });
    }


    res.json({error:false,
      message: await  Promise.all(purchaseWithDetails)
      })
})

router.post(`/api/get-expense-with-details`,async (req,res,next)=>{
  let payload = req.body.reqPayload;
    
  let cluases = ``;
  if(payload.purchaseId != undefined ){
    cluases += ` and pm.pur_ser_id  = ${payload.purchaseId} `;
  }
  if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
    cluases += ` and pm.pur_ser_created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}'`;
  }

  let orderBy = ` order by pm.pur_ser_id  desc `

    if(payload.from == 'invoice' ){
      orderBy = ` order by pm.pur_ser_id desc limit 1 `;
      }

  

  if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Supplier'){
    cluases += ` and pm.pur_ser_supplier_id=${payload.supplierId}`;
  }
  if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Employee'){
    cluases += ` and pm.pur_ser_emp_id=${payload.employeeId}`;
  }
  if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By User'){
    cluases += ` and pm.pur_ser_created_by=${payload.userId}`;
  }
  let [purchaseErr,purchase] = await _p(db.query(`select pm.*,sup.supplier_name,sup.supplier_mobile_no,sup.supplier_code,
  sup.supplier_address,sup.supplier_mobile_no,emp.employee_name,u.user_full_name,
  concat(bacc.bank_acc_name,' - ',bacc.bank_acc_number) as bank_display_name
  from tbl_pur_ser_master as pm
  left join tbl_bank_accounts as bacc on bacc.bank_acc_id =  pm.pur_ser_bank_id 
  left join tbl_employees as emp on pm.pur_ser_emp_id =  emp.employee_id 
  left join tbl_suppliers as sup on pm.pur_ser_supplier_id =  sup.supplier_id 
  left join tbl_users as u on  pm.pur_ser_created_by = u.user_id
  where pm.pur_ser_status='a' and pm.pur_ser_branch_id=?  ${cluases}
  ${orderBy} `,[req.user.user_branch_id])).then(purchase=>{
    return purchase;
  })


if(!purchaseErr){
  var purchaseWithDetails =  purchase.map(async (ele)=>{
      var [detailsErr,details] = await _p(db.query(`select pd.*,pn.prod_name,pu.prod_unit_name
      from  tbl_pur_ser_details as pd 
      left join  tbl_products p on  p.prod_id=pd.pur_ser_prod_id 
      left join  tbl_products_names pn on pn.prod_name_id = p.prod_name_id 
      left join tbl_product_units pu on pu.prod_unit_id = p.prod_unit_id 
      where pd.pur_ser_id=?`,[ele.pur_ser_id])).then(rows=>{
          return rows;
      })


      ele.details = details;
      return ele;
  });

}


res.json({error:false,
  message: await  Promise.all(purchaseWithDetails)
  })
})



router.post('/api/get-purchase-details',async(req,res,next)=>{
      let payload = req.body.reqPayload;
            
      let cluases = ``;
      if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
        cluases += ` and pm.pur_created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}'`;
      }

      if(payload.productId != undefined && payload.productId!=''){
        cluases += ` and prod.prod_id='${payload.productId}'`;
      }

      if(payload.categoryId != undefined && payload.categoryId!=''){
        cluases += ` and pc.prod_cat_id='${payload.categoryId}'`;
      }

     let [purchaseDetailsErr,purchaseDetails] = await _p(db.query(`select pd.*,prod.prod_code,pn.prod_name,pc.prod_cat_name,pc.prod_cat_id,pm.pur_invoice_no,sp.supplier_name,pm.pur_created_isodt
      from tbl_purchase_details pd 
      left join tbl_products prod on pd.pur_prod_id = prod.prod_id
      left join tbl_products_names pn on prod.prod_name_id = pn.prod_name_id
      left join tbl_product_categories pc on prod.prod_cat_id = pc.prod_cat_id
      left join tbl_purchase_master pm on pd.pur_id = pm.pur_id
      left join tbl_suppliers sp on pm.pur_supplier_id = sp.supplier_id
      where pd.pur_status='a' ${cluases} `).then((res)=>{
        return res;
      }));
      if(purchaseDetailsErr && !purchaseDetails){
         return next(purchaseDetailsErr)
      }else{
        res.json({error:false,message:purchaseDetails});
      }
})

router.get('/api/get-purchase-invoce',async(req,res,next)=>{
            let [qryErr,data] = await _p(purMdl.getPurchaseInvoice().then((result)=>{
                return result;
            }));
            if(qryErr && !data){
            return next(qryErr);
            }
            else{
              res.json({error:false,message:data});
            }
});

router.get('/api/get-expense-invoce',async(req,res,next)=>{
  let [qryErr,data] = await _p(purMdl.getExpenseInvoice().then((result)=>{
      return result;
  }));
  if(qryErr && !data){
  return next(qryErr);
  }
  else{
    res.json({error:false,message:data});
  }
});


router.post('/api/save-expense',async(req,res,next)=>{
  let payloadPurchase = req.body.purchase;
  let payloadCart = req.body.purchaseCart;
   
          

          // get ivoice
          let [invoiceNoErr,invoiceNo] = await _p(purMdl.getExpenseInvoice().then((result)=>{
            return result;
            }));
            if(invoiceNo && !invoiceNo){
            return next(invoiceNoErr);
            }
          // end 
          // new supplier add
          let pur_supplier_id = payloadPurchase.pur_supplier_id;
             if(payloadPurchase.pur_supplier_id=='0'){
              /// get supplier code
              let [supplierCodeErr,supplier_code] = await _p(purMdl.getSupplierCode().then((res)=>{
                return res
              }));
              // end 
               let newSupplierPayload = {
                supplier_code: supplier_code,
                supplier_address: payloadPurchase.supplier_address,
                supplier_mobile_no: payloadPurchase.supplier_mobile_no,
                supplier_name: payloadPurchase.supplier_name,
                supplier_created_isodt:payloadPurchase.pur_created_isodt,
                supplier_branch_id:req.user.user_branch_id,
                supplier_created_by:req.user.user_id,
                supplier_type:'general',
                supplier_status:'active'
               }
             let [suppEntyErr,suppEnty] =  await _p(db.insert('tbl_suppliers',newSupplierPayload)).then((row)=>{
                    return row
              })
              pur_supplier_id = suppEnty.insertId;
             }
          // end new supplier
            let newPurchasePayload =  {
              pur_ser_invoice_no: invoiceNo,
              pur_ser_emp_id: payloadPurchase.pur_emp_id,
              pur_ser_created_isodt: payloadPurchase.pur_created_isodt,
              pur_ser_supplier_id: pur_supplier_id,
              pur_ser_subtotal_amount: payloadPurchase.pur_subtotal_amount,
              pur_ser_vat_amount: payloadPurchase.pur_vat_amount,
              pur_ser_vat_percent: payloadPurchase.pur_vat_percent,
              pur_ser_discount_amount: payloadPurchase.pur_discount_amount,
              pur_ser_discount_percent: payloadPurchase.pur_discount_percent,
              pur_ser_total_amount: payloadPurchase.pur_total_amount,
              pur_ser_paid_amount: payloadPurchase.pur_paid_amount,
              pur_ser_due_amount: payloadPurchase.pur_due_amount,
              pur_ser_transport_cost: payloadPurchase.pur_transport_cost,
              pur_ser_note: payloadPurchase.pur_note,
              pur_ser_previous_due: payloadPurchase.pur_previous_due,
              pur_ser_created_by:req.user.user_id,
              pur_ser_branch_id:req.user.user_branch_id,
              pur_ser_status:'a',
              pur_ser_supplier_type: payloadPurchase.pur_supplier_type,
              pur_ser_pay_method: payloadPurchase.pur_pay_method,
              pur_ser_bank_id: payloadPurchase.pur_bank_id
            }


          let [soldDataErr,soldData] = await _p(db.insert('tbl_pur_ser_master',newPurchasePayload).then((result)=>{
              return result;
          }));

          if(soldDataErr && !soldData){
          return next(soldDataErr);
          }
          else{
            payloadCart.map(async (element )=> {

              let savePayload = {
                pur_ser_id: soldData.insertId,
                pur_ser_prod_id: element.prod_id,
                pur_ser_rate: element.prod_purchase_rate,
                pur_ser_qty: element.prod_qty,
                pur_ser_total_amount: element.prod_total,
                pur_ser_status:'a',
                pur_ser_d_branch_id: req.user.user_branch_id,
              }

              let [qryErr,data] = await _p(db.insert('tbl_pur_ser_details',savePayload).then((result)=>{
                return result;
            }));




  

            if(qryErr){
            return next(qryErr);
            }
           
          

          
          });/// Loop end
            res.json({error:false,message:{purchaseId:soldData.insertId,msg:'Expense  success.'}});
          }
});

   
 
router.post('/api/save-purchase',async(req,res,next)=>{
  let payloadPurchase = req.body.purchase;
  let payloadCart = req.body.purchaseCart;
   
          

          // get ivoice
          let [invoiceNoErr,invoiceNo] = await _p(purMdl.getPurchaseInvoice().then((result)=>{
            return result;
            }));
            if(invoiceNo && !invoiceNo){
            return next(invoiceNoErr);
            }
          // end 
          // new supplier add
          let pur_supplier_id = payloadPurchase.pur_supplier_id;
             if(payloadPurchase.pur_supplier_id=='0'){
              /// get supplier code
              let [supplierCodeErr,supplier_code] = await _p(purMdl.getSupplierCode().then((res)=>{
                return res
              }));
              // end
               let newSupplierPayload = {
                supplier_code: supplier_code,
                supplier_address: payloadPurchase.supplier_address,
                supplier_mobile_no: payloadPurchase.supplier_mobile_no,
                supplier_name: payloadPurchase.supplier_name,
                supplier_created_isodt:payloadPurchase.pur_created_isodt,
                supplier_branch_id:req.user.user_branch_id,
                supplier_created_by:req.user.user_id,
                supplier_type:'general',
                supplier_status:'active'
               }
             let [suppEntyErr,suppEnty] =  await _p(db.insert('tbl_suppliers',newSupplierPayload)).then((row)=>{
                    return row
              })
              pur_supplier_id = suppEnty.insertId;
             }
          // end new supplier
            let newPurchasePayload =  {
              pur_invoice_no: invoiceNo,
              pur_emp_id: payloadPurchase.pur_emp_id,
              pur_created_isodt: payloadPurchase.pur_created_isodt,
              pur_supplier_id: pur_supplier_id,
              pur_subtotal_amount: payloadPurchase.pur_subtotal_amount,
              pur_vat_amount: payloadPurchase.pur_vat_amount,
              pur_vat_percent: payloadPurchase.pur_vat_percent,
              pur_discount_amount: payloadPurchase.pur_discount_amount,
              pur_discount_percent: payloadPurchase.pur_discount_percent,
              pur_total_amount: payloadPurchase.pur_total_amount,
              pur_paid_amount: payloadPurchase.pur_paid_amount,
              pur_due_amount: payloadPurchase.pur_due_amount,
              pur_transport_cost: payloadPurchase.pur_transport_cost,
              pur_note: payloadPurchase.pur_note,
              pur_previous_due: payloadPurchase.pur_previous_due,
              pur_created_by:req.user.user_id,
              pur_branch_id:req.user.user_branch_id,
              pur_status:'a',
              pur_supplier_type: payloadPurchase.pur_supplier_type,
              pur_pay_method: payloadPurchase.pur_pay_method,
              pur_bank_id: payloadPurchase.pur_bank_id
            }


          let [soldDataErr,soldData] = await _p(db.insert('tbl_purchase_master',newPurchasePayload).then((result)=>{
              return result;
          }));
          if(soldDataErr && !soldData){
          return next(soldDataErr);
          }
          else{
            payloadCart.map(async (element )=> {

              /// Previous Product Stock for avarage
              let beforePurchaseStock =  await  Promise.all([stockM.productCurrentStock(element.prod_id,req)]);
                  beforePurchaseStock = beforePurchaseStock[0]
              /// End
              let savePayload = {
                pur_id: soldData.insertId,
                pur_prod_id: element.prod_id,
                pur_rate: element.prod_purchase_rate,
                sale_rate: element.prod_sale_rate,
                pur_qty: element.prod_qty,
                pur_total_amount: element.prod_total,
                pur_status:'a',
                pur_d_branch_id: req.user.user_branch_id,
              }

              let [qryErr,data] = await _p(db.insert('tbl_purchase_details',savePayload).then((result)=>{
                return result;
            }));

  

            if(qryErr){
            return next(qryErr);
            }
           
           /// Stock updateing          
           let [errStockCheck,stockData] =  await _p(db.countRows(`select * from tbl_product_current_stock where prod_id=? and branch_id=?  `,[element.prod_id,req.user.user_branch_id]).then((res)=>{
                  return res;
            }));
            if( stockData>0){
              await _p(db.query(`update tbl_product_current_stock set purchase_qty=purchase_qty+? where prod_id=? and branch_id=?  `,[element.prod_qty,element.prod_id,req.user.user_branch_id]).then((res=>{
                return res;
              })))
            }else{
              let savePayload = {
                prod_id: element.prod_id,
                purchase_qty: element.prod_qty,
                branch_id: req.user.user_branch_id,
              }
              let [qryErr,data] = await _p(db.insert('tbl_product_current_stock',savePayload).then((result)=>{
                return result;
            }));

            
            }

            /// Product Avarage Calculation
            // purchase rate entry check 
             let [getRateForProdErr,getRateForProd] =  await _p(db.query(`select ifnull(prod_avarage_rate,0) as prod_avarage_rate from tbl_product_purchase_rate  where product_id=? and branch_id=?  `,[element.prod_id,req.user.user_branch_id]).then((res)=>{
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
                branch_id: req.user.user_branch_id,
              }
             await _p(db.insert('tbl_product_purchase_rate',savePayload).then((result)=>{
                return result;
              }));
             }else{
              await _p(db.query(`update tbl_product_purchase_rate set prod_avarage_rate=? where product_id=? and branch_id=?  `,[productPurchaseRate,element.prod_id,req.user.user_branch_id]))
             }
          
          });/// Loop end
            res.json({error:false,message:{purchaseId:soldData.insertId,msg:'Purchase success.'}});
          }
});
router.post('/api/update-expense',async(req,res,next)=>{
  let payloadPurchase = req.body.purchase;
  let payloadCart = req.body.purchaseCart;
         
       
          // new supplier add
          let pur_supplier_id = payloadPurchase.pur_supplier_id;
             if( payloadPurchase.pur_supplier_type =='general'){
              /// get supplier code
              let [supplierCodeErr,supplier_code] = await _p(purMdl.getSupplierCode().then((res)=>{
                return res
              }));
              // end
               let newSupplierPayload = {
                supplier_code: supplier_code,
                supplier_address: payloadPurchase.supplier_address,
                supplier_mobile_no: payloadPurchase.supplier_mobile_no,
                supplier_name: payloadPurchase.supplier_name,
                supplier_created_isodt:payloadPurchase.pur_created_isodt,
                supplier_branch_id:req.user.user_branch_id,
                supplier_created_by:req.user.user_id,
                supplier_type:'general',
                supplier_status:'active'
               }
             let [suppEntyErr,suppEnty] =  await _p(db.insert('tbl_suppliers',newSupplierPayload)).then((row)=>{
                    return row
              })
              pur_supplier_id = suppEnty.insertId;
             }
          // end new supplier
            let newPurchasePayload =  {
              pur_ser_emp_id: payloadPurchase.pur_emp_id,
              pur_ser_created_isodt: payloadPurchase.pur_created_isodt,
              pur_ser_supplier_id: pur_supplier_id,
              pur_ser_subtotal_amount: payloadPurchase.pur_subtotal_amount,
              pur_ser_vat_amount: payloadPurchase.pur_vat_amount,
              pur_ser_vat_percent: payloadPurchase.pur_vat_percent,
              pur_ser_discount_amount: payloadPurchase.pur_discount_amount,
              pur_ser_discount_percent: payloadPurchase.pur_discount_percent,
              pur_ser_total_amount: payloadPurchase.pur_total_amount,
              pur_ser_paid_amount: payloadPurchase.pur_paid_amount,
              pur_ser_due_amount: payloadPurchase.pur_due_amount,
              pur_ser_transport_cost: payloadPurchase.pur_transport_cost,
              pur_ser_note: payloadPurchase.pur_note,
              pur_ser_previous_due: payloadPurchase.pur_previous_due,
              pur_ser_created_by:req.user.user_id,
              pur_ser_branch_id:req.user.user_branch_id,
              pur_ser_supplier_type: payloadPurchase.pur_supplier_type,
              pur_ser_pay_method: payloadPurchase.pur_pay_method,
              pur_ser_bank_id: payloadPurchase.pur_bank_id
            }

          let cond = {pur_ser_id: payloadPurchase.pur_id}
          let [soldDataErr,soldData] = await _p(db.update('tbl_pur_ser_master',newPurchasePayload,cond).then((result)=>{
              return result;
          }));
          if(soldDataErr && !soldData){
          return next(soldDataErr);
          }
          else{
       
        


            //end 
            let deleteCond = {
              pur_ser_id: payloadPurchase.pur_id
            }
            

           let  [ErrDetailDelete,detailDeleteData]  = await _p(db.delete(`tbl_pur_ser_details`,deleteCond).then((res)=>{
              return res;
           }));

           if(detailDeleteData){
            payloadCart.map(async (element )=> {
              let savePayload = {
                pur_ser_id: payloadPurchase.pur_id,
                pur_ser_prod_id: element.prod_id,
                pur_ser_rate: element.prod_purchase_rate,
                pur_ser_qty: element.prod_qty,
                pur_ser_total_amount: element.prod_total,
                pur_ser_status:'a',
                pur_ser_d_branch_id: req.user.user_branch_id,
              }

              let [qryErr,data] = await _p(db.insert('tbl_pur_ser_details',savePayload).then((result)=>{
                return result;
            }));

            if(qryErr){
            return next(qryErr);
            }
            });
           }
            
            res.json({error:false,message:{purchaseId:payloadPurchase.pur_id,msg:'Expense Update Success.'}});
          }
});




router.post('/api/update-purchase',async(req,res,next)=>{
  let payloadPurchase = req.body.purchase;
  let payloadCart = req.body.purchaseCart;
         
       
          // new supplier add
          let pur_supplier_id = payloadPurchase.pur_supplier_id;
             if( payloadPurchase.pur_supplier_type =='general'){
              /// get supplier code
              let [supplierCodeErr,supplier_code] = await _p(purMdl.getSupplierCode().then((res)=>{
                return res
              }));
              // end
               let newSupplierPayload = {
                supplier_code: supplier_code,
                supplier_address: payloadPurchase.supplier_address,
                supplier_mobile_no: payloadPurchase.supplier_mobile_no,
                supplier_name: payloadPurchase.supplier_name,
                supplier_created_isodt:payloadPurchase.pur_created_isodt,
                supplier_branch_id:req.user.user_branch_id,
                supplier_created_by:req.user.user_id,
                supplier_type:'general',
                supplier_status:'active'
               }
             let [suppEntyErr,suppEnty] =  await _p(db.insert('tbl_suppliers',newSupplierPayload)).then((row)=>{
                    return row
              })
              pur_supplier_id = suppEnty.insertId;
             }
          // end new supplier
            let newPurchasePayload =  {
              pur_emp_id: payloadPurchase.pur_emp_id,
              pur_created_isodt: payloadPurchase.pur_created_isodt,
              pur_supplier_id: pur_supplier_id,
              pur_subtotal_amount: payloadPurchase.pur_subtotal_amount,
              pur_vat_amount: payloadPurchase.pur_vat_amount,
              pur_vat_percent: payloadPurchase.pur_vat_percent,
              pur_discount_amount: payloadPurchase.pur_discount_amount,
              pur_discount_percent: payloadPurchase.pur_discount_percent,
              pur_total_amount: payloadPurchase.pur_total_amount,
              pur_paid_amount: payloadPurchase.pur_paid_amount,
              pur_due_amount: payloadPurchase.pur_due_amount,
              pur_transport_cost: payloadPurchase.pur_transport_cost,
              pur_note: payloadPurchase.pur_note,
              pur_previous_due: payloadPurchase.pur_previous_due,
              pur_created_by:req.user.user_id,
              pur_branch_id:req.user.user_branch_id,
              pur_supplier_type: payloadPurchase.pur_supplier_type,
              pur_pay_method: payloadPurchase.pur_pay_method,
              pur_bank_id: payloadPurchase.pur_bank_id
            }

          let cond = {pur_id: payloadPurchase.pur_id}
          let [soldDataErr,soldData] = await _p(db.update('tbl_purchase_master',newPurchasePayload,cond).then((result)=>{
              return result;
          }));
          if(soldDataErr && !soldData){
          return next(soldDataErr);
          }
          else{
            // Old stock update
          let [errOldPurDetail,oldPurDetail] =   await _p(db.query(`select * from tbl_purchase_details   where pur_id=? `,[payloadPurchase.pur_id]).then((res=>{
              return res;
            })));

            oldPurDetail.map(async (item)=>{
              /// Previous Product Stock for avarage
              let beforePurchaseStock =  await  Promise.all([stockM.productCurrentStock(item.pur_prod_id,req)]);
              beforePurchaseStock = beforePurchaseStock[0]
             /// End




              await _p(db.query(`update tbl_product_current_stock set purchase_qty=purchase_qty-? where prod_id=? and branch_id=?  `,[item.pur_qty,item.pur_prod_id,item.pur_d_branch_id]).then((res=>{
                return res;
              })));


            



            /// Product Avarage Calculation
            // purchase rate entry check 
            let [getRateForProdErr,getRateForProd] =  await _p(db.query(`select ifnull(prod_avarage_rate,0) as prod_avarage_rate from tbl_product_purchase_rate  where product_id=? and branch_id=?  `,[item.pur_prod_id,item.pur_d_branch_id]).then((res)=>{
              return res;
            }));
            

           let previousProdAvgRate =  getRateForProd.length == 0 ?0:getRateForProd[0].prod_avarage_rate;
            
            // previous stock value
            let  previousStockValue =  beforePurchaseStock*parseFloat(previousProdAvgRate);
            //End
            // Subtruct Stock Value
            let oldStockValue = item.pur_qty * item.pur_rate

            let currentStockValue =   previousStockValue - oldStockValue;
            // End
            let subTructQty = beforePurchaseStock - item.pur_qty
            if(currentStockValue==0){

              var avarageRate = previousProdAvgRate
            }else{
              var avarageRate = currentStockValue / subTructQty;
            }


           let [e,d] =  await _p(db.query(`update tbl_product_purchase_rate set prod_avarage_rate=? where product_id=? and branch_id=?  `,[avarageRate,item.pur_prod_id,item.pur_d_branch_id]).then(res=>{
              return res
            }));



            })


            //end 
            let deleteCond = {
              pur_id: payloadPurchase.pur_id
            }
            

           let  [ErrDetailDelete,detailDeleteData]  = await _p(db.delete(`tbl_purchase_details`,deleteCond).then((res)=>{
              return res;
           }));

           if(detailDeleteData){
            payloadCart.map(async (element )=> {

                /// Previous Product Stock for avarage
                let beforePurchaseStock =  await  Promise.all([stockM.productCurrentStock(element.prod_id,req)]);
                beforePurchaseStock = beforePurchaseStock[0]
            /// End

              let savePayload = {
                pur_id: payloadPurchase.pur_id,
                pur_prod_id: element.prod_id,
                pur_rate: element.prod_purchase_rate,
                sale_rate: element.prod_sale_rate,
                pur_qty: element.prod_qty,
                pur_total_amount: element.prod_total,
                pur_status:'a',
                pur_d_branch_id: req.user.user_branch_id,
              }

              let [qryErr,data] = await _p(db.insert('tbl_purchase_details',savePayload).then((result)=>{
                return result;
            }));

            if(qryErr){
            return next(qryErr);
            }


            /// Stock update

            let [errStockCheck,stockData] =  await _p(db.countRows(`select * from tbl_product_current_stock where prod_id=? and branch_id=?  `,[element.prod_id,req.user.user_branch_id]).then((res)=>{
              return res;
        }));
        if( stockData>0){
          await _p(db.query(`update tbl_product_current_stock set purchase_qty=purchase_qty+? where prod_id=? and branch_id=?  `,[element.prod_qty,element.prod_id,req.user.user_branch_id]).then((res=>{
            return res;
          })));
        }else{
          let savePayload = {
            prod_id: element.prod_id,
            purchase_qty: element.prod_qty,
            branch_id: req.user.user_branch_id,
          }
          let [qryErr,data] = await _p(db.insert('tbl_product_current_stock',savePayload).then((result)=>{
            return result;
        }));
        }



         /// Product Avarage Calculation
            // purchase rate entry check 
            let [getRateForProdErr,getRateForProd] =  await _p(db.query(`select ifnull(prod_avarage_rate,0) as prod_avarage_rate from tbl_product_purchase_rate  where product_id=? and branch_id=?  `,[element.prod_id,req.user.user_branch_id]).then((res)=>{
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
              branch_id: req.user.user_branch_id,
            }
         await _p(db.insert('tbl_product_purchase_rate',savePayload).then((result)=>{
              return result;
            }));

           }else{

            await _p(db.query(`update tbl_product_purchase_rate set prod_avarage_rate=? where product_id=? and branch_id=?  `,[productPurchaseRate,element.prod_id,req.user.user_branch_id]))
          }




            });
           }
            
            res.json({error:false,message:{purchaseId:payloadPurchase.pur_id,msg:'Purchase success.'}});
          }
});




router.post('/api/get-purchase-return-details',async(req,res,next)=>{
  let payload = req.body.reqPayload;
        
  let cluases = ``;
  if(payload.purId != undefined && payload.purId!=''){
    cluases += ` and pd.pur_id='${payload.purId}'`;
  }
  
  let [saleDetailsErr,saleDetails] = await _p(db.query(`select pd.*,prod.prod_code,pn.prod_name,
  pc.prod_cat_name,pc.prod_cat_id,pm.pur_invoice_no,supp.supplier_name,pm.pur_created_isodt,
  ifnull(sum(prd.pur_return_qty), 0.00) as returned_quantity,
  ifnull(sum(prd.pur_return_amount), 0.00) as returned_amount,
  pr.pur_return_note
  from  tbl_purchase_details pd 
  left join tbl_products prod on pd.pur_prod_id = prod.prod_id
  left join tbl_products_names pn on prod.prod_name_id = pn.prod_name_id
  left join tbl_product_categories pc on prod.prod_cat_id = pc.prod_cat_id
  left join tbl_purchase_master pm on pd.pur_id = pm.pur_id 
  left join tbl_purchase_return pr on pr.pur_invoice_no=pm.pur_invoice_no
  left join  tbl_purchase_return_details prd on prd.pur_return_id=pr.pur_return_id  
  and prd.pur_return_prod_id = pd.pur_prod_id
  left join  tbl_suppliers supp on pm.pur_supplier_id = supp.supplier_id 
  where pd.pur_status='a'  ${cluases} group by pd.pur_prod_id   `).then((res)=>{
    return res;
  }));
  if(saleDetailsErr && !saleDetails){
    return next(saleDetailsErr)
  }else{
    res.json({error:false,message:saleDetails});
  }
  });


  router.post(`/api/service-expense-delete`,async(req,res,next)=>{
    let cond = {pur_ser_id : req.body.purchaseId}
    let [spurchaseDataErr,purchaseData] = await _p(db.update('tbl_pur_ser_master',{pur_ser_status:'d'},cond).then((result)=>{
        return result;
    }));
    if(spurchaseDataErr && !purchaseData){
    return next(spurchaseDataErr);
    }else{
      let cond = {pur_ser_id :req.body.purchaseId}
      let [spurchaseDataErr,purchaseData] = await _p(db.update('tbl_pur_ser_details',{pur_ser_status:'d'},cond).then((result)=>{
        return result;
      }));
  
  
  
    }
    res.json({error:false,message:'Service Expense Deleted successfully.'})
  })

router.post(`/api/purchase-delete`,async(req,res,next)=>{
  let cond = {pur_id: req.body.purchaseId}
  let [spurchaseDataErr,purchaseData] = await _p(db.update('tbl_purchase_master',{pur_status:'d'},cond).then((result)=>{
      return result;
  }));
  if(spurchaseDataErr && !purchaseData){
  return next(spurchaseDataErr);
  }else{
    let cond = {pur_id:req.body.purchaseId}
    let [spurchaseDataErr,purchaseData] = await _p(db.update('tbl_purchase_details',{pur_status:'d'},cond).then((result)=>{
      return result;
    }));


    // Stock Update

    let [errOldPurDetail,oldPurDetail] =   await _p(db.query(`select * from tbl_purchase_details   where pur_id=? `,[req.body.purchaseId]).then((res=>{
      return res;
    })));

    oldPurDetail.map(async (item)=>{
      /// Previous Product Stock for avarage
      let beforePurchaseStock =  await  Promise.all([stockM.productCurrentStock(item.pur_prod_id,req)]);
      beforePurchaseStock = beforePurchaseStock[0]
     /// End

      await _p(db.query(`update tbl_product_current_stock set purchase_qty=purchase_qty-? where prod_id=? and branch_id=?  `,[item.pur_qty,item.pur_prod_id,item.pur_d_branch_id]).then((res=>{
        return res;
      })));


      /// Product Avarage Calculation
            // purchase rate entry check 
            let [getRateForProdErr,getRateForProd] =  await _p(db.query(`select ifnull(prod_avarage_rate,0) as prod_avarage_rate from tbl_product_purchase_rate  where product_id=? and branch_id=?  `,[item.pur_prod_id,item.pur_d_branch_id]).then((res)=>{
              return res;
            }));

           let previousProdAvgRate =  getRateForProd.length == 0 ?0:getRateForProd[0].prod_avarage_rate;
            
            // previous stock value
            let  previousStockValue =  beforePurchaseStock * parseFloat(previousProdAvgRate);
            //End
            // Subtruct Stock Value
            let oldStockValue = item.pur_qty * item.pur_rate

            let currentStockValue =   previousStockValue - oldStockValue;
            // End
            let subTructQty = beforePurchaseStock - item.pur_qty
            if(currentStockValue==0){
              var avarageRate = previousProdAvgRate;
            }else{
              var avarageRate = currentStockValue / subTructQty;
            }


           await _p(db.query(`update tbl_product_purchase_rate set prod_avarage_rate=? where product_id=? and branch_id=?  `,[avarageRate,item.pur_prod_id,item.pur_d_branch_id]).then(res=>{
              return res
            }));

    })

  }
  res.json({error:false,message:'Purchase Deleted successfully.'})
})


router.post('/api/purchase-return',async(req,res,next)=>{
  let cart = req.body.returnCart;
  let selectedInvoice = req.body.selectedInvoice;
  
  let returnData = {
      'pur_invoice_no':selectedInvoice.pur_invoice_no,
      'pur_supplier_id': selectedInvoice.pur_supplier_id,
      'pur_return_amount':selectedInvoice.pur_return_amount,
      'pur_return_note':selectedInvoice.pur_return_note,
      'pur_return_status':'a',
      'pur_return_created_by':req.user.user_id,
      'pur_return_created_isodt':selectedInvoice.pur_return_created_isodt,
      'pur_return_branch_id':req.user.user_branch_id,
  }


let [purchaseReturnErr,purchaseReturn] =   await _p(db.insert('tbl_purchase_return',returnData).then((result)=>{
    return result;
}));
if(purchaseReturnErr && !purchaseReturn){
  return next(purchaseReturnErr)
}else{
  cart.forEach(async (product)=>{


    /// Previous Product Stock for avarage
    let beforePurchaseStock =  await  Promise.all([stockM.productCurrentStock(product.pur_prod_id,req)]);
    beforePurchaseStock = beforePurchaseStock[0]
   /// End



    let returnDetailData = {
      pur_return_id:purchaseReturn.insertId,
      pur_return_prod_id: product.pur_prod_id,
      pur_return_qty: product.return_qty,
      pur_return_rate: product.pur_rate,
      pur_return_amount: product.return_amount,
      pur_return_status	:'a',
      pur_return_branch_id: req.user.user_branch_id,
    }
    let [saleReturnErrD,saleReturnD] =   await _p(db.insert('tbl_purchase_return_details',returnDetailData).then((result)=>{
      return result;
  }));



   
   // Current Stock purchase  return   add
   let[stockUpdateErr,stockUpdate] =  await _p(db.query(`update tbl_product_current_stock set purchase_return_qty=purchase_return_qty+? where prod_id=? and branch_id=?  `,[product.return_qty,product.pur_prod_id,req.user.user_branch_id]).then((res=>{
    return res;
  })));
  if(stockUpdateErr && !stockUpdate){
    return next(stockUpdateErr)
  }


  /// Product Avarage Calculation
            // purchase rate entry check 
            let [getRateForProdErr,getRateForProd] =  await _p(db.query(`select ifnull(prod_avarage_rate,0) as prod_avarage_rate from tbl_product_purchase_rate  where product_id=? and branch_id=?  `,[product.pur_prod_id,product.pur_d_branch_id]).then((res)=>{
              return res;
            }));

           let previousProdAvgRate =  getRateForProd.length == 0 ?0:getRateForProd[0].prod_avarage_rate;
            
            // previous stock value
            let  previousStockValue =  beforePurchaseStock*parseFloat(previousProdAvgRate);
            //End
            // Subtruct Stock Value
            let oldStockValue = product.return_qty * product.pur_rate

            let currentStockValue =   previousStockValue - oldStockValue;
            // End
            let subTructQty = beforePurchaseStock - product.return_qty
            if(currentStockValue==0){
              var avarageRate = previousProdAvgRate;
            }else{
              var avarageRate = currentStockValue / subTructQty;
            }


           await _p(db.query(`update tbl_product_purchase_rate set prod_avarage_rate=? where product_id=? and branch_id=?  `,[avarageRate,product.pur_prod_id,product.pur_d_branch_id]));
  // End 
  })
}
if(purchaseReturn){
  res.json({error:false,message:'Purchase Return successfully.'})
}
  
})

module.exports = router;