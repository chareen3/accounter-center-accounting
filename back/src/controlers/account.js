const router = require('express').Router();
const _p      = require('../utils/promise_error');
const  {Database}   = require('../utils/Database');
let    db = new Database(); 



router.post(`/api/get-daily-ledger`,async(req,res,next)=>{
    let dateTimeFrom = req.body.fromDate;
    let dateTimeTo = req.body.toDate;
    
  let [bank_init_bErr,getBankInitB] =   await _p(db.selectSingleRow(`select ifnull(sum(bank_acc_init_balance),0.00) as bank_init_balance from tbl_bank_accounts where bank_acc_branch_id=${req.user.user_branch_id} and bank_acc_status='active' `).then((res)=>{
      return res;
  }));


 
    let [ledgerErr,ledger] = await  _p(db.query(`
        select 
             'a' as sequence,
             pm.pur_created_isodt as dateTime,
             concat('Product Purchased Paid  to  ',s.supplier_name) as description,
             ifnull(pm.pur_paid_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from tbl_purchase_master pm 
             left join tbl_suppliers s on s.supplier_id = pm.pur_supplier_id
             where 
             pm.pur_branch_id = ${req.user.user_branch_id} 
             and pm.pur_status='a'
            
            
             UNION
             select  'b' as sequence,
             mpm.created_isodt as dateTime,
             concat('Material Purchased Paid  to  ',s.supplier_name) as description,
             ifnull(mpm.paid,0.00) as debitAmount,
             0.00 as creditAmount
             from  tbl_material_purchase mpm 
             left join tbl_suppliers s on s.supplier_id = mpm.supplier_id
             where 
             mpm.branch_id = ${req.user.user_branch_id} 
             and mpm.status='a'
            

             UNION
             select 'c' as sequence,
             sm.sale_created_isodt as dateTime,
             concat('Sales paid  from  ',c.customer_name) as description,
             0.00 as debitAmount,
             ifnull(sm.sale_paid_amount,0.00) as creditAmount
             from   tbl_sales_master sm 
             left join tbl_customers c on c.customer_id = sm.sale_customer_id
             where
             sm.sale_branch_id = ${req.user.user_branch_id} 
             and sm.sale_status='a'
            

             UNION
             select 'd' as sequence,
             ct.cash_tran_created_isodt as dateTime,
             concat('Others Transaction Payment for   ',tacc.tran_acc_name) as description,
             ifnull(ct.cash_tran_out_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from   tbl_cash_transactions ct 
             left join tbl_transaction_accounts tacc on tacc.tran_acc_id  = ct.cash_tran_acc_id
             where 
             ct.cash_tran_type = 'payment' 
             and ct.cash_tran_branch_id = ${req.user.user_branch_id} 
             and ct.cash_tran_status='active'
             
             UNION
             select 'e' as sequence,
             ct.cash_tran_created_isodt as dateTime,
             concat('Others Transaction Received for   ',tacc.tran_acc_name) as description,
             0.00 as debitAmount,
             ifnull(ct.cash_tran_in_amount,0.00) as creditAmount
             from   tbl_cash_transactions ct 
             left join tbl_transaction_accounts tacc on tacc.tran_acc_id  = ct.cash_tran_acc_id
             where 
             ct.cash_tran_type = 'receive'
             and ct.cash_tran_branch_id = ${req.user.user_branch_id} 
             and ct.cash_tran_status='active'
             

             UNION
             select 'f' as sequence,
             spay.created_isodt as dateTime,
             concat('Received from supplier - ',s.supplier_name) as description,
             0.00 as debitAmount,
             ifnull(spay.pay_amount,0.00) as creditAmount
             from tbl_supplier_payments spay 
             left join tbl_suppliers s on s.supplier_id = spay.supplier_id
             where 
             spay.pay_type = 'receive' 
             and spay.branch_id = ${req.user.user_branch_id} 
             and spay.status='a'
             
             UNION
             select 'g' as sequence,
             spay.created_isodt as dateTime,
             concat('Payment to supplier -  ',s.supplier_name) as description,
             ifnull(spay.pay_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from tbl_supplier_payments spay 
             left join tbl_suppliers s on s.supplier_id = spay.supplier_id
             where 
             spay.pay_type = 'payment' 
             and spay.branch_id = ${req.user.user_branch_id} 
             and spay.status='a'
             

             UNION
             select 'h' as sequence,
             cpay.created_isodt as dateTime,
             concat('Payment to  customer -  ',c.customer_name) as description,
             ifnull(cpay.pay_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from   tbl_customer_payments cpay 
             left join tbl_customers c on c.customer_id = cpay.cus_id
             where 
             cpay.pay_type = 'payment'
             and cpay.branch_id = ${req.user.user_branch_id} 
             and cpay.status='a'
            
            
             UNION
             select 'i' as sequence,
             cpay.created_isodt as dateTime,
             concat('Received from customer -  ',c.customer_name) as description,
             0.00 as debitAmount,
             ifnull(cpay.pay_amount,0.00) as creditAmount
             from   tbl_customer_payments cpay 
             left join tbl_customers c on c.customer_id = cpay.cus_id
             where 
             cpay.pay_type = 'receive'
             and cpay.branch_id = ${req.user.user_branch_id} 
             and cpay.status='a'
             

            
             
             UNION
             select 'l' as sequence,
             epay.payment_isodt as dateTime,
             concat('Salary Payment to Employee ') as description,
             ifnull(epay.payment_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from tbl_employee_payments epay
             where 
             epay.payment_branch_id = ${req.user.user_branch_id}


             UNION
             select 'm' as sequence,
             cdw.tran_created_isodt as dateTime,
             concat('Cash Deposit ') as description,
             0.00 as debitAmount,
             ifnull(cdw.tran_amount,0.00) as creditAmount
             from tbl_cash_deposit_withdraw_trans cdw
             where 
             cdw.tran_branch_id = ${req.user.user_branch_id}
             and  cdw.tran_type='deposit'
             and  cdw.tran_status='a'

             UNION
             select 'n' as sequence,
             cdw.tran_created_isodt as dateTime,
             concat('Cash Withdraw ') as description,
             ifnull(cdw.tran_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from tbl_cash_deposit_withdraw_trans cdw
             where 
             cdw.tran_branch_id = ${req.user.user_branch_id}
             and  cdw.tran_type='withdraw'
             and  cdw.tran_status='a'

             UNION  
             select 'o' as sequence,
             sm.service_created_isodt as dateTime,
             concat('Service -   ',c.customer_name) as description,
             0.00 as debitAmount,
             ifnull(sm.service_paid_amount,0.00) as creditAmount
             from   tbl_service_master sm 
             left join tbl_customers c on c.customer_id = sm.service_customer_id
             where
             sm.service_branch_id = ${req.user.user_branch_id} 
             and sm.service_status='a'

             UNION 
             select 'p' as sequence,
             pm.pur_ser_created_isodt as dateTime,
             concat('Service Item Expense -   ',s.supplier_name) as description,
             ifnull(pm.pur_ser_paid_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from tbl_pur_ser_master pm 
             left join tbl_suppliers s on s.supplier_id = pm.pur_ser_supplier_id
             where 
             pm.pur_ser_branch_id = ${req.user.user_branch_id} 
             and pm.pur_ser_status='a'


           
            
            
             
            order by dateTime asc

    `).then(res=>{
        return res;
    }));



    if(ledgerErr) return next(ledgerErr);

    let opening_balance = getBankInitB.bank_init_balance;
    let closing_balance  = 0

    let ledgerResult = ledger.map((value,index) => {
        let lastBalance  = index == 0 ? opening_balance : ledger[index - 1].balance;
        value.balance = (parseFloat(lastBalance) + parseFloat(value.creditAmount))-(parseFloat(value.debitAmount));
        return value;
    });

    

    if((dateTimeFrom != undefined && dateTimeTo != undefined) && (dateTimeFrom != null && dateTimeTo != null) && ledgerResult.length > 0){
       let prevTrans =  ledgerResult.filter((payment)=>{
            return payment.dateTime < dateTimeFrom
        });

        opening_balance =  prevTrans.length > 0 ? prevTrans[prevTrans.length - 1].balance : opening_balance;
        
         ledgerResult =  ledgerResult.filter((payment)=>{
            return payment.dateTime >= dateTimeFrom && payment.dateTime <= dateTimeTo
        });

        closing_balance = ledgerResult.length > 0 ? ledgerResult[ledgerResult.length - 1].balance : 0;

    }
    
    res.json({ledger:ledgerResult,opening_balance,closing_balance});
});

