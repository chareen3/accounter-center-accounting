const router = require('express').Router();
const {check} = require('express-validator');
const  rejet_invalid = require("../middlewares/reject_invalid");
const _p      = require('../utils/promise_error');
const path    = require('path')
const fs = require('fs')



const  {getCurrentISODT,checkIntNum,convToISODT,isoFromDate} = require('../utils/functions')
const  {Database}   = require('../utils/Database');
const { exit } = require('process');
let    db = new Database();


const  signupValidator = [
    check('user_name').exists(),
];
router.get(`/api/get-institution`,async(req,res,next)=>{
    let [institutionErr,institution] =  await _p(db.query(`select pro_name,pro_desc,pro_logo,pro_print_type from tbl_institution_profile where pro_id = ? `,[1]).then(res=>{
        return res;
    }))

    if(institutionErr && !institution) return next(institutionErr);
    res.json(institution[0]);

});
router.get(`/public/get-institution`,async(req,res,next)=>{
    let [institutionErr,institution] =  await _p(db.query(`select pro_name,pro_desc,pro_logo,pro_print_type from tbl_institution_profile  where pro_id = 1 `).then(res=>{
        return res;
    }))

    if(institutionErr && !institution) return next(institutionErr);
    res.json(institution[0]);

});

router.post(`/public/app-checker`,async (req,res,next)=>{
    let [checkingErr,checking] =  await _p(db.countRows(`select * from tbl_checking where 
    status='a' and  app_id=? `,[req.body.appId])).then(row=>{
        return row;
    });
    res.json({
        error:false,
        active: checking > 0 ? 'YES':'NO'
    })
})


router.post(`/api/save-institution`,async(req,res,next)=>{
   
    var pro_logo = ''
    if(req.files==null){
        pro_logo = 'no'
    }else{
        let [preLogoErr,preLogo] =  await _p(db.query(`select pro_logo from tbl_institution_profile where pro_branch_id=? `,[req.user.user_branch_id]).then(res=>{
            return res;
        }))
        // if(preLogo.length!=0 ){
        //     if(fs.existsSync(path.join(__dirname, `../../uploads/${preLogo[0].pro_logo}`))){
        //         fs.unlink(path.join(__dirname, `../../uploads/${preLogo[0].pro_logo}`), (err) => {})
        //     }
        // }

        let file = req.files.pro_logo;
        let formatCheck =  ['image/jpeg','image/jpg','image/png'].indexOf(file.mimetype)

        // if(formatCheck == -1){
        //     res.json({error:true,message:'Must be file type image(jpeg/jpg/png) required.'})
        // }else if(file.size>61440){
        //     res.json({error:true,message:'Maximum upload size 60 K '})
        // }else{
            
        //     pro_logo = Math.floor(1000000000 + Math.random() * 9000000000)+file.name;
        //     file.mv(path.join(__dirname, `../../uploads/${pro_logo}`), err => {
        //         if (err) {
        //         return res.status(500).send(err);
        //         }
        //     });
        // }
    
    
    }

   let [countErr,count] =  await _p(db.countRows(`select pro_id from tbl_institution_profile where pro_branch_id=? `,[req.user.user_branch_id]).then(res=>{
            return res;
        }))

        if(countErr && !count) return next(countErr);

        if(count>0){

            let saveRow = {
                pro_name: req.body.pro_name,
                pro_desc: req.body.pro_desc,
                pro_print_type: req.body.pro_print_type,
                pro_updated_by: req.user.user_id,
                pro_branch_id: req.user.user_branch_id,
            }
            // if(pro_logo!='no'){
            //     saveRow.pro_logo = pro_logo
            // }
           let [updateErr,update] =  await _p(db.update(`tbl_institution_profile`,saveRow,{
            // pro_branch_id: req.user.user_branch_id,
            pro_id : 1
           }));
           if(updateErr && !update){
            return next(updateErr);
           }else{
               res.json({error:false,message:'Institution Profile Update Successfully.'})
           }
        }else{
            let saveRow = {
                pro_name: req.body.pro_name,
                pro_desc: req.body.pro_desc,
                pro_print_type: req.body.pro_print_type,
                pro_updated_by: req.user.user_id,
                pro_branch_id: req.user.user_branch_id,
            }
            // if(pro_logo!='no'){
            //     saveRow.pro_logo = pro_logo
            // }
           let [addErr,add] =  await _p(db.insert(`tbl_institution_profile`,saveRow));
           if(addErr && !add){
            return next(addErr);
           }else{
               res.json({error:false,message:'Institution Profile Add Successfully.'})
           }
        }
});


router.post('/api/get-branches',async (req,res,next)=>{
    let cluases = ``
    if(req.body['without-self'] != undefined && req.body['without-self'] != null){
        cluases +=` where branch_id <>${req.user.user_branch_id} `
    }
    let [qryErr,data] = await _p(db.query(`select * from tbl_branches 
    ${cluases}
    order by branch_status  `).then( rows => {   
                  return rows
      }));
      if(qryErr && !data){
        return next(qryErr);
      }
      else{
          res.json({error:false,message:data});
      }
})
router.post('/api/get-users',async (req,res,next)=>{
    let [qryErr,data] = await _p(db.query(`select u.user_id,u.user_label,u.user_full_name,u.user_name,u.user_email,
    u.user_role,u.user_status,b.branch_name,w.warehouse_name,u.user_branch_id,u.user_warehouse_id
     from tbl_users u
     left join tbl_branches b on b.branch_id = u.user_branch_id
     left join tbl_warehouses w on w.warehouse_id = u.user_warehouse_id
     order by u.user_id desc
      `).then( rows => {   
                  return rows
      }));
      if(qryErr && !data){
        return next(qryErr);
      }
      else{
          res.json({error:false,message:data});
      }
})
router.post('/api/get-categories',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " and prod_cat_status='active' "
    }
    let [catsError,categories] =  await _p(db.query(`select * from tbl_product_categories where   prod_cat_branch_id=? ${cluases} order by prod_cat_status `,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(catsError && !categories){
        next(catsError)
    }else{
        res.json({
            error:false,
            message:categories
        });
    }
})

let getEmployeeCode = async (req,res,next)=>{
    let [lastEmployeeRowError,lastEmployeeRow] =  await _p(db.query(`select employee_id from tbl_employees  order by employee_id desc LIMIT 1`)).then(result=>{
        return result;
    });
    if(lastEmployeeRowError){
        next(lastEmployeeRowError)
    }
    let employeeCode = '';
    if(lastEmployeeRow.length<1){
        employeeCode = 'E00001';
    }else{
        employeeCode = 'E0000'+(parseFloat(lastEmployeeRow[0].employee_id)+1);
    }
    return new Promise((resolve,reject)=>{
             resolve(employeeCode)
    })
}
router.get('/api/get-employee-code',async(req,res,next)=>{  
        res.json({
            error:false,
            message:await  getEmployeeCode(req,res,next)
        });
})

let getTranAccCode = async (req,res,next)=>{
    let [lastTranAccRowError,lastTranAccRow] =  await _p(db.query(`select tran_acc_id from tbl_transaction_accounts  order by tran_acc_id desc LIMIT 1`)).then(result=>{
        return result;
    });
    if(lastTranAccRowError){
        next(lastTranAccRowError)
    }
    let TranAccCode = '';
    if(lastTranAccRow.length<1){
        tranAccCode = 'TA00001';
    }else{
        tranAccCode = 'TA0000'+(parseFloat(lastTranAccRow[0].tran_acc_id)+1);
    }
    return new Promise((resolve,reject)=>{
             resolve(tranAccCode)
    })
}
router.get('/api/get-transaction-account-code',async(req,res,next)=>{  
        res.json({
            error:false,
            message:await  getTranAccCode(req,res,next)
        });
})
// 


let getBankTranCode = async (req,res,next)=>{
    let [lastBankTranRowError,lastBankTranRow] =  await _p(db.query(`select bank_tran_id from tbl_bank_transactions  order by bank_tran_id desc LIMIT 1`)).then(result=>{
        return result;
    });
    if(lastBankTranRowError){
        next(lastBankTranRowError)
    }
    let bankTranCode = '';
    if(lastBankTranRow.length<1){
        bankTranCode = 'CT00001';
    }else{
        bankTranCode = 'CT0000'+(parseFloat(lastBankTranRow[0].bank_tran_id)+1);
    }
    return new Promise((resolve,reject)=>{
             resolve(bankTranCode)
    })
}
router.get('/api/get-bank-transaction-code',async(req,res,next)=>{  
        res.json({
            error:false,
            message:await  getBankTranCode(req,res,next)
        });
})

let getCashTranCode = async (req,res,next)=>{
    let [lastCashTranRowError,lastCashTranRow] =  await _p(db.query(`select cash_tran_id from tbl_cash_transactions  order by cash_tran_id desc LIMIT 1`)).then(result=>{
        return result;
    });
    if(lastCashTranRowError){
        next(lastCashTranRowError)
    }
    let cashTranCode = '';
    if(lastCashTranRow.length<1){
        cashTranCode = 'CT00001';
    }else{
        cashTranCode = 'CT0000'+(parseFloat(lastCashTranRow[0].cash_tran_id)+1);
    }
    return new Promise((resolve,reject)=>{
             resolve(cashTranCode)
    })
}
router.get('/api/get-cash-transaction-code',async(req,res,next)=>{  
        res.json({
            error:false,
            message:await  getCashTranCode(req,res,next)
        });
})
let getBankAccCode = async (req,res,next)=>{
    let [lastBankAccRowError,lastBankAccRow] =  await _p(db.query(`select bank_acc_id from tbl_bank_accounts  order by bank_acc_id desc LIMIT 1`)).then(result=>{
        return result;
    });
    if(lastBankAccRowError){
        next(lastBankAccRowError)
    }
    let bankAccCode = '';
    if(lastBankAccRow.length<1){
        bankAccCode = 'BA00001';
    }else{
        bankAccCode = 'BA0000'+(parseFloat(lastBankAccRow[0].bank_acc_id)+1);
    }
    return new Promise((resolve,reject)=>{
             resolve(bankAccCode)
    })
}
router.get('/api/get-bank-account-code',async(req,res,next)=>{  
        res.json({
            error:false,
            message:await  getBankAccCode(req,res,next)
        });
})
let getProductCode = async (req,res,next)=>{
    let [lastProductRowError,lastProductRow] =  await _p(db.query(`select prod_id from tbl_products  order by prod_id desc LIMIT 1`)).then(result=>{
        return result;
    });
    if(lastProductRowError){
        next(lastProductRowError)
    }
    let prodCode = '';
    if(lastProductRow.length<1){
        prodCode = 'P00001';
    }else{
        prodCode = 'P0000'+(parseFloat(lastProductRow[0].prod_id)+1);
    }
    return new Promise((resolve,reject)=>{
             resolve(prodCode)
    })
}
router.get('/api/get-product-code',async(req,res,next)=>{  
        res.json({
            error:false,
            message:await  getProductCode(req,res,next)
        });
})

let getCustomerCode = async (req,res,next)=>{
    let [lastCustomerRowError,lastCustomerRow] =  await _p(db.query(`select customer_id from tbl_customers  order by customer_id desc LIMIT 1`)).then(result=>{
        return result;
    });
    if(lastCustomerRowError){
        next(lastCustomerRowError)
    }
    let customerCode = '';
    if(lastCustomerRow.length<1){
        customerCode = 'C00001';
    }else{
        customerCode = 'C0000'+(parseFloat(lastCustomerRow[0].customer_id)+1);
    }
    return new Promise((resolve,reject)=>{
             resolve(customerCode)
    })
}

router.get('/api/get-customer-code',async (req,res,next)=>{
    res.json({
        error:false,
        message:await  getCustomerCode(req,res,next)
    });
})

