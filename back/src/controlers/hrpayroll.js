const router = require('express').Router();
const _p      = require('../utils/promise_error');
const  {Database}   = require('../utils/Database');
let    db = new Database();








router.post('/api/save-salary-payment',async(req,res,next)=>{
    var payload = req.body.payload;
   
    if(payload.paymentAction=='create'){
        let savePayload = {
            employee_id: payload.employee_id,
            month_id: payload.month_id,
            payment_isodt: payload.payment_date,
            payment_amount: payload.payment_amount,
            payment_note: payload.payment_note,
            deduction_amount: payload.deduction_amount,
            payment_branch_id : req.user.user_branch_id,
            tran_method: payload.tran_method,
            bank_acc_id: payload.bank_acc_id
        }
        
        let [paymentSaveErr,paymentSave] = await _p(db.insert(`tbl_employee_payments`,savePayload)).then(res=>{
            return res;
        });

        if(paymentSaveErr && !paymentSave){
            return next(paymentSaveErr);
        }else{
            res.json({error:false,message:'Salary Payment Entry successfully'});
        }
    }

    if(payload.paymentAction=='update'){
      
        let  paymentId =  payload.payment_id;
        let savePayload = {
            employee_id: payload.employee_id,
            month_id: payload.month_id,
            payment_isodt: payload.payment_date,
            payment_amount: payload.payment_amount,
            payment_note: payload.payment_note,
            deduction_amount: payload.deduction_amount,
            tran_method: payload.tran_method,
            bank_acc_id: payload.bank_acc_id
        }
       
        let  [paymentSaveErr,paymentSave] = await _p(db.update('tbl_employee_payments',savePayload,{payment_id:paymentId}).then((result)=>{
            return result;
        }))
        

        if(paymentSaveErr && !paymentSave){
            return next(paymentSaveErr); 
        }else{ 
            res.json({error:false,message:'Salary payment update successfully'});
        }
    }
})


router.post('/api/delete-salary-payment',async(req,res,next)=>{
    let[paymentErr,payment] = await _p(db.delete(`tbl_employee_payments`,{payment_id:req.body.payment_id}).then(res=>{
        return res;
    }));
    if(paymentErr && !payment){
        return next(paymentErr);
    }else{
        res.json({error:false,message:'Salary Payment Delete Successfully.'})
    }
})

router.post('/api/get-salary-report',async (req,res,next)=>{
    let payload = req.body.payLoad;
    let clauses = ``;
    if(payload.type != undefined && payload.type==`payment records`){
        
        if(payload.employeeId != null){
            clauses += ` and epay.employee_id= ${payload.employeeId} `
        }
        if(payload.monthId != null){
            clauses += ` and epay.month_id= ${payload.monthId} `
        }

        if(payload.fromDate != undefined && payload.toDate != undefined){
            clauses += ` and epay.payment_isodt between '${payload.fromDate}' and '${payload.toDate}' `
        }


    }
    let sumgroup = ``
    if(payload.type != undefined && payload.type==`salary summary`){
        if(payload.monthId != null){
             sumgroup += ` sum(epay.payment_amount)  payment_amount, 
                           sum(epay.deduction_amount)  deduction_amount, `
            clauses += ` and epay.month_id= ${payload.monthId}  `
        }
    }
    let [reportsErr,reports] = await _p(db.query(`select epay.*,emp.employee_code,emp.employee_name,d.department_name,m.month_name,
    ${sumgroup}
    de.designation_name
    from tbl_employee_payments epay
    left join tbl_employees emp on emp.employee_id = epay.employee_id
    left join tbl_departments d on d.department_id  = emp.employee_department_id 
    left join tbl_designations de on de.designation_id  = emp.employee_designation_id
    left join tbl_months m on m.month_id  = epay.month_id
    where epay.payment_branch_id=?  ${clauses}
    `,[req.user.user_branch_id]).then(res=>{
        return res;
    }));
    if(reportsErr && !reports){
        return next(reportsErr);
    }else{
        res.json(reports);
    }
})


router.get('/api/get-salary-payments',async(req,res,next)=>{
      let[paymentsErr,payments] = await _p(db.query(`select epay.*,emp.employee_name,emp.employee_code,m.month_name,bac.bank_acc_name
      from tbl_employee_payments epay
      left join tbl_employees emp on emp.employee_id = epay.employee_id
      left join tbl_months m on m.month_id = epay.month_id 
      left join tbl_bank_accounts bac
      on bac.bank_acc_id = epay.bank_acc_id
      where epay.payment_branch_id=? 
      order by epay.payment_id  desc
      `,[req.user.user_branch_id]).then(res=>{
          return res;
      }));
      if(paymentsErr && !payments){
          return next(paymentsErr);
      }else{
          res.json(payments)
      }
})




module.exports = router;