router.post(`/api/get-cash-ledger`,async(req,res,next)=>{
    let dateTimeFrom = req.body.fromDate;
    let dateTimeTo = req.body.toDate;

 
    let [ledgerErr,ledger] = await  _p(db.query(`
        select 
             'a' as sequence,
             pm.pur_created_isodt as dateTime,
             concat('Product Purchased Paid  to  ',s.supplier_name) as description,
             ifnull(pm.pur_paid_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from tbl_purchase_master pm 
             left join tbl_suppliers s on s.supplier_id = pm.pur_supplier_id
             where pm.pur_pay_method = 'cash' 
             and pm.pur_branch_id = ${req.user.user_branch_id} 
             and pm.pur_status='a'
            
            
             UNION
             select  'b' as sequence,
             mpm.created_isodt as dateTime,
             concat('Material Purchased Paid  to  ',s.supplier_name) as description,
             ifnull(mpm.paid,0.00) as debitAmount,
             0.00 as creditAmount
             from  tbl_material_purchase mpm 
             left join tbl_suppliers s on s.supplier_id = mpm.supplier_id
             where mpm.pay_method = 'cash' 
             and mpm.branch_id = ${req.user.user_branch_id} 
             and mpm.status='a'
            

             UNION
             select 'c' as sequence,
             sm.sale_created_isodt as dateTime,
             concat('Sales paid  from  ',c.customer_name) as description,
             0.00 as debitAmount,
             ifnull(sm.sale_paid_amount,0.00) as creditAmount
             from   tbl_sales_master sm 
             left join tbl_customers c on c.customer_id = sm.sale_customer_id
             where sm.sale_pay_method = 'cash' 
             and sm.sale_branch_id = ${req.user.user_branch_id} 
             and sm.sale_status='a'
            

             UNION
             select 'd' as sequence,
             ct.cash_tran_created_isodt as dateTime,
             concat('Others Transaction Payment for   ',tacc.tran_acc_name) as description,
             ifnull(ct.cash_tran_out_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from   tbl_cash_transactions ct 
             left join tbl_transaction_accounts tacc on tacc.tran_acc_id  = ct.cash_tran_acc_id
             where ct.cash_tran_method = 'cash'
             and ct.cash_tran_type = 'payment' 
             and ct.cash_tran_branch_id = ${req.user.user_branch_id} 
             and ct.cash_tran_status='active'
             
             UNION
             select 'e' as sequence,
             ct.cash_tran_created_isodt as dateTime,
             concat('Others Transaction Received for   ',tacc.tran_acc_name) as description,
             0.00 as debitAmount,
             ifnull(ct.cash_tran_in_amount,0.00) as creditAmount
             from   tbl_cash_transactions ct 
             left join tbl_transaction_accounts tacc on tacc.tran_acc_id  = ct.cash_tran_acc_id
             where ct.cash_tran_method = 'cash'
             and ct.cash_tran_type = 'receive'
             and ct.cash_tran_branch_id = ${req.user.user_branch_id} 
             and ct.cash_tran_status='active'
             

             UNION
             select 'f' as sequence,
             spay.created_isodt as dateTime,
             concat('Received from supplier - ',s.supplier_name) as description,
             0.00 as debitAmount,
             ifnull(spay.pay_amount,0.00) as creditAmount
             from tbl_supplier_payments spay 
             left join tbl_suppliers s on s.supplier_id = spay.supplier_id
             where spay.pay_method = 'cash'
             and spay.pay_type = 'receive' 
             and spay.branch_id = ${req.user.user_branch_id} 
             and spay.status='a'
             
             UNION
             select 'g' as sequence,
             spay.created_isodt as dateTime,
             concat('Payment to supplier -  ',s.supplier_name) as description,
             ifnull(spay.pay_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from tbl_supplier_payments spay 
             left join tbl_suppliers s on s.supplier_id = spay.supplier_id
             where spay.pay_method = 'cash' 
             and spay.pay_type = 'payment' 
             and spay.branch_id = ${req.user.user_branch_id} 
             and spay.status='a'
             

             UNION
             select 'h' as sequence,
             cpay.created_isodt as dateTime,
             concat('Payment to  customer -  ',c.customer_name) as description,
             ifnull(cpay.pay_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from   tbl_customer_payments cpay 
             left join tbl_customers c on c.customer_id = cpay.cus_id
             where cpay.pay_method = 'cash'
             and cpay.pay_type = 'payment'
             and cpay.branch_id = ${req.user.user_branch_id} 
             and cpay.status='a'
            
            
             UNION
             select 'i' as sequence,
             cpay.created_isodt as dateTime,
             concat('Received from customer -  ',c.customer_name) as description,
             0.00 as debitAmount,
             ifnull(cpay.pay_amount,0.00) as creditAmount
             from   tbl_customer_payments cpay 
             left join tbl_customers c on c.customer_id = cpay.cus_id
             where cpay.pay_method = 'cash'
             and cpay.pay_type = 'receive'
             and cpay.branch_id = ${req.user.user_branch_id} 
             and cpay.status='a'
             

             UNION
             select 'j' as sequence,
             bt.bank_tran_created_isodt as dateTime,
             concat('Deposit  Bank Account') as description,
             ifnull(bt.bank_tran_in_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from   tbl_bank_transactions bt 
             where 
             bt.bank_tran_type = 'deposit'
             and bt.bank_tran_branch_id = ${req.user.user_branch_id} 
             and bt.bank_tran_status='active'
             

             UNION
             select 'k' as sequence,
             bt.bank_tran_created_isodt as dateTime,
             concat('Withdraw  from this Bank Account') as description,
             0.00 as debitAmount,
             ifnull(bt.bank_tran_out_amount,0.00) as creditAmount
             from   tbl_bank_transactions bt 
             where 
             
             bt.bank_tran_type = 'withdraw'
             and bt.bank_tran_branch_id = ${req.user.user_branch_id} 
             and bt.bank_tran_status='active'
            
             
             UNION
             select 'l' as sequence,
             epay.payment_isodt as dateTime,
             concat('Salary Payment to Employee ') as description,
             ifnull(epay.payment_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from tbl_employee_payments epay
             where 
             epay.payment_branch_id = ${req.user.user_branch_id}
             and  epay.tran_method='cash'

             UNION
             select 'm' as sequence,
             cdw.tran_created_isodt as dateTime,
             concat('Cash Deposit ') as description,
             0.00 as debitAmount,
             ifnull(cdw.tran_amount,0.00) as creditAmount
             from tbl_cash_deposit_withdraw_trans cdw
             where 
             cdw.tran_branch_id = ${req.user.user_branch_id}
             and  cdw.tran_type='deposit'
             and  cdw.tran_status='a'

             UNION
             select 'n' as sequence,
             cdw.tran_created_isodt as dateTime,
             concat('Cash Withdraw ') as description,
             ifnull(cdw.tran_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from tbl_cash_deposit_withdraw_trans cdw
             where 
             cdw.tran_branch_id = ${req.user.user_branch_id}
             and  cdw.tran_type='withdraw'
             and  cdw.tran_status='a'

             UNION  
             select 'o' as sequence,
             sm.service_created_isodt as dateTime,
             concat('Service -   ',c.customer_name) as description,
             0.00 as debitAmount,
             ifnull(sm.service_paid_amount,0.00) as creditAmount
             from   tbl_service_master sm 
             left join tbl_customers c on c.customer_id = sm.service_customer_id
             where
             sm.service_branch_id = ${req.user.user_branch_id} 
             and sm.service_status='a'
             and sm.service_pay_method = 'cash'

             UNION 
             select 'p' as sequence,
             pm.pur_ser_created_isodt as dateTime,
             concat('Service Item Expense -   ',s.supplier_name) as description,
             ifnull(pm.pur_ser_paid_amount,0.00) as debitAmount,
             0.00 as creditAmount
             from tbl_pur_ser_master pm 
             left join tbl_suppliers s on s.supplier_id = pm.pur_ser_supplier_id
             where 
             pm.pur_ser_branch_id = ${req.user.user_branch_id} 
             and pm.pur_ser_status='a'
             and pm.pur_ser_pay_method = 'cash'

             UNION 
             select 'q' as sequence,
             sr.sale_return_created_isodt as dateTime,
             concat('Sales Return    ') as description,
             0.00 as debitAmount,
             ifnull(sr.sale_return_amount,0.00) as creditAmount
             from tbl_sales_return sr 
             where 
             sr.sale_return_branch_id = ${req.user.user_branch_id} 

            
            
             
            order by dateTime asc

    `).then(res=>{
        return res;
    }));



    if(ledgerErr) return next(ledgerErr);

    let opening_balance = 0;
    let closing_balance  = 0

    let ledgerResult = ledger.map((value,index) => {
        let lastBalance  = index == 0 ? 0 : ledger[index - 1].balance;
        value.balance = (parseFloat(lastBalance) + parseFloat(value.creditAmount))-(parseFloat(value.debitAmount));
        return value;
    });

    

    if((dateTimeFrom != undefined && dateTimeTo != undefined) && (dateTimeFrom != null && dateTimeTo != null) && ledgerResult.length > 0){
       let prevTrans =  ledgerResult.filter((payment)=>{
            return payment.dateTime < dateTimeFrom
        });

        opening_balance =  prevTrans.length > 0 ? prevTrans[prevTrans.length - 1].balance : opening_balance;
        
         ledgerResult =  ledgerResult.filter((payment)=>{
            return payment.dateTime >= dateTimeFrom && payment.dateTime <= dateTimeTo
        });

        closing_balance = ledgerResult.length > 0 ? ledgerResult[ledgerResult.length - 1].balance : 0;

    }
    
    res.json({ledger:ledgerResult,opening_balance,closing_balance});
});