let getSupplierCode = async (req,res,next)=>{
    let [lastSupplierRowError,lastSupplierRow] =  await _p(db.query(`select supplier_id from tbl_suppliers  order by supplier_id desc LIMIT 1`)).then(result=>{
        return result;
    });
    if(lastSupplierRowError){
        next(lastSupplierRowError)
    }
    let supplierCode = '';
    if(lastSupplierRow.length<1){
        supplierCode = 'S00001';
    }else{
        supplierCode = 'S0000'+(parseFloat(lastSupplierRow[0].supplier_id)+1);
    }
    return new Promise((resolve,reject)=>{
             resolve(supplierCode)
    })
}
router.get('/api/get-supplier-code',async (req,res,next)=>{
    res.json({
        error:false,
        message:await  getSupplierCode(req,res,next)
    });
})
router.post('/api/get-products',async (req,res,next)=>{
    let cluases = " ";
    

    if(req.body['fromDate']!= undefined && req.body['toDate'] != undefined){
        cluases += ` and  p.prod_created_isodt between '${req.body['fromDate']}' and '${req.body['toDate']}'  `
    }

    let [productsError,products] =  await _p(db.query(`select p.*,
    ifnull(pr.prod_avarage_rate,0) as prod_purchase_rate,
    c.prod_cat_name,pn.prod_name,u.prod_unit_name from 
    tbl_products p  
    left join tbl_product_categories c on p.prod_cat_id = c.prod_cat_id
    left join tbl_products_names pn on p.prod_name_id = pn.prod_name_id
    left join tbl_product_units u on p.prod_unit_id = u.prod_unit_id
    left join tbl_product_purchase_rate pr on pr.product_id = p.prod_id  
    and pr.branch_id =?
    where p.prod_status='active' and 
    find_in_set(?,p.prod_branch_ids) <> 0 
     ${cluases}    
       
    order by pn.prod_name asc `,[req.user.user_branch_id,req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(productsError && !products){
        next(productsError)
    }else{
       
        res.json({
            error:false,
            message:products
        });
    }
})

router.post('/api/get-cash-transactions',async  (req,res,next)=>{
    let payLoad = req.body;
    let cluases = " ";
    
    if(payLoad.tranType != undefined && payLoad.tranType != null){
        cluases += ` and  ct.cash_tran_type='${payLoad.tranType}'  `
    }

    if(payLoad.accountId != undefined && payLoad.accountId != null){
        cluases += ` and  ct.cash_tran_acc_id='${payLoad.accountId}'  `
    }

    if(payLoad.fromDate != undefined && payLoad.toDate != null){
        cluases += ` and  ct.cash_tran_created_isodt between  '${payLoad.fromDate}' and '${payLoad.toDate}' `
    }


    let [cashTransError,cashTrans] =  await _p(db.query(`select ct.*,ta.tran_acc_name,bac.bank_acc_name
    from 
    tbl_cash_transactions ct 
    left join tbl_transaction_accounts ta
    on ct.cash_tran_acc_id=ta.tran_acc_id
    left join tbl_bank_accounts bac
    on bac.bank_acc_id = ct.bank_acc_id
    where ct.cash_tran_status='active' and  ct.cash_tran_branch_id=? 
    ${cluases}
    order by ct.cash_tran_id desc`,[req.user.user_branch_id])).then(result=>{
        return result;
    });

    if(cashTransError && !cashTrans){
        next(cashTransError)
    }else{
       
        res.json(cashTrans)
    }
});

router.post('/api/get-bank-transactions',async  (req,res,next)=>{


    let payLoad = req.body;
    let cluases = " ";
    
    if(payLoad.tranType != undefined && payLoad.tranType != null){
        cluases += ` and  bt.bank_tran_type='${payLoad.tranType}'  `
    }

    if(payLoad.accountId != undefined && payLoad.accountId != null){
        cluases += ` and  bt.bank_tran_acc_id='${payLoad.accountId}'  `
    }

    if(payLoad.fromDate != undefined && payLoad.toDate != null){
        cluases += ` and  bt.bank_tran_created_isodt between  '${payLoad.fromDate}' and '${payLoad.toDate}' `
    }

    let [bankTransError,bankTrans] =  await _p(db.query(`select bt.*,ba.bank_acc_name from 
    tbl_bank_transactions bt 
    left join tbl_bank_accounts ba
    on bt.bank_tran_acc_id=ba.bank_acc_id
    where   bt.bank_tran_status='active' and   bt.bank_tran_branch_id=? 
    ${cluases}
    order by bt.bank_tran_id desc`,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(bankTransError && !bankTrans){
        next(bankTransError)
    }else{
       
        res.json(bankTrans)
    }
})

router.post('/api/get-customers',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " and  c.customer_status='active'  "
    }

    if(req.body['fromDate']!= undefined && req.body['toDate'] != undefined){
        cluases += ` and  c.customer_created_isodt between '${req.body['fromDate']}' and '${req.body['toDate']}'  `
    }

    if(req.body['customer-type'] != undefined){
        cluases += ` and  c.customer_type =  '${req.body['customer-type']}' `
    }
    
    let [customersError,customers] =  await _p(db.query(`select c.*,a.area_name,concat(c.customer_name,' - ',c.customer_mobile_no) as display_text,emp.employee_name
     from 
    tbl_customers c  
    left join tbl_areas a on a.area_id = c.customer_area_id
    left join tbl_employees emp  on emp.employee_id = c.employee_id
    where c.customer_type<>'general' and c.customer_branch_id=?   ${cluases}     
    order by c.customer_status `,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(customersError && !customers){
        next(customersError)
    }else{
       
        res.json({
            error:false,
            message:customers
        });
    }
})
router.post('/api/get-suppliers',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " and  supplier_status='active'  "
    }

    if(req.body['fromDate']!= undefined && req.body['toDate'] != undefined){
        cluases += ` and  supplier_created_isodt between '${req.body['fromDate']}' and  '${req.body['toDate']}'  `
    }
    let [suppliersError,suppliers] =  await _p(db.query(`select *,concat(supplier_name,' - ',supplier_mobile_no) as display_text
     from  tbl_suppliers where  supplier_branch_id=?  and supplier_name<>'' and supplier_type <> 'general' ${cluases}     
    order by supplier_id desc`,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(suppliersError && !suppliers){
        next(suppliersError)
    }else{
       
        res.json({
            error:false,
            message:suppliers
        });
    }
})
router.post('/api/get-colors',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " and prod_color_status='active' "
    }
    let [colorsError,colors] =  await _p(db.query(`select * from tbl_product_colors where   prod_color_branch_id=?  ${cluases}   order by prod_color_status `,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(colorsError && !colors){
        next(colorsError)
    }else{
        res.json({
            error:false,
            message:colors
        });
    }
})
// Brands 
router.post('/api/get-brands',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " and prod_brand_status='active' "
    }
    let [brandsError,brands] =  await _p(db.query(`select * from tbl_product_brands where   prod_brand_branch_id=?  ${cluases}   order by prod_brand_status `,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(brandsError && !brands){
        next(brandsError)
    }else{
        res.json({
            error:false,
            message:brands
        });
    }
});
router.post('/api/get-employees',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " and e.employee_status='active' "
    }
    let [employeesError,employees] =  await _p(db.query(`select e.*,d.department_name,dg.designation_name from 
    tbl_employees e  
    left join tbl_departments d on e.employee_department_id = d.department_id
    left join tbl_designations dg on e.employee_designation_id = dg.designation_id
    where    e.employee_branch_id=?  ${cluases}   order by e.employee_status asc`,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(employeesError && !employees){
        next(employeesError)
    }else{
        res.json({
            error:false,
            message:employees
        });
    }
});
router.post('/api/get-units',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " and prod_unit_status='active' "
    }
    let [unitsError,units] =  await _p(db.query(`select * from tbl_product_units where   prod_unit_branch_id=?  ${cluases}   order by prod_unit_status `,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(unitsError && !units){
        next(unitsError)
    }else{
        res.json({
            error:false,
            message:units
        });
    }
});
router.post('/api/get-designations',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " and designation_status='active' "
    }
    let [designationsError,designations] =  await _p(db.query(`select * from tbl_designations where   designation_branch_id=?  ${cluases}   order by designation_id desc`,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(designationsError && !designations){
        next(designationsError)
    }else{
        res.json({
            error:false,
            message:designations
        });
    }
});

router.post('/api/get-departments',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " and department_status='active' "
    }
    let [departmentsError,departments] =  await _p(db.query(`select * from tbl_departments where   department_branch_id=?  ${cluases}   order by department_id desc`,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(departmentsError && !departments){
        next(departmentsError)
    }else{
        res.json({
            error:false,
            message:departments
        });
    }
});
router.post('/api/get-months',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " and month_status='active' "
    }
    let [monthsError,months] =  await _p(db.query(`select * from tbl_months where   month_branch_id=?  ${cluases}   order by month_id desc`,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(monthsError && !months){
        next(monthsError)
    }else{
        res.json({
            error:false,
            message:months
        });
    }
});
router.post('/api/get-prod-names',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " and prod_name_status='active' "
    }
let [prodNamesError,prodNames] =  await _p(db.query(`select * from tbl_products_names where   prod_name_branch_id=?  ${cluases}   order by prod_name_status `,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(prodNamesError && !prodNames){
        next(prodNamesError)
    }else{
        res.json({
            error:false,
            message:prodNames
        });
    }
});
router.post('/api/get-areas',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " and area_status='active' "
    }
    let [areasError,areas] =  await _p(db.query(`select * from tbl_areas where   area_branch_id=?  ${cluases}   order by area_status `,[req.user.user_branch_id])).then(result=>{
        return result;
    });
    if(areasError && !areas){
        next(areasError)
    }else{
        res.json({
            error:false,
            message:areas
        });
    }
});

router.post('/api/get-warehouses',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " where  warehouse_status='active' "
    }
    let [warehousesError,warehouses] =  await _p(db.query(`select * from tbl_warehouses     ${cluases}   order by warehouse_status `)).then(result=>{
        return result;
    });
    if(warehousesError && !warehouses){
        next(warehousesError)
    }else{
        res.json({
            error:false,
            message:warehouses
        });
    }
});
 
router.post('/api/get-transaction-accounts',async (req,res,next)=>{
    let cluases = " ";
    if(req.body['select-type']=='active'){
        cluases += " and   tran_acc_status='active' "
    }
    let [tranAccError,tranAccs] =  await _p(db.query(`select * from tbl_transaction_accounts   
    where tran_acc_branch_id=${req.user.user_branch_id}
      ${cluases}   order by tran_acc_status `)).then(result=>{
        return result;
    });
    if(tranAccError && !tranAccs){
        next(tranAccError)
    }else{
        res.json({
            error:false,
            message:tranAccs
        });
    }
});
router.post('/api/get-customer-payments',async (req,res,next)=>{
    let cluases = " ";
    let limit = " ";
    // if(req.body['select-type']=='active'){
    //     cluases += " where  cp.status='active' "
    // }
    if(req.body.transactionId != undefined){
        cluases += ` and  cp.pay_id = ${req.body.transactionId}  `
    }


    if(req.body.dailyDate != undefined && req.body.dailyDate != null){
        cluases += ` and  DATE(cp.created_isodt) = '${isoFromDate(req.body.dailyDate)}'  `
    }

    if(req.body.from != undefined && req.body.from =='invoice'){
        limit += ` limit 1  `
    }

    
    let [customerError,customers] =  await _p(db.query(`select cp.*,bacc.bank_acc_name,bacc.bank_acc_id,cus.customer_name,
    cus.customer_code,cus.customer_address,
    cus.customer_mobile_no,
    cus.customer_institution_name,
    u.user_name
     from tbl_customer_payments cp
    left join tbl_bank_accounts bacc on cp.bank_acc_id=bacc.bank_acc_id
    left join tbl_customers cus on cp.cus_id=cus.customer_id 
    left join tbl_users u on u.user_id = cp.created_by 
    where cp.status='a' 
    and cp.branch_id = ${req.user.user_branch_id}
        ${cluases}   order by cp.pay_id desc ${limit} `)).then(result=>{
        return result;
    });
    if(customerError && !customers){
        next(customerError)
    }else{
        res.json({
            error:false,
            message:customers
        });
    }
});
router.post('/api/get-supplier-payments',async (req,res,next)=>{
    let cluases = " ";
    // if(req.body['select-type']=='active'){
    //     cluases += " where  sp.status='a' "
    // }
    let [suppError,supps] =  await _p(db.query(`select sp.*,bacc.bank_acc_name,sup.supplier_name from tbl_supplier_payments sp
    left join tbl_bank_accounts bacc on sp.bank_acc_id=bacc.bank_acc_id
    left join tbl_suppliers sup on sp.supplier_id=sup.supplier_id
    where  sp.status='a'
      and  sp.branch_id= ${req.user.user_branch_id}
        ${cluases}   order by sp.pay_id desc`)).then(result=>{
        return result;
    });
    if(suppError && !supps){
        next(suppError)
    }else{
        res.json({
            error:false,
            message:supps
        });
    }
});
router.post('/api/get-bank-accounts',async (req,res,next)=>{
    let cluases = " ";
    // if(req.body['select-type']=='active'){
    //     cluases += " where  bank_acc_status='active' "
    // }
    let [bankAccError,bankAccs] =  await _p(db.query(`select *,concat(bank_acc_name,' - ',bank_acc_number) as bank_display_name 
    from tbl_bank_accounts   
    where  bank_acc_status='active'
      and bank_acc_branch_id = ${req.user.user_branch_id}
      order by bank_acc_status `)).then(result=>{
        return result;
    });
    if(bankAccError && !bankAccs){
        next(bankAccError)
    }else{
        res.json({
            error:false,
            message:bankAccs
        });
    }
});




router.post('/api/bank-transaction-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let bankTranUpdateIndex = reqObj.bankTranUpdateIndex;
    let bankTranInamount = 0;
    let bankTranOutamount = 0;
    if(reqObj.bank_tran_type=='withdraw'){
        bankTranOutamount = reqObj.bank_tran_amount;
    }else{
        bankTranInamount = reqObj.bank_tran_amount;
    }

    let newObject = {
        bank_tran_code: await  getBankTranCode(req,res,next), 
        bank_tran_branch_id:req.user.user_branch_id,
        bank_tran_in_amount:bankTranInamount,
        bank_tran_out_amount:bankTranOutamount, 
        bank_tran_created_by:req.user.user_id,
        bank_tran_updated_by:req.user.user_id,
        bank_tran_status:'active',
        bank_tran_created_isodt:reqObj.bank_tran_date_time, 
        bank_tran_updated_isodt:getCurrentISODT()
     }
     delete reqObj.bank_tran_date_time

     let saveObj = Object.assign(reqObj,newObject)
     
     // Create script
     if(reqObj.action=='create'){
            delete saveObj.bank_tran_id;
            delete saveObj.action;
            delete saveObj.bank_tran_updated_by;
            delete saveObj.bankTranUpdateIndex;
            delete saveObj.bank_tran_updated_isodt;
            delete saveObj.bank_tran_date;
            delete saveObj.bank_tran_amount;

        let [bankTranAddErr,bankTranAddResult] = await _p(db.insert('tbl_bank_transactions',saveObj)).then(res=>{
            return res;
        });
        if(bankTranAddErr && !bankTranAddResult){
           next(bankTranAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select bt.*,ba.bank_acc_name from 
           tbl_bank_transactions bt 
           left join tbl_bank_accounts ba
           on bt.bank_tran_acc_id=ba.bank_acc_id
           where  bt.bank_tran_id=?`,bankTranAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdBankTran',{
               msg:'You have successfully created a bank transaction',
               createdRow,
               index:bankTranUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });

            req.app.io.emit('bankTranCode',{
                createdRow:await  getBankTranCode(req,res,next)
             });
               res.json({
                   error:false,
                   message:'You have successfully created a bank transaction'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
            bank_tran_id:reqObj.bank_tran_id
        }

     

        delete saveObj.action;
        delete saveObj.bank_tran_code;
        delete saveObj.bank_tran_code;
        delete saveObj.bank_tran_status;
        delete saveObj.bankTranUpdateIndex;
        delete saveObj.bank_tran_date;
        delete saveObj.bank_tran_amount;
        let [bankTranUpdateErr,bankTranUpdateResult] = await _p(db.update('tbl_bank_transactions',saveObj,cond)).then(res=>{
            return res;
        });
        if(bankTranUpdateErr && !bankTranUpdateResult){
           next(bankTranUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =   await _p(db.query(`select bt.*,ba.bank_acc_name from 
           tbl_bank_transactions bt 
           left join tbl_bank_accounts ba
           on bt.bank_tran_acc_id=ba.bank_acc_id
           where  bt.bank_tran_id=?`,reqObj.bank_tran_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedBankTran',{
               msg:'You have successfully update a bank transaction',
               updatedRow,
               index:bankTranUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a bank transaction'
               })
            }
        }
     }
     
})


let supplierPayCode =  async ()=>{
    let [lastError,lastRow] =  await _p(db.query(`select pay_id from tbl_supplier_payments  order by pay_id desc LIMIT 1`)).then(result=>{
        return result;
    });
    if(lastError){
        next(lastError);
    }
    let payCode = '';
    if(lastRow.length<1){
        payCode = 'ST0001';
    }else{
        payCode = 'ST000'+(parseFloat(lastRow[0].pay_id)+1);
    }


    return new Promise((resolve,reject)=>{
        resolve(payCode)
    })
}


router.post('/api/supplier-payment-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let supplierPayUpdateIndex = reqObj.supplierPayUpdateIndex;
    let newObject = {
        pay_code	 : await supplierPayCode(),
        branch_id:req.user.user_branch_id,
        
        created_by:req.user.user_id,
        updated_by:req.user.user_id,
        bank_acc_id : reqObj.bank_acc_id,
        status:'a',
        created_isodt:reqObj.created_isodt, 
        updated_isodt:getCurrentISODT(),
     }

     let saveObj = Object.assign(reqObj,newObject)
     
     // Create script
     if(reqObj.action=='create'){ 
            delete saveObj.pay_id;
            delete saveObj.action;
            delete saveObj.updated_by;
            delete saveObj.supplierPayUpdateIndex;

        let [supplierPaymentAddErr,supplierPaymentAddResult] = await _p(db.insert('tbl_supplier_payments',saveObj)).then(res=>{
            return res;
        });
        if(supplierPaymentAddErr && !supplierPaymentAddResult){
           next(supplierPaymentAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select sp.*,bacc.bank_acc_name,sup.supplier_name from tbl_supplier_payments sp
           left join tbl_bank_accounts bacc on sp.bank_acc_id=bacc.bank_acc_id
           left join tbl_suppliers sup on sp.supplier_id=sup.supplier_id
           where  sp.pay_id=?`,supplierPaymentAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdSupplierPay',{
               msg:'You have successfully created a supplier payment',
               createdRow,
               index:supplierPayUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });

               res.json({
                   error:false,
                   message:'You have successfully created a supplier payment'
               })
            }
        }
     }
     // Update script 
     if(reqObj.action=='update'){         
         let cond = {
            pay_id:reqObj.pay_id
        }
        delete saveObj.action;
        delete saveObj.status;
        delete saveObj.supplierPayUpdateIndex;
        delete saveObj.created_isodt;
        delete saveObj.created_by;
        delete saveObj.pay_code;
        

        let [supplierUpdateErr,supplierUpdateResult] = await _p(db.update('tbl_supplier_payments',saveObj,cond)).then(res=>{
            return res;
        });

        if(supplierUpdateErr && !supplierUpdateResult){
           next(supplierUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =   await _p(db.query(`select sp.*,bacc.bank_acc_name,sup.supplier_name from tbl_supplier_payments sp
           left join tbl_bank_accounts bacc on sp.bank_acc_id=bacc.bank_acc_id
           left join tbl_suppliers sup on sp.supplier_id=sup.supplier_id
           where  sp.pay_id=?`,reqObj.pay_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedSupplierPay',{
               msg:'You have successfully update a supplier payment',
               updatedRow,
               index:supplierPayUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a supplier payment'
               })
            }
        }
     }
     
});


 let customerPayCode =  async ()=>{
    let [lastError,lastRow] =  await _p(db.query(`select pay_id from tbl_customer_payments  order by pay_id desc LIMIT 1`)).then(result=>{
        return result;
    });
    if(lastError){
        next(lastError);
    }
    let payCode = '';
    if(lastRow.length<1){
        payCode = 'CT0001';
    }else{
        payCode = 'CT000'+(parseFloat(lastRow[0].pay_id)+1);
    }


    return new Promise((resolve,reject)=>{
        resolve(payCode)
    })
}


