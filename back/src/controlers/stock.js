const router = require('express').Router();
const _p      = require('../utils/promise_error');
const  {getCurrentISODT,checkIntNum,convToISODT,isoFromDate} = require('../utils/functions')

const  {Database}   = require('../utils/Database');
let    db = new Database();

router.post(`/api/get-product-ledger`, async (req,res,next)=>{

    let  payload =  req.body;
    let productId = payload.productId;
    
    

    let [productLedgerErr,productLedger] = await _p(db.query(` 
            select 
            
            'a' as sequence,
            pd.pur_d_id as id,
            concat('Purchase - ', pm.pur_invoice_no, ' - ', sp.supplier_name) as description,
            pm.pur_created_isodt as dateTime,
            pd.pur_qty as in_qty,
            0 as out_qty,
            pd.pur_rate as rate

            from tbl_purchase_details pd 
            left join  tbl_purchase_master pm on pm.pur_id = pd.pur_id
            left join tbl_suppliers sp on sp.supplier_id = pm.pur_supplier_id
            where pd.pur_prod_id= ${productId} and pd.pur_d_branch_id=${req.user.user_branch_id} 
            and pd.pur_status='a' 

            UNION  
            select  
            'b' as sequence,
            prd.pur_return_d_id as id,
            concat('Purchase Return - ',pr.pur_invoice_no,' - ', sp.supplier_name) as description,
            pr.pur_return_created_isodt as dateTime,
            0 as in_qty,
            prd.pur_return_qty as out_qty,
            prd.pur_return_rate as rate

            from tbl_purchase_return_details prd 
            left join tbl_purchase_return pr on pr.pur_return_id = prd.pur_return_id 
            left join tbl_suppliers sp on sp.supplier_id = pr.pur_supplier_id
            where prd.pur_return_prod_id =  ${productId}
            and prd.pur_return_branch_id = ${req.user.user_branch_id}
            and prd.pur_return_status = 'a' 



            UNION 
            select 
            'c' as sequence,
            sd.sale_d_id as id,
            concat('Sales - ', sm.sale_invoice ,' - ', c.customer_name) as description,
            sm.sale_created_isodt as dateTime,
            0 as in_qty,
            sd.sale_qty as out_qty,
            sd.sale_rate as rate

            from tbl_sales_details sd 
            left join tbl_sales_master sm on sm.sale_id = sd.sale_id  
            left join tbl_customers c on c.customer_id = sm.sale_customer_id  
            where sd.sale_prod_id=  ${productId} 
            and sd.sale_d_branch_id=${req.user.user_branch_id} 
            and sd.sale_d_status='a' 

            UNION 
            select 

            'd' as sequence,
            srd.sale_return_d_id as id,
            concat('Sales Return - ',sr.sale_invoice, ' - ',c.customer_name) as description,
            sr.sale_return_created_isodt as dateTime,
            srd.return_qty as in_qty,
            0 as out_qty,
            srd.return_prod_rate as rate

            from tbl_sales_return_details srd  
            left join tbl_sales_return sr on sr.sale_return_id = srd.sale_return_id 
            left join tbl_customers c on c.customer_id = sr.sale_cus_id 
            where 
            srd.return_prod_id =  ${productId}
            and srd.return_branch_id = ${req.user.user_branch_id}
            and srd.return_status='a'

            UNION 
            select 
               
            'e' as sequence,
            dmd.damage_id as id,
            'Damaged' as description,
            dmd.damage_c_isodt as dateTime,
            0 as in_qty,
            dmd.damage_qty as out_qty,
            dmd.damage_rate as rate

            from tbl_product_damage dmd
            where dmd.damage_prod_id =  ${productId}
            and dmd.damage_branch_id = ${req.user.user_branch_id} 
                
            UNION 
            select 
            
            'f' as sequence,
            trd.transfer_d_id as id,
            concat('Transfer To  - ',b.branch_name) as description,
            tm.transfer_c_isodt as dateTime,
            0 as in_qty,
            trd.transfer_qty as out_qty,
            trd.transfer_pur_rate as rate

            from tbl_product_transfer_details trd
            left join  tbl_product_transfer_master tm on tm.transfer_id = trd.transfer_id
            left join tbl_branches b on b.branch_id = tm.transfer_b_to
            where trd.transfer_prod_id =  ${productId}
            and tm.transfer_b_from = ${req.user.user_branch_id} 
            and tm.transfer_status='a'
            
            UNION 
            select 

            'g' as sequence,
            trd.transfer_d_id as id,
            concat('Transfer  in Branch - ',b.branch_name) as description,
            tm.transfer_c_isodt as dateTime,
            trd.transfer_qty as in_qty,
            0 as out_qty,
            trd.transfer_pur_rate as rate

            from tbl_product_transfer_details trd
            left join  tbl_product_transfer_master tm on tm.transfer_id  = trd.transfer_id
            left join tbl_branches b on b.branch_id = tm.transfer_b_from
            where trd.transfer_prod_id =  ${productId}
            and tm.transfer_b_to = ${req.user.user_branch_id} 
            and tm.transfer_status='a' 


            UNION 
            select 
            'h' as sequence,
            pdd.prod_d_id as id,
            concat('Production  - ',pdm.production_invoice) as description,
            pdm.created_isodt as dateTime,
            pdd.prod_qty as in_qty,
            0 as out_qty,
            pdd.prod_rate as rate

            from  tbl_production_products pdd
            left join tbl_product_productions_master pdm on pdm.production_id = pdd.production_id
            where pdd.prod_status = 'a' 
            and pdd.prod_id = ${productId}
            and pdd.branch_id = ${req.user.user_branch_id}
            

            order by dateTime asc
    `).then(res=>res))
    if(productLedgerErr && !productLedger) return next(productLedgerErr);

    let opening_stock  = 0
    let closing_stock  = 0

    productLedger =  productLedger.map((prod,index)=>{
        prod.stock = index == 0 ? (prod.in_qty-prod.out_qty) : ( productLedger[index - 1].stock + (prod.in_qty-prod.out_qty));
        return prod;
        });

   

    if((payload.fromDate != undefined && payload.toDate != undefined) && (payload.fromDate != null && payload.toDate != null) && productLedger.length > 0){
        let prevTrans =  productLedger.filter((stock)=>{
             return stock.dateTime < payload.fromDate
         });
 
         opening_stock =  prevTrans.length > 0 ? prevTrans[prevTrans.length - 1].stock : opening_stock;
         
         productLedger =  productLedger.filter((stock)=>{
             return stock.dateTime >= payload.fromDate && stock.dateTime <= payload.toDate
         });
        closing_stock = productLedger.length > 0 ? productLedger[productLedger.length - 1].stock : 0;

     }

    res.json({ledger:productLedger,opening_stock,closing_stock});
})

