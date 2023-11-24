const router = require('express').Router();
const _p      = require('../utils/promise_error');
const  {Database}   = require('../utils/Database');
let    db = new Database();

class StockModel {

   
        async productCurrentStock(productId,req){

         
         let [qryErr,data] =  await _p(db.query(`select ((cs.purchase_qty+cs.sale_return_qty+
                cs.transfer_to_qty+cs.production_qty)-(cs.sale_qty +
                     cs.purchase_return_qty + cs.damage_qty
                      + cs.transfer_from_qty) ) as current_stock 
                      from tbl_product_current_stock cs where cs.prod_id=? and 
                      cs.branch_id=? 
                    
                      `,[productId,req.user.user_branch_id]).then((row)=>{

                        

                        // console.log(row[0].current_stock)

                        
                        return row.length==0?0:row[0].current_stock;
            }));
                if(qryErr && !data){
                return next(qryErr);
                }
                else{
                  return data
                }
        }

        async materialCurrentStock(materialId,req){
          let [qryErr,data] = await _p(db.query(`select ((cs.material_purchase_qty)-(cs.material_used_qty +
            cs.material_damage_qty ) ) as current_stock 
             from tbl_material_stock cs where cs.material_id=? and 
             cs.branch_id=? 
           
             `,[materialId,req.user.user_branch_id]).then((row)=>{
               
               return row.length==0?0:row[0].current_stock;
              }));
            if(qryErr && !data){
            return next(qryErr);
            }
            else{
              return data;
            }
        }
   
}

module.exports = {StockModel}