router.post(`/api/get-bank-ledger`,async(req,res,next)=>{
    let bankId = req.body.bankId;
    let dateTimeFrom = req.body.fromDate;
    let dateTimeTo = req.body.toDate;

    let [bankErr,bank]  = await _p(db.selectSingleRow(`select ifnull(bank_acc_init_balance,0.00) as opening_balance from  tbl_bank_accounts where bank_acc_id =${bankId}`).then(res=>{
        return res;
    }));



    let [ledgerErr,ledger] = await  _p(db.query(`
        select 
             'a' as sequence,
             pm.pur_created_isodt as dateTime,
             concat('Product Purchased Paid  to  ',s.supplier_name) as description,
             pm.pur_paid_amount as debitAmount,
             0.00 as creditAmount
             from tbl_purchase_master pm 
             left join tbl_suppliers s on s.supplier_id = pm.pur_supplier_id
             where pm.pur_pay_method = 'bank' 
             and pm.pur_bank_id=${bankId}
             and pm.pur_branch_id = ${req.user.user_branch_id} 
             and pm.pur_status='a'
            
            
             UNION
             select  'b' as sequence,
             mpm.created_isodt as dateTime,
             concat('Material Purchased Paid  to  ',s.supplier_name) as description,
             mpm.paid as debitAmount,
             0.00 as creditAmount
             from  tbl_material_purchase mpm 
             left join tbl_suppliers s on s.supplier_id = mpm.supplier_id
             where mpm.pay_method = 'bank' 
             and mpm.bank_id=${bankId}
             and mpm.branch_id = ${req.user.user_branch_id} 
             and mpm.status='a'
           

             UNION
             select 'c' as sequence,
             sm.sale_created_isodt as dateTime,
             concat('Sales paid  from  ',c.customer_name) as description,
             0.00 as debitAmount,
             sm.sale_paid_amount as creditAmount
             from   tbl_sales_master sm 
             left join tbl_customers c on c.customer_id = sm.sale_customer_id
             where sm.sale_pay_method = 'bank' 
             and sm.sale_bank_id=${bankId}
             and sm.sale_branch_id = ${req.user.user_branch_id} 
             and sm.sale_status='a'
            

             UNION
             select 'd' as sequence,
             ct.cash_tran_created_isodt as dateTime,
             concat('Others Transaction Payment for   ',tacc.tran_acc_name) as description,
             ct.cash_tran_out_amount as debitAmount,
             0.00 as creditAmount
             from   tbl_cash_transactions ct 
             left join tbl_transaction_accounts tacc on tacc.tran_acc_id  = ct.cash_tran_acc_id
             where ct.cash_tran_method = 'bank'
             and ct.cash_tran_type = 'payment' 
             and ct.bank_acc_id=${bankId}
             and ct.cash_tran_branch_id = ${req.user.user_branch_id} 
             and ct.cash_tran_status='active'
             
             UNION
             select 'e' as sequence,
             ct.cash_tran_created_isodt as dateTime,
             concat('Others Transaction Received for   ',tacc.tran_acc_name) as description,
             0.00 as debitAmount,
             ct.cash_tran_in_amount as creditAmount
             from   tbl_cash_transactions ct 
             left join tbl_transaction_accounts tacc on tacc.tran_acc_id  = ct.cash_tran_acc_id
             where ct.cash_tran_method = 'bank'
             and ct.cash_tran_type = 'receive'
             and ct.bank_acc_id=${bankId}
             and ct.cash_tran_branch_id = ${req.user.user_branch_id} 
             and ct.cash_tran_status='active'
             

             UNION
             select 'f' as sequence,
             spay.created_isodt as dateTime,
             concat('Received from supplier - ',s.supplier_name) as description,
             0.00 as debitAmount,
             spay.pay_amount as creditAmount
             from tbl_supplier_payments spay 
             left join tbl_suppliers s on s.supplier_id = spay.supplier_id
             where spay.pay_method = 'bank'
             and spay.pay_type = 'receive' 
             and spay.bank_acc_id=${bankId}
             and spay.branch_id = ${req.user.user_branch_id} 
             and spay.status='a'
           
             UNION
             select 'g' as sequence,
             spay.created_isodt as dateTime,
             concat('Payment to supplier -  ',s.supplier_name) as description,
             spay.pay_amount as debitAmount,
             0.00 as creditAmount
             from tbl_supplier_payments spay 
             left join tbl_suppliers s on s.supplier_id = spay.supplier_id
             where spay.pay_method = 'bank' 
             and spay.pay_type = 'payment' 
             and spay.bank_acc_id=${bankId}
             and spay.branch_id = ${req.user.user_branch_id} 
             and spay.status='a'
             

             UNION
             select 'h' as sequence,
             cpay.created_isodt as dateTime,
             concat('Payment to  customer -  ',c.customer_name) as description,
             cpay.pay_amount as debitAmount,
             0.00 as creditAmount
             from   tbl_customer_payments cpay 
             left join tbl_customers c on c.customer_id = cpay.cus_id
             where cpay.pay_method = 'bank'
             and cpay.pay_type = 'payment'
             and cpay.bank_acc_id=${bankId}
             and cpay.branch_id = ${req.user.user_branch_id} 
             and cpay.status='a'
            
            
             UNION
             select 'i' as sequence,
             cpay.created_isodt as dateTime,
             concat('Received from customer -  ',c.customer_name) as description,
             0.00 as debitAmount,
             cpay.pay_amount as creditAmount
             from   tbl_customer_payments cpay 
             left join tbl_customers c on c.customer_id = cpay.cus_id
             where cpay.pay_method = 'bank'
             and cpay.pay_type = 'receive'
             and cpay.bank_acc_id=${bankId}
             and cpay.branch_id = ${req.user.user_branch_id} 
             and cpay.status='a'
            

             UNION
             select 'j' as sequence,
             bt.bank_tran_created_isodt as dateTime,
             concat('Deposit to this Bank Account') as description,
             0.00 as debitAmount,
             bt.bank_tran_in_amount as creditAmount
             from   tbl_bank_transactions bt 
             where 
             bt.bank_tran_type = 'deposit'
             and bt.bank_tran_acc_id=${bankId}
             and bt.bank_tran_branch_id = ${req.user.user_branch_id} 
             and bt.bank_tran_status='active'
          

             UNION
             select 'k' as sequence,
             bt.bank_tran_created_isodt as dateTime,
             concat('Withdraw  from this Bank Account') as description,
             bt.bank_tran_out_amount as debitAmount,
             0.00 as creditAmount
             from   tbl_bank_transactions bt 
             where 
             
             bt.bank_tran_type = 'withdraw'
             and bt.bank_tran_acc_id=${bankId}
             and bt.bank_tran_branch_id = ${req.user.user_branch_id} 
             and bt.bank_tran_status='active'
            
             
             UNION
             select 'l' as sequence,
             epay.payment_isodt as dateTime,
             concat('Salary Payment to Employee ') as description,
             epay.payment_amount as debitAmount,
             0.00 as creditAmount
             from tbl_employee_payments epay
             where 
             epay.payment_branch_id = ${req.user.user_branch_id}
             and  epay.bank_acc_id=${bankId}


             UNION
             select 'm' as sequence,
             sm.service_created_isodt as dateTime,
             concat('Service paid -   ',c.customer_name) as description,
             0.00 as debitAmount,
             sm.service_paid_amount as creditAmount
             from   tbl_service_master sm 
             left join tbl_customers c on c.customer_id = sm.service_customer_id
             where sm.service_pay_method = 'bank' 
             and sm.service_bank_id=${bankId}
             and sm.service_branch_id = ${req.user.user_branch_id} 
             and sm.service_status='a'

             UNION 
             select 
             'p' as sequence,
             pm.pur_ser_created_isodt as dateTime,
             concat('Service Item Expense -   ',s.supplier_name) as description,
             pm.pur_ser_paid_amount as debitAmount,
             0.00 as creditAmount
             from tbl_pur_ser_master pm 
             left join tbl_suppliers s on s.supplier_id = pm.pur_ser_supplier_id
             where pm.pur_ser_pay_method = 'bank' 
             and pm.pur_ser_bank_id=${bankId}
             and pm.pur_ser_branch_id = ${req.user.user_branch_id} 
             and pm.pur_ser_status='a'

            
          
            order by dateTime asc

    `).then(res=>{
        return res;
    }));

    if(ledgerErr) return next(ledgerErr);

    let opening_balance = bank.opening_balance
    let closing_balance  = 0

    let bankLedger = ledger.map((value,index) => {
        let lastBalance  = index == 0 ? bank.opening_balance : ledger[index - 1].balance;
        value.balance = (parseFloat(lastBalance) + parseFloat(value.creditAmount))-(parseFloat(value.debitAmount));
        return value;
    });



    if((dateTimeFrom != undefined && dateTimeTo != undefined) && (dateTimeFrom != null && dateTimeTo != null) && bankLedger.length > 0){
        let prevTrans =  bankLedger.filter((payment)=>{
             return payment.dateTime < dateTimeFrom
         });
 
         opening_balance =  prevTrans.length > 0 ? prevTrans[prevTrans.length - 1].balance : opening_balance;
         
         bankLedger =  bankLedger.filter((payment)=>{
             return payment.dateTime >= dateTimeFrom && payment.dateTime <= dateTimeTo
         });
        closing_balance = bankLedger.length > 0 ? bankLedger[bankLedger.length - 1].balance : 0;

     }
    

    res.json({ledger:bankLedger,opening_balance,closing_balance});
});