router.post('/api/customer-payment-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let customerPayUpdateIndex = req.body.customerPayUpdateIndex
    let saveObj = {
        pay_code: await customerPayCode(),
        created_isodt: reqObj.created_isodt,
        cus_id: reqObj.cus_id,
        note: reqObj.note,
        pay_amount: reqObj.pay_amount,
        pay_method: reqObj.pay_method,
        bank_acc_id: reqObj.bank_acc_id,
        pay_type:reqObj.pay_type,
        previous_due: reqObj.previous_due,
        branch_id:req.user.user_branch_id,
        
        created_by:req.user.user_id,
        updated_by:req.user.user_id,
        status:'a'
     }





     
     // Create script
     if(reqObj.action=='create'){
    

        let [customerPaymentAddErr,customerPaymentAddResult] = await _p(db.insert('tbl_customer_payments',saveObj)).then(res=>{
            return res;
        });
        if(customerPaymentAddErr && !customerPaymentAddResult){
           next(customerPaymentAddErr)
        }else{
  
           
            let [createdRowErr,createdRow] =   await _p(db.query(`select cp.*,bacc.bank_acc_name,cus.customer_name from tbl_customer_payments cp
           left join tbl_bank_accounts bacc on cp.bank_acc_id=bacc.bank_acc_id
           left join tbl_customers cus on cp.cus_id=cus.customer_id
           where  cp.pay_id=?`,customerPaymentAddResult.insertId)).then(row=>{
                return row;
            })
    
            req.app.io.emit('createdCustomerPay',{
                msg:'You have successfully customer transaction',
                createdRow,
                index:customerPayUpdateIndex,
                user_branch_id: req.user.user_branch_id,
               });


               res.json({
                   error:false,
                   message:'You have successfully created  customer transaction',
                   payId : customerPaymentAddResult.insertId
               });
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
            pay_id:reqObj.pay_id
        }
        delete saveObj.action;
        delete saveObj.status;
        delete saveObj.customerPayUpdateIndex;
        delete saveObj.created_by;
        delete saveObj.pay_code;
        

        let [cashTranUpdateErr,cashTranUpdateResult] = await _p(db.update('tbl_customer_payments',saveObj,cond)).then(res=>{
            return res;
        });

        if(cashTranUpdateErr && !cashTranUpdateResult){
           next(cashTranUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =   await _p(db.query(`select cp.*,bacc.bank_acc_name,cus.customer_name from tbl_customer_payments cp
           left join tbl_bank_accounts bacc on cp.bank_acc_id=bacc.bank_acc_id
           left join tbl_customers cus on cp.cus_id=cus.customer_id
           where  cp.pay_id=?`,reqObj.pay_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedCustomerPay',{
               msg:'You have successfully update  customer transaction',
               updatedRow,
               index:customerPayUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a customer payment',
                   payId : reqObj.pay_id
               })
            }
        }
     }
     
});

