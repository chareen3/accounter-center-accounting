const router = require('express').Router();
const _p      = require('../utils/promise_error');
const  {Database}   = require('../utils/Database');
let    db = new Database();

 
router.post('/api/get-customer-due',async(req,res,next)=>{
        let clauses = ' ';
        if(req.body.customerId!=undefined || req.body.customerId!=null){
            clauses += ` and c.customer_id=${req.body.customerId} `;
        } 
        if(req.body.areaId!=undefined || req.body.areaId!=null){
            clauses += ` and c.customer_area_id=${req.body.areaId} `;
        } 

        if(req.body.areaId!=undefined || req.body.areaId!=null){
            clauses += ` and c.customer_area_id=${req.body.areaId} `;
        } 

        if((req.body.customerType!=undefined || req.body.customerType!=null) && (req.body.customerType =='retail' || req.body.customerType == 'wholesale')){
            clauses += ` and c.customer_type= '${req.body.customerType}' `;
        } 

        let [qryErr,data] = await _p(db.query(`
                    select c.customer_code,c.customer_name,c.customer_mobile_no,c.customer_address,c.customer_institution_name,
                           
                          (select ifnull(sum(sm.sale_total_amount),0.00) + ifnull(c.customer_previous_due,0.00) 
                           from  tbl_sales_master sm 
                               where sm.sale_customer_id=c.customer_id
                               and sm.sale_status='a'
                           ) as soldAmount,
                           (
                               select ifnull(sum(sm.sale_paid_amount),0.00)
                                      from tbl_sales_master sm 
                                      where sm.sale_customer_id=c.customer_id
                                      and sm.sale_status='a'
                           ) as soldPaidAmount,


                           (select ifnull(sum(sm.service_total_amount),0.00) 
                           from  tbl_service_master sm 
                               where sm.service_customer_id=c.customer_id
                               and sm.service_status='a'
                           ) as serviceAmount,
                           (
                               select ifnull(sum(sm.service_paid_amount),0.00)
                                      from tbl_service_master sm 
                                      where sm.service_customer_id=c.customer_id
                                      and sm.service_status='a'
                           ) as servicePaidAmount,




                           (
                            select ifnull(sum(cp.pay_amount),0.00)
                                   from tbl_customer_payments cp 
                                   where cp.cus_id=c.customer_id
                                   and cp.pay_type='receive'
                                   and cp.status='a'
                            ) as receivedAmount,
                            (
                                select ifnull(sum(cp.pay_amount),0.00)
                                       from tbl_customer_payments cp 
                                       where cp.cus_id=c.customer_id
                                       and cp.pay_type='payment'
                                       and cp.status='a'
                                ) as paymentAmount,

                                (
                                    select ifnull(sum(sr.sale_return_amount),0.00)
                                     from  tbl_sales_return sr 
                                           left join tbl_sales_master sm on sm.sale_invoice=sr.sale_invoice
                                           where sm.sale_customer_id=c.customer_id
                                ) as returnAmount,

                                (select soldPaidAmount + servicePaidAmount + receivedAmount) as paidAmount,

                                (select (soldAmount + serviceAmount + paymentAmount) - ( paidAmount + returnAmount )  ) as dueAmount
 
                           from tbl_customers c
                                 where c.customer_branch_id =?  ${clauses}
                                 and c.customer_type <> 'general'
                               

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

router.post(`/api/customer-transaction-history`,async (req,res,next)=>{
       let payLoad = req.body;

       let clauses = ``
       if(payLoad.customerId != undefined && payLoad.customerId != null &&  payLoad.customerId != '' ){
           clauses += ` and cp.cus_id = ${payLoad.customerId} `
       }

       if(payLoad.employeeId != undefined && payLoad.employeeId != null &&  payLoad.employeeId != '' ){
        clauses += ` and c.employee_id = ${payLoad.employeeId} `
    }

       if(payLoad.fromDate != undefined && payLoad.toDate != undefined ){
           clauses += ` and cp.created_isodt between  '${payLoad.fromDate}'  and '${payLoad.toDate}' `
       } 

       if(payLoad.payType != undefined && payLoad.payType != null && payLoad.payType != '' &&  payLoad.payType != 'all' ){
           clauses += ` and cp.pay_type = '${payLoad.payType}' `
       } 

        
      let [tranHistoryErr,tranHistory] =   await _p(db.query(`select 
        c.customer_code,
        c.customer_name,
        c.customer_institution_name,
        cp.pay_code as pay_code,
        cp.created_isodt,
        concat(
              case cp.pay_method
                   when 'bank' then concat('Bank - ', ba.bank_acc_name,
                 ' - ', ba.bank_acc_number,' - ',ba.bank_name)
                  when 'by cheque' then 'Cheque'
                  else 'Cash'
                  end
        ) as pay_method,
        cp.note,
        case cp.pay_type
        when 'payment' then 'Payment to Customer'
        when 'receive' then 'Receive from Customer'
        end as pay_type,
        cp.pay_amount
        from tbl_customer_payments cp
        left join tbl_customers c on c.customer_id = cp.cus_id
        left join tbl_bank_accounts ba on ba.bank_acc_id = cp.bank_acc_id
        where  cp.status = 'a' 
        ${clauses} 
        order by cp.created_isodt desc
        `).then(res=>{
            return res;
        }))

        if(tranHistoryErr && !tranHistory) return next(tranHistoryErr)
        res.json(tranHistory)
})


router.post(`/api/get-customer-ledger`,async(req,res,next)=>{
    let payload = req.body;

    let dateTimeFrom = req.body.fromDate;
    let dateTimeTo = req.body.toDate;
    
   

   let [customerErr,customer]  = await _p(db.selectSingleRow(`select ifnull(customer_previous_due,.00) as opening_balance from tbl_customers where customer_id=${payload.customerId}`).then(cus=>{
        return cus;
    }));

    
    if(customerErr){return next(customerErr)}

    /// Customer Ledger Query 
    let [ledgerErr,ledger] =  await _p(db.query(`
            select 
                'a' as sequence,
                 sm.sale_id as id,
                 sm.sale_created_isodt as date,

                 concat('Sold - ',sm.sale_invoice,
                 case sm.sale_pay_method
                      when 'bank' then concat(' - By Bank - ', ba.bank_acc_name,
                    ' - ', ba.bank_acc_number)
                     when 'by cheque' then 'Cheque'
                     else ' - Cash'
                     end, ' ' 
           ) as description,

                 sm.sale_total_amount as bill,
                 sm.sale_paid_amount as paid,
                 sm.sale_due_amount as due,
                 0.00 as returned,
                 0.00 as payment,
                 0.00 as balance
            from tbl_sales_master sm
            left join tbl_bank_accounts ba on ba.bank_acc_id = sm.sale_bank_id
            where sm.sale_customer_id = ${payload.customerId}
            and sm.sale_status = 'a' 

            UNION
            select 'b' as sequence,
            cp.pay_id as id,
            cp.created_isodt as date,
            concat('Received from customer - ', 
                  case cp.pay_method
                       when 'bank' then concat('By Bank - ', ba.bank_acc_name,
                     ' - ', ba.bank_acc_number)
                      when 'by cheque' then 'Cheque'
                      else 'Cash'
                      end, ' ', cp.note 
            ) as description,
            0.00 as bill,
            cp.pay_amount as paid,
            0.00 as due,
            0.00 as returned,
            0.00 as payment,
            0.00 as balance
            from tbl_customer_payments cp
            left join tbl_bank_accounts ba on ba.bank_acc_id = cp.bank_acc_id
            where cp.pay_type = 'receive'
            and cp.cus_id = ${payload.customerId}
            and cp.status = 'a'

            UNION
            select 'c' as sequence,
            cp.pay_id as id,
            cp.created_isodt as date,
            concat('Payment to customer - ', 
                  case cp.pay_method
                       when 'bank' then concat('By Bank - ', ba.bank_acc_name,
                     ' - ', ba.bank_acc_number)
                      when 'by cheque' then 'Cheque'
                      else 'Cash'
                      end, ' ', cp.note 
            ) as description,
            0.00 as bill,
            0.00 as paid,
            0.00 as due,
            0.00 as returned,
            cp.pay_amount as payment,
            0.00 as balance
            from tbl_customer_payments cp
            left join tbl_bank_accounts ba on ba.bank_acc_id = cp.bank_acc_id
            where cp.pay_type = 'payment'
            and cp.cus_id = ${payload.customerId}
            and cp.status = 'a'

            UNION
            select 'd' as sequence,
            sr.sale_return_id as id,
            sr.sale_return_created_isodt as date,
            'Sales Return' as description,
            0.00 as bill,
            0.00 as paid,
            0.00 as due,
            sr.sale_return_amount as returned,
            0.00 as payment,
            0.00 as balance

            
        from tbl_sales_return sr
        left join tbl_sales_master smr on smr.sale_invoice = sr.sale_invoice
        where smr.sale_customer_id = ${payload.customerId} 


        UNION select 
        'd' as sequence,
         sm.service_id  as id,
         sm.service_created_isodt as date,

         concat('Service - ',sm.service_invoice,
         case sm.service_pay_method
              when 'bank' then concat(' - By Bank - ', ba.bank_acc_name,
            ' - ', ba.bank_acc_number)
             when 'by cheque' then 'Cheque'
             else ' - Cash'
             end, ' ' 
   ) as description,

         sm.service_total_amount as bill,
         sm.service_paid_amount as paid,
         sm.service_due_amount as due,
         0.00 as returned,
         0.00 as payment,
         0.00 as balance
    from tbl_service_master sm
    left join tbl_bank_accounts ba on ba.bank_acc_id = sm.service_bank_id
    where sm.service_customer_id = ${payload.customerId}
    and sm.service_status = 'a' 



        order by date ASC
    `).then(result=>{
        return result;
    }));
    if(ledgerErr) return next(ledgerErr);

    let opening_balance  = customer.opening_balance
    let closing_balance  = 0
    

    let newLedger = ledger.map((value,index) => {
        let lastBalance  = index == 0 ? opening_balance : ledger[index - 1].balance;
        value.balance = (parseFloat(lastBalance) + parseFloat(value.bill)+parseFloat(value.payment))-(parseFloat(value.paid)+parseFloat(value.returned));
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