router.post(`/api/get-others-profit-loss`,async(req,res,next)=>{
        let payload = req.body;

        let tranCluases = ``
        let empPayCluases = ``
        let damageCluases = ``
        let salesReturnCluases = ``
        let materialDamageCluases = ``
        let serviceExpenseCluases = ``
        let serviceIncomeCluases = ``
        if((payload.fromDate != undefined && payload.toDate != undefined) && (payload.fromDate != null && payload.toDate != null)){
            tranCluases += ` and cash_tran_created_isodt between '${payload.fromDate}' and '${payload.toDate}' `
            empPayCluases += ` and payment_isodt between '${payload.fromDate}' and '${payload.toDate}' `
            damageCluases += ` and d.damage_c_isodt between '${payload.fromDate}' and '${payload.toDate}' `
            salesReturnCluases += ` and r.sale_return_created_isodt between '${payload.fromDate}' and '${payload.toDate}' `
            materialDamageCluases += ` and md.damage_c_isodt between '${payload.fromDate}' and '${payload.toDate}' `
            serviceExpenseCluases += ` and pm.pur_ser_created_isodt between '${payload.fromDate}' and '${payload.toDate}' `
            serviceIncomeCluases += ` and sm.service_created_isodt between '${payload.fromDate}' and '${payload.toDate}' `
        }

       let [othersProfitLossErr,othersProfitLoss] = await _p(db.query(`
        select (
            select ifnull(sum(cash_tran_in_amount),0) 
            from tbl_cash_transactions
            where cash_tran_status = 'active' and cash_tran_branch_id = ${req.user.user_branch_id} 
            ${tranCluases} 
        ) as cashTranProfit,

         (
            select ifnull(sum(cash_tran_out_amount),0.00) from tbl_cash_transactions
            where cash_tran_status = 'active' and cash_tran_branch_id = ${req.user.user_branch_id} 
            ${tranCluases} 
        ) as cashTranLoss,
        
         (
            select ifnull(sum(payment_amount),0.00) from tbl_employee_payments
            where  payment_branch_id = ${req.user.user_branch_id}  
            ${empPayCluases}
        ) as employeeSalaryPay,
        
         (
            select  ifnull(sum(d.damage_total), 0) 
            from  tbl_product_damage d
            where 
            d.damage_branch_id = ${req.user.user_branch_id} 
           
            ${damageCluases}
        ) as productDamageAmount,

        (
            select  ifnull(sum(md.damage_total), 0) 
            from   tbl_materials_damage md
            where 
            md.damage_branch_id = ${req.user.user_branch_id} 
            ${materialDamageCluases}
        ) as materialDamageAmount,

        (
            select  ifnull(sum(rd.return_amount), 0) 
            from   tbl_sales_return_details rd
            left join tbl_sales_return r on r.sale_return_id = rd.sale_return_id
            where 
            r.sale_return_branch_id = ${req.user.user_branch_id} 
            
            ${salesReturnCluases}
        ) as salesReturnAmount,

        (
            select  ifnull(sum(pm.pur_ser_total_amount), 0) 
            from   tbl_pur_ser_master pm
            where 
            pm.pur_ser_branch_id = ${req.user.user_branch_id} 
            and pm.pur_ser_status = 'a'
            
            ${serviceExpenseCluases}
        ) as serviceExpenseAmount,

        (
            select  ifnull(sum(sm.service_total_amount), 0) 
            from   tbl_service_master sm
            where 
            sm.service_branch_id = ${req.user.user_branch_id} 
            and sm.service_status = 'a'
            
            ${serviceIncomeCluases}
        ) as serviceIncomeAmount

        
    `).then((res)=>{
        return res;
    }));

    if(othersProfitLossErr && !othersProfitLoss){
        return next(othersProfitLossErr)
    }
    res.json(othersProfitLoss[0]);


});

