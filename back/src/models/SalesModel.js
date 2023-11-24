const router = require('express').Router();
const _p      = require('../utils/promise_error');
const  {Database}   = require('../utils/Database');
let    db = new Database();

class SalesModel {
    async getQuotationInvoice(){
        let [qryErr,data] = await _p(db.selectSingleRow(`
        select sale_id  from tbl_quotation_master order by sale_id desc limit 1
       `).then((row)=>{
            return row;
            }));
            if(qryErr && !data){
            return reject(qryErr);
            }
            else{
                let invoice = 'Q-'+new Date().getFullYear()+'-';
                if(Object.keys(data).length === 0 && data.constructor === Object
                ){
                    invoice += 1
                }else{
                    invoice += data.sale_id+parseFloat(1)
                }
                
                return invoice
            }
   
    
}
    async getSalesInvoice(){
            let [qryErr,data] = await _p(db.selectSingleRow(`
            select sale_id  from tbl_sales_master order by sale_id desc limit 1
           `).then((row)=>{
                return row;
                }));
                if(qryErr && !data){
                return reject(qryErr);
                }
                else{
                    let invoice = 'S-'+new Date().getFullYear()+'-';
                    if(Object.keys(data).length === 0 && data.constructor === Object
                    ){
                        invoice += 1
                    }else{
                        invoice += data.sale_id+parseFloat(1)
                    }
                    
                    return invoice
                }
       
        
    }


    async getServiceInvoice(){
        let [qryErr,data] = await _p(db.selectSingleRow(`
        select service_id  from tbl_service_master order by service_id desc limit 1
       `).then((row)=>{
            return row;
            }));
            if(qryErr && !data){
            return reject(qryErr);
            }
            else{
                let service = 'Sev-'+new Date().getFullYear()+'-';
                if(Object.keys(data).length === 0 && data.constructor === Object
                ){
                    service += 1
                }else{
                    service += data.service_id+parseFloat(1)
                }
                
                return service
            }
   
    
}

    async getCustomerCode(){
        let [lastCustomerRowError,lastCustomerRow] =  await _p(db.query(`select customer_id from tbl_customers  order by customer_id desc LIMIT 1`)).then(result=>{
            return result;
        });
        if(lastCustomerRowError){
            next(lastCustomerRowError)
        }
        let customerCode = '';
        if(lastCustomerRow.length<1){
            customerCode = 'P00001';
        }else{
            customerCode = 'P0000'+(parseFloat(lastCustomerRow[0].customer_id)+1);
        }
        return customerCode;
    }
} 

module.exports = {SalesModel}