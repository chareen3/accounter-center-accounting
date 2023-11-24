const router = require('express').Router();
const _p      = require('../utils/promise_error');
const  {Database}   = require('../utils/Database');
let    db = new Database();

class PurchaseModel {

    async getSupplierCode(){
        let [lastSupplierRowError,lastSupplierRow] =  await _p(db.query(`select supplier_id from tbl_suppliers  order by supplier_id desc LIMIT 1`)).then(result=>{
            return result;
        });
        if(lastSupplierRowError){
            next(lastSupplierRowError);
        }
        let supplierCode = '';
        if(lastSupplierRow.length<1){
            supplierCode = 'P00001';
        }else{
            supplierCode = 'P0000'+(parseFloat(lastSupplierRow[0].supplier_id)+1);
        }

        return supplierCode;
    }
    getPurchaseInvoice(){
        return new Promise(async (resolve,reject)=>{
            let [qryErr,data] = await _p(db.selectSingleRow(`
            select pur_id  from tbl_purchase_master order by pur_id desc limit 1
           `).then((row)=>{
                return row;
                }));
                if(qryErr && !data){
                return reject(qryErr);
                }
                else{
                    let invoice = 'PUR-'+new Date().getFullYear()+'-';
                    if(Object.keys(data).length === 0 && data.constructor === Object
                    ){
                        invoice += 1
                    }else{
                        invoice += data.pur_id+parseFloat(1)
                    }
                    resolve(invoice)
                }
        })
        
    }

    getExpenseInvoice(){
        return new Promise(async (resolve,reject)=>{
            let [qryErr,data] = await _p(db.selectSingleRow(`
            select pur_ser_id   from tbl_pur_ser_master order by pur_ser_id  desc limit 1
           `).then((row)=>{
                return row;
                }));
                if(qryErr && !data){
                return reject(qryErr);
                }
                else{
                    let invoice = 'E-'+new Date().getFullYear()+'-';
                    if(Object.keys(data).length === 0 && data.constructor === Object
                    ){
                        invoice += 1
                    }else{
                        invoice += data.pur_ser_id +parseFloat(1)
                    }
                    resolve(invoice)
                }
        })
        
    }

    getMaterialPurchaseInvoice(){
        return new Promise(async (resolve,reject)=>{
            let [qryErr,data] = await _p(db.selectSingleRow(`
            select m_purchase_id   from tbl_material_purchase order by m_purchase_id  desc limit 1
           `).then((row)=>{
                return row;
                }));
                if(qryErr && !data){
                return reject(qryErr);
                }
                else{
                    let invoice = 'MINV-'+new Date().getFullYear()+'-';
                    if(Object.keys(data).length === 0 && data.constructor === Object
                    ){
                        invoice += 1
                    }else{
                        invoice += data.m_purchase_id+parseFloat(1)
                    }
                    resolve(invoice)
                }
        })
        
    }

    getProductionInvoice(){
        return new Promise(async (resolve,reject)=>{
            let [qryErr,data] = await _p(db.selectSingleRow(`
            select production_id    from tbl_product_productions_master order by production_id   desc limit 1
           `).then((row)=>{
                return row;
                }));
                if(qryErr && !data){
                return reject(qryErr);
                }
                else{
                    let invoice = 'PD-'+new Date().getFullYear()+'-';
                    if(Object.keys(data).length === 0 && data.constructor === Object
                    ){
                        invoice += 1
                    }else{
                        invoice += data.production_id+parseFloat(1)
                    }
                    resolve(invoice)
                }
        })
        
    }
}

module.exports = {PurchaseModel}