router.get(`/api/get-customer-transactions-invoice`,async(req,res,next)=>{
   let [paysErr,pays] =  await _p(db.query(`select concat(ct.pay_code,' - ',c.customer_name,'- ',c.customer_mobile_no,' - ',c.customer_address) as display_text,ct.pay_id
    from 
     tbl_customer_payments ct
     left join tbl_customers c on c.customer_id = ct.cus_id 
     where ct.branch_id=${req.user.user_branch_id} and ct.status='a' `)).then(res=>{
         return res;
     })

     res.json(pays)
})
router.post(`/api/get-sales-profit-loss`,async(req,res,next)=>{

        let clauses = ' ';
        let prodWiseClauses = ` `;

        if(req.body.customerId != undefined || req.body.customerId != null){
            clauses += ` and  cus.customer_id=${req.body.customerId} `;
        }

        if(req.body.prodId != undefined || req.body.prodId != null){
            prodWiseClauses += ` and  p.prod_id=${req.body.prodId} `;
        }

        if(req.body.fromDate != undefined && req.body.toDate != undefined ){
            clauses += ` and sm.sale_created_isodt between '${req.body.fromDate}' and  '${req.body.toDate}' `;
        }

          let [salesErr,sales] = await _p(db.query(`select sm.*,cus.customer_name,cus.customer_code from 
              tbl_sales_master sm
              left join tbl_customers cus on cus.customer_id = sm.sale_customer_id
              where   sm.sale_status = 'a' and sm.sale_branch_id = ?  ${clauses}
           `,[req.user.user_branch_id]).then((result)=>{ 
                   return result
           }));
           if(salesErr && !sales) return next(salesErr);
          
          let salesProfit =  sales.map(async(sale)=>{
               let[saleDetailErr,saleDetail] =  await _p(db.query(`select sd.*,p.prod_code,
                        ifnull(sd.sale_prod_purchase_rate,0) as sale_prod_purchase_rate,
                        pn.prod_name,u.prod_unit_name,
                        (ifnull(sd.sale_prod_purchase_rate,0) * sd.sale_qty) as purchasedAmount,
                        (select sd.sale_prod_total - purchasedAmount) as productProfitLoss
                        from tbl_sales_details sd
                        left join tbl_products p on p.prod_id = sd.sale_prod_id
                        left join tbl_products_names pn on pn.prod_name_id = p.prod_name_id
                        left join tbl_product_units u on p.prod_unit_id = u.prod_unit_id

                        where sd.sale_id = ?
                        ${prodWiseClauses}
                 `,[sale.sale_id]).then((result)=>{
                     return result
                 }))

                 sale.details = saleDetail
                 
                 return sale
           });
           let result = await  Promise.all(salesProfit);

           
           result = result.filter((d)=>{
                if(d.details.length > 0 ){
                    return d;
                }
           })
           res.json(result);
})

