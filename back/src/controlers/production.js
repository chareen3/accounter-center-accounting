const router = require('express').Router();
const _p      = require('../utils/promise_error');
const  {getCurrentISODT,checkIntNum,convToISODT} = require('../utils/functions')

const  {Database}   = require('../utils/Database');
const  {PurchaseModel}   = require('../models/PurchaseModel');
const  {StockModel}   = require('../models/StockModel');

let    db = new Database();
let    purMdl = new PurchaseModel();
const    stockM = new StockModel();
 
router.post(`/api/get-material-ledger`, async (req,res,next)=>{

  let  payload =  req.body;
  let materialId = payload.materialId;
  
  

  let [materialLedgerErr,materialLedger] = await _p(db.query(` 
          select 
          
          'a' as sequence,
          pd.m_pur_detail_id  as id,
          concat('Purchase - ', ifnull(pm.m_purchase_invoice,'') , ' - ', ifnull(sp.supplier_name,'')) as description,
          pm.created_isodt as dateTime,
          pd.purchase_qty as in_qty,
          0 as out_qty,
          pd.purchase_rate as rate

          from  tbl_material_purchase_details pd 
          left join  tbl_material_purchase pm on pm.m_purchase_id  = pd.m_purchase_id
          left join tbl_suppliers sp on sp.supplier_id = pm.supplier_id
          where pd.material_id= ${materialId} and pd.branch_id = ${req.user.user_branch_id} 
          and pd.status='a' 

          UNION  
          select  
          'b' as sequence,
          ppd.prod_d_id as id,
          concat('Used In Production  - ',ppm.production_invoice,' - ', emp.employee_name) as description,
          ppm.created_isodt as dateTime,
          0 as in_qty,
          ppd.material_qty as out_qty,
          ppd.material_rate as rate

          from tbl_product_productions_details ppd 
          left join tbl_product_productions_master ppm on ppm.production_id = ppd.production_id 
          left join tbl_employees emp on emp.employee_id  = ppm.production_by 
          where ppd.material_id =  ${materialId}
          and ppd.branch_id = ${req.user.user_branch_id}
          and ppd.status = 'a' 



          UNION 
          select 
          'c' as sequence,
          md.damage_id as id,
          concat('Damage  - ', md.damage_code) as description,
          md.damage_c_isodt as dateTime,
          0 as in_qty,
          md.damage_qty as out_qty,
          md.damage_rate as rate

          from tbl_materials_damage md 

          where md.material_id =  ${materialId} 
          and md.damage_branch_id=${req.user.user_branch_id} 

          order by dateTime asc
  `).then(res=>res))
  if(materialLedgerErr && !materialLedger) return next(materialLedgerErr);


  let opening_stock  = 0
  let closing_stock  = 0

  
  materialLedger =  materialLedger.map((material,index)=>{
    material.stock = index == 0 ? (material.in_qty-material.out_qty) : ( materialLedger[index - 1].stock + (material.in_qty-material.out_qty));
  return material;
  });


  if((payload.fromDate != undefined && payload.toDate != undefined) && (payload.fromDate != null && payload.toDate != null) && materialLedger.length > 0){
    let prevTrans =  materialLedger.filter((stock)=>{
         return stock.dateTime < payload.fromDate
     });

     opening_stock =  prevTrans.length > 0 ? prevTrans[prevTrans.length - 1].stock : opening_stock;
     
     materialLedger =  materialLedger.filter((stock)=>{
         return stock.dateTime >= payload.fromDate && stock.dateTime <= payload.toDate
     });
    closing_stock = materialLedger.length > 0 ? materialLedger[materialLedger.length - 1].stock : 0;

 }


  res.json({ledger:materialLedger,opening_stock,closing_stock});
})


router.post('/api/get-material-current-stock',async(req,res,next)=>{
  let [qryErr,data] = await _p(db.query(`select ((cs.material_purchase_qty)-(cs.material_used_qty +
           cs.material_damage_qty ) ) as current_stock 
            from tbl_material_stock cs where cs.material_id=? and 
            cs.branch_id=? 
          
            `,[req.body.materialId,req.user.user_branch_id]).then((row)=>{
              
              return row.length>0?row[0].current_stock:0;
  }));
      if(qryErr && !data){
      return next(qryErr);
      }
      else{
        res.json({error:false,stock:data});
      }
});

router.post('/api/get-material-current-stock-detail',async (req,res,next)=>{
  let clauses = ' ';
      if(req.body['fetch-type']=='low'){
          clauses += ' and current_stock < material_re_order_lebel ';
      }
   
        let [qryErr,data] = await _p(db.query(`
        select * from (
        select cs.*,( select (cs.material_purchase_qty)-(cs.material_used_qty + cs.material_damage_qty ) ) as current_stock,
        (select (ifnull(mr.material_avarage_rate,0.00) * current_stock)) as stock_value,
        m.material_code,
        m.material_re_order_lebel,
        mn.material_name,
        u.prod_unit_name,
        ifnull(mr.material_avarage_rate,0) as material_purchase_rate,
        c.prod_cat_name
        from tbl_material_stock cs
        left join tbl_materials m on  m.material_id = cs.material_id
        left join  tbl_material_names mn on mn.material_name_id = m.material_name_id
        left join  tbl_product_units u on u.prod_unit_id = m.material_unit_id
        left join tbl_product_categories c on c.prod_cat_id = m.material_cat_id
        left join tbl_material_purchase_rate mr on m.material_id = mr.material_id 
        and find_in_set(mr.branch_id,m.material_branch_ids)
        where m.material_status = 'a' and  cs.branch_id=?  

        ) as tbl 
        where 1=1 
        ${clauses} 
        `,[req.user.user_branch_id]).then( rows => {   
                      return rows
          }));
          if(qryErr && !data){
            return next(qryErr);
          }
          else{
              res.json(data);

          }
});


router.post('/api/get-material-total-stock',async (req,res,next)=>{

  let clauses = ' ';
  if(req.body.categoryId!=undefined || req.body.categoryId!=null){
      clauses += ` and  m.material_cat_id=${req.body.categoryId} `;
  }

  if(req.body.materialId!=undefined || req.body.materialId!=null){
      clauses += ` and  m.material_id=${req.body.materialId} `;
  }

  

  let [qryErr,data] = await _p(db.query(`
          select m.material_id,m.material_code,

          (select ifnull(sum(pd.purchase_qty),0) from tbl_material_purchase_details pd 
          where pd.material_id=m.material_id and pd.branch_id=${req.user.user_branch_id} 
        
          and pd.status='a' ) as purchased_quantity,

          (select ifnull(sum(mused.material_qty),0) from tbl_product_productions_details mused 
          where mused.material_id=m.material_id and mused.branch_id=${req.user.user_branch_id} 
        
          and mused.status='a' ) as material_used_quantity,

          (select ifnull(sum(mdmd.damage_qty),0) from tbl_materials_damage mdmd
          where mdmd.material_id=m.material_id and mdmd.damage_branch_id=${req.user.user_branch_id} 
        
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
          ${clauses}


  `,[req.user.user_branch_id])).then(rows=>{
      return rows;
    });

    if(qryErr && !data){
      return next(qryErr);
    }
    else{
        res.json(data);

    }
});


let getMaterialCode = async (req,res,next)=>{
    let [lastProductRowError,lastProductRow] =  await _p(db.query(`select material_id from 
    tbl_materials  order by material_id desc LIMIT 1`)).then(result=>{
        return result;
    });
    if(lastProductRowError){
        next(lastProductRowError)
    }
    let materialCode = '';
    if(lastProductRow.length<1){
        materialCode = 'M00001';
    }else{
        materialCode = 'M0000'+(parseFloat(lastProductRow[0].material_id)+1);
    }
    return new Promise((resolve,reject)=>{
             resolve(materialCode)
    })
}