let getDameCode = async (req)=>{
    let[damageRowErr,damageRow] = await _p(db.selectSingleRow(`select damage_id  from tbl_product_damage order by damage_id  desc limit 1 `).then(res=>{
        return res;
  }))
  if(damageRowErr && !damageRow){
      return next(damageRowErr)
  }else{
      let code = 'D000';
      if(Object.keys(damageRow).length == 0 && damageRow.constructor == Object){
          code += `1`
      }else{
          code += damageRow.damage_id+parseFloat(1)
      }

      return code;
  }
}



router.get('/api/get-damage-code',async (req,res,next)=>{
    res.json(await Promise.all([getDameCode(req)]));
})






router.post('/api/save-damage',async(req,res,next)=>{
    var payload = req.body.payload;
   
    if(payload.damageAction=='create'){
        delete payload.damage_id;
        delete payload.damageAction;
        payload.damage_code = await Promise.all([getDameCode(req)])
        payload.damage_user_id = req.user.user_id;
        payload.damage_branch_id = req.user.user_branch_id;
      
        let [damageSaveErr,damageSave] = await _p(db.insert(`tbl_product_damage`,payload)).then(res=>{
            return res;
        });

        if(damageSaveErr && !damageSave){
            return next(damageSaveErr);
        }else{
            // Stock update
            let [errStockCheck,stockData] =  await _p(db.countRows(`select * from tbl_product_current_stock where prod_id=? and branch_id=?  `,[payload.damage_prod_id,req.user.user_branch_id]).then((res)=>{
                return res;
            }));
            if( stockData>0){
             await _p(db.query(`update tbl_product_current_stock set damage_qty=damage_qty+? where prod_id=? and branch_id=?  `,[payload.damage_qty,payload.damage_prod_id,req.user.user_branch_id]).then((res=>{
                return res;
                })))
            }else{
                let savePayload = {
                damage_prod_id: payload.damage_prod_id,
                damage_qty: payload.damage_qty,
                branch_id: req.user.user_branch_id,
                }
                let  [qryErr,data] = await _p(db.insert('tbl_product_current_stock',savePayload).then((result)=>{
                return result;
            }));
            }

            // end
            res.json({error:false,message:'Damage Entry successfully'});
        }
    }

    if(payload.damageAction=='update'){
        let [oldDamageErr,oldDamage] = await _p(db.query(`select * from tbl_product_damage where damage_id=?`,[payload.damage_id])).then(res=>{
            return res;
        })
        let  damageId =  payload.damage_id;
        delete payload.damage_id;
        delete payload.damage_code;
        delete payload.damageAction;
        payload.damage_user_id = req.user.user_id;
        payload.damage_branch_id = req.user.user_branch_id;

       
        let  [damageSaveErr,damageSave] = await _p(db.update('tbl_product_damage',payload,{damage_id:damageId}).then((result)=>{
            return result;
        }))
        

        if(damageSaveErr && !damageSave){
            return next(damageSaveErr); 
        }else{
            oldDamage.map(async (product)=>{
                await _p(db.query(`update tbl_product_current_stock set damage_qty=damage_qty-? where prod_id=? and branch_id=?  `,[product.damage_qty,product.damage_prod_id,req.user.user_branch_id]).then((res=>{
                    return res;
                    })))
            });

            await _p(db.query(`update tbl_product_current_stock set damage_qty=damage_qty+? where prod_id=? and branch_id=?  `,[payload.damage_qty,payload.damage_prod_id,req.user.user_branch_id]).then((res=>{
                return res;
                })))
            
            res.json({error:false,message:'Damage update successfully'});
        }
    }
})


