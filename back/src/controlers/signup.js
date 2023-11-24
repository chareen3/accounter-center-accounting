const router = require('express').Router();
const {check} = require('express-validator');
const {generate}      = require('../utils/passwords');
const _p      = require('../utils/promise_error');
const  rejet_invalid = require("../middlewares/reject_invalid");
const  {Database}   = require('../utils/Database');
const { currentDateTime,getCurrentISODT } = require('../utils/functions');
let    db = new Database();

const  signupValidator = [
    check('user_full_name').exists(),
    check('user_email').exists().isEmail(),
    check('selectedBranch').exists(),
    check('user_name').exists(),
    check('user_password').exists().isLength(6)
];
router.post('/api/signup',signupValidator,rejet_invalid,async (req,res,next)=>{
  let tableName = `tbl_users`
  
  let [checkDuplicateUsernameErr,checkDuplicateUsername] = 
  await _p(db.query(`select user_name from ${tableName} where user_name=?`,req.body.user_name)).then(result=>{
    return result;
  })
  if(checkDuplicateUsernameErr && !checkDuplicateUsername){
    return next(checkDuplicateUsernameErr)
  }else{
    if(checkDuplicateUsername.length>0){
    res.status(200).json({
    error:true,
    message:"username already exists."
    });
    }else{
   // Signup next script
   let reqData = req.body;
   let shunks = generate(req.body.user_password);
   let user_password = `${shunks.salt}.${shunks.hash}`;
   let saveObj = {
      user_full_name:reqData.user_full_name,
      user_email:reqData.user_email,
      user_branch_id:reqData.selectedBranch.branch_id,
      user_warehouse_id: reqData.selectedWarehouse != null ?reqData.selectedWarehouse.warehouse_id:0,
      user_role:reqData.selectedUserRole.user_role,
      user_label:reqData.selectedUserRole.user_label,
      user_full_name:reqData.user_full_name,
      user_name:reqData.user_name,
      user_password:user_password,
      user_access:'[]',
      user_status:'active',
      user_created_iso_dt: getCurrentISODT(),
      user_updated_iso_dt: getCurrentISODT(),
      user_created_by:req.user.user_id
    }
    let [signupErr,signupData] = await _p(db.insert(tableName,saveObj)).then(result=>{
      return result;
    })
    if(signupErr && !signupData){
      return next(signupErr)
    }else{
      let [signupRecordErr,signupRecord] = await _p(db.query(`select * from ${tableName} where user_id=?`,signupData.insertId)).then(result=>{
           return result
      })
      if(signupRecordErr && !signupRecord){
        return next(signupRocordErr)
      }
    
      res.status(200).json({
        error:false,
        message:'User account created successfully'
        })
    }
    }
}    
})



router.post('/api/user-update',async (req,res,next)=>{
  let tableName = `tbl_users`
  
  let [checkDuplicateUsernameErr,checkDuplicateUsername] = 
  await _p(db.query(`select user_name from ${tableName} where user_name=? and user_id<>?`,[req.body.user_name,req.body.user_id])).then(result=>{
    return result;
  })
  if(checkDuplicateUsernameErr && !checkDuplicateUsername){
    return next(checkDuplicateUsernameErr)
  }else{
    if(checkDuplicateUsername.length>0){
    res.status(200).json({
    error:true,
    message:"username already exists."
    });
    }else{
   // Signup next script
   let reqData = req.body;

   let user_password= ``;

   if(req.body.user_password.trim() !=''){
    let shunks = generate(req.body.user_password);
     user_password = `${shunks.salt}.${shunks.hash}`;
    }
   let saveObj = {
      user_full_name:reqData.user_full_name,
      user_email:reqData.user_email,
      user_branch_id:reqData.selectedBranch.branch_id,
      user_warehouse_id: reqData.selectedWarehouse != null ?reqData.selectedWarehouse.warehouse_id:0,
      user_role:reqData.selectedUserRole.user_role,
      user_label:reqData.selectedUserRole.user_label,
      user_full_name:reqData.user_full_name,
      user_name:reqData.user_name,
      user_updated_iso_dt: getCurrentISODT(),
      user_updated_by:req.user.user_id
    }

    if(req.body.user_password.trim() !=''){
      saveObj.user_password = user_password
    }
    
    let cond = {
        user_id:req.body.user_id
    }
    let [signupErr,signupData] = await _p(db.update(tableName,saveObj,cond)).then(result=>{
      return result;
    })
    if(signupErr && !signupData){
      return next(signupErr)
    }else{
      
      req.app.io.emit('accessChanged',{
        msg:'Your access has changed. Please Login...',
        access:'changed',
        user_id: req.body.user_id
     });

     if(req.body.user_id != req.user.user_id){
      res.status(200).json({
        error:false,
        message:'User account update successfully'
        })
      }

     
    }
    }
}    
})


router.post(`/api/save-access`,async(req,res)=>{
  let access = JSON.stringify(req.body.access);

 
     let [saveAccessErr,saveAccess] =  await _p(db.query(`update tbl_users set user_access='${access}' where  user_id=? `,[req.body.userId])).then(res=>{
        return res;
      });

      if(saveAccess){

        req.app.io.emit('accessChanged',{
          msg:'Your access has changed. Please Login...',
          access:'changed',
          user_id: req.body.userId
       });
  
       if(req.body.userId != req.user.userId){
        res.status(200).json({
          error:false,
          message:'Save Success',
          user_id: req.body.userId
          })
        }

        

       
      }else{
        res.json({
          error:true,
          message:`Somthing Error`
        })
      }

})


router.post(`/api/get-access`,async(req,res,next)=>{
       let [accessErr,access] = await _p(db.query(`select user_access,user_full_name from tbl_users where user_id=?`,[req.body.userId]).then(res=>{
         return res;
       }));
        if(accessErr && !access){ return next(accessErr)}
       res.json(access[0]);
})
module.exports = router;