router.get('/api/get-material-code',async(req,res,next)=>{  
        res.json({
            error:false,
            message:await  getMaterialCode(req,res,next)
        });
})

router.post('/api/material-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let materialUpdateIndex = reqObj.materialUpdateIndex;
     let saveObj = {
        material_code: await  getMaterialCode(req,res,next),
        material_cat_id: reqObj.material_cat_id, 
        material_unit_id: reqObj.material_unit_id, 
        material_name_id: reqObj.material_name_id, 
        material_purchase_rate: reqObj.material_purchase_rate, 
        material_re_order_lebel: reqObj.material_re_order_lebel, 
        material_branch_ids:req.user.user_branch_id,
       
        material_created_by:req.user.user_id,
        material_updated_by:req.user.user_id,
        material_status:'a',
        material_created_isodt:getCurrentISODT(),
        material_updated_isodt:getCurrentISODT()
     }
    /// let saveObj = Object.assign(reqObj,newObject)
     
     // Create script 
     if(reqObj.action=='create'){
        let [materialExitErr,materialCount] =  await _p(db.countRows(`select * from tbl_materials where material_name_id=?  and material_cat_id=?  `,[saveObj.material_name_id,saveObj.material_cat_id])).then(count=>{
            
            return count;
        });

        if(materialExitErr && !materialCount){
           next(materialExitErr);
        }else{
           if(materialCount>0){
               res.json({
                   error:false,
                   warning:true,
                   message:'This Category\'s Material  already Exist.'
               })
           }else{
                /// Creting 
                delete saveObj.material_id;
                delete saveObj.action;
                delete saveObj.material_updated_by;
                delete saveObj.materialUpdateIndex;
                delete saveObj.material_updated_isodt;
    
            let [materialAddErr,materialAddResult] = await _p(db.insert('tbl_materials',saveObj)).then(res=>{
                return res;
            });
            if(materialAddErr && !materialAddResult){
               next(materialAddErr)
            }else{
               let [createdRowErr,createdRow] =  await _p(db.query(`select m.*,
               c.prod_cat_name,mn.material_name,u.prod_unit_name,
               ifnull(mr.material_avarage_rate,0) as material_purchase_rate
               from 
               tbl_materials m
               left join tbl_product_categories c on m.material_cat_id = c.prod_cat_id
               left join tbl_material_names mn on m.material_name_id = mn.material_name_id
               left join tbl_product_units u on m.material_unit_id = u.prod_unit_id

               left join tbl_material_purchase_rate mr on m.material_id = mr.material_id 
               and find_in_set(mr.branch_id,m.material_branch_ids)

               where m.material_id=? and find_in_set(?,m.material_branch_ids) 
               `,[materialAddResult.insertId,req.user.user_branch_id])).then(row=>{
                    return row;
                })
                if(createdRowErr && !createdRow){
                   next(createdRowErr);
                }else{
                   req.app.io.emit('createdMaterial',{
                   msg:'You have successfully created a material',
                   createdRow,
                   index:materialUpdateIndex,
                   user_branch_id: req.user.user_branch_id,
                 
                });
    
                req.app.io.emit('materialCode',{
                    createdRow:await  getMaterialCode(req,res,next)
                 });
    
                   res.json({
                       error:false,
                       message:'You have successfully created a material'
                   })
                }
            }

                //  End
           }
        }

            
     }
     // Update script
     if(reqObj.action=='update'){ 

        let [materialExitErr,materialCount] =  await _p(db.countRows(`select * from 
        tbl_materials where material_name_id=? 
         and material_cat_id=? and material_id<>?  
          `,
          [saveObj.material_name_id,saveObj.material_cat_id,reqObj.material_id])).then(count=>{
            return count;
        });


      

        if(materialExitErr && !materialCount){
           next(materialExitErr);
        }else{
            if(materialCount>0){
                res.json({
                    error:false,
                    warning:true,
                    message:'This Category\'s Material  already Exist.'
                })
            }else{
                let cond = {
                    material_id:reqObj.material_id
               }
               delete saveObj.material_code;
               delete saveObj.action;
               delete saveObj.material_status;
               delete saveObj.materialUpdateIndex;
               delete saveObj.material_created_isodt;
               let [materialUpdateErr,materialUpdateResult] = await _p(db.update('tbl_materials',saveObj,cond)).then(res=>{
                   return res;
               });
               if(materialUpdateErr && !materialUpdateResult){
                  next(materialUpdateErr)
               }else{
                  let [updatedRowErr,updatedRow] =  await _p(db.query(`select m.*,
                  c.prod_cat_name,mn.material_name,u.prod_unit_name,
                  ifnull(mr.material_avarage_rate,0) as material_purchase_rate
                  from 
                  tbl_materials m
                  left join tbl_product_categories c on m.material_cat_id = c.prod_cat_id
                  left join tbl_material_names mn on m.material_name_id = mn.material_name_id
                  left join tbl_product_units u on m.material_unit_id = u.prod_unit_id
                  left join tbl_material_purchase_rate mr on m.material_id = mr.material_id 
                  and find_in_set(mr.branch_id,m.material_branch_ids)

                  where m.material_id=? and find_in_set(?,m.material_branch_ids) 
                  `,[reqObj.material_id,req.user.user_branch_id])).then(row=>{
                       return row;
                   })
                   if(updatedRowErr && !updatedRow){
                      next(updatedRowErr);
                   }else{
                      req.app.io.emit('updatedMaterial',{
                      msg:'You have successfully update a material', 
                      updatedRow,
                      index:materialUpdateIndex,
                      user_branch_id: req.user.user_branch_id,
                      })
                      res.json({
                          error:false,
                          message:'You have successfully updated a material'
                      })
                   }
               }
    
            }
            
        }
         
     }
     
})