router.post('/api/delete-damage',async(req,res,next)=>{

    let [oldDamageErr,oldDamage] = await _p(db.query(`select * from tbl_product_damage where damage_id=?`,[req.body.damageId])).then(res=>{
        return res;
    })

    let[damageErr,damage] = await _p(db.delete(`tbl_product_damage`,{damage_id:req.body.damageId}).then(res=>{
        return res;
    }));
    if(damageErr && !damage){
        return next(damageErr);
    }else{
        
        oldDamage.map(async (product)=>{
            await _p(db.query(`update tbl_product_current_stock set damage_qty=damage_qty-? where prod_id=? and branch_id=?  `,[product.damage_qty,product.damage_prod_id,req.user.user_branch_id]).then((res=>{
                return res;
                })))
        });

        res.json({error:false,message:'Damage Delete Successfully.'})
    }
})


router.post('/api/get-damages',async(req,res,next)=>{
    let cluases = ''
    if(req.body['fromDate']!= undefined && req.body['toDate'] != undefined){
        cluases += ` and  dm.damage_c_isodt between '${req.body['fromDate']}' and '${req.body['toDate']}'  `
    }
      let[damageErr,damage] = await _p(db.query(`select dm.*,pn.prod_name,p.prod_code
      from tbl_product_damage dm 
      left join tbl_products p on p.prod_id = dm.damage_prod_id
      left join tbl_products_names pn on pn.prod_name_id = p.prod_name_id 
      where dm.damage_branch_id=?
      ${cluases}
      order by dm.damage_id desc
      `,[req.user.user_branch_id]).then(res=>{
          return res;
      }));
      if(damageErr && !damage){
          return next(damageErr);
      }else{
          res.json(damage)
      }
})