router.post('/api/get-product-profit-loss',async(req,res,next)=>{
    let prodCluases = ``;
    let cluases = ``;
    if(req.body.fromDate != undefined  && req.body.toDate != undefined){
        cluases += ` and sd.sale_date_time between '${req.body.fromDate}' and '${req.body.toDate}'  `
    }
    if(req.body.prodId != undefined ){
        prodCluases += ` and p.prod_id =   ${req.body.prodId}  `
    }
    let[productsErr,products] = await _p(db.query(`select p.prod_id,p.prod_code,pn.prod_name
    from tbl_products p
    left join tbl_products_names pn on pn.prod_name_id = p.prod_name_id
    
    where p.prod_status = 'active' 
    and find_in_set(?,p.prod_branch_ids) 
    ${prodCluases}
    order by p.prod_id 

    `,[req.user.user_branch_id]).then(res=>{
        return res;
    }));


    let results = products.map(async(prod)=>{
          let [soldDetailErr,soldDetail] =   await _p(db.query(`select
            ifnull(sum(sd.sale_rate * sd.sale_qty),0) as prod_sold_amount,
            ifnull(sum(sd.sale_prod_purchase_rate * sd.sale_qty),0) as prod_purchased_amount,
            ifnull(sum(sd.sale_qty),0) as prod_sold_qty
            from tbl_sales_details sd 
            where sd.sale_prod_id = ${prod.prod_id} 
            and sd.sale_d_status = 'a' 
            and sd.sale_d_branch_id = ${req.user.user_branch_id} 
            ${cluases}
            `).then(res=>{
                return res;
            }));

            prod.prod_sold_amount = soldDetail[0].prod_sold_amount
            prod.prod_purchased_amount = soldDetail[0].prod_purchased_amount
            prod.prod_sold_qty = soldDetail[0].prod_sold_qty
            prod.prod_profit_amount = prod.prod_sold_amount -  prod.prod_purchased_amount

            return prod
    })

    res.json(await  Promise.all(results))
})

let getCashTransationSummary = async (req,next,date=null)=>{
   let [cashTranSummaryErr,cashTranSummary] =  await _p(db.query(`
            select 
            
               (
                select ifnull(sum(sm.sale_paid_amount),0) from tbl_sales_master sm where sm.sale_branch_id=${req.user.user_branch_id} 
                and sm.sale_status='a' and sm.sale_pay_method!='bank' ${date!=null?` and sm.sale_created_isodt < ${date}`:''} 
               ) as received_sale_amount,

               (
                select ifnull(sum(sm.service_paid_amount),0) from tbl_service_master sm where sm.service_branch_id=${req.user.user_branch_id} 
                and sm.service_status='a' and sm.service_pay_method!='bank' ${date!=null?` and sm.service_created_isodt < ${date}`:''} 
               ) as received_service_amount,
               
               (select ifnull(sum(pay_amount),0) from tbl_customer_payments where pay_type='receive' and pay_method != 'bank' 
               and branch_id=${req.user.user_branch_id}  and 
                status='a' ${date!=null?` and created_isodt < ${date}`:''}) as received_customer_partial,
                
                (select ifnull(sum(pay_amount),0) from tbl_supplier_payments where pay_type='receive' and pay_method != 'bank' 
               and branch_id=${req.user.user_branch_id}  and 
                status='a' ${date!=null?` and created_isodt < ${date}`:''}) as received_supplier_amount,
                
                (select ifnull(sum(cash_tran_in_amount),0) from tbl_cash_transactions where cash_tran_type='receive' 
                and cash_tran_branch_id=${req.user.user_branch_id}   
                and cash_tran_method='cash' and 
                cash_tran_status='active' ${date!=null?` and cash_tran_created_isodt < ${date}`:''}) as received_tran_amount,

                (select ifnull(sum(bank_tran_out_amount),0) from tbl_bank_transactions where bank_tran_type='withdraw' 
                and bank_tran_branch_id=${req.user.user_branch_id}  and 
                bank_tran_status='active' ${date!=null?` and bank_tran_created_isodt < ${date}`:''}) as bank_withdraw_amount,

            (select ifnull(sum(pur_paid_amount),0) from tbl_purchase_master where pur_branch_id=${req.user.user_branch_id} 
            and pur_status='a' and pur_pay_method='cash' ${date!=null?` and pur_created_isodt < ${date}`:''} ) as payment_purchase_amount,

            (select ifnull(sum(pur_ser_paid_amount),0) from tbl_pur_ser_master where pur_ser_branch_id=${req.user.user_branch_id} 
            and pur_ser_status='a' and pur_ser_pay_method='cash' ${date!=null?` and pur_ser_created_isodt < ${date}`:''} ) as service_expense_amount,
            
            (select ifnull(sum(paid),0) from tbl_material_purchase where branch_id=${req.user.user_branch_id} 
            and status='a' and pay_method='cash' ${date!=null?` and created_isodt < ${date}`:''} ) as material_purchase_amount,

            (select ifnull(sum(pay_amount),0) from tbl_supplier_payments where pay_type='payment' and pay_method != 'bank' and  branch_id=${req.user.user_branch_id} 
             and status='a' ${date!=null?` and created_isodt < ${date}`:''} ) as payment_supplier_amount,

            (select ifnull(sum(pay_amount),0) from tbl_customer_payments where pay_type='payment' and pay_method != 'bank' 
            and branch_id=${req.user.user_branch_id}  and 
             status='a' ${date!=null?` and created_isodt < ${date}`:''}) as payment_customer_partial,

             (select ifnull(sum(cash_tran_out_amount),0) from tbl_cash_transactions where cash_tran_type='payment' 
             and cash_tran_branch_id=${req.user.user_branch_id}   
             and cash_tran_method='cash' 
             and cash_tran_status='active' 
             ${date!=null?` and cash_tran_created_isodt < ${date}`:''}) as payment_tran_amount,

             (select ifnull(sum(bank_tran_in_amount),0) from tbl_bank_transactions where bank_tran_type='deposit' 
             and bank_tran_branch_id=${req.user.user_branch_id}  and 
             bank_tran_status='active' ${date!=null?` and bank_tran_created_isodt < ${date}`:''}) as bank_deposit_amount,

             (select ifnull(sum(payment_amount),0) from tbl_employee_payments where 
             tran_method='cash' and payment_branch_id=${req.user.user_branch_id}  ${date!=null?` and payment_isodt < ${date}`:''}) as employe_salary_payment,


             (select ifnull(sum(tran_amount),0) from tbl_cash_deposit_withdraw_trans where 
             tran_type='deposit' and tran_branch_id=${req.user.user_branch_id} and tran_status='a'  ${date!=null?` and tran_created_isodt < ${date}`:''}) as cash_deposit_amount, 
             
             (select ifnull(sum(tran_amount),0) from tbl_cash_deposit_withdraw_trans where 
             tran_type='withdraw' and tran_branch_id=${req.user.user_branch_id} and tran_status='a'  ${date!=null?` and tran_created_isodt < ${date}`:''}) as cash_withdraw_amount, 


             ( select ifnull(sum(sale_return_amount),0) from tbl_sales_return where sale_return_branch_id = ${req.user.user_branch_id}  ) as sale_return_amount, 




            ( select received_sale_amount + received_service_amount + received_customer_partial + received_supplier_amount + 
                received_tran_amount + bank_withdraw_amount + cash_deposit_amount) as in_amount,
            

            ( select payment_purchase_amount + material_purchase_amount + payment_supplier_amount +  payment_customer_partial + payment_tran_amount + bank_deposit_amount +employe_salary_payment +cash_withdraw_amount + service_expense_amount + sale_return_amount) as out_amount,
            ( select in_amount - out_amount) as cash_balance

    `).then((result)=>{return result;}));
    if(cashTranSummaryErr && !cashTranSummary)
    { 
        return next(cashTranSummaryErr)
    }else{
        return cashTranSummary
    }

}

let getBankTransationSummary = async (req,next,accountId=null,date=null)=>{
              let [bankTranErr,bankTran] =   await _p(db.query(`select ba.bank_acc_name,ba.bank_acc_number,ba.bank_name,
                        
              (select ifnull(sum(ct.cash_tran_in_amount),0) from  tbl_cash_transactions ct where 
              ct.bank_acc_id = ba.bank_acc_id 
              and ct.cash_tran_status='active' 
              and ct.cash_tran_type = 'receive'
              and ct.cash_tran_method = 'bank'
              and ct.cash_tran_branch_id = ${req.user.user_branch_id} 
             
              ${date!=null?` and ct.cash_tran_created_isodt < ${date}`:''}
          ) as tranReceiveAmount,

          (select ifnull(sum(ct.cash_tran_out_amount),0) from  tbl_cash_transactions ct where 
              ct.bank_acc_id = ba.bank_acc_id 
              and ct.cash_tran_status='active' 
              and ct.cash_tran_type = 'payment'
              and ct.cash_tran_method = 'bank'
              and ct.cash_tran_branch_id = ${req.user.user_branch_id} 
             
              ${date!=null?` and ct.cash_tran_created_isodt < ${date}`:''}
          ) as tranPaymentAmount,

          
          (select ifnull(sum(epay.payment_amount),0) from  tbl_employee_payments epay where 
          epay.bank_acc_id = ba.bank_acc_id 
          and epay.tran_method = 'bank'
          and epay.payment_branch_id = ${req.user.user_branch_id} 
         

          ${date!=null?` and epay.payment_isodt < ${date}`:''}
          ) as employePaymentAmount,
                        (select ifnull(sum(bt.bank_tran_in_amount),0) from tbl_bank_transactions bt where 
                            bt.bank_tran_acc_id = ba.bank_acc_id 
                            and bt.bank_tran_status='active' 
                            and bt.bank_tran_type = 'deposit'
                            and bt.bank_tran_branch_id = ${req.user.user_branch_id} 
                           
                            ${date!=null?` and bt.bank_tran_created_isodt < ${date}`:''}
                        ) as deposit_amount,
                        (select ifnull(sum(bt.bank_tran_out_amount),0) from tbl_bank_transactions bt where 
                        bt.bank_tran_acc_id = ba.bank_acc_id 
                        and bt.bank_tran_status='active' 
                        and bt.bank_tran_type = 'withdraw'
                        and bt.bank_tran_branch_id = ${req.user.user_branch_id} 
                       
                        ${date!=null?` and bt.bank_tran_created_isodt < ${date}`:''}
                        ) as withdraw_amount,

                        (select ifnull(sum(cp.pay_amount),0) from tbl_customer_payments cp where 
                        cp.bank_acc_id = ba.bank_acc_id 
                        and cp.status='a' 
                        and cp.pay_type = 'receive'
                        and cp.branch_id = ${req.user.user_branch_id} 
                        
                        ${date!=null?` and cp.created_isodt < ${date}`:''}
                        ) as receive_amount_from_customer,
                        (select ifnull(sum(cp.pay_amount),0) from tbl_customer_payments cp where 
                        cp.bank_acc_id = ba.bank_acc_id 
                        and cp.status='a' 
                        and cp.pay_type = 'payment'
                        and cp.branch_id = ${req.user.user_branch_id} 
                        
                        ${date!=null?` and cp.created_isodt < ${date}`:''}
                        ) as payment_amount_to_customer,


                        (select ifnull(sum(sp.pay_amount),0) from tbl_supplier_payments sp where 
                        sp.bank_acc_id = ba.bank_acc_id 
                        and sp.status='a' 
                        and sp.pay_type = 'receive'
                        and sp.branch_id = ${req.user.user_branch_id} 
                       
                        ${date!=null?` and cp.created_isodt < ${date}`:''}
                        ) as receive_amount_from_supplier,
                        (select ifnull(sum(sp.pay_amount),0) from tbl_supplier_payments sp where 
                        sp.bank_acc_id = ba.bank_acc_id 
                        and sp.status='a' 
                        and sp.pay_type = 'payment'
                        and sp.branch_id = ${req.user.user_branch_id} 
                       
                        ${date!=null?` and sp.created_isodt < ${date}`:''}
                        ) as payment_amount_to_supplier,

                        (select ifnull(sum(pur_paid_amount),0) from tbl_purchase_master where pur_branch_id=${req.user.user_branch_id} 
                        and pur_status='a' and pur_pay_method='bank'
                        and pur_bank_id = ba.bank_acc_id
                         ${date!=null?` and pur_created_isodt < ${date}`:''} ) as payment_purchase_amount,

                         (select ifnull(sum(pur_ser_paid_amount),0) from tbl_pur_ser_master where pur_ser_branch_id=${req.user.user_branch_id} 
                         and pur_ser_status='a' and pur_ser_pay_method='bank'
                         and pur_ser_bank_id = ba.bank_acc_id
                          ${date!=null?` and pur_ser_created_isodt < ${date}`:''} ) as service_expense_amount,


                          

                        (select ifnull(sum(paid),0) from tbl_material_purchase where branch_id=${req.user.user_branch_id} 
                        and status='a' and pay_method='bank' 
                        and bank_id = ba.bank_acc_id 
                         ${date!=null?` and created_isodt < ${date}`:''} ) as material_purchase_amount,

                        (select ifnull(sum(sale_paid_amount),0) from tbl_sales_master where sale_branch_id=${req.user.user_branch_id} 
                        and sale_status='a' and sale_pay_method='bank' 
                        and sale_bank_id = ba.bank_acc_id  
                        ${date!=null?` and sale_created_isodt < ${date}`:''} ) as sold_paid_amount,

                        (select ifnull(sum(service_paid_amount),0) from tbl_service_master where service_branch_id=${req.user.user_branch_id} 
                        and service_status='a' and service_pay_method='bank' 
                        and service_bank_id = ba.bank_acc_id  
                        ${date!=null?` and service_created_isodt < ${date}`:''} ) as service_paid_amount,

                        (
                            select (ba.bank_acc_init_balance + deposit_amount + receive_amount_from_customer + service_paid_amount + receive_amount_from_supplier + sold_paid_amount + tranReceiveAmount)-
                                (withdraw_amount + payment_amount_to_customer + payment_amount_to_supplier + payment_purchase_amount + material_purchase_amount + tranPaymentAmount + employePaymentAmount + service_expense_amount)
                        ) as balance


                        from tbl_bank_accounts ba where
                        ba.bank_acc_branch_id = ${req.user.user_branch_id}
                        
                        ${accountId!=null? ` and ba.bank_acc_id =${accountId}` :''}
                `).then(res=>{ return res}));
                if(bankTranErr && !bankTran) return next(bankTranErr);
                   return bankTran;
}

router.post(`/api/get-cash-transaction-summary`,async (req,res,next)=>{
    let result =  getCashTransationSummary(req,next);
    result = await Promise.all([result])
    res.json(result[0])
});

router.post(`/api/get-bank-transaction-summary`,async (req,res,next)=>{
    let result =  getBankTransationSummary(req,next);
    result = await Promise.all([result])
    res.json(await Promise.all(result[0]))
});




let getCashDWCode = async (req,res,next)=>{
    let [lastBankTranRowError,lastBankTranRow] =  await _p(db.query(`select tran_id from tbl_cash_deposit_withdraw_trans  order by tran_id desc LIMIT 1`)).then(result=>{
        return result;
    });
    if(lastBankTranRowError){
        next(lastBankTranRowError)
    }
    let CDWCode = '';
    if(lastBankTranRow.length<1){
        CDWCode = 'CDW00001';
    }else{
        CDWCode = 'CDW0000'+(parseFloat(lastBankTranRow[0].tran_id)+1);
    }
    return new Promise((resolve,reject)=>{
             resolve(CDWCode)
    })
}

router.post(`/api/get-cash-d-w-trans`,async(req,res,next)=>{
    let [transErr,trans] =  await _p(db.query(`select * from tbl_cash_deposit_withdraw_trans where tran_status = 'a'  order by tran_id desc `)).then(result=>{
        return result;
    });
    res.json(trans)
})
router.get('/api/get-cash-d-w-code',async(req,res,next)=>{  
        res.json({
            error:false,
            message:await  getCashDWCode(req,res,next)
        });
})

router.post(`/api/cash-d-w-delete`,async(req,res,next)=>{
    let cond = {
        tran_id : req.body.tran_id
    }
    let saveObj = {
        tran_status : 'd'
    }
    await _p(db.update('tbl_cash_deposit_withdraw_trans',saveObj,cond)).then(res=>{
        return res;
    });

    res.json({
        error:false,
        message:'You have successfully deleted a  transaction'
    })
})


router.post('/api/cash-d-w-transaction-cu',async (req,res,next)=>{
    let reqObj = req.body;
  

    let newObject = {
        tran_code: await  getCashDWCode(req,res,next),
        tran_note:reqObj.tran_note, 
        tran_type:reqObj.tran_type, 
        tran_amount:reqObj.tran_amount, 
        tran_user_id:req.user.user_id,
        tran_status:'a',
        tran_created_isodt:reqObj.tran_created_isodt,
        tran_branch_id:req.user.user_branch_id,
     }
     

     
     // Create script
     if(reqObj.action=='create'){
        

        let [tranAddErr,tranAddResult] = await _p(db.insert('tbl_cash_deposit_withdraw_trans',newObject)).then(res=>{
            return res;
        });
        if(tranAddErr && !tranAddResult){
           next(tranAddErr)
        }else{
          
               res.json({
                   error:false,
                   message:'You have successfully created a  transaction'
               })
            
        
     }

    }
     // Update script
     if(reqObj.action=='update'){         
         let cond = {
            tran_id:reqObj.tran_id
        }

     

        delete newObject.tran_code;
        delete newObject.tran_created_isodt 

        let [tranUpdateResultErr,tranUpdateResult] = await _p(db.update('tbl_cash_deposit_withdraw_trans',newObject,cond)).then(res=>{
            return res;
        });
        if(tranUpdateResultErr && !tranUpdateResult){
           next(tranUpdateResultErr)
        }else{
       
            
               res.json({
                   error:false,
                   message:'You have successfully updated a  transaction'
               })
            
        }
     }
     
})




module.exports = router;