router.post('/api/material-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
    let action = ``
    if(req.body.action=='d'){
        saveEnum = 'd'
        action = 'disable'
    }
    if(req.body.action=='a'){
        saveEnum = 'a'
        action = 'restore'
    }
    if(req.body.action=='d' || req.body.action=='a'){
        let cond = {
            material_id:req.body.material_id
        }
        
       let [prodRestoreErr,prodDisRestoreResult] = await _p(db.update('tbl_materials',{material_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(prodRestoreErr && !prodDisRestoreResult){
          next(prodRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select m.*,
          c.prod_cat_name,mn.material_name,u.prod_unit_name,
          ifnull(mr.material_avarage_rate,0) as material_purchase_rate
           from 
          tbl_materials m
          left join tbl_product_categories c on m.material_cat_id = c.prod_cat_id
          left join tbl_material_names mn on m.material_name_id = mn.material_name_id
          left join tbl_product_units u on m.material_unit_id = u.prod_unit_id
          left join tbl_material_purchase_rate mr on m.material_id = mr.material_id 
          and find_in_set(mr.branch_id,m.material_branch_ids)

          where m.material_id=? and find_in_set(?,m.material_branch_ids) `,[req.body.material_id,req.user.user_branch_id])).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreMaterial',{
              msg:`You have successfully ${action} a material`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
           
            });
              res.json({
                  error:false,
                  message:`You have successfully ${action} a material`
              })
           }
       }
    }
})


router.post('/api/get-materials',async (req,res,next)=>{
    let cluases = " ";
    

    if(req.body['fromDate']!= undefined && req.body['toDate'] != undefined){
        cluases += ` and  m.material_created_isodt between '${req.body['fromDate']}' and '${req.body['toDate']}'  `
    }

    if(req.body['userId']!= undefined){
      cluases += ` and  m.material_created_by = '${req.body['userId']}'  `
  }

    let [materialsError,materials] =  await _p(db.query(`select m.*,
    c.prod_cat_name,mn.material_name,u.prod_unit_name,
    ifnull(mr.material_avarage_rate,0) as material_purchase_rate
    from 
    tbl_materials m
    left join tbl_product_categories c on m.material_cat_id = c.prod_cat_id
    left join tbl_material_names mn on m.material_name_id = mn.material_name_id
    left join tbl_product_units u on m.material_unit_id = u.prod_unit_id
    left join tbl_material_purchase_rate mr on m.material_id = mr.material_id 
    and find_in_set(mr.branch_id,m.material_branch_ids)

    where  find_in_set(?,m.material_branch_ids) <> 0 
     ${cluases}      
    order by material_status asc `,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(materialsError && !materials){
        next(materialsError)
    }else{
       
        res.json({
            error:false,
            message:materials
        });
    }
})



router.post('/api/get-material-names',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='a'){
        cluases += " and name_status='a' "
    }
let [materialNamesError,materialNames] =  await _p(db.query(`select * from  tbl_material_names where   name_branch_id=?  ${cluases}   order by name_status `,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(materialNamesError && !materialNames){
        next(materialNamesError)
    }else{
        res.json({
            error:false,
            message:materialNames
        });
    }
});


router.post('/api/material-name-cu',async (req,res,next)=>{
    let reqObj = req.body;

    if(reqObj.action =='create'){
      let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_material_names where material_name=? and name_branch_id=? `,[reqObj.material_name,req.user.user_branch_id])).then(row=>{
          return row;
      });
      if(checkDuplicate>0){
          res.json({
              error:true,
              message:'Material Name Already Exists !!!'
          })
         return false
      }
  }
  if(reqObj.action =='update'){
      let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_material_names where material_name=? and material_id <>? and name_branch_id=?  `,[reqObj.material_name,reqObj.material_id,req.user.user_branch_id])).then(row=>{
          return row;
      });
      if(checkDuplicate>0){
          res.json({
              error:true,
              message:'Material Name Already Exists !!!'
          })
           return false
      }
  }


    let materialNameUpdateIndex = req.body.materialNameUpdateIndex;
     let newObject = {
        material_name:req.body.material_name,
        name_branch_id	:req.user.user_branch_id,
        
        name_created_by:req.user.user_id,
        name_status:'a',
        name_created_isodt:getCurrentISODT(),
        name_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)

     // Create script
     if(reqObj.action=='create'){
            delete saveObj.material_name_id;
            delete saveObj.action;
            delete saveObj.materialNameUpdateIndex;
            delete saveObj.name_updated_isodt;

        let [materialNameAddErr,materialNameAddResult] = await _p(db.insert('tbl_material_names',saveObj)).then(res=>{
            return res;
        });
        if(materialNameAddErr && !materialNameAddResult){
           next(materialNameAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from tbl_material_names where material_name_id=?`,materialNameAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdMaterialName',{
               msg:'You have successfully created a material name',
               createdRow,
               index:materialNameUpdateIndex,
               user_branch_id: req.user.user_branch_id,
               
              
            });
               res.json({
                   error:false,
                   message:'You have successfully created a material name'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
             material_name_id:reqObj.material_name_id,
            
        }
        delete saveObj.action;
        delete saveObj.name_status;
        delete saveObj.materialNameUpdateIndex;
        delete saveObj.name_created_isodt;
        let [materialNameUpdateErr,unitUpdateResult] = await _p(db.update('tbl_material_names',saveObj,cond)).then(res=>{
            return res;
        });
        if(materialNameUpdateErr && !materialNameUpdateErr){
           next(materialNameUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select * from tbl_material_names where material_name_id=?`,reqObj.material_name_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedMaterialName',{
               msg:'You have successfully update a material name',
               updatedRow,
               index:materialNameUpdateIndex,
               user_branch_id: req.user.user_branch_id,
               });
               res.json({
                   error:false,
                   message:'You have successfully updated a material name'
               })
            }
        }
     }
     
})


router.post('/api/material-name-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   let action = ``
    if(req.body.action=='d'){
        saveEnum = 'd'
        action = 'disabled'
    }
    if(req.body.action=='a'){
        saveEnum = 'a'
        action = 'restore'
    }
    if(req.body.action=='d' || req.body.action=='a'){
        let cond = {
            material_name_id:req.body.material_name_id
        }
        
       let [materialNameRestoreErr,materialNameDisRestoreResult] = await _p(db.update('tbl_material_names',{name_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(materialNameRestoreErr && !materialNameDisRestoreResult){
          next(materialNameRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_material_names where material_name_id=?`,req.body.material_name_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreMaterialName',{
              msg:`You have successfully ${req.body.action} a material name`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
              
            });
              res.json({
                  error:false,
                  message:`You have successfully ${action} a material name`
              })
           }
       }
    }
});