router.post('/api/get-product-current-stock',async(req,res,next)=>{
    
        let [qryErr,data] = await _p(db.query(`select ((cs.purchase_qty+cs.sale_return_qty+
            cs.transfer_to_qty+cs.production_qty)-(cs.sale_qty +
                 cs.purchase_return_qty + cs.damage_qty
                  + cs.transfer_from_qty) ) as current_stock 
                  from tbl_product_current_stock cs where cs.prod_id=? and 
                  cs.branch_id=? 
                
                  `,[req.body.product_id,req.user.user_branch_id]).then((row)=>{
                    
                    return row.length>0?row[0].current_stock:0;
        }));
            if(qryErr && !data){
            return next(qryErr);
            }
            else{
              res.json({error:false,message:data});
            }
});

router.post('/api/get-product-current-stock-detail',async (req,res,next)=>{
    let clauses = ' ';
        if(req.body['fetch-type']=='low'){
            clauses += ' and current_stock < prod_re_order_lebel ';
        }
     
    let [qryErr,data] = await _p(db.query(`
    select * from (
    select cs.*,( select (cs.purchase_qty+cs.sale_return_qty+cs.transfer_to_qty+cs.production_qty)-(cs.sale_qty + cs.purchase_return_qty + cs.damage_qty + cs.transfer_from_qty) ) as current_stock,
    (select (ifnull(pr.prod_avarage_rate,0.00) * current_stock)) as stock_value,
    p.prod_code,
    p.prod_sale_rate,
    p.prod_re_order_lebel,
    pn.prod_name,
    c.prod_cat_name,
    ifnull(pr.prod_avarage_rate,0) as prod_purchase_rate,
    u.prod_unit_name

    from tbl_product_current_stock cs
    left join tbl_products p on  p.prod_id = cs.prod_id
    left join tbl_products_names pn on pn.prod_name_id = p.prod_name_id
    left join  tbl_product_units u on u.prod_unit_id = p.prod_unit_id
    left join tbl_product_categories c on c.prod_cat_id = p.prod_cat_id
    left join tbl_product_purchase_rate pr on p.prod_id = pr.product_id 
    and pr.branch_id =?

    where p.prod_status='active' and  cs.branch_id=? 
    order by pn.prod_name
    ) as tbl 
    where 1=1 
    ${clauses} 
    
    `,[req.user.user_branch_id,req.user.user_branch_id]).then( rows => {   
                  return rows
      }));
      if(qryErr && !data){
        return next(qryErr);
      }
      else{
          res.json(data);

      }
});

