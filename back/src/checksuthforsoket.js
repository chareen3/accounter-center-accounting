const jwt = require('jsonwebtoken');
const {app_secret} = require('./config.json');

const checkAuth = (token)=>{
    let check = false;
    jwt.verify(token,app_secret,(err,userInfo)=>{
        if(err){
            check =  false
        }else{
            check =  userInfo
        }
    })
    return check
}

module.exports = {checkAuth}