router.post('/api/cash-transaction-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let cashTranUpdateIndex = reqObj.cashTranUpdateIndex;
    
    let cashTranInamount = 0;
    let cashTranOutamount = 0;
    if(reqObj.cash_tran_type=='payment'){
        cashTranOutamount = reqObj.cash_tran_amount;
    }else{
        cashTranInamount = reqObj.cash_tran_amount;
    }

    let newObject = {
        cash_tran_code: await  getCashTranCode(req,res,next), 
        cash_tran_branch_id:req.user.user_branch_id,
        cash_tran_in_amount:cashTranInamount,
        cash_tran_out_amount:cashTranOutamount, 
        cash_tran_created_by:req.user.user_id,
        cash_tran_updated_by:req.user.user_id,
        cash_tran_status:'active',
        cash_tran_created_isodt:convToISODT(reqObj.cash_tran_date_time), 
        cash_tran_updated_isodt:getCurrentISODT()
     }
     delete reqObj.cash_tran_date_time

     let saveObj = Object.assign(reqObj,newObject)
     
     // Create script
     if(reqObj.action=='create'){
            delete saveObj.cash_tran_id;
            delete saveObj.action;
            delete saveObj.cash_tran_updated_by;
            delete saveObj.cashTranUpdateIndex;
            delete saveObj.cash_tran_updated_isodt;
            delete saveObj.cash_tran_date;
            delete saveObj.cash_tran_amount;

        let [cashTranAddErr,cashTranAddResult] = await _p(db.insert('tbl_cash_transactions',saveObj)).then(res=>{
            return res;
        });
        if(cashTranAddErr && !cashTranAddResult){
           next(cashTranAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select ct.*,ta.tran_acc_name,bac.bank_acc_name 
           from 
           tbl_cash_transactions ct 
           left join tbl_transaction_accounts ta
           on ct.cash_tran_acc_id=ta.tran_acc_id
           left join tbl_bank_accounts bac
           on bac.bank_acc_id = ct.bank_acc_id
           where  ct.cash_tran_id=?`,cashTranAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdCashTran',{
               msg:'You have successfully created a cash transaction',
               createdRow,
               index:cashTranUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });

            req.app.io.emit('cashTranCode',{
                createdRow:await  getBankAccCode(req,res,next)
             });
               res.json({
                   error:false,
                   message:'You have successfully created a cash transaction'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
            cash_tran_id:reqObj.cash_tran_id
        }

     

        delete saveObj.action;
        delete saveObj.cash_tran_code;
        delete saveObj.cash_tran_code;
        delete saveObj.cash_tran_status;
        delete saveObj.cashTranUpdateIndex;
        delete saveObj.cash_tran_date;
        delete saveObj.cash_tran_amount;
        let [cashTranUpdateErr,cashTranUpdateResult] = await _p(db.update('tbl_cash_transactions',saveObj,cond)).then(res=>{
            return res;
        });
        if(cashTranUpdateErr && !cashTranUpdateResult){
           next(cashTranUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =   await _p(db.query(`select ct.*,ta.tran_acc_name,bac.bank_acc_name from 
           tbl_cash_transactions ct 
           left join tbl_transaction_accounts ta
           on ct.cash_tran_acc_id=ta.tran_acc_id
           left join tbl_bank_accounts bac
           on bac.bank_acc_id = ct.bank_acc_id
           where  ct.cash_tran_id=?`,reqObj.cash_tran_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedCashTran',{
               msg:'You have successfully update a cash transaction',
               updatedRow,
               index:cashTranUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a cash transaction'
               })
            }
        }
     }
     
})
router.post('/api/bank-account-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let bankAccUpdateIndex = reqObj.bankAccUpdateIndex;
     let newObject = {
        bank_acc_code: await  getBankAccCode(req,res,next), 
        bank_acc_branch_id:req.user.user_branch_id,
        bank_acc_created_by:req.user.user_id,
        bank_acc_updated_by:req.user.user_id,
        bank_acc_status:'active',
        bank_acc_created_isodt:getCurrentISODT(),
        bank_acc_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)
     
     // Create script
     if(reqObj.action=='create'){
            delete saveObj.bank_acc_id;
            delete saveObj.action;
            delete saveObj.bank_acc_updated_by;
            delete saveObj.bankAccUpdateIndex;
            delete saveObj.bank_acc_updated_isodt;

        let [bankAccAddErr,bankAccAddResult] = await _p(db.insert('tbl_bank_accounts',saveObj)).then(res=>{
            return res;
        });
        if(bankAccAddErr && !bankAccAddResult){
           next(bankAccAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from  tbl_bank_accounts 
           where bank_acc_id=?`,bankAccAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdBankAcc',{
               msg:'You have successfully created a bank account',
               createdRow,
               index:bankAccUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });

            req.app.io.emit('bankAccCode',{
                createdRow:await  getBankAccCode(req,res,next)
             });
               res.json({
                   error:false,
                   message:'You have successfully created a bank account'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
            bank_acc_id:reqObj.bank_acc_id
        }
        delete saveObj.action;
        delete saveObj.bank_acc_code;
        delete saveObj.bank_acc_code;
        delete saveObj.bank_acc_status;
        delete saveObj.bankAccUpdateIndex;
        delete saveObj.bank_acc_created_isodt;
        let [bankAccUpdateErr,bankAccUpdateResult] = await _p(db.update('tbl_bank_accounts',saveObj,cond)).then(res=>{
            return res;
        });
        if(bankAccUpdateErr && !bankAccUpdateResult){
           next(bankAccUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =   await _p(db.query(`select * from tbl_bank_accounts
           where   bank_acc_id=?`,reqObj.bank_acc_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{ 
               req.app.io.emit('updatedBankAcc',{
               msg:'You have successfully update a bank account',
               updatedRow,
               index:bankAccUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });
               res.json({
                   error:false,
                   message:'You have successfully updated a bank account'
               })
            }
        }
     }
     
})
router.post('/api/transaction-account-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let tranAccUpdateIndex = reqObj.tranAccUpdateIndex;
     let newObject = {
        tran_acc_code: await  getTranAccCode(req,res,next),
        tran_acc_branch_id:req.user.user_branch_id,
        tran_acc_created_by:req.user.user_id,
        tran_acc_updated_by:req.user.user_id,
        tran_acc_status:'active',
        tran_acc_created_isodt:getCurrentISODT(),
        tran_acc_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)
     
     // Create script
     if(reqObj.action=='create'){

        let [existCheckErr,existCheck] =  await _p(db.countRows(`select tran_acc_name from  tbl_transaction_accounts 
        where tran_acc_name=?`,[reqObj.tran_acc_name])).then(row=>{
             return row;
         })
        if(existCheck>0){
            res.json({
                error:true,
                message:'Account Name Already is Exist.'
            })
            return false
        }
         
         
            delete saveObj.tran_acc_id;
            delete saveObj.action;
            delete saveObj.tran_acc_updated_by;
            delete saveObj.tranAccUpdateIndex;
            delete saveObj.tran_acc_updated_isodt;

        let [tranAccAddErr,tranAccAddResult] = await _p(db.insert('tbl_transaction_accounts',saveObj)).then(res=>{
            return res;
        });
        if(tranAccAddErr && !tranAccAddResult){
           next(tranAccAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from  tbl_transaction_accounts 
           where tran_acc_id=?`,tranAccAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdTranAcc',{
               msg:'You have successfully created a transaction account',
               createdRow,
               index:tranAccUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });

            req.app.io.emit('tranAccCode',{
                createdRow:await  getTranAccCode(req,res,next)
             });
               res.json({
                   error:false,
                   message:'You have successfully created a transaction account'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){        
         
        let [existCheckErr,existCheck] =  await _p(db.countRows(`select tran_acc_name from  tbl_transaction_accounts 
        where tran_acc_name=? and tran_acc_id <> ?`,[reqObj.tran_acc_name,reqObj.tran_acc_id])).then(row=>{
             return row;
         })
        if(existCheck>0){
            res.json({
                error:true,
                message:'Account Name Already is Exist.'
            })
            return false
        }

         let cond = {
            tran_acc_id:reqObj.tran_acc_id
        }
        delete saveObj.action;
        delete saveObj.tran_acc_code;
        delete saveObj.tran_acc_code;
        delete saveObj.tran_acc_status;
        delete saveObj.tranAccUpdateIndex;
        delete saveObj.tran_acc_created_isodt;
        let [tranAccUpdateErr,tranAccUpdateResult] = await _p(db.update('tbl_transaction_accounts',saveObj,cond)).then(res=>{
            return res;
        });
        if(tranAccUpdateErr && !tranAccUpdateResult){
           next(tranAccUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =   await _p(db.query(`select * from tbl_transaction_accounts
           where   tran_acc_id=?`,reqObj.tran_acc_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedTranAcc',{
               msg:'You have successfully update a transaction account',
               updatedRow,
               index:tranAccUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a transaction account'
               })
            }
        }
     }
     
})
router.post('/api/employee-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let employeeUpdateIndex = reqObj.employeeUpdateIndex;
     let newObject = {
        employee_code: await  getEmployeeCode(req,res,next),
        employee_branch_id:req.user.user_branch_id,
        employee_created_by:req.user.user_id,
        employee_updated_by:req.user.user_id,
        employee_status:'active',
        employee_created_isodt:getCurrentISODT(),
        employee_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)
     
     // Create script
     if(reqObj.action=='create'){
            delete saveObj.employee_id;
            delete saveObj.action;
            delete saveObj.employee_updated_by;
            delete saveObj.employeeUpdateIndex;
            delete saveObj.employee_updated_isodt;

        let [employeeAddErr,employeeAddResult] = await _p(db.insert('tbl_employees',saveObj)).then(res=>{
            return res;
        });
        if(employeeAddErr && !employeeAddResult){
           next(employeeAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select e.*,d.department_name,dg.designation_name from 
           tbl_employees e  
           left join tbl_departments d on e.employee_department_id = d.department_id
           left join tbl_designations dg on e.employee_designation_id = dg.designation_id
           where e.employee_id=?`,employeeAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdEmployee',{
               msg:'You have successfully created a employee',
               createdRow,
               index:employeeUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });

            req.app.io.emit('employeeCode',{
                createdRow:await  getEmployeeCode(req,res,next)
             });

               res.json({
                   error:false,
                   message:'You have successfully created a employee'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
            employee_id:reqObj.employee_id
        }
        delete saveObj.action;
        delete saveObj.employee_code;
        delete saveObj.employee_status;
        delete saveObj.employeeUpdateIndex;
        delete saveObj.employee_created_isodt;
        let [employeeUpdateErr,employeeUpdateResult] = await _p(db.update('tbl_employees',saveObj,cond)).then(res=>{
            return res;
        });
        if(employeeUpdateErr && !employeeUpdateResult){
           next(employeeUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =   await _p(db.query(`select e.*,d.department_name,dg.designation_name from 
           tbl_employees e  
           left join tbl_departments d on e.employee_department_id = d.department_id
           left join tbl_designations dg on e.employee_designation_id = dg.designation_id
           where e.employee_id=?`,reqObj.employee_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedEmployee',{
               msg:'You have successfully update a employee',
               updatedRow,
               index:employeeUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a employee'
               })
            }
        }
     }
     
})
router.post('/api/product-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let productUpdateIndex = reqObj.productUpdateIndex;

  
     let saveObj = {
        prod_code: await  getProductCode(req,res,next),
        prod_cat_id: reqObj.prod_cat_id, 
        prod_unit_id: reqObj.prod_unit_id, 
        prod_name_id: reqObj.prod_name_id, 
        prod_purchase_rate: reqObj.prod_purchase_rate, 
        prod_sale_rate: reqObj.prod_sale_rate, 
        prod_whole_sale_rate: reqObj.prod_whole_sale_rate, 
        prod_re_order_lebel: reqObj.prod_re_order_lebel, 
        prod_branch_ids:req.user.user_branch_id,
        prod_created_by:req.user.user_id,
        prod_updated_by:req.user.user_id,
        prod_status:'active',
        prod_created_isodt:getCurrentISODT(),
        prod_updated_isodt:getCurrentISODT()
     }

     if(reqObj.prod_is_service == true){
        saveObj.prod_is_service = 'true'
     }else{
        saveObj.prod_is_service = 'false'
     }
    /// let saveObj = Object.assign(reqObj,newObject)
     
     // Create script 
     if(reqObj.action=='create'){
        let [prodExitErr,prodCount] =  await _p(db.countRows(`select * from tbl_products where prod_name_id=?  and prod_cat_id=? `,[saveObj.prod_name_id,saveObj.prod_cat_id])).then(count=>{
            
            return count;
        });

        if(prodExitErr && !prodCount){
           next(prodExitErr);
        }else{
           if(prodCount>0){
               res.json({
                   error:false,
                   warning:true,
                   message:'This Category\'s Product  already Exist.'
               })
           }else{
                /// Creting 
                delete saveObj.prod_id;
                delete saveObj.action;
                delete saveObj.prod_updated_by;
                delete saveObj.productUpdateIndex;
                delete saveObj.prod_updated_isodt;
    
            let [prodAddErr,prodAddResult] = await _p(db.insert('tbl_products',saveObj)).then(res=>{
                return res;
            });
            if(prodAddErr && !prodAddResult){
               next(prodAddErr)
            }else{
               let [createdRowErr,createdRow] =  await _p(db.query(`select p.*,c.prod_cat_name,b.prod_brand_name,pn.prod_name,u.prod_unit_name,
               ifnull(pr.prod_avarage_rate,0) as prod_purchase_rate
                from 
               tbl_products p  left join tbl_product_categories c on p.prod_cat_id = c.prod_cat_id
               left join tbl_product_brands b on p.prod_brand_id = b.prod_brand_id
               left join tbl_products_names pn on p.prod_name_id = pn.prod_name_id
               left join tbl_product_units u on p.prod_unit_id = u.prod_unit_id
               left join tbl_product_purchase_rate pr on p.prod_id = pr.product_id 
               and find_in_set(pr.branch_id,p.prod_branch_ids)
               where p.prod_id=?`,prodAddResult.insertId)).then(row=>{
                    return row;
                })
                if(createdRowErr && !createdRow){
                   next(createdRowErr);
                }else{
                   req.app.io.emit('createdProduct',{
                   msg:'You have successfully created a product',
                   createdRow,
                   index:productUpdateIndex,
                   user_branch_id: req.user.user_branch_id,
                  
                });
    
                req.app.io.emit('productCode',{
                    createdRow:await  getProductCode(req,res,next)
                 });
    
                   res.json({
                       error:false,
                       message:'You have successfully created a product'
                   })
                }
            }

                //  End
           }
        }

            
     }
     // Update script
     if(reqObj.action=='update'){ 

        let [prodExitErr,prodCount] =  await _p(db.countRows(`select * from tbl_products where prod_name_id=?  and prod_cat_id=? and prod_id<>?  `,[saveObj.prod_name_id,saveObj.prod_cat_id,reqObj.prod_id])).then(count=>{
            return count;
        });


      

        if(prodExitErr && !prodCount){
           next(prodExitErr);
        }else{
            if(prodCount>0){
                res.json({
                    error:false,
                    warning:true,
                    message:'This Category\'s Product  already Exist.'
                })
            }else{
                let cond = {
                    prod_id:reqObj.prod_id
               }
               delete saveObj.prod_code;
               delete saveObj.action;
               delete saveObj.prod_status;
               delete saveObj.productUpdateIndex;
               delete saveObj.rod_created_isodt;
               delete saveObj.prod_branch_ids;
               let [prodUpdateErr,prodUpdateResult] = await _p(db.update('tbl_products',saveObj,cond)).then(res=>{
                   return res;
               });
               if(prodUpdateErr && !prodUpdateResult){
                  next(prodUpdateErr)
               }else{
                  let [updatedRowErr,updatedRow] =  await _p(db.query(`select p.*,c.prod_cat_name,b.prod_brand_name,pn.prod_name,u.prod_unit_name,
                  ifnull(pr.prod_avarage_rate,0) as prod_purchase_rate
                   from 
                  tbl_products p  left join tbl_product_categories c on p.prod_cat_id = c.prod_cat_id
                  left join tbl_product_brands b on p.prod_brand_id = b.prod_brand_id
                  left join tbl_products_names pn on p.prod_name_id = pn.prod_name_id
                  left join tbl_product_units u on p.prod_unit_id = u.prod_unit_id
                  left join tbl_product_purchase_rate pr on p.prod_id = pr.product_id 
                  and find_in_set(pr.branch_id,p.prod_branch_ids)
                  where p.prod_id=?`,reqObj.prod_id)).then(row=>{
                       return row;
                   })
                   if(updatedRowErr && !updatedRow){
                      next(updatedRowErr);
                   }else{
                      req.app.io.emit('updatedProduct',{
                      msg:'You have successfully update a product', 
                      updatedRow,
                      index:productUpdateIndex,
                      user_branch_id: req.user.user_branch_id,
                     });
                      res.json({
                          error:false,
                          message:'You have successfully updated a product'
                      })
                   }
               }
    
            }
            
        }
         
     }
     
})

router.post('/api/customer-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let customerUpdateIndex = reqObj.customerUpdateIndex;
     let saveObj = {
        customer_code: await  getCustomerCode(req,res,next),
        customer_name: reqObj.customer_name,
        customer_institution_name: reqObj.customer_institution_name,
        customer_address: reqObj.customer_address,
        customer_area_id: reqObj.customer_area_id,
        employee_id: reqObj.employee_id,
        customer_mobile_no: reqObj.customer_mobile_no,
        customer_phone_no: reqObj.customer_phone_no,
        customer_previous_due: reqObj.customer_previous_due,
        customer_credit_limit: reqObj.customer_credit_limit,
        customer_type:reqObj.customer_type,
        customer_branch_id:req.user.user_branch_id,
        customer_created_by:req.user.user_id,
        customer_updated_by:req.user.user_id,
        customer_status:'active',
        customer_created_isodt:getCurrentISODT(),
        customer_updated_isodt:getCurrentISODT()
     }
    /// let saveObj = Object.assign(reqObj,newObject)
    
     // Create script
     if(reqObj.action=='create'){

        let [existCheckErr,existCheck] =  await _p(db.countRows(`select customer_mobile_no from   tbl_customers 
        where customer_mobile_no=? `,[reqObj.customer_mobile_no])).then(row=>{
             return row;
         })
        if(existCheck>0){
            res.json({
                error:true,
                message:'Customer Mobile is Already  Exist.'
            })
            return false
        }


            delete saveObj.customer_id;
            delete saveObj.action;
            delete saveObj.customer_updated_by;
            delete saveObj.customerUpdateIndex;
            delete saveObj.customer_updated_isodt;

        let [customerAddErr,customerAddResult] = await _p(db.insert('tbl_customers',saveObj)).then(res=>{
            return res;
        });
        if(customerAddErr && !customerAddResult){
           next(customerAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select c.*,a.area_name,emp.employee_name from 
           tbl_customers c  
           left join tbl_areas a on a.area_id = c.customer_area_id
           left join tbl_employees emp on emp.employee_id = c.employee_id
           where  c.customer_id=? `,customerAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdCustomer',{
               msg:'You have successfully created a customer',
               createdRow,
               index:customerUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });

            req.app.io.emit('customerCode',{
                createdRow:await  getCustomerCode(req,res,next)
             });

               res.json({
                   error:false,
                   message:'You have successfully created a customer'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){      
         
        let [existCheckErr,existCheck] =  await _p(db.countRows(`select customer_mobile_no from   tbl_customers 
        where customer_mobile_no=? and customer_id <> ? `,[reqObj.customer_mobile_no,reqObj.customer_id])).then(row=>{
             return row;
         })
        if(existCheck>0){
            res.json({
                error:true,
                message:'Customer Mobile is Already  Exist.'
            })
            return false
        }


         let cond = {
            customer_id:reqObj.customer_id
        }
        delete saveObj.action;
        delete saveObj.customer_status;
        delete saveObj.customer_code;
        delete saveObj.customerUpdateIndex;
        delete saveObj.customer_created_isodt;
        let [customerUpdateErr,customerUpdateResult] = await _p(db.update('tbl_customers',saveObj,cond)).then(res=>{
            return res;
        });
        if(customerUpdateErr && !customerUpdateResult){
           next(customerUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select c.*,a.area_name,emp.employee_name from 
           tbl_customers c  
           left join tbl_areas a on a.area_id = c.customer_area_id
           left join tbl_employees emp on emp.employee_id = c.employee_id

           where  c.customer_id=?  
          `,reqObj.customer_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedCustomer',{
               msg:'You have successfully update a customer',
               updatedRow,
               index:customerUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a customer'
               })
            }
        }
     }
     
})

