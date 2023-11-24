const router = require('express').Router();
const _p      = require('../utils/promise_error');
const  {Database}   = require('../utils/Database');
let    db = new Database();


router.post('/api/get-supplier-due',async(req,res,next)=>{
        let clauses = ' ';
        if(req.body.supplierId!=undefined || req.body.supplierId!=null){
            clauses += ` and s.supplier_id=${req.body.supplierId} `;
        } 

        let [qryErr,data] = await _p(db.query(`
                    select s.supplier_code,s.supplier_name,s.supplier_mobile_no,s.supplier_address,
                            s.supplier_institution_name,
                           (select ifnull(sum(pm.pur_total_amount),0.00) + ifnull(s.supplier_previous_due,0.00) 
                           from  tbl_purchase_master pm 
                               where pm.pur_supplier_id=s.supplier_id
                               and pm.pur_status='a'
                           ) as purchasedAmount,
                           (
                               select ifnull(sum(pm.pur_paid_amount),0.00)
                                      from tbl_purchase_master pm 
                                      where pm.pur_supplier_id=s.supplier_id
                                      and pm.pur_status='a'
                           ) as purchasedPaidAmount,

                           (select ifnull(sum(pm.pur_ser_total_amount),0.00)  
                           from  tbl_pur_ser_master pm 
                               where pm.pur_ser_supplier_id=s.supplier_id
                               and pm.pur_ser_status='a'
                           ) as serviceExpenseAmount,
                           (
                               select ifnull(sum(pm.pur_ser_paid_amount),0.00)
                                      from tbl_pur_ser_master pm 
                                      where pm.pur_ser_supplier_id=s.supplier_id
                                      and pm.pur_ser_status='a'
                           ) as serviceExpensePaidAmount,



                           (select ifnull(sum(mm.total),0.00)  
                           from  tbl_material_purchase mm 
                               where mm.supplier_id=s.supplier_id
                               and mm.status='a'
                           ) as mPurchasedAmount,
                        
                           (select ifnull(sum(mm.paid),0.00)  
                           from  tbl_material_purchase mm 
                               where mm.supplier_id=s.supplier_id
                               and mm.status='a'
                           ) as mPurchasedPaidAmount,

                           (
                            select ifnull(sum(sp.pay_amount	),0.00)
                                   from  tbl_supplier_payments sp 
                                   where sp.supplier_id=s.supplier_id
                                   and sp.pay_type='receive'
                                   and sp.status='a'
                            ) as receivedAmount,
                            (
                                select ifnull(sum(sp.pay_amount),0.00)
                                       from tbl_supplier_payments sp 
                                       where sp.supplier_id=s.supplier_id
                                       and sp.pay_type='payment'
                                       and sp.status='a'
                                ) as paymentAmount,

                                (
                                    select ifnull(sum(pr.pur_return_amount),0.00)
                                     from  tbl_purchase_return pr 
                                           where pr.pur_supplier_id=s.supplier_id
                                ) as returnAmount,

                                        
                                (select (purchasedAmount + mPurchasedAmount + receivedAmount + serviceExpenseAmount) - (  purchasedPaidAmount + mPurchasedPaidAmount + returnAmount + paymentAmount + serviceExpensePaidAmount)  ) as dueAmount
                            
                           from tbl_suppliers s
                                 where s.supplier_branch_id =? 
                                 and s.supplier_type <> 'general'
                                 ${clauses}
                               

                  `,[req.user.user_branch_id]).then((row)=>{
            return row;
        }));
            if(qryErr && !data){
            return next(qryErr);
            }
            else{
              res.json(data);
            }
});


