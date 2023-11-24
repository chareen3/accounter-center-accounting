const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const {check}= require('express-validator');
const {validate} = require('../utils/passwords');
const {app_secret}  = require("../config.json");
const rejectInvalid = require('../middlewares/reject_invalid');
const  {Database}   = require('../utils/Database');
const _p      = require('../utils/promise_error');

let    db = new Database();

const loginValidation = [
    check('user_name').exists(),
    check('user_password').isLength({min:6})
]
router.post('/signin',loginValidation,rejectInvalid,async (req,res,next)=>{
    let {user_name,user_password} = req.body;
    let tableName = `tbl_users`;
    let [checkUserErr,checkUserData] = await _p(db.query(`select u.*,b.branch_name,w.warehouse_name
     from ${tableName} u 
     left join tbl_branches b on b.branch_id = u.user_branch_id
     left join tbl_warehouses w on w.warehouse_id = u.user_warehouse_id
     where u.user_name=? and u.user_status='active'`,[user_name]).then(result=>{
          return result;
    }))

    if(checkUserErr && !checkUserData){
        return next(checkUserErr)
    }else{
        if(checkUserData.length<1){
            
            return  res.status(200).json({
                error:true,
                message:"Invalid username."
                })
        }else{
            
            let [salt,hash] = checkUserData[0]['user_password'].split('.');
            let {user_id,user_email,user_name,user_full_name,user_role,user_branch_id,user_warehouse_id,branch_name,warehouse_name,user_access} = checkUserData[0];
            let valid = validate(user_password,hash,salt);
            if(valid){
                let token = jwt.sign({user_id,user_name,user_full_name,user_email,user_role,user_branch_id,user_warehouse_id,branch_name,warehouse_name,user_access},app_secret);
                

                let [institutionErr,institution] =  await _p(db.query(`select pro_name from tbl_institution_profile where pro_branch_id=? `,[user_branch_id]).then(res=>{
                    return res;
                }))

                res.status(200).json({
                    error:false,
                    auth:true,
                    token,
                    message:"Congratulations!! Success.",
                    userInfo:{
                        user_id,user_name,user_full_name,user_email,user_role,
                        user_branch_id,user_warehouse_id,
                        branch_name,warehouse_name
                    },
                    access:user_access,
                    role:user_role,
                    institution:institution.length==0?'SoftTask':institution[0].pro_name

                });
            }else{
                res.status(200).json({
                    error:true,
                    message:"Sorry !! wrong password." 
                 })
            }
        }
    }
});



router.post('/api/switch-branch',async (req,res,next)=>{
    let {user_password,new_branch_id,new_branch_name} = req.body;
    let tableName = `tbl_users`;
    let [checkUserErr,checkUserData] = await _p(db.query(`select u.*,b.branch_name,w.warehouse_name
     from ${tableName} u 
     left join tbl_branches b on b.branch_id = u.user_branch_id
     left join tbl_warehouses w on w.warehouse_id = u.user_warehouse_id
     where u.user_name=? and u.user_status='active' `,[req.user.user_name]).then(result=>{
          return result;
    }))

    if(checkUserErr && !checkUserData){
        return next(checkUserErr)
    }else{
        if(checkUserData.length<1){
            
            return  res.status(200).json({
                error:true,
                message:"Invalid username."
                })
        }else{
            
            let [salt,hash] = checkUserData[0]['user_password'].split('.');
            let {user_id,user_email,user_name,user_full_name,user_role,user_branch_id,user_warehouse_id,branch_name,warehouse_name,user_access} = checkUserData[0];
            let valid = validate(user_password,hash,salt);
            if(valid){
                let token = jwt.sign({user_id,user_name,user_full_name,user_email,user_role,user_branch_id:new_branch_id,user_warehouse_id,branch_name:new_branch_name,warehouse_name,user_access},app_secret);
                

                let [institutionErr,institution] =  await _p(db.query(`select pro_name from tbl_institution_profile where pro_branch_id=? `,[user_branch_id]).then(res=>{
                    return res;
                }))

                res.status(200).json({
                    error:false,
                    auth:true,
                    token,
                    message:"Congratulations!! Success.",
                    userInfo:{
                        user_id,user_name,user_full_name,user_email,user_role,
                        user_branch_id:new_branch_id,user_warehouse_id,
                        branch_name:new_branch_name,warehouse_name
                    },
                    access:user_access,
                    role:user_role,
                    institution:institution.length==0?'SoftTask':institution[0].pro_name

                });
            }else{
                res.status(200).json({
                    error:true,
                    message:"Sorry !! wrong password." 
                 })
            }
        }
    }
});



module.exports = router;