router.post('/api/supplier-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let supplierUpdateIndex = reqObj.supplierUpdateIndex;
     let saveObj = {
        supplier_code: await  getSupplierCode(req,res,next),
        supplier_name: reqObj.supplier_name,
        supplier_institution_name: reqObj.supplier_institution_name,
        supplier_address: reqObj.supplier_address,
        supplier_mobile_no: reqObj.supplier_mobile_no,
        supplier_phone_no: reqObj.supplier_phone_no,
        supplier_previous_due: reqObj.supplier_previous_due,
        supplier_branch_id:req.user.user_branch_id,
        supplier_created_by:req.user.user_id,
        supplier_updated_by:req.user.user_id,
        supplier_status:'active',
        supplier_created_isodt:getCurrentISODT(),
        supplier_updated_isodt:getCurrentISODT()
     }
    
     // Create script
     if(reqObj.action=='create'){

        let [existCheckErr,existCheck] =  await _p(db.countRows(`select supplier_mobile_no from   tbl_suppliers 
        where supplier_mobile_no=?  `,[reqObj.supplier_mobile_no])).then(row=>{
             return row;
         })
        if(existCheck>0){
            res.json({
                error:true,
                message:'Supplier Mobile is Already  Exist.'
            })
            return false
        }

            delete saveObj.supplier_id;
            delete saveObj.action;
            delete saveObj.supplier_updated_by;
            delete saveObj.supplierUpdateIndex;
            delete saveObj.supplier_updated_isodt;

        let [supplierAddErr,supplierAddResult] = await _p(db.insert('tbl_suppliers',saveObj)).then(res=>{
            return res;
        });
        if(supplierAddErr && !supplierAddResult){
           next(supplierAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from 
           tbl_suppliers where  supplier_id=? `,supplierAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdSupplier',{
               msg:'You have successfully created a supplier',
               createdRow,
               index:supplierUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });

            req.app.io.emit('supplierCode',{
                createdRow:await  getSupplierCode(req,res,next)
             });

               res.json({
                   error:false,
                   message:'You have successfully created a supplier'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){  
         
        let [existCheckErr,existCheck] =  await _p(db.countRows(`select supplier_mobile_no from   tbl_suppliers 
        where supplier_mobile_no=? and supplier_id <> ? `,[reqObj.supplier_mobile_no,reqObj.supplier_id])).then(row=>{
             return row;
         })
        if(existCheck>0){
            res.json({
                error:true,
                message:'Supplier Mobile is Already  Exist.'
            })
            return false
        }

         let cond = {
            supplier_id:reqObj.supplier_id
        }
        delete saveObj.action;
        delete saveObj.supplier_status;
        delete saveObj.supplierUpdateIndex;
        delete saveObj.supplier_created_isodt;
        delete saveObj.supplier_code;
        let [supplierUpdateErr,supplierUpdateResult] = await _p(db.update('tbl_suppliers',saveObj,cond)).then(res=>{
            return res;
        });
        if(supplierUpdateErr && !supplierUpdateResult){
           next(supplierUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select * from 
           tbl_suppliers  where  supplier_id=?  
          `,reqObj.supplier_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedSupplier',{
               msg:'You have successfully update a supplier',
               updatedRow,
               index:supplierUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a supplier'
               })
            }
        }
     }
     
})
router.post('/api/color-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let colorUpdateIndex = req.body.colorUpdateIndex;
     let newObject = {
        prod_color_branch_id:req.user.user_branch_id,
        prod_color_created_by:req.user.user_id,
        prod_color_updated_by:req.user.user_id,
        prod_color_status:'active',
        prod_color_created_isodt:getCurrentISODT(),
        prod_color_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)

     // Create script
     if(reqObj.action=='create'){
            delete saveObj.prod_color_id;
            delete saveObj.action;
            delete saveObj.prod_color_updated_by;
            delete saveObj.colorUpdateIndex;
            delete saveObj.prod_color_updated_isodt;

        let [colorAddErr,colorAddResult] = await _p(db.insert('tbl_product_colors',saveObj)).then(res=>{
            return res;
        });
        if(colorAddErr && !colorAddResult){
           next(colorAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from tbl_product_colors where prod_color_id=?`,colorAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdColor',{
               msg:'You have successfully created a color',
               createdRow,
               index:colorUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });
               res.json({
                   error:false,
                   message:'You have successfully created a color'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
             prod_color_id:reqObj.prod_color_id
        }
        delete saveObj.action;
        delete saveObj.prod_color_status;
        delete saveObj.colorUpdateIndex;
        delete saveObj.prod_color_created_isodt;
        let [colorUpdateErr,colorUpdateResult] = await _p(db.update('tbl_product_colors',saveObj,cond)).then(res=>{
            return res;
        });
        if(colorUpdateErr && !colorUpdateResult){
           next(colorUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select * from tbl_product_colors where prod_color_id=?`,reqObj.prod_color_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedColor',{
               msg:'You have successfully update a color',
               updatedRow,
               index:colorUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a color'
               })
            }
        }
     }
     
})
router.post('/api/prod-name-cu',async (req,res,next)=>{
    let reqObj = req.body;

    if(reqObj.action =='create'){
        let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_products_names where prod_name=? and prod_name_branch_id=? `,[reqObj.prod_name,req.user.user_branch_id])).then(row=>{
            return row;
        });
        if(checkDuplicate>0){
            res.json({
                error:true,
                message:'Product Name Already Exists !!!'
            })
           return false
        }
    }
    if(reqObj.action =='update'){
        let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_products_names where prod_name=? and prod_name_id <>? and prod_name_branch_id=?  `,[reqObj.prod_name,reqObj.prod_name_id,req.user.user_branch_id])).then(row=>{
            return row;
        });
        if(checkDuplicate>0){
            res.json({
                error:true,
                message:'Product Name Already Exists !!!'
            })
             return false
        }
    }


    let prodNameUpdateIndex = req.body.prodNameUpdateIndex;
     let newObject = {
        prod_name_branch_id:req.user.user_branch_id,
        prod_name_created_by:req.user.user_id,
        prod_name_updated_by:req.user.user_id,
        prod_name_status:'active',
        prod_name_created_isodt:getCurrentISODT(),
        prod_name_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)

     // Create script
     if(reqObj.action=='create'){
            delete saveObj.prod_name_id;
            delete saveObj.action;
            delete saveObj.prod_name_updated_by;
            delete saveObj.prodNameUpdateIndex;
            delete saveObj.prod_name_updated_isodt;

        let [prodNameAddErr,prodNameAddResult] = await _p(db.insert('tbl_products_names',saveObj)).then(res=>{
            return res;
        });
        if(prodNameAddErr && !prodNameAddResult){
           next(prodNameAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from tbl_products_names where prod_name_id=?`,prodNameAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdProdName',{
               msg:'You have successfully created a product name',
               createdRow,
               index:prodNameUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });
               res.json({
                   error:false,
                   message:'You have successfully created a product name'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
             prod_name_id:reqObj.prod_name_id
        }
        delete saveObj.action;
        delete saveObj.prod_name_status;
        delete saveObj.prodNameUpdateIndex;
        delete saveObj.prod_name_created_isodt;
        let [prodNameUpdateErr,unitUpdateResult] = await _p(db.update('tbl_products_names',saveObj,cond)).then(res=>{
            return res;
        });
        if(prodNameUpdateErr && !prodNameUpdateErr){
           next(prodNameUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select * from tbl_products_names where prod_name_id=?`,reqObj.prod_name_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedPordName',{
               msg:'You have successfully update a product name',
               updatedRow,
               index:prodNameUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a product name'
               })
            }
        }
     }
     
})
router.post('/api/unit-cu',async (req,res,next)=>{
    let reqObj = req.body;

    if(reqObj.action =='create'){
        let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_product_units where prod_unit_name=? and prod_unit_branch_id=? `,[reqObj.prod_unit_name,req.user.user_branch_id])).then(row=>{
            return row;
        });
        if(checkDuplicate>0){
            res.json({
                error:true,
                message:'Unit Name Already Exists !!!'
            })
           return false
        }
    }
    if(reqObj.action =='update'){
        let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_product_units where prod_unit_name=? and prod_unit_id<>? and prod_unit_branch_id=? `,[reqObj.prod_unit_name,reqObj.prod_unit_id,req.user.user_branch_id])).then(row=>{
            return row;
        });
        if(checkDuplicate>0){
            res.json({
                error:true,
                message:'Unit Name Already Exists !!!'
            })
             return false
        }
    }


    let unitUpdateIndex = req.body.unitUpdateIndex;
     let newObject = {
        prod_unit_branch_id:req.user.user_branch_id,
        prod_unit_created_by:req.user.user_id,
        prod_unit_updated_by:req.user.user_id,
        prod_unit_status:'active',
        prod_unit_created_isodt:getCurrentISODT(),
        prod_unit_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)

     // Create script
     if(reqObj.action=='create'){
            delete saveObj.prod_unit_id;
            delete saveObj.action;
            delete saveObj.prod_unit_updated_by;
            delete saveObj.unitUpdateIndex;
            delete saveObj.prod_unit_updated_isodt;

        let [unitAddErr,unitAddResult] = await _p(db.insert('tbl_product_units',saveObj)).then(res=>{
            return res;
        });
        if(unitAddErr && !unitAddResult){
           next(unitAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from tbl_product_units where prod_unit_id=?`,unitAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdUnit',{
               msg:'You have successfully created a unit',
               createdRow,
               index:unitUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });
               res.json({
                   error:false,
                   message:'You have successfully created a unit'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
             prod_unit_id:reqObj.prod_unit_id
        }
        delete saveObj.action;
        delete saveObj.prod_unit_status;
        delete saveObj.unitUpdateIndex;
        delete saveObj.prod_unit_created_isodt;
        let [unitUpdateErr,unitUpdateResult] = await _p(db.update('tbl_product_units',saveObj,cond)).then(res=>{
            return res;
        });
        if(unitUpdateErr && !unitUpdateResult){
           next(unitUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select * from tbl_product_units where prod_unit_id=?`,reqObj.prod_unit_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedUnit',{
               msg:'You have successfully update a unit',
               updatedRow,
               index:unitUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a unit'
               })
            }
        }
     }
     
})