router.post('/api/get-material-damages',async(req,res,next)=>{
    let cluases = ''
    if(req.body['fromDate']!= undefined && req.body['toDate'] != undefined){
        cluases += ` and  dm.damage_c_isodt between '${req.body['fromDate']}' and '${req.body['toDate']}'  `
    }

    if(req.body.materialId != undefined){
      cluases += ` and dm.material_id = ${req.body.materialId} `
    }

    if(req.body.userId != undefined){
      cluases += ` and dm.damage_user_id = ${req.body.userId} `
    }
      let[damageErr,damage] = await _p(db.query(`select dm.*,mn.material_name
      from tbl_materials_damage dm 
      left join tbl_materials m on m.material_id = dm.material_id
      left join tbl_material_names mn on mn.material_name_id  = m.material_name_id 
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

let getDameCode = async (req)=>{
    let[damageRowErr,damageRow] = await _p(db.selectSingleRow(`select damage_id  from
    tbl_materials_damage order by damage_id  desc limit 1 `).then(res=>{
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



router.get('/api/get-material-damage-code',async (req,res,next)=>{
    res.json(await Promise.all([getDameCode(req)]));
})




router.post('/api/save-material-damage',async(req,res,next)=>{
    var payload = req.body.payload;
   
    if(payload.damageAction=='create'){
        delete payload.damage_id;
        delete payload.damageAction;
        payload.damage_code = await Promise.all([getDameCode(req)])
        payload.damage_user_id = req.user.user_id;
        payload.damage_branch_id = req.user.user_branch_id;
      
        let [damageSaveErr,damageSave] = await _p(db.insert(`tbl_materials_damage`,payload)).then(res=>{
            return res;
        });

        if(damageSaveErr && !damageSave){
            return next(damageSaveErr);
        }else{
          
            /// Stock updateing          
            let [errStockCheck,stockData] =  await _p(db.countRows(`select * from  tbl_material_stock where material_id=? and branch_id=?  `,[payload.material_id,req.user.user_branch_id]).then((res)=>{
              return res;
        }));
        if( stockData>0){
          await _p(db.query(`update tbl_material_stock set material_damage_qty=material_damage_qty+? where material_id=? and branch_id=?  `,[payload.damage_qty,payload.material_id,req.user.user_branch_id]).then((res=>{
            return res;
          })));
        }else{
          let savePayload = {
            material_id: payload.material_id,
            material_damage_qty: payload.damage_qty,
            branch_id: req.user.user_branch_id,
          }
          let [qryErr,data] = await _p(db.insert('tbl_material_stock',savePayload).then((result)=>{
            return result;
        }));

        }

            // end
            res.json({error:false,message:'Damage Entry successfully'});
        }
    }

    if(payload.damageAction=='update'){
        
        let  damageId =  payload.damage_id;
        delete payload.damage_id;
        delete payload.damage_code;
        delete payload.damageAction;
        payload.damage_user_id = req.user.user_id;
        payload.damage_branch_id = req.user.user_branch_id;


        let [oldDamageErr,oldDamage] = await _p(db.query(`select * from tbl_materials_damage
        where damage_id=?`,[damageId])).then(res=>{
           return res;
       })
      await _p(db.query(`update tbl_material_stock set material_damage_qty=material_damage_qty-? where material_id=? and branch_id=?  `,[oldDamage[0].damage_qty,oldDamage[0].material_id,oldDamage[0].damage_branch_id]).then(res=>{
          return res;
        }))




       
        let  [damageSaveErr,damageSave] = await _p(db.update('tbl_materials_damage',payload,{damage_id:damageId}).then((result)=>{
            return result;
        }))
        

        if(damageSaveErr && !damageSave){
            return next(damageSaveErr); 
        }else{

         


 
            /// Stock updateing          
            let [errStockCheck,stockData] =  await _p(db.countRows(`select * from  tbl_material_stock where material_id=? and branch_id=?  `,[payload.material_id,req.user.user_branch_id]).then((res)=>{
              return res;
        }));
        if( stockData>0){
          await _p(db.query(`update tbl_material_stock set material_damage_qty=material_damage_qty+? where material_id=? and branch_id=?  `,[payload.damage_qty,payload.material_id,req.user.user_branch_id]).then((res=>{
            return res;
          })));
        }else{
          let savePayload = {
            material_id: payload.material_id,
            material_damage_qty: payload.damage_qty,
            branch_id: req.user.user_branch_id,
          }
          let [qryErr,data] = await _p(db.insert('tbl_material_stock',savePayload).then((result)=>{
            return result;
        }));
        }
            res.json({error:false,message:'Damage update successfully'});
        
    }
  }

  })


router.post('/api/delete-material-damage',async(req,res,next)=>{


   
    
        
        let [oldDamageErr,oldDamage] = await _p(db.query(`select * from tbl_materials_damage
        where damage_id=?`,[req.body.damageId])).then(res=>{
           return res;
       })


        await _p(db.query(`update tbl_material_stock set material_damage_qty=material_damage_qty-? where material_id=? and branch_id=?  `,[oldDamage[0].damage_qty,oldDamage[0].material_id,req.user.user_branch_id]))



        let[damageErr,damage] = await _p(db.delete(`tbl_materials_damage`,{damage_id:req.body.damageId}).then(res=>{
          return res;
      }));
 

        res.json({error:false,message:'Damage Delete Successfully.'})
    
});


router.get('/api/get-material-purchase-invoice',async(req,res,next)=>{
    let [qryErr,data] = await _p(purMdl.getMaterialPurchaseInvoice().then((result)=>{
        return result;
    }));
    if(qryErr && !data){
    return next(qryErr);
    }
    else{
      res.json({error:false,message:data});
    }
});

router.post(`/api/get-material-purchase-with-details`,async (req,res,next)=>{
    let payload = req.body.reqPayload;
      
    let cluases = ``;
    if(payload.purchaseId != undefined ){
      cluases += ` and pm.m_purchase_id  = ${payload.purchaseId} `;
    }
    let orderCluases = ``
    if(payload.purchaseId == undefined && payload.purchaseId == null ){
      orderCluases += ` order by pm.m_purchase_id  desc LIMIT 1 `;
    }else{
      orderCluases += ` order by pm.m_purchase_id  desc `
    }

    
    if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
      cluases += ` and pm.created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}'`;
    }
    

    if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Supplier'){
      cluases += ` and pm.supplier_id=${payload.supplierId}`;
    }
    if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Employee'){
      cluases += ` and pm.pur_by=${payload.employeeId}`;
    }
    if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By User'){
      cluases += ` and pm.created_by=${payload.userId}`;
    }
    let [purchaseErr,purchase] = await _p(db.query(`select pm.*,sup.supplier_name,sup.supplier_mobile_no,sup.supplier_code,
    sup.supplier_address,sup.supplier_mobile_no,emp.employee_name,u.user_full_name,
    concat(bacc.bank_acc_name,' - ',bacc.bank_acc_number) as bank_display_name
    from tbl_material_purchase as pm
    left join tbl_bank_accounts as bacc on bacc.bank_acc_id =  pm.bank_id 
    left join tbl_employees as emp on pm.pur_by =  emp.employee_id 
    left join tbl_suppliers as sup on pm.supplier_id =  sup.supplier_id 
    left join tbl_users as u on  pm.created_by = u.user_id
    where pm.status='a' and pm.branch_id=? 
    ${cluases} ${orderCluases} `,[req.user.user_branch_id])).then(purchase=>{
      return purchase;
    })
  if(!purchaseErr){
    var purchaseWithDetails =  purchase.map(async (ele)=>{
        var [detailsErr,details] = await _p(db.query(`select pd.*,mn.material_name,pu.prod_unit_name
        from tbl_material_purchase_details as pd 
        left join   tbl_materials m on  m.material_id=pd.material_id 
        left join  tbl_material_names mn on mn.material_name_id = m.material_name_id 
        left join tbl_product_units pu on pu.prod_unit_id = m.material_unit_id 
        where pd.m_purchase_id=?`,[ele.m_purchase_id])).then(rows=>{
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


router.get(`/api/get-material-purchase-invoices`,async (req,res,next)=>{
  let payload = req.body;
    
  
 


  let [purchaseErr,purchases] = await _p(db.query(`select pm.m_purchase_id,pm.m_purchase_invoice
  from tbl_material_purchase as pm
  
  where pm.status='a' and pm.branch_id=? 
    order by pm.m_purchase_id  desc`,[req.user.user_branch_id])).then(purchase=>{
    return purchase;
  })


res.json(purchases)
})


router.post(`/api/get-material-purchase`,async (req,res,next)=>{
  let payload = req.body;
    
  let cluases = ``;
  
  if((payload.fromDate != undefined && payload.fromDate!='') &&  (payload.toDate != undefined && payload.toDate!='')){
    cluases += ` and pm.created_isodt between '${payload.fromDate}' and '${payload.toDate}'`;
  }


  if(payload.employeeId != undefined && payload.employeeId != null){
    cluases += ` and pm.pur_by= ${payload.employeeId} `
  }

  if(payload.supplierId != undefined && payload.supplierId != null){
    cluases += ` and pm.supplier_id= ${payload.supplierId} `
  }

  if(payload.userId != undefined && payload.userId != null){
    cluases += ` and pm.created_by= ${payload.userId} `
  }
  

  let [purchaseErr,purchases] = await _p(db.query(`select pm.*,sup.supplier_name,sup.supplier_mobile_no,sup.supplier_code,
  sup.supplier_address,sup.supplier_mobile_no,emp.employee_name,u.user_full_name,
  concat(bacc.bank_acc_name,' - ',bacc.bank_acc_number) as bank_display_name
  from tbl_material_purchase as pm
  left join tbl_bank_accounts as bacc on bacc.bank_acc_id =  pm.bank_id 
  left join tbl_employees as emp on pm.pur_by =  emp.employee_id 
  left join tbl_suppliers as sup on pm.supplier_id =  sup.supplier_id 
  left join tbl_users as u on  pm.created_by = u.user_id
  where pm.status='a' and pm.branch_id=? 
   ${cluases} order by pm.m_purchase_id  desc`,[req.user.user_branch_id])).then(purchase=>{
    return purchase;
  })


res.json(purchases)
})


router.get('/api/get-production-invoice',async(req,res,next)=>{
    let [qryErr,data] = await _p(purMdl.getProductionInvoice().then((result)=>{
        return result;
    }));
    if(qryErr && !data){
    return next(qryErr);
    }
    else{
      res.json({error:false,message:data});
    }
});
 
router.post('/api/save-production',async(req,res,next)=>{
    let productionPayload = req.body.purchase;
    let usedCart = req.body.usedCart;
    let productCart = req.body.productCart;
            // get ivoice
            let [invoiceNoErr,invoiceNo] = await _p(purMdl.getProductionInvoice().then((result)=>{
              return result;
              }));
              if(invoiceNo && !invoiceNo){
              return next(invoiceNoErr);
              }
            
              let newProductionPayload =  {
                production_invoice: invoiceNo,
                production_by: productionPayload.emp_id,
                created_isodt: productionPayload.created_isodt,
                shift: productionPayload.shift_id,
                material_used_note: productionPayload.material_used_note,
                production_note: productionPayload.production_note,
                labour_cost: productionPayload.labour_cost,
                material_cost: productionPayload.material_cost,
                others_cost: productionPayload.others_cost,
                total_cost: productionPayload.total_cost,
                created_by: req.user.user_id,
                branch_id:req.user.user_branch_id,
                status:'a'
              }
  
  
            let [prodDataErr,prodData] = await _p(db.insert('tbl_product_productions_master',newProductionPayload).then((result)=>{
                return result;
            }));
            if(prodDataErr && !prodData){
            return next(prodDataErr);
            }
            else{


              /// used material Add
              usedCart.map(async (element )=> {
                let savePayload = {
                  production_id: prodData.insertId,
                  material_id: element.material_id,
                  material_rate: element.material_purchase_rate,
                  material_qty: element.material_qty,
                  material_total: element.material_total,
                  status:'a',
                  branch_id: req.user.user_branch_id,
                }
  
                let [qryErr,data] = await _p(db.insert('tbl_product_productions_details',savePayload).then((result)=>{
                  return result;
              }));
              if(qryErr){
              return next(qryErr);
              }
             
             /// Stock updateing          
             let [errStockCheck,stockData] =  await _p(db.countRows(`select * from  tbl_material_stock where material_id=? and branch_id=?  `,[element.material_id,req.user.user_branch_id]).then((res)=>{
                    return res;
              }));
              if( stockData>0){
                await _p(db.query(`update tbl_material_stock set material_used_qty=material_used_qty+? where material_id=? and branch_id=?  `,[element.material_qty,element.material_id,req.user.user_branch_id]).then((res=>{
                  return res;
                })))
              }else{
                let savePayload = {
                  material_id: element.material_id,
                  material_used_qty: element.material_qty,
                  branch_id: req.user.user_branch_id,
                }
                 await _p(db.insert('tbl_material_stock',savePayload).then((result)=>{
                  return result;
              }));

              }
            
            });
            /// Used Material  end

             /// Productionn Product Add
             productCart.map(async (element )=> {

              /// Previous Product Stock for avarage
                 let beforePurchaseStock =  await  Promise.all([stockM.productCurrentStock(element.prod_id,req)]);
                 beforePurchaseStock = beforePurchaseStock[0]
             /// End
              let prodPayload = {
                production_id: prodData.insertId,
                prod_id: element.prod_id,
                prod_rate: element.prod_purchase_rate,
                prod_qty: element.prod_qty,
                prod_total: element.prod_total,
                prod_status:'a',
                branch_id: req.user.user_branch_id,
              }

              await _p(db.insert('tbl_production_products',prodPayload).then((result)=>{
                return result;
              }));
           
           
           /// Stock updateing          
           let [errStockCheck,stockData] =  await _p(db.countRows(`select * from  tbl_product_current_stock where prod_id =? and branch_id=?  `,[element.prod_id,req.user.user_branch_id]).then((res)=>{
                  return res;
            }));
            if( stockData>0){
              await _p(db.query(`update tbl_product_current_stock set production_qty=production_qty+? where prod_id=? and branch_id=?  `,[element.prod_qty,element.prod_id,req.user.user_branch_id]).then((res=>{
                return res;
              })))
            }else{
              let savePayload = {
                prod_id: element.prod_id,
                production_qty: element.prod_qty,
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





              res.json({error:false,message:{productionId:prodData.insertId,msg:'Production success.'}});
            }
  });


  router.post('/api/update-production',async(req,res,next)=>{
    let productionPayload = req.body.purchase;
    let usedCart = req.body.usedCart;
    let productCart = req.body.productCart;
            // get ivoice
           
            
              let newProductionPayload =  {
                production_by: productionPayload.emp_id,
                created_isodt: productionPayload.created_isodt,
                shift: productionPayload.shift_id,
                material_used_note: productionPayload.material_used_note,
                production_note: productionPayload.production_note,
                labour_cost: productionPayload.labour_cost,
                material_cost: productionPayload.material_cost,
                others_cost: productionPayload.others_cost,
                total_cost: productionPayload.total_cost,
                branch_id:req.user.user_branch_id,
              }
  
            let mCond = {
                production_id:productionPayload.production_id
            }
            let [prodDataErr,prodData] = await _p(db.update('tbl_product_productions_master',newProductionPayload,mCond).then((result)=>{
                return result;
            }));
            if(prodDataErr && !prodData){
            return next(prodDataErr);
            }
            else{

              let [oldMDetailErr,oldMDetail] = await _p(db.query(`select * from tbl_product_productions_details where production_id=?`,[productionPayload.production_id]).then(res=>{
                  return res;
              }));
              await _p(db.delete(`tbl_product_productions_details`,{production_id:productionPayload.production_id}).then(res))
              // Update Material Stock 
              oldMDetail.map(async (material)=>{
                await _p(db.query(`update tbl_material_stock set material_used_qty=material_used_qty-? where material_id=? and branch_id=?  `,[material.material_qty,material.material_id,material.branch_id]))
              })



              
              // End
              /// used material Add
              usedCart.map(async (element )=> {
                let savePayload = {
                  production_id: productionPayload.production_id,
                  material_id: element.material_id,
                  material_rate: element.material_purchase_rate,
                  material_qty: element.material_qty,
                  material_total: element.material_total,
                  status:'a',
                  branch_id: req.user.user_branch_id,
                }
  
                let [qryErr,data] = await _p(db.insert('tbl_product_productions_details',savePayload).then((result)=>{
                  return result;
              }));
              if(qryErr){
              return next(qryErr);
              }
             
             /// Stock updateing          
             let [errStockCheck,stockData] =  await _p(db.countRows(`select * from  tbl_material_stock where material_id=? and branch_id=?  `,[element.material_id,req.user.user_branch_id]).then((res)=>{
                    return res;
              }));
              if( stockData>0){
                await _p(db.query(`update tbl_material_stock set material_used_qty=material_used_qty+? where material_id=? and branch_id=?  `,[element.material_qty,element.material_id,req.user.user_branch_id]).then((res=>{
                  return res;
                })))
              }else{
                let savePayload = {
                  material_id: element.material_id,
                  material_used_qty: element.material_qty,
                  branch_id: req.user.user_branch_id,
                }
                 await _p(db.insert('tbl_material_stock',savePayload).then((result)=>{
                  return result;
              }));

              }
            
            });
            /// Used Material  end
            // Producion product stock update
            let [oldProdDetailErr,oldProdDetail] = await _p(db.query(`select * from tbl_production_products where production_id=?`,[productionPayload.production_id]).then(res=>{
              return res;
            }));
           let [e,d] = await _p(db.delete(`tbl_production_products`,{production_id:productionPayload.production_id}))

         
           // Update product Stock 
            oldProdDetail.map(async (prod)=>{
              /// Previous Product Stock for avarage
              let beforePurchaseStock =  await  Promise.all([stockM.productCurrentStock(prod.prod_id,req)]);
              beforePurchaseStock = beforePurchaseStock[0]
            /// End
              await _p(db.query(`update tbl_product_current_stock set production_qty=production_qty-? where prod_id=? and branch_id=?  `,[prod.prod_qty,prod.prod_id,prod.branch_id]))
            
               /// Product Avarage Calculation
            // purchase rate entry check 
            let [getRateForProdErr,getRateForProd] =  await _p(db.query(`select ifnull(prod_avarage_rate,0) as prod_avarage_rate from tbl_product_purchase_rate  where product_id=? and branch_id=?  `,[prod.prod_id,prod.branch_id]).then((res)=>{
              return res;
            }));

           let previousProdAvgRate =  getRateForProd.length == 0 ?0:getRateForProd[0].prod_avarage_rate;
            
            // previous stock value
            let  previousStockValue =  beforePurchaseStock*parseFloat(previousProdAvgRate);
            //End
            // Subtruct Stock Value
            let oldStockValue = prod.prod_qty * prod.prod_rate

            let currentStockValue =   previousStockValue - oldStockValue;
            // End
            let subTructQty = beforePurchaseStock - prod.prod_qty
            if(currentStockValue==0){
              var avarageRate = previousProdAvgRate;
            }else{
              var avarageRate = currentStockValue / subTructQty;
            }


           await _p(db.query(`update tbl_product_purchase_rate set prod_avarage_rate=? where product_id=? and branch_id=?  `,[avarageRate,prod.prod_id,prod.branch_id]).then(res=>{
              return res
            }));
            })

    
             // Productionn Product Add
             productCart.map(async (element )=> {

                 /// Previous Product Stock for avarage
                 let beforePurchaseStock =  await  Promise.all([stockM.productCurrentStock(element.prod_id,req)]);
                 beforePurchaseStock = beforePurchaseStock[0]
             /// End


              let prodPayload = {
                production_id: productionPayload.production_id,
                prod_id: element.prod_id,
                prod_rate: element.prod_purchase_rate,
                prod_qty: element.prod_qty,
                prod_total: element.prod_total,
                prod_status:'a',
                branch_id: req.user.user_branch_id,
              }

              await _p(db.insert('tbl_production_products',prodPayload));
           
           
           /// Stock updateing          
           let [errStockCheck,stockData] =  await _p(db.countRows(`select * from  tbl_product_current_stock where prod_id =? and branch_id=?  `,[element.prod_id,req.user.user_branch_id]).then((res)=>{
                  return res;
            }));
            if( stockData>0){
              await _p(db.query(`update tbl_product_current_stock set production_qty=production_qty+? where prod_id=? and branch_id=?  `,[element.prod_qty,element.prod_id,req.user.user_branch_id]).then((res=>{
                return res;
              })))
            }else{
              let savePayload = {
                prod_id: element.prod_id,
                production_qty: element.prod_qty,
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


              res.json({error:false,message:{productionId:productionPayload.production_id,msg:'Production update success.'}});
            }
  });


  router.post(`/api/get-productions`,async(req,res,next)=>{
    let reqPayload = req.body;
    let cluases = ``
    if(reqPayload.employeeId != undefined && reqPayload.employeeId != null){
      cluases += ` and pdm.production_by =${reqPayload.employeeId}`
    }
    if(reqPayload.userId != undefined && reqPayload.userId != null){
      cluases += ` and pdm.created_by =${reqPayload.userId}`
    }

    if(reqPayload.shiftId != undefined && reqPayload.shiftId != null){
      cluases += ` and pdm.shift ='${reqPayload.shiftId}'`
    }

    if(reqPayload.fromDate != undefined && reqPayload.toDate != null){
      cluases += ` and pdm.created_isodt between '${reqPayload.fromDate}' and '${reqPayload.toDate}' `
    }

    let [productionsErr,productions] = await _p(db.query(`select pdm.*,
    emp.employee_id,emp.employee_name
    from tbl_product_productions_master pdm
    left  join tbl_employees emp on  emp.employee_id = pdm.production_by
    where pdm.status = 'a' and pdm.branch_id=? 
    
    ${cluases} order by pdm.production_id desc `,[req.user.user_branch_id]).then(res=>{
      return res;
    }));

    res.json(await Promise.all(productions))

})

router.get(`/api/get-production-invoices`,async(req,res,next)=>{


  let [productionsErr,productions] = await _p(db.query(`select pdm.production_invoice,pdm.production_id
  from tbl_product_productions_master pdm
  where pdm.status = 'a' and pdm.branch_id=? 
   order by pdm.production_id desc `,[req.user.user_branch_id]).then(res=>{
    return res;
  }));

  res.json(productions)

});

router.post(`/api/get-production-with-details`,async(req,res,next)=>{
    let reqPayload = req.body;
    let cluases = ``
    if(reqPayload.productionId != undefined && reqPayload.productionId != null){
      cluases += ` and pdm.production_id=${reqPayload.productionId}`
    }

    let orderCluases = ``
    if(reqPayload.from =='invoice' ){
      orderCluases += ` order by pdm.production_id  desc LIMIT 1 `;
    }else{
      orderCluases += ` order by pdm.production_id  desc `
    }


    let [masterErr,masterData] = await _p(db.query(`select pdm.*,
    emp.employee_id,emp.employee_name
    from tbl_product_productions_master pdm
    left  join tbl_employees emp on  emp.employee_id = pdm.production_by
    where pdm.status = 'a' and pdm.branch_id=? 
    ${cluases} ${orderCluases} `,[req.user.user_branch_id]).then(res=>{
      return res;
    }));



   let productionWithDetail =  masterData.map(async(detail)=>{
    
    let [productsErr,products] = await _p(db.query(`select pdp.*,pn.prod_name,pu.prod_unit_name
    from  tbl_production_products pdp
    left  join tbl_products p on p.prod_id = pdp.prod_id
    left  join tbl_products_names pn on pn.prod_name_id = p.prod_name_id
    left join tbl_product_units pu on pu.prod_unit_id = p.prod_unit_id 
    where pdp.production_id = ? `,[detail.production_id]).then(res=>{
      return res;
    }));
    detail.products = products;

    let [materialsErr,materials] = await _p(db.query(`select pd.*,mn.material_name,pu.prod_unit_name
    from  tbl_product_productions_details pd
    left  join tbl_materials m on  m.material_id = pd.material_id
    left  join tbl_material_names mn on mn.material_name_id = m.material_name_id
    left join tbl_product_units pu on pu.prod_unit_id = m.material_unit_id 
    where pd.production_id = ? `,[detail.production_id]).then(res=>{
      return res;
    }));

    detail.materials = materials;

    return detail;
    });

    res.json(await Promise.all(productionWithDetail))

})





router.post('/api/save-material-purchase',async(req,res,next)=>{
    let payloadPurchase = req.body.purchase;
    let payloadCart = req.body.purchaseCart;
            // get ivoice
            let [invoiceNoErr,invoiceNo] = await _p(purMdl.getMaterialPurchaseInvoice().then((result)=>{
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
                m_purchase_invoice: invoiceNo,
                pur_by: payloadPurchase.pur_emp_id,
                created_isodt: payloadPurchase.pur_created_isodt,
                supplier_id: pur_supplier_id,
                sub_total: payloadPurchase.pur_subtotal_amount,
                vat: payloadPurchase.pur_vat_amount,
                vat_percent: payloadPurchase.pur_vat_percent,
                discount: payloadPurchase.pur_discount_amount,
                discount_percent: payloadPurchase.pur_discount_percent,
                total: payloadPurchase.pur_total_amount,
                paid: payloadPurchase.pur_paid_amount,
                due: payloadPurchase.pur_due_amount,
                transport_cost: payloadPurchase.pur_transport_cost,
                note: payloadPurchase.pur_note,
                previous_due: payloadPurchase.pur_previous_due,
                created_by:req.user.user_id,
                branch_id:req.user.user_branch_id,
                status:'a',
                supplier_type: payloadPurchase.pur_supplier_type,
                pay_method: payloadPurchase.pur_pay_method,
                bank_id: payloadPurchase.pur_bank_id
              }
  
  
            let [soldDataErr,soldData] = await _p(db.insert('tbl_material_purchase',newPurchasePayload).then((result)=>{
                return result;
            }));
            if(soldDataErr && !soldData){
            return next(soldDataErr);
            }
            else{
              payloadCart.map(async (element )=> {
                
              /// Previous Product Stock for avarage
              let beforePurchaseStock =  await  Promise.all([stockM.materialCurrentStock(element.material_id,req)]);
              beforePurchaseStock = beforePurchaseStock[0]
          /// End
                let savePayload = {
                  m_purchase_id: soldData.insertId,
                  material_id: element.material_id,
                  purchase_rate: element.material_purchase_rate,
                  purchase_qty: element.material_qty,
                  purchase_total: element.material_total,
                  status:'a',
                  branch_id: req.user.user_branch_id,
                }
  
                let [qryErr,data] = await _p(db.insert('tbl_material_purchase_details',savePayload).then((result)=>{
                  return result;
              }));
  
  
  
              if(qryErr){
              return next(qryErr);
              }
             
             /// Stock updateing          
             let [errStockCheck,stockData] =  await _p(db.countRows(`select * from  tbl_material_stock where material_id=? and branch_id=?  `,[element.material_id,req.user.user_branch_id]).then((res)=>{
                    return res;
              }));
              if( stockData>0){
                await _p(db.query(`update tbl_material_stock set material_purchase_qty=material_purchase_qty+? where material_id=? and branch_id=?  `,[element.material_qty,element.material_id,req.user.user_branch_id]).then((res=>{
                  return res;
                })))
              }else{
                let savePayload = {
                  material_id: element.material_id,
                  material_purchase_qty: element.material_qty,
                  branch_id: req.user.user_branch_id,
                }
                let [qryErr,data] = await _p(db.insert('tbl_material_stock',savePayload).then((result)=>{
                  return result;
              }));

              }



               /// Material Avarage Calculation
            // purchase rate entry check 
             let [getRateForMaterialErr,getRateForMaterial] =  await _p(db.query(`select ifnull(material_avarage_rate,0) as material_avarage_rate from tbl_material_purchase_rate  where material_id=? and branch_id=?  `,[element.material_id,req.user.user_branch_id]).then((res)=>{
              return res;
            }));

           let previousProdAvgRate =  getRateForMaterial.length == 0?0:getRateForMaterial[0].material_avarage_rate;
            // previous stock value
            let  previousStockValue =  beforePurchaseStock*previousProdAvgRate;
            //End

            // Current Purchase stock value
             let currentPurchaseStockValue = element.material_qty * element.material_purchase_rate;
            // Ennd
            // Previouse & current Total
            let totalQty = beforePurchaseStock + parseFloat(element.material_qty);
            let totalStockValue = previousStockValue + parseFloat(currentPurchaseStockValue)

            // Get Finaly product Avarage
            let materialPurchaseRate = totalStockValue / totalQty;


           if(getRateForMaterial.length == 0){
            let savePayload = {
              material_id: element.material_id,
              material_avarage_rate: materialPurchaseRate,
              branch_id: req.user.user_branch_id,
            }
           await _p(db.insert('tbl_material_purchase_rate',savePayload).then((result)=>{
              return result;
            }));
           }else{
            await _p(db.query(`update tbl_material_purchase_rate set material_avarage_rate=? where material_id=? and branch_id=?  `,[materialPurchaseRate,element.material_id,req.user.user_branch_id]))
           }
        

            
            });/// Loop end
              res.json({error:false,message:{productionId:soldData.insertId,msg:'Purchase success.'}});
            }
  });



  router.post(`/api/material-purchase-delete`,async(req,res,next)=>{
    let purchaseId = req.body.purchaseId;
    let [errOldPurDetail,oldPurDetail] =   await _p(db.query(`select * from tbl_material_purchase_details   where m_purchase_id=? `,[purchaseId]).then((res=>{
      return res;
    })));

    oldPurDetail.map(async (item)=>{

       /// Previous Product Stock for avarage
       let beforePurchaseStock =  await  Promise.all([stockM.materialCurrentStock(item.material_id,req)]);
       beforePurchaseStock = beforePurchaseStock[0]
      /// End

      await _p(db.query(`update tbl_material_stock set material_purchase_qty=material_purchase_qty-? where material_id=? and branch_id=?  `,[item.purchase_qty,item.material_id,item.branch_id]).then((res=>{
        return res;
      })));

      /// Material Avarage Calculation
            // purchase rate entry check 
            let [getRateForMaterialErr,getRateForMaterial] =  await _p(db.query(`select ifnull(material_avarage_rate,0) as material_avarage_rate from tbl_material_purchase_rate  where material_id=? and branch_id=?  `,[item.material_id,item.branch_id]).then((res)=>{
              return res;
            }));

           let previousMaterialAvgRate =  getRateForMaterial.length == 0 ?0:getRateForMaterial[0].material_avarage_rate;
            
            // previous stock value
            let  previousStockValue =  beforePurchaseStock*parseFloat(previousMaterialAvgRate);
            //End
            // Subtruct Stock Value
            let oldStockValue = item.purchase_qty * item.purchase_rate

            let currentStockValue =   previousStockValue - oldStockValue;
            // End
            let subTructQty = beforePurchaseStock - item.purchase_qty
            if(currentStockValue==0){
              var avarageRate = previousMaterialAvgRate;
            }else{
              var avarageRate = currentStockValue / subTructQty;
            }


           await _p(db.query(`update tbl_material_purchase_rate set material_avarage_rate=? where material_id=? and branch_id=?  `,[avarageRate,item.material_id,item.branch_id]).then(res=>{
              return res
            }));


    })


    await _p(db.query(`update tbl_material_purchase_details set status='d' where  m_purchase_id=? `,[purchaseId]).then((res=>{
      return res;
    })));

    await _p(db.query(`update tbl_material_purchase set status='d' where  m_purchase_id =? `,[purchaseId]).then((res=>{
      return res;
    })));

    res.json({error:false,
      message:'Purchase delete success.'});



  })

  
  router.post(`/api/production-delete`,async(req,res,next)=>{ 
    let productionId = req.body.productionId;
    

      // Product Stock Update
      let [oldProdDetailErr,oldProdDetail] = await _p(db.query(`select * from tbl_production_products where production_id=?`,[productionId]).then(res=>{
        return res;
      }));
      oldProdDetail.map(async (prod)=>{

        /// Previous Product Stock for avarage
      let beforePurchaseStock =  await  Promise.all([stockM.productCurrentStock(prod.prod_id,req)]);
      beforePurchaseStock = beforePurchaseStock[0]
     /// End



        await _p(db.query(`update tbl_product_current_stock set production_qty=production_qty-? where prod_id=? and branch_id=?  `,[prod.prod_qty,prod.prod_id,prod.branch_id]))
      
       
        
           /// Product Avarage Calculation
        // purchase rate entry check 
        let [getRateForProdErr,getRateForProd] =  await _p(db.query(`select ifnull(prod_avarage_rate,0) as prod_avarage_rate from tbl_product_purchase_rate  where product_id=? and branch_id=?  `,[prod.prod_id,prod.branch_id]).then((res)=>{
          return res;
        }));

       let previousProdAvgRate =  getRateForProd.length == 0 ?0:getRateForProd[0].prod_avarage_rate;
        
        // previous stock value
        let  previousStockValue =  beforePurchaseStock*parseFloat(previousProdAvgRate);
        //End
        // Subtruct Stock Value
        let oldStockValue = prod.prod_qty * prod.prod_rate

        let currentStockValue =   previousStockValue - oldStockValue;
        // End
        let subTructQty = beforePurchaseStock - prod.prod_qty
        if(currentStockValue==0){
          var avarageRate = previousProdAvgRate;
        }else{
          var avarageRate = currentStockValue / subTructQty;
        }


       await _p(db.query(`update tbl_product_purchase_rate set prod_avarage_rate=? where product_id=? and branch_id=?  `,[avarageRate,prod.prod_id,prod.branch_id]).then(res=>{
          return res
        }));

      });
      // Product stock End

      // Material Stock Update

      let [oldMDetailErr,oldMDetail] = await _p(db.query(`select * from tbl_product_productions_details where production_id=?`,[productionId]).then(res=>{
        return res;
    }));
    oldMDetail.map(async (material)=>{
      await _p(db.query(`update tbl_material_stock set material_used_qty=material_used_qty-? where material_id=? and branch_id=?  `,[material.material_qty,material.material_id,material.branch_id]))
    })
      // Material Stock End
      


      await _p(db.update('tbl_product_productions_master',{status:'d'},{production_id:productionId}));
      await _p(db.update('tbl_production_products',{prod_status:'d'},{production_id:productionId}));
      await _p(db.update('tbl_product_productions_details',{status:'d'},{production_id:productionId}));




    res.json({error:false,
      message:'Production delete success.'});



  })

  router.post('/api/update-material-purchase',async(req,res,next)=>{
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
                pur_by: payloadPurchase.pur_emp_id,
                created_isodt: payloadPurchase.pur_created_isodt,
                supplier_id: pur_supplier_id,
                sub_total: payloadPurchase.pur_subtotal_amount,
                vat: payloadPurchase.pur_vat_amount,
                vat_percent: payloadPurchase.pur_vat_percent,
                discount: payloadPurchase.pur_discount_amount,
                discount_percent: payloadPurchase.pur_discount_percent,
                total: payloadPurchase.pur_total_amount,
                paid: payloadPurchase.pur_paid_amount,
                due: payloadPurchase.pur_due_amount,
                transport_cost: payloadPurchase.pur_transport_cost,
                note: payloadPurchase.pur_note,
                previous_due: payloadPurchase.pur_previous_due,
                created_by:req.user.user_id,
                branch_id:req.user.user_branch_id,
                supplier_type: payloadPurchase.pur_supplier_type,
                pay_method: payloadPurchase.pur_pay_method,
                bank_id: payloadPurchase.pur_bank_id
              }
  
            let cond = {m_purchase_id : payloadPurchase.pur_id }
            let [soldDataErr,soldData] = await _p(db.update('tbl_material_purchase',newPurchasePayload,cond).then((result)=>{
                return result;
            }));
            if(soldDataErr && !soldData){
            return next(soldDataErr);
            }
            else{
              // Old stock update
            let [errOldPurDetail,oldPurDetail] =   await _p(db.query(`select * from tbl_material_purchase_details   where m_purchase_id=? `,[payloadPurchase.pur_id]).then((res=>{
                return res;
              })));

  
              oldPurDetail.map(async (item)=>{
                 /// Previous Product Stock for avarage
              let beforePurchaseStock =  await  Promise.all([stockM.materialCurrentStock(item.material_id,req)]);
              beforePurchaseStock = beforePurchaseStock[0]
             /// End

                await _p(db.query(`update tbl_material_stock set material_purchase_qty=material_purchase_qty-? where material_id=? and branch_id=?  `,[item.purchase_qty,item.material_id,item.branch_id]).then((res=>{
                  return res;
                })));



                 /// Product Avarage Calculation
            // purchase rate entry check 
            let [getRateForMaterialErr,getRateForMaterial] =  await _p(db.query(`select ifnull(material_avarage_rate,0) as material_avarage_rate from tbl_material_purchase_rate  where material_id=? and branch_id=?  `,[item.material_id,item.branch_id]).then((res)=>{
              return res;
            }));

            let previousMaterialAvgRate =  getRateForMaterial.length == 0 ?0:getRateForMaterial[0].material_avarage_rate;
             
            // previous stock value
            let  previousStockValue =  beforePurchaseStock*parseFloat(previousMaterialAvgRate);
            //End
            // Subtruct Stock Value
            let oldStockValue = item.purchase_qty * item.purchase_rate

            let currentStockValue =   previousStockValue - oldStockValue;
            // End
            let subTructQty = beforePurchaseStock - item.purchase_qty
            if(currentStockValue==0){
              var avarageRate = previousMaterialAvgRate;
            }else{
              var avarageRate = currentStockValue / subTructQty;
            }


           await _p(db.query(`update tbl_material_purchase_rate set material_avarage_rate=? where material_id=? and branch_id=?  `,[avarageRate,item.material_id,item.branch_id]).then(res=>{
              return res
            }));
                
              })

  
  
              //end 
              let deleteCond = {
                m_purchase_id: payloadPurchase.pur_id
              }
              
  
             let  [ErrDetailDelete,detailDeleteData]  = await _p(db.delete(`tbl_material_purchase_details`,deleteCond).then((res)=>{
                return res;
             }));
  
             if(detailDeleteData){
              payloadCart.map(async (element )=> {
                 /// Previous Product Stock for avarage
                 let beforePurchaseStock =  await  Promise.all([stockM.materialCurrentStock(element.material_id,req)]);
                 beforePurchaseStock = beforePurchaseStock[0]
             /// End


                let savePayload = {
                  m_purchase_id: payloadPurchase.pur_id,
                  material_id: element.material_id,
                  purchase_rate: element.material_purchase_rate,
                  purchase_qty: element.material_qty,
                  purchase_total: element.material_total,
                  status:'a',
                  branch_id: req.user.user_branch_id,
                }
  
                let [qryErr,data] = await _p(db.insert('tbl_material_purchase_details',savePayload).then((result)=>{
                  return result;
              }));
  
              if(qryErr){
              return next(qryErr);
              }
  
  
              /// Stock update
  
              let [errStockCheck,stockData] =  await _p(db.countRows(`select * from tbl_material_stock where material_id=? and branch_id=?  `,[element.material_id,req.user.user_branch_id]).then((res)=>{
                return res;
          }));
          if( stockData>0){
            await _p(db.query(`update tbl_material_stock set material_purchase_qty=material_purchase_qty+? where material_id=? and branch_id=?  `,[element.material_qty,element.material_id,req.user.user_branch_id]).then((res=>{
              return res;
            })));
          }else{
            let savePayload = {
              material_id: element.material_id,
              material_purchase_qty: element.material_qty,
              branch_id: req.user.user_branch_id,
            }
            let [qryErr,data] = await _p(db.insert('tbl_material_stock',savePayload).then((result)=>{
              return result;
          }));
          }

             


           /// Material Avarage Calculation
            // purchase rate entry check 
            let [getRateForMaterialErr,getRateForMaterial] =  await _p(db.query(`select ifnull(material_avarage_rate,0) as material_avarage_rate from tbl_material_purchase_rate  where material_id=? and branch_id=?  `,[element.material_id,req.user.user_branch_id]).then((res)=>{
              return res;
            }));
           let previousMaterialAvgRate =  getRateForMaterial.length == 0?0:getRateForMaterial[0].material_avarage_rate;
            
            // previous stock value
            let  previousStockValue =  beforePurchaseStock*previousMaterialAvgRate;
            //End

            // Current Purchase stock value
             let currentPurchaseStockValue = element.material_qty * element.material_purchase_rate;
            // Ennd
            // Previouse & current Total
            let totalQty = beforePurchaseStock + parseFloat(element.material_qty);
            let totalStockValue = previousStockValue + parseFloat(currentPurchaseStockValue)

            // Get Finaly product Avarage
            let materialPurchaseRate = totalStockValue / totalQty;

           if(getRateForMaterial.length == 0){
            let savePayload = {
              material_id: element.material_id,
              material_avarage_rate: materialPurchaseRate,
              branch_id: req.user.user_branch_id,
            }
           await _p(db.insert('tbl_material_purchase_rate',savePayload).then((result)=>{
              return result;
            }));
           }else{
            await _p(db.query(`update tbl_material_purchase_rate set material_avarage_rate=? where material_id=? and branch_id=?  `,[materialPurchaseRate,element.material_id,req.user.user_branch_id]))
           }



  
              });
             }
              
              res.json({error:false,message:{productionId:payloadPurchase.pur_id,msg:'Purchase update success.'}});
            }
  });


module.exports = router;