router.post('/api/get-product-total-stock',async (req,res,next)=>{

    let clauses = ' ';
    if(req.body.categoryId!=undefined || req.body.categoryId!=null){
        clauses += ` and  p.prod_cat_id=${req.body.categoryId} `;
    }

    if(req.body.productId!=undefined || req.body.productId!=null){
        clauses += ` and  p.prod_id=${req.body.productId} `;
    }

    if(req.body.brandId!=undefined || req.body.brandId!=null){
        clauses += ` and  p.prod_brand_id=${req.body.brandId} `;
    }

    let [qryErr,data] = await _p(db.query(`
            select p.prod_id,p.prod_code,
            (select ifnull(sum(pd.pur_qty),0) from tbl_purchase_details pd 
            where pd.pur_prod_id=p.prod_id and pd.pur_d_branch_id=${req.user.user_branch_id} 
            and pd.pur_status='a' ) as purchased_quantity,

            ( select ifnull(sum(prd.pur_return_qty),0) from tbl_purchase_return_details prd
            where prd.pur_return_prod_id=p.prod_id 
            and prd.pur_return_branch_id=${req.user.user_branch_id}
            and prd.pur_return_status='a' )
            as purchase_returned_quantity,

            (select ifnull(sum(sd.sale_qty),0) from tbl_sales_details sd 
            where sd.sale_prod_id=p.prod_id 
            and sd.sale_d_branch_id=${req.user.user_branch_id} 
            and sd.sale_d_status='a' ) as sold_quantity,

            (select ifnull(sum(srd.return_qty),0) from tbl_sales_return_details srd where 
            srd.return_prod_id=p.prod_id 
            and srd.return_branch_id=${req.user.user_branch_id}
            and srd.return_status='a' ) as sales_returned_quantity,

            (select ifnull(sum(dmd.damage_qty),0) from tbl_product_damage dmd 
            where dmd.damage_prod_id=p.prod_id 
            and dmd.damage_branch_id=${req.user.user_branch_id} 
             ) as damaged_quantity,
                

            (select ifnull(sum(trd.transfer_qty), 0)
            from tbl_product_transfer_details trd
            left join  tbl_product_transfer_master tm on tm.transfer_id = trd.transfer_id
            where trd.transfer_prod_id = p.prod_id
            and tm.transfer_b_from = ${req.user.user_branch_id} 
            and tm.transfer_status='a' ) as transfered_from_quantity,
            
           (select ifnull(sum(trd.transfer_qty), 0)
            from tbl_product_transfer_details trd
            left join  tbl_product_transfer_master tm on tm.transfer_id  = trd.transfer_id
            where trd.transfer_prod_id = p.prod_id
            and tm.transfer_b_to = ${req.user.user_branch_id} 
            and tm.transfer_status='a' ) as transfered_to_quantity,

            
            (select ifnull(sum(ppd.prod_qty),0) from tbl_production_products ppd
            where ppd.prod_id=p.prod_id and ppd.branch_id=${req.user.user_branch_id} 
            and ppd.prod_status='a' ) as production_quantity,



            (select (purchased_quantity + sales_returned_quantity + transfered_to_quantity + production_quantity) - 
            (sold_quantity + purchase_returned_quantity + damaged_quantity + transfered_from_quantity)) as current_quantity,
            (select ifnull(pr.prod_avarage_rate,0) * current_quantity) as stock_value,
            c.prod_cat_name,pn.prod_name,u.prod_unit_name,
            ifnull(pr.prod_avarage_rate,0) as prod_purchase_rate

            from 
            tbl_products p  left join tbl_product_categories c on p.prod_cat_id = c.prod_cat_id
            left join tbl_products_names pn on p.prod_name_id = pn.prod_name_id
            left join tbl_product_units u on p.prod_unit_id = u.prod_unit_id
            left join tbl_product_purchase_rate pr on p.prod_id = pr.product_id 
            and pr.branch_id=?

            where p.prod_status='active' 
            and find_in_set(?,p.prod_branch_ids) <> 0 
            ${clauses}

            order by pn.prod_name


    `,[req.user.user_branch_id,req.user.user_branch_id])).then(rows=>{
        return rows;
      });

      if(qryErr && !data){
        return next(qryErr);
      }
      else{
          res.json(data);

      }
});