router.post('/api/month-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let monthUpdateIndex = req.body.monthUpdateIndex;
     let newObject = {
        month_branch_id:req.user.user_branch_id,
        month_created_by:req.user.user_id,
        month_updated_by:req.user.user_id,
        month_status:'active',
        month_created_isodt:getCurrentISODT(),
        month_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)

     // Create script
     if(reqObj.action=='create'){
            delete saveObj.month_id;
            delete saveObj.action;
            delete saveObj.month_updated_by;
            delete saveObj.monthUpdateIndex;
            delete saveObj.month_updated_isodt;

        let [monthAddErr,monthAddResult] = await _p(db.insert('tbl_months',saveObj)).then(res=>{
            return res;
        });
        if(monthAddErr && !monthAddResult){
           next(monthAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from tbl_months where month_id=?`,monthAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdMonth',{
               msg:'You have successfully created a month',
               createdRow,
               index:monthUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });
               res.json({
                   error:false,
                   message:'You have successfully created a month'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
            month_id:reqObj.month_id
        }
        delete saveObj.action;
        delete saveObj.month_status;
        delete saveObj.monthUpdateIndex;
        delete saveObj.month_created_isodt;
        let [monthUpdateErr,monthUpdateResult] = await _p(db.update('tbl_months',saveObj,cond)).then(res=>{
            return res;
        });
        if(monthUpdateErr && !monthUpdateResult){
           next(monthUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select * from tbl_months where month_id=?`,reqObj.month_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedMonth',{
               msg:'You have successfully update a month',
               updatedRow,
               index:monthUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a month'
               })
            }
        }
     }
     
})
router.post('/api/designation-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let designationUpdateIndex = req.body.designationUpdateIndex;
     let newObject = {
        designation_branch_id:req.user.user_branch_id,
        designation_created_by:req.user.user_id,
        designation_updated_by:req.user.user_id,
        designation_status:'active',
        designation_created_isodt:getCurrentISODT(),
        designation_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)

     // Create script
     if(reqObj.action=='create'){
            delete saveObj.designation_id;
            delete saveObj.action;
            delete saveObj.designation_updated_by;
            delete saveObj.designationUpdateIndex;
            delete saveObj.designation_updated_isodt;

        let [designationAddErr,designationAddResult] = await _p(db.insert('tbl_designations',saveObj)).then(res=>{
            return res;
        });
        if(designationAddErr && !designationAddResult){
           next(designationAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from tbl_designations where designation_id=?`,designationAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdDesignation',{
               msg:'You have successfully created a designation',
               createdRow,
               index:designationUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });
               res.json({
                   error:false,
                   message:'You have successfully created a designation'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
            designation_id:reqObj.designation_id
        }
        delete saveObj.action;
        delete saveObj.designation_status;
        delete saveObj.designationUpdateIndex;
        delete saveObj.designation_created_isodt;
        let [designationUpdateErr,designationUpdateResult] = await _p(db.update('tbl_designations',saveObj,cond)).then(res=>{
            return res;
        });
        if(designationUpdateErr && !designationUpdateResult){
           next(designationUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select * from tbl_designations where designation_id=?`,reqObj.designation_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedDesignation',{
               msg:'You have successfully update a designation',
               updatedRow,
               index:designationUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a designation'
               })
            }
        }
     }
     
})

