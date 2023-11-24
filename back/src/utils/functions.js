let  getCurrentISODT = ()=>{
    let dateObj =  new Date();
        return dateObj.toISOString();
}

let convToISODT = (datetime)=>{
    let isoDateTime =  new Date(datetime);
    return  isoDateTime.toISOString()
}
let checkIntNum = (number)=>{
    return !Number.isInteger(parseFloat(number))?0:number;
}
let isoFromDate = (dailyDate)=>{
    return  dailyDate.substring(0,10)
   
}
module.exports =  {getCurrentISODT,checkIntNum,convToISODT,isoFromDate}