router.get(`/get-fix-material-stock`,async(req,res,next)=>{

    let user_branch_id = 1


    let [qryErr,data] = await _p(db.query(`
    select m.material_id,m.material_code,

    (select ifnull(sum(pd.purchase_qty),0) from tbl_material_purchase_details pd 
    where pd.material_id=m.material_id and pd.branch_id=${user_branch_id} 
  
    and pd.status='a' ) as purchased_quantity,

    (select ifnull(sum(mused.material_qty),0) from tbl_product_productions_details mused 
    where mused.material_id=m.material_id and mused.branch_id=${user_branch_id} 
  
    and mused.status='a' ) as material_used_quantity,

    (select ifnull(sum(mdmd.damage_qty),0) from tbl_materials_damage mdmd
    where mdmd.material_id=m.material_id and mdmd.damage_branch_id=${user_branch_id} 
  
    ) as material_damage_quantity,

    (select (purchased_quantity) - 
    (material_used_quantity + material_damage_quantity )) as current_quantity,
    (select ifnull(mr.material_avarage_rate,0) * current_quantity) as stock_value,


    c.prod_cat_name,mn.material_name,
    u.prod_unit_name,
    ifnull(mr.material_avarage_rate,0) as material_purchase_rate
    
    from tbl_materials m 
    left join tbl_material_names mn on m.material_name_id = mn.material_name_id
    left join tbl_product_categories c on m.material_cat_id = c.prod_cat_id
    left join  tbl_product_units u on u.prod_unit_id = m.material_unit_id
    left join tbl_material_purchase_rate mr on m.material_id = mr.material_id 
    and find_in_set(mr.branch_id,m.material_branch_ids)

    where m.material_status='a' 
    and find_in_set(?,m.material_branch_ids) <> 0 
    


`,[user_branch_id])).then(rows=>{
return rows;
});

data.map(async(stock)=>{
    let savePayload = {
        material_id: stock.material_id,
        material_purchase_qty: stock.purchased_quantity,
        material_used_qty: stock.material_used_quantity,
        material_damage_qty: stock.material_damage_quantity,
        branch_id: user_branch_id,
    }
    let  [qryErr,data] = await _p(db.insert('tbl_material_stock',savePayload).then((result)=>{
                  return result;
               }));
})


res.json({})

})

router.get(`/get-fix-stock`,async(req,res,next)=>{


    let branch_id = 1
   
    let [qryErr,data] = await _p(db.query(`
            select p.prod_id,p.prod_code,
            (select ifnull(sum(pd.pur_qty),0) from tbl_purchase_details pd 
            where pd.pur_prod_id=p.prod_id and pd.pur_d_branch_id=${branch_id} 
            and pd.pur_status='a' ) as purchased_quantity,

            ( select ifnull(sum(prd.pur_return_qty),0) from tbl_purchase_return_details prd
            where prd.pur_return_prod_id=p.prod_id 
            and prd.pur_return_branch_id=${branch_id}
            and prd.pur_return_status='a' )
            as purchase_returned_quantity,

            (select ifnull(sum(sd.sale_qty),0) from tbl_sales_details sd 
            where sd.sale_prod_id=p.prod_id 
            and sd.sale_d_branch_id=${branch_id} 
            and sd.sale_d_status='a' ) as sold_quantity,

            (select ifnull(sum(srd.return_qty),0) from tbl_sales_return_details srd where 
            srd.return_prod_id=p.prod_id 
            and srd.return_branch_id=${branch_id}
            and srd.return_status='a' ) as sales_returned_quantity,

            (select ifnull(sum(dmd.damage_qty),0) from tbl_product_damage dmd 
            where dmd.damage_prod_id=p.prod_id 
            and dmd.damage_branch_id=${branch_id} 
             ) as damaged_quantity,
                

            (select ifnull(sum(trd.transfer_qty), 0)
            from tbl_product_transfer_details trd
            left join  tbl_product_transfer_master tm on tm.transfer_id = trd.transfer_id
            where trd.transfer_prod_id = p.prod_id
            and tm.transfer_b_from = ${branch_id} 
            and tm.transfer_status='a' ) as transfered_from_quantity,
            
           (select ifnull(sum(trd.transfer_qty), 0)
            from tbl_product_transfer_details trd
            left join  tbl_product_transfer_master tm on tm.transfer_id  = trd.transfer_id
            where trd.transfer_prod_id = p.prod_id
            and tm.transfer_b_to = ${branch_id} 
            and tm.transfer_status='a' ) as transfered_to_quantity,

            
            (select ifnull(sum(ppd.prod_qty),0) from tbl_production_products ppd
            where ppd.prod_id=p.prod_id and ppd.branch_id=${branch_id} 
            and ppd.prod_status='a' ) as production_quantity,



            (select (purchased_quantity + sales_returned_quantity + transfered_to_quantity + production_quantity) - 
            (sold_quantity + purchase_returned_quantity + damaged_quantity + transfered_from_quantity)) as current_quantity,
            (select ifnull(pr.prod_avarage_rate,0) * current_quantity) as stock_value,
            c.prod_cat_name,pn.prod_name,u.prod_unit_name,
            ifnull(pr.prod_avarage_rate,0) as prod_purchase_rate

            from 
            tbl_products p  left join tbl_product_categories c on p.prod_cat_id = c.prod_cat_id
            left join tbl_products_names pn on p.prod_name_id = pn.prod_name_id
            left join tbl_product_units u on p.prod_unit_id = u.prod_unit_id
            left join tbl_product_purchase_rate pr on p.prod_id = pr.product_id 
            and pr.branch_id=?

            where p.prod_status='active' 
            and find_in_set(?,p.prod_branch_ids) <> 0 
         

            order by pn.prod_name


    `,[branch_id,branch_id])).then(rows=>{
        return rows;
      });

      if(qryErr && !data){
        return next(qryErr);
      }
      else{

        console.log(data)

        data.map(async (prod)=>{
           


              let [errStockCheck,stockData] =  await _p(db.countRows(`select * from tbl_product_current_stock where prod_id=? and branch_id=?  `,[prod.prod_id,branch_id]).then((res)=>{
                return res;
          }));


          if( stockData>0){
         

          }else{
            let savePayload = {
                purchase_qty: prod.purchased_quantity,
                purchase_return_qty: prod.purchase_returned_quantity,
                production_qty: prod.production_quantity,
                sale_qty: prod.sold_quantity,
                sale_return_qty: prod.sales_returned_quantity,
                damage_qty: prod.damaged_quantity,
                transfer_from_qty: prod.transfered_from_quantity,
                transfer_to_qty: prod.transfered_to_quantity,
                prod_id: prod.prod_id,
                branch_id: branch_id
              }


            let  [qryErr,data] = await _p(db.insert('tbl_product_current_stock',savePayload).then((result)=>{
              return result;
          }));
          }

        })


        res.json({a:'a'})




        




      }



})


router.get(`/sale-detail-date-entry`,async(req,res,next)=>{
    let[salesErr,sales] = await _p(db.query(`select sale_id,sale_created_isodt
      from tbl_sales_master
      `).then(res=>{
          return res;
      }));
      sales.map(async(sale)=>{
        await _p(db.update('tbl_sales_details',{sale_date_time:sale.sale_created_isodt},{sale_id:sale.sale_id}).then((result)=>{
            return result;
        }));
      })

      res.json({status:'ok'})
});

router.get(`/areas-restore`,async(req,res,next)=>{
    let[customersErr,customers] = await _p(db.query(`select area
      from table_name group by area
      `).then(res=>{
          return res;
      }));

      customers.map(async(a)=>{
        let [newAreaErr,newArea] =   await _p(db.insert('tbl_areas',{
            area_name: a.area,
            area_branch_id:1
        }).then((result)=>{
            return result;
        }));
      })

      res.json({})
})


router.get(`/customers-restore`,async(req,res,next)=>{
    let[customersErr,customers] = await _p(db.query(`select *
      from table_name
      `).then(res=>{
          return res;
      }));

      customers.map(async(cus)=>{



     

     

           
                let [prevErr,prev] =  await _p(db.query(`select area_id
                from tbl_areas where area_name = '${cus.area}'
                `).then(res=>{
                    return res;
                }));


            


            // Customer Entry

            let customer = {
                customer_code : cus.Customer_code,
                customer_name: cus.Customer_name,
                customer_institution_name: cus.institution_name,
                customer_address: cus.address,
                customer_area_id: prev[0].area_id,
                customer_mobile_no: cus.mobile_no,
                customer_phone_no: '',
                customer_previous_due: cus.previous_due,
                customer_credit_limit: cus.creadit_limit,
                customer_type: cus.Customer_Type,
                customer_created_isodt:getCurrentISODT(), 
                customer_branch_id: 1,
            }


            await _p(db.insert('tbl_customers',customer).then((result)=>{
                return result;
            }));

        

      })

      res.json({})
     
})



module.exports = router;