router.post('/api/department-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let departmentUpdateIndex = req.body.departmentUpdateIndex;
     let newObject = {
        department_branch_id:req.user.user_branch_id,
        department_created_by:req.user.user_id,
        department_updated_by:req.user.user_id,
        department_status:'active',
        department_created_isodt:getCurrentISODT(),
        department_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)

     // Create script
     if(reqObj.action=='create'){
            delete saveObj.department_id;
            delete saveObj.action;
            delete saveObj.department_updated_by;
            delete saveObj.departmentUpdateIndex;
            delete saveObj.department_updated_isodt;

        let [departmentAddErr,departmentAddResult] = await _p(db.insert('tbl_departments',saveObj)).then(res=>{
            return res;
        });
        if(departmentAddErr && !departmentAddResult){
           next(departmentAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from tbl_departments where department_id=?`,departmentAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdDepartment',{
               msg:'You have successfully created a department',
               createdRow,
               index:departmentUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });
               res.json({
                   error:false,
                   message:'You have successfully created a department'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
            department_id:reqObj.department_id
        }
        delete saveObj.action;
        delete saveObj.department_status;
        delete saveObj.departmentUpdateIndex;
        delete saveObj.department_created_isodt;
        let [departmentUpdateErr,departmentUpdateResult] = await _p(db.update('tbl_departments',saveObj,cond)).then(res=>{
            return res;
        });
        if(departmentUpdateErr && !departmentUpdateResult){
           next(departmentUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select * from tbl_departments where department_id=?`,reqObj.department_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedDepartment',{
               msg:'You have successfully update a department',
               updatedRow,
               index:departmentUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a department'
               })
            }
        }
     }
     
})
router.post('/api/area-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let areaUpdateIndex = req.body.areaUpdateIndex;

        if(reqObj.action =='create'){
            let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_areas where area_name=? and area_branch_id=? `,[reqObj.area_name,req.user.user_branch_id])).then(row=>{
                return row;
            });
            if(checkDuplicate>0){
                res.json({
                    error:true,
                    message:'Area Name Already Exists !!!'
                })
               return false
            }
        }
        if(reqObj.action =='update'){
            let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_areas where area_name=? and area_id<>? and area_branch_id=?  `,[reqObj.area_name,reqObj.area_id,req.user.user_branch_id])).then(row=>{
                return row;
            });
            if(checkDuplicate>0){
                res.json({
                    error:true,
                    message:'Area Name Already Exists !!!'
                })
                 return false
            }
        }

     let newObject = {
        area_branch_id:req.user.user_branch_id,
        area_created_by:req.user.user_id,
        area_updated_by:req.user.user_id,
        area_status:'active',
        area_created_isodt:getCurrentISODT(),
        area_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)

     // Create script
     if(reqObj.action=='create'){
            delete saveObj.area_id;
            delete saveObj.action;
            delete saveObj.area_updated_by;
            delete saveObj.areaUpdateIndex;
            delete saveObj.area_updated_isodt;

        let [areaAddErr,areaAddResult] = await _p(db.insert('tbl_areas',saveObj)).then(res=>{
            return res;
        });
        if(areaAddErr && !areaAddResult){
           next(areaAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from tbl_areas where area_id=?`,areaAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdArea',{
               msg:'You have successfully created a area',
               createdRow,
               index:areaUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });
               res.json({
                   error:false,
                   message:'You have successfully created a area'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
             area_id:reqObj.area_id
        }
        delete saveObj.action;
        delete saveObj.area_status;
        delete saveObj.areaUpdateIndex;
        delete saveObj.area_created_isodt;
        let [areaUpdateErr,areaUpdateResult] = await _p(db.update('tbl_areas',saveObj,cond)).then(res=>{
            return res;
        });
        if(areaUpdateErr && !areaUpdateResult){
           next(areaUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select * from tbl_areas where area_id=?`,reqObj.area_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedArea',{
               msg:'You have successfully update a area',
               updatedRow,
               index:areaUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a area'
               })
            }
        }
     }
     
})
// 
router.post('/api/brand-cu',async (req,res,next)=>{
    let reqObj = req.body;
    let brandUpdateIndex = req.body.brandUpdateIndex;
     let newObject = {
        prod_brand_branch_id:req.user.user_branch_id,
        prod_brand_created_by:req.user.user_id,
        prod_brand_updated_by:req.user.user_id,
        prod_brand_status:'active',
        prod_brand_created_isodt:getCurrentISODT(),
        prod_brand_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)

     // Create script
     if(reqObj.action=='create'){
            delete saveObj.prod_brand_id;
            delete saveObj.action;
            delete saveObj.prod_brand_updated_by;
            delete saveObj.brandUpdateIndex;
            delete saveObj.prod_brand_updated_isodt;

        let [brandAddErr,brandAddResult] = await _p(db.insert('tbl_product_brands',saveObj)).then(res=>{
            return res;
        });
        if(brandAddErr && !brandAddResult){
           next(brandAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from tbl_product_brands where prod_brand_id=?`,brandAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdBrand',{
               msg:'You have successfully created a brand',
               createdRow,
               index:brandUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });
               res.json({
                   error:false,
                   message:'You have successfully created a brand'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
             prod_brand_id:reqObj.prod_brand_id
        }
        delete saveObj.action;
        delete saveObj.prod_brand_status;
        delete saveObj.brandUpdateIndex;
        delete saveObj.prod_brand_created_isodt;
        let [brandUpdateErr,brandUpdateResult] = await _p(db.update('tbl_product_brands',saveObj,cond)).then(res=>{
            return res;
        });
        if(brandUpdateErr && !brandUpdateResult){
           next(brandUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select * from tbl_product_brands where prod_brand_id=?`,reqObj.prod_brand_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedBrand',{
               msg:'You have successfully update a brand',
               updatedRow,
               index:brandUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a brand'
               })
            }
        }
     }
     
})
router.post('/api/supplier-payment-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
    let smg = ``;

    if(req.body.action=='d'){
        saveEnum = 'd'
        smg = `disabled`
    }
    if(req.body.action=='a'){
        saveEnum = 'a'
        smg = `restore`
    }
    if(req.body.action=='d' || req.body.action=='a'){
        let cond = {
            pay_id:req.body.pay_id
        }

        
       let [supplierPayRestoreErr,supplierPayDisRestoreResult] = await _p(db.update('tbl_supplier_payments',{status:saveEnum},cond)).then(res=>{
           return res;
       });

       if(supplierPayRestoreErr && !supplierPayDisRestoreResult){
          next(supplierPayRestoreErr)
       }else{ 
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select sp.*,bacc.bank_acc_name,sup.supplier_name from tbl_supplier_payments sp
          left join tbl_bank_accounts bacc on sp.bank_acc_id=bacc.bank_acc_id
          left join tbl_suppliers sup on sp.supplier_id=sup.supplier_id
          where  sp.pay_id=?`,req.body.pay_id)).then(row=>{ 
               return row; 
           });


           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreSupplierPay',{
              msg:`You have successfully ${smg} a supplier payment `,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${smg} a supplier payment  `
              })
           }
       }
    }
})
router.post('/api/customer-payment-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
    let smg = ``
    if(req.body.action=='d'){
        saveEnum = 'd'
        smg = `disabled`
    }
    if(req.body.action=='a'){
        saveEnum = 'a'
        smg = `enabled`
    }
    if(req.body.action=='d' || req.body.action=='a'){
        let cond = {
            pay_id:req.body.pay_id
        }

        
       let [customerPayRestoreErr,customerPayDisRestoreResult] = await _p(db.update('tbl_customer_payments',{status:saveEnum},cond)).then(res=>{
           return res;
       });

       if(customerPayRestoreErr && !customerPayDisRestoreResult){
          next(customerPayRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select cp.*,bacc.bank_acc_name,cus.customer_name from tbl_customer_payments cp
          left join tbl_bank_accounts bacc on cp.bank_acc_id=bacc.bank_acc_id
          left join tbl_customers cus on cp.cus_id=cus.customer_id
          where  cp.pay_id=?`,req.body.pay_id)).then(row=>{
               return row;
           })


           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreCustomerPay',{
              msg:`You have successfully ${smg} a customer transaction `,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${smg} a customer Transaction  `
              })
           }
       }
    }
})
router.post('/api/bank-transaction-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            bank_tran_id:req.body.bank_tran_id
        }
        
       let [bankTranAccRestoreErr,tranAccDisRestoreResult] = await _p(db.update('tbl_bank_transactions',{bank_tran_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(bankTranAccRestoreErr && !tranAccDisRestoreResult){
          next(bankTranAccRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select bt.*,ba.bank_acc_name from 
          tbl_bank_transactions bt 
          left join tbl_bank_accounts ba
          on bt.bank_tran_acc_id=ba.bank_acc_id
          where  bt.bank_tran_id=?`,req.body.bank_tran_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('bankTranDisableRestoreSet',{
              msg:`You have successfully ${req.body.action} a bank transaction `,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a bank transaction `
              })
           }
       }
    }
})

router.post('/api/cash-transaction-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            cash_tran_id:req.body.cash_tran_id
        }
        
       let [cashTranAccRestoreErr,tranAccDisRestoreResult] = await _p(db.update('tbl_cash_transactions',{cash_tran_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(cashTranAccRestoreErr && !tranAccDisRestoreResult){
          next(cashTranAccRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select ct.*,ta.tran_acc_name,bac.bank_acc_name from 
          tbl_cash_transactions ct 
          left join tbl_transaction_accounts ta
          on ct.cash_tran_acc_id=ta.tran_acc_id
          left join tbl_bank_accounts bac
          on bac.bank_acc_id = ct.bank_acc_id
          where  ct.cash_tran_id=?`,req.body.cash_tran_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreCashTranAcc',{
              msg:`You have successfully ${req.body.action} a cash transaction `,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a cash transaction `
              })
           }
       }
    }
})
router.post('/api/transaction-account-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            tran_acc_id:req.body.tran_acc_id
        }
        
       let [tranAccRestoreErr,tranAccDisRestoreResult] = await _p(db.update('tbl_transaction_accounts',{tran_acc_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(tranAccRestoreErr && !tranAccDisRestoreResult){
          next(tranAccRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_transaction_accounts
          where  tran_acc_id=?`,req.body.tran_acc_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreTranAcc',{
              msg:`You have successfully ${req.body.action} a transaction account`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a transaction account`
              })
           }
       }
    }
})

router.post('/api/bank-account-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            bank_acc_id:req.body.bank_acc_id
        }
        
       let [bankAccRestoreErr,bankAccDisRestoreResult] = await _p(db.update('tbl_bank_accounts',{bank_acc_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(bankAccRestoreErr && !bankAccDisRestoreResult){
          next(bankAccRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_bank_accounts
          where  bank_acc_id=?`,req.body.bank_acc_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreBankAcc',{
              msg:`You have successfully ${req.body.action} a bank account`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a bank account`
              })
           }
       }
    }
})
router.post('/api/customer-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            customer_id:req.body.customer_id
        }
        
       let [customerRestoreErr,customerDisRestoreResult] = await _p(db.update('tbl_customers',{customer_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(customerRestoreErr && !customerDisRestoreResult){
          next(customerRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select c.*,a.area_name from 
          tbl_customers c  
          left join tbl_areas a on a.area_id = c.customer_area_id
          where  c.customer_id=?`,req.body.customer_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreCustomer',{
              msg:`You have successfully ${req.body.action} a customer`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a customer`
              })
           }
       }
    }
})

 
router.post('/api/user-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){

        let cond = {
            user_id:req.body.user_id
        }
        
       let [userRestoreErr,userDisRestoreResult] = await _p(db.update('tbl_users',{user_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(userRestoreErr && !userDisRestoreResult){
          next(userRestoreErr)
       }else{
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} user`
              })
           
       }
    }
})


router.post('/api/supplier-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            supplier_id:req.body.supplier_id
        }
        
       let [supplierRestoreErr,supplierDisRestoreResult] = await _p(db.update('tbl_suppliers',{supplier_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(supplierRestoreErr && !supplierDisRestoreResult){
          next(supplierRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_suppliers 
          where  supplier_id=?`,req.body.supplier_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreSupplier',{
              msg:`You have successfully ${req.body.action} a supplier`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a supplier`
              })
           }
       }
    }
})
router.post('/api/product-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            prod_id:req.body.prod_id
        }
        
       let [prodRestoreErr,prodDisRestoreResult] = await _p(db.update('tbl_products',{prod_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(prodRestoreErr && !prodDisRestoreResult){
          next(prodRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select p.*,c.prod_cat_name,b.prod_brand_name,
          color.prod_color_name,pn.prod_name,u.prod_unit_name,ifnull(pr.prod_avarage_rate,0)as prod_avarage_rate from 
          tbl_products p  left join tbl_product_categories c on p.prod_cat_id = c.prod_cat_id
          left join tbl_product_brands b on p.prod_brand_id = b.prod_brand_id
          left join tbl_product_colors color on p.prod_color_id = color.prod_color_id
          left join tbl_products_names pn on p.prod_name_id = pn.prod_name_id
          left join tbl_product_units u on p.prod_unit_id = u.prod_unit_id
          left join tbl_product_purchase_rate pr on p.prod_id = pr.product_id 
           and find_in_set(pr.branch_id,p.prod_branch_ids)
          where p.prod_id=?`,req.body.prod_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreProduct',{
              msg:`You have successfully ${req.body.action} a product`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a product`
              })
           }
       }
    }
})
router.post('/api/color-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            prod_color_id:req.body.prod_color_id
        }
        
       let [colorRestoreErr,colorDisRestoreResult] = await _p(db.update('tbl_product_colors',{prod_color_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(colorRestoreErr && !colorDisRestoreResult){
          next(colorRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_product_colors where prod_color_id=?`,req.body.prod_color_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreColor',{
              msg:`You have successfully ${req.body.action} a color`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a color`
              })
           }
       }
    }
})

router.post('/api/area-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            area_id:req.body.area_id
        }
        
       let [areaRestoreErr,areaDisRestoreResult] = await _p(db.update('tbl_areas',{area_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(areaRestoreErr && !areaDisRestoreResult){
          next(areaRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_areas where area_id=?`,req.body.area_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreArea',{
              msg:`You have successfully ${req.body.action} a area`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a area`
              })
           }
       }
    }
})
router.post('/api/unit-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            prod_unit_id:req.body.prod_unit_id
        }
        
       let [unitRestoreErr,unitDisRestoreResult] = await _p(db.update('tbl_product_units',{prod_unit_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(unitRestoreErr && !unitDisRestoreResult){
          next(unitRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_product_units where prod_unit_id=?`,req.body.prod_unit_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreUnit',{
              msg:`You have successfully ${req.body.action} a unit`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a unit`
              })
           }
       }
    }
})

router.post('/api/employee-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            employee_id:req.body.employee_id
        }
        
       let [employeeRestoreErr,employeeDisRestoreResult] = await _p(db.update('tbl_employees',{employee_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(employeeRestoreErr && !employeeDisRestoreResult){
          next(employeeRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select e.*,d.department_name,dg.designation_name from 
          tbl_employees e  
          left join tbl_departments d on e.employee_department_id = d.department_id
          left join tbl_designations dg on e.employee_designation_id = dg.designation_id
          where   employee_id=?`,req.body.employee_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreEmployee',{
              msg:`You have successfully ${req.body.action} a employee`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a employee`
              })
           }
       }
    }
})


router.post('/api/designation-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            designation_id:req.body.designation_id
        }
        
       let [designationRestoreErr,designationDisRestoreResult] = await _p(db.update('tbl_designations',{designation_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(designationRestoreErr && !designationDisRestoreResult){
          next(designationRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_designations where designation_id=?`,req.body.designation_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreDesignation',{
              msg:`You have successfully ${req.body.action} a designation`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a designation`
              })
           }
       }
    }
})

router.post('/api/department-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            department_id:req.body.department_id
        }
        
       let [departmentRestoreErr,departmentDisRestoreResult] = await _p(db.update('tbl_departments',{department_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(departmentRestoreErr && !departmentDisRestoreResult){
          next(departmentRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_departments where department_id=?`,req.body.department_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreDepartment',{
              msg:`You have successfully ${req.body.action} a department`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a department`
              })
           }
       }
    }
})

router.post('/api/month-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            month_id:req.body.month_id
        }
        
       let [monthRestoreErr,monthDisRestoreResult] = await _p(db.update('tbl_months',{month_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(monthRestoreErr && !monthDisRestoreResult){
          next(monthRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_months where month_id=?`,req.body.month_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreMonth',{
              msg:`You have successfully ${req.body.action} a month`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a month`
              })
           }
       }
    }
})
router.post('/api/prod-name-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            prod_name_id:req.body.prod_name_id
        }
        
       let [prodNameRestoreErr,prodNameDisRestoreResult] = await _p(db.update('tbl_products_names',{prod_name_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(prodNameRestoreErr && !prodNameDisRestoreResult){
          next(prodNameRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_products_names where prod_name_id=?`,req.body.prod_name_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreProdName',{
              msg:`You have successfully ${req.body.action} a product name`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a product name`
              })
           }
       }
    }
})
router.post('/api/brand-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            prod_brand_id:req.body.prod_brand_id
        }
        
       let [brandRestoreErr,brandDisRestoreResult] = await _p(db.update('tbl_product_brands',{prod_brand_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(brandRestoreErr && !brandDisRestoreResult){
          next(brandRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_product_brands where prod_brand_id=?`,req.body.prod_brand_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreBrand',{
              msg:`You have successfully ${req.body.action} a Brand`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a category`
              })
           }
       }
    }
})

router.post('/api/warehouse-cu',async (req,res,next)=>{
    let reqObj = req.body;
    if(reqObj.action=='create'){
        let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_warehouses where warehouse_name=?   `,[reqObj.warehouse_name])).then(row=>{
            return row;
        });
        if(checkDuplicate>0){
            res.json({
                error:true,
                message:'Warehouse Name Already Exists !!!'
            })
           return false
        }
    }


    if(reqObj.action=='update'){
        let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_warehouses where warehouse_name=? and warehouse_id<>? `,[reqObj.warehouse_name])).then(row=>{
            return row;
        });
        if(checkDuplicate>0){
            res.json({
                error:true,
                message:'Warehouse Name Already Exists !!!'
            })
           return false
        }
    }
    
    let warehouseUpdateIndex = req.body.warehouseUpdateIndex;
     let newObject = {
        warehouse_created_by:req.user.user_id,
        warehouse_updated_by:req.user.user_id,
        warehouse_status:'active',
        warehouse_created_isodt:getCurrentISODT(),
        warehouse_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)

     // Create script
     if(reqObj.action=='create'){
            delete saveObj.warehouse_id;
            delete saveObj.action;
            delete saveObj.warehouseUpdateIndex;
            delete saveObj.warehouse_updated_isodt;

        let [warehouseAddErr,warehouseAddResult] = await _p(db.insert('tbl_warehouses',saveObj)).then(res=>{
            return res;
        });
        if(warehouseAddErr && !warehouseAddResult){
           next(warehouseAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from tbl_warehouses `,warehouseAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdWarehouse',{
               msg:'You have successfully created a warehouse',
               createdRow,
               index:warehouseUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });
               res.json({
                   error:false,
                   message:'You have successfully created a warehouse'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
            warehouse_id:reqObj.warehouse_id
         }
        delete saveObj.action;
        delete saveObj.warehouseUpdateIndex;
        delete saveObj.warehouse_created_isodt;
        let [warehouseUpdateErr,warehouseUpdateResult] = await _p(db.update('tbl_warehouses',saveObj,cond)).then(res=>{
            return res;
        });
        if(warehouseUpdateErr && !warehouseUpdateResult){
           next(warehouseUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select * from tbl_warehouses `,reqObj.warehouse_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedWarehouse',{
               msg:'You have successfully update a warehouse',
               updatedRow,
               index:warehouseUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a warehouse'
               })
            }
        }
     }
     
})
router.post('/api/branch-cu',async (req,res,next)=>{
    let reqObj = req.body;
    if(reqObj.action=='create'){
        let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_branches where branch_name=? `,[reqObj.branch_name])).then(row=>{
            return row;
        });
        if(checkDuplicate>0){
            res.json({
                error:true,
                message:'Branch Name Already Exists !!!'
            })
           return false
        }
    }


    if(reqObj.action=='update'){
        let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_branches where branch_name=?  and branch_id<>?`,[reqObj.branch_name,reqObj.branch_id])).then(row=>{
            return row;
        });
        if(checkDuplicate>0){
            res.json({
                error:true,
                message:'Branch Name Already Exists !!!'
            })
           return false
        }
    }
    



    let branchUpdateIndex = req.body.branchUpdateIndex;
     let newObject = {
        branch_created_by:req.user.user_id,
        branch_updated_by:req.user.user_id,
        branch_status:'active',
        branch_created_isodt:getCurrentISODT(),
        branch_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)


     

     // Create script
     if(reqObj.action=='create'){
            delete saveObj.branch_id;
            delete saveObj.action;
            delete saveObj.branchUpdateIndex;
            delete saveObj.branch_updated_isodt;

        let [branchAddErr,branchAddResult] = await _p(db.insert('tbl_branches',saveObj)).then(res=>{
            return res;
        });
        if(branchAddErr && !branchAddResult){
           next(branchAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from tbl_branches where branch_id=?`,branchAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdBranch',{
               msg:'You have successfully created a branch',
               createdRow,
               index:branchUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });
               res.json({
                   error:false,
                   message:'You have successfully created a branch'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
            branch_id:reqObj.branch_id
         }
        delete saveObj.action;
        delete saveObj.branchUpdateIndex;
        delete saveObj.branch_created_isodt;
        let [branchUpdateErr,branchUpdateResult] = await _p(db.update('tbl_branches',saveObj,cond)).then(res=>{
            return res;
        });
        if(branchUpdateErr && !branchUpdateResult){
           next(branchUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select * from tbl_branches where branch_id=?`,reqObj.branch_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedBranch',{
               msg:'You have successfully update a branch',
               updatedRow,
               index:branchUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a branch'
               })
            }
        }
     }
     
})

router.post('/api/category-cu',async (req,res,next)=>{
    let reqObj = req.body;

    if(reqObj.action =='create'){
        let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_product_categories where prod_cat_name=? and prod_cat_branch_id=? `,[reqObj.prod_cat_name,req.user.user_branch_id])).then(row=>{
            return row;
        });
        if(checkDuplicate>0){
            res.json({
                error:true,
                message:'Category Name Already Exists !!!'
            })
           return false
        }
    }
    if(reqObj.action =='update'){
        let [checkDuplicateErr,checkDuplicate] =  await _p(db.countRows(`select * from tbl_product_categories where prod_cat_name=? and prod_cat_id<>? and prod_cat_branch_id=?  `,[reqObj.prod_cat_name,reqObj.prod_cat_id,req.user.user_branch_id])).then(row=>{
            return row;
        });
        if(checkDuplicate>0){
            res.json({
                error:true,
                message:'Category Name Already Exists !!!'
            })
             return false
        }
    }


    let catUpdateIndex = req.body.catUpdateIndex;
     let newObject = {
        prod_cat_branch_id:req.user.user_branch_id,
        prod_cat_created_by:req.user.user_id,
        prod_cat_updated_by:req.user.user_id,
        prod_cat_status:'active',
        prod_cat_created_isodt:getCurrentISODT(),
        prod_cat_updated_isodt:getCurrentISODT()
     }
     let saveObj = Object.assign(reqObj,newObject)

     // Create script
     if(reqObj.action=='create'){
            delete saveObj.prod_cat_id;
            delete saveObj.action;
            delete saveObj.catUpdateIndex;
            delete saveObj.prod_cat_updated_isodt;

        let [categoryAddErr,categoryAddResult] = await _p(db.insert('tbl_product_categories',saveObj)).then(res=>{
            return res;
        });
        if(categoryAddErr && !categoryAddResult){
           next(categoryAddErr)
        }else{
           let [createdRowErr,createdRow] =  await _p(db.query(`select * from tbl_product_categories where prod_cat_id=?`,categoryAddResult.insertId)).then(row=>{
                return row;
            })
            if(createdRowErr && !createdRow){
               next(createdRowErr);
            }else{
               req.app.io.emit('createdCategory',{
               msg:'You have successfully created a category',
               createdRow,
               index:catUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              
            });
               res.json({
                   error:false,
                   message:'You have successfully created a category'
               })
            }
        }
     }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
             prod_cat_id:reqObj.prod_cat_id
         }
        delete saveObj.action;
        delete saveObj.catUpdateIndex;
        delete saveObj.prod_cat_created_isodt;
        let [categoryUpdateErr,categoryUpdateResult] = await _p(db.update('tbl_product_categories',saveObj,cond)).then(res=>{
            return res;
        });
        if(categoryUpdateErr && !categoryUpdateResult){
           next(categoryUpdateErr)
        }else{
           let [updatedRowErr,updatedRow] =  await _p(db.query(`select * from tbl_product_categories where prod_cat_id=?`,reqObj.prod_cat_id)).then(row=>{
                return row;
            })
            if(updatedRowErr && !updatedRow){
               next(updatedRowErr);
            }else{
               req.app.io.emit('updatedCategory',{
               msg:'You have successfully update a category',
               updatedRow,
               index:catUpdateIndex,
               user_branch_id: req.user.user_branch_id,
              });
               res.json({
                   error:false,
                   message:'You have successfully updated a category'
               })
            }
        }
     }
     
})

router.post('/api/category-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            prod_cat_id:req.body.prod_cat_id
        }
        
       let [categoryRestoreErr,categoryDisRestoreResult] = await _p(db.update('tbl_product_categories',{prod_cat_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(categoryRestoreErr && !categoryDisRestoreResult){
          next(categoryRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_product_categories where prod_cat_id=?`,req.body.prod_cat_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreCategory',{
              msg:`You have successfully ${req.body.action} a category`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a category`
              })
           }
       }
    }
})

router.post('/api/branch-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            branch_id:req.body.branch_id
        }
        
       let [branchRestoreErr,branchDisRestoreResult] = await _p(db.update('tbl_branches',{branch_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(branchRestoreErr && !branchDisRestoreResult){
          next(branchRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_branches where branch_id=?`,req.body.branch_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreBranch',{
              msg:`You have successfully ${req.body.action} a branch`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a branch`
              })
           }
       }
    }
})

router.post('/api/warehouse-disable-restore',async (req,res,next)=>{
    let saveEnum = "";
   
    if(req.body.action=='disable'){
        saveEnum = 'deactivated'
    }
    if(req.body.action=='restore'){
        saveEnum = 'active'
    }
    if(req.body.action=='disable' || req.body.action=='restore'){
        let cond = {
            warehouse_id:req.body.warehouse_id
        }
        
       let [warehouseRestoreErr,warehouseDisRestoreResult] = await _p(db.update('tbl_warehouses',{warehouse_status:saveEnum},cond)).then(res=>{
           return res;
       });
       if(warehouseRestoreErr && !warehouseDisRestoreResult){
          next(warehouseRestoreErr)
       }else{
          let [disableRestoreErr,disableRestoreRow] =  await _p(db.query(`select * from tbl_warehouses `,req.body.warehouse_id)).then(row=>{
               return row;
           })
           if(disableRestoreErr && !disableRestoreRow){
              next(disableRestoreErr);
           }else{
              req.app.io.emit('disableRestoreWarehouse',{
              msg:`You have successfully ${req.body.action} a warehouse`,
              disableRestoreRow,
              index:req.body.index,
              user_branch_id: req.user.user_branch_id,
             
            });
              res.json({
                  error:false,
                  message:`You have successfully ${req.body.action} a warehouse`
              })
           }
       }
    }
});






module.exports = router;