router.post(`/api/supplier-transaction-history`,async (req,res,next)=>{
    let payLoad = req.body;

    let clauses = ``
    if(payLoad.supplierId != undefined && payLoad.supplierId != null &&  payLoad.supplierId != '' ){
        clauses += ` and sp.supplier_id = ${payLoad.supplierId} `
    }

    if(payLoad.fromDate != undefined && payLoad.toDate != undefined ){
        clauses += ` and sp.created_isodt between  '${payLoad.fromDate}'  and '${payLoad.toDate}' `
    } 

    if(payLoad.payType != undefined && payLoad.payType != null && payLoad.payType != '' && payLoad.payType != 'all' ){
        clauses += ` and sp.pay_type = '${payLoad.payType}' `
    } 
     
   let [tranHistoryErr,tranHistory] =   await _p(db.query(`select 
     sup.supplier_code,
     sup.supplier_name,
     sp.pay_id as id,
     sp.created_isodt,
     sp.pay_code,
     sp.note,
     concat(
           case sp.pay_method
                when 'bank' then concat('Bank - ', ba.bank_acc_name,
              ' - ', ba.bank_acc_number,' - ',ba.bank_name)
               when 'by cheque' then 'Cheque'
               else 'Cash'
               end, ' ', sp.note 
     ) as pay_method,
     case sp.pay_type
     when 'payment' then 'Payment to Supplier'
     when 'receive' then 'Receive from Supplier'
     end as pay_type,
    
     sp.pay_amount
     from tbl_supplier_payments sp
     left join tbl_suppliers sup on sup.supplier_id  = sp.supplier_id
     left join tbl_bank_accounts ba on ba.bank_acc_id = sp.bank_acc_id
     where  sp.status = 'a' 
     ${clauses} 
     order by sp.created_isodt desc
     `).then(res=>{
         return res;
     }))

     if(tranHistoryErr && !tranHistory) return next(tranHistoryErr)
     res.json(tranHistory)
})


router.post('/api/get-supplier-ledger',async(req,res,next)=>{
    let payload = req.body;
    let clauses = ``;
    
    let dateTimeFrom = req.body.fromDate;
    let dateTimeTo = req.body.toDate;
    
   

   let [supplierErr,supplier]  = await _p(db.selectSingleRow(`select ifnull(supplier_previous_due,0.00) as opening_balance from tbl_suppliers where supplier_id=${payload.supplierId}`).then(sup=>{
        return sup;
    }));

    
    if(supplierErr){return next(supplierErr)}

    /// Customer Ledger Query 
    let [ledgerErr,ledger] =  await _p(db.query(`
            select 
                'a' as sequence,
                 pm.pur_id as id,
                 pm.pur_created_isodt as date,
                 concat('Purchased - ',pm.pur_invoice_no,
                 case pm.pur_pay_method
                      when 'bank' then concat(' - By Bank - ', ba.bank_acc_name,
                    ' - ', ba.bank_acc_number)
                     when 'by cheque' then 'Cheque'
                     else ' - Cash'
                     end, ' ' 
           ) as description,


                 pm.pur_total_amount as bill,
                 pm.pur_paid_amount as paid,
                 pm.pur_due_amount as due,
                 0.00 as returned,
                 0.00 as received,
                 0.00 as balance
            from tbl_purchase_master pm
            left join tbl_bank_accounts ba on ba.bank_acc_id = pm.pur_bank_id
            where pm.pur_supplier_id = ${payload.supplierId}
            and pm.pur_status = 'a' 


           

            UNION
            select 'b' as sequence,
            sp.pay_id as id,
            sp.created_isodt as date,
            concat('Received from Supplier - ', 
                  case sp.pay_method
                       when 'bank' then concat('Bank - ', ba.bank_acc_name,
                     ' - ', ba.bank_acc_number)
                      when 'by cheque' then 'Cheque'
                      else 'Cash'
                      end, ' ', sp.note 
            ) as description,
            0.00 as bill,
            0.00 as paid,
            0.00 as due,
            0.00 as returned,
            sp.pay_amount as received,
            0.00 as balance
            from tbl_supplier_payments sp
            left join tbl_bank_accounts ba on ba.bank_acc_id = sp.bank_acc_id
            where sp.pay_type = 'receive'
            and sp.supplier_id = ${payload.supplierId}
            and sp.status = 'a' 

            UNION
            select 'c' as sequence,
            sp.pay_id as id,
            sp.created_isodt as date,
            concat('Payment to Supplier - ', 
                  case sp.pay_method
                       when 'bank' then concat('Bank - ', ba.bank_acc_name,
                     ' - ', ba.bank_acc_number)
                      when 'by cheque' then 'Cheque'
                      else 'Cash'
                      end, ' ', sp.note 
            ) as description,
            0.00 as bill,
            sp.pay_amount as paid,
            0.00 as due,
            0.00 as returned,
            0.00 as received,
            0.00 as balance
            from tbl_supplier_payments sp
            left join tbl_bank_accounts ba on ba.bank_acc_id = sp.bank_acc_id
            where sp.pay_type = 'payment'
            and sp.supplier_id = ${payload.supplierId}
            and sp.status = 'a' 

            UNION
            select 'd' as sequence,
            pr.pur_return_id as id,
            pr.pur_return_created_isodt as date,
            'Purchase  Return' as description,
            0.00 as bill,
            0.00 as paid,
            0.00 as due,
            pr.pur_return_amount as returned,
            0.00 as received,
            0.00 as balance
        from tbl_purchase_return pr
        left join tbl_purchase_master pmr on pmr.pur_invoice_no = pr.pur_invoice_no
        where pmr.pur_supplier_id = ${payload.supplierId} 


        UNION
        select 'e' as sequence,
                 mm.m_purchase_id  as id,
                 mm.created_isodt as date,
                 concat('Material Purchase - ',mm.m_purchase_invoice) as description,
                 mm.total as bill,
                 mm.paid as paid,
                 mm.due as due,
                 0.00 as returned,
                 0.00 as received,
                 0.00 as balance
            from tbl_material_purchase mm
            where mm.supplier_id = ${payload.supplierId}
            and mm.status = 'a' 

            UNION 
            select 
            'f' as sequence,
             pm.pur_ser_id  as id,
             pm.pur_ser_created_isodt as date,
             concat('Service Item Expense - ',pm.pur_ser_invoice_no,
             case pm.pur_ser_pay_method
                  when 'bank' then concat(' - By Bank - ', ba.bank_acc_name,
                ' - ', ba.bank_acc_number)
                 when 'by cheque' then 'Cheque'
                 else ' - Cash'
                 end, ' ' 
       ) as description,


             pm.pur_ser_total_amount as bill,
             pm.pur_ser_paid_amount as paid,
             pm.pur_ser_due_amount as due,
             0.00 as returned,
             0.00 as received,
             0.00 as balance
        from tbl_pur_ser_master pm
        left join tbl_bank_accounts ba on ba.bank_acc_id = pm.pur_ser_bank_id
        where pm.pur_ser_supplier_id = ${payload.supplierId}
        and pm.pur_ser_status = 'a' 


        order by date ASC
    `).then(result=>{
        return result;
    }));
    if(ledgerErr) return next(ledgerErr);

    let opening_balance  = supplier.opening_balance
    let closing_balance  = 0
    


    let newLedger = ledger.map((value,index) => {
        // Balance Sequence
        let lastBalance  = index == 0 ? supplier.opening_balance : ledger[index - 1].balance;
        value.balance = (parseFloat(lastBalance) + parseFloat(value.bill)+parseFloat(value.received))-(parseFloat(value.paid)+parseFloat(value.returned));
        return value;
    });


    if((dateTimeFrom != undefined && dateTimeTo != undefined) && (dateTimeFrom != null && dateTimeTo != null) && newLedger.length > 0){
        let prevTrans =  newLedger.filter((payment)=>{
             return payment.date < dateTimeFrom
         });
 
         opening_balance =  prevTrans.length > 0 ? prevTrans[prevTrans.length - 1].balance : opening_balance;
         
         newLedger =  newLedger.filter((payment)=>{
             return payment.date >= dateTimeFrom && payment.date <= dateTimeTo
         });
        closing_balance = newLedger.length > 0 ? newLedger[newLedger.length - 1].balance : 0;

     }

    
    res.json({ledger:newLedger,opening_balance,closing_balance});
});

module.exports = router;