import moment from 'moment';
const pathSpliter = (path,index)=>{
     let divs =  path.split('/')
     return divs[index];
}
const authInfoSeter = JSON.parse(sessionStorage.getItem('auth_info'));

const accessChecker = (accessName)=>{
      let auth =  JSON.parse(sessionStorage.getItem('auth_info'));
      if(auth.access != undefined || auth.access.length != 0){
           let access = JSON.parse(auth.access)
           return access.indexOf(accessName);
      }else{
            return false
      }
      
}
const checkAuthBranchWare = (branchID)=>{
      if(authInfoSeter.userInfo.user_branch_id==branchID ){
            return true
      }else{
            return false
      }
}

const checkIntNum = (number)=>{
      return !Number.isInteger(parseFloat(number))?true:false
}

let getDateTimeFromISODT = (isoString)=>{
      
      var date = moment(isoString);
      var dateComponent = date.utc().format('Y-MM-DD');
      var timeComponent = date.utc().format('hh:mm');
      return dateComponent+'T'+timeComponent
      
}
const dateTimeFormat  =  'DD MMM Y hh:mm zz a';
const currentDateTime = ()=>{
      return moment().toISOString()
}

const currentDateStartTime = ()=>{
      return moment().startOf('day').toISOString()
}
const currentDateEndTime = ()=>{
      return moment().endOf('day').toISOString()
}

export {pathSpliter,authInfoSeter,accessChecker,checkAuthBranchWare,dateTimeFormat,checkIntNum,currentDateTime,getDateTimeFromISODT,currentDateStartTime,currentDateEndTime}
