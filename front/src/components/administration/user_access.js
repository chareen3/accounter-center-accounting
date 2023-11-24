import React,{Fragment,useState,useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet} from '../../actions/actions';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {pathSpliter,checkAuthBranchWare,dateTimeFormat,checkIntNum,currentDateTime,getDateTimeFromISODT} from '../../lib/functions'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {APP_URL,API_URL} from '../../config.json';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import CheckboxIndependant from "./independant";


import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';


import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import swal from 'sweetalert';
import { CardContent } from '@material-ui/core';
import material_re_order_list from './material_re_order_list';



const UserAccess = ({location,currentRoute,currentRouteSet,authInfo})=>{

    const classes = useStyles();
    const [selectedDate, handleDateChangeSet] = useState(currentDateTime);
    const [userId, userIdSet] = useState(0);
    const [access, accessSet] = useState([]);
    const [user_full_name, user_full_name_set] = useState('Loading...');


    


  let moduleAllCheck = (event)=>{
      let elem = document
        .getElementById(`${event.target.name}`)
        .querySelectorAll("input[type='checkbox']");
      for (let i = 0; i < elem.length; i++) {

        checkExistAccess(elem[i])
        elem[i].checked = !event.target.checked;
        elem[i].click()
      }
     
      reset(event)

  
  }


  let checkExistAccess = (e)=>{
    let accessTemp = access
    let tg = e.name
    let check =  access.findIndex((ele)=>{
      if(ele==tg) return true;
    });

  if(e.checked && check == -1){
    accessTemp.push(tg)
  }

  if(!e.checked && check > -1){
    accessTemp.splice(check,1)
  }
   accessSet(accessTemp)
  }



  const handleChange = (e,state,stateFun) => {
      checkExistAccess(e.target)
      if(!state){
        stateFun(true)
      }else{
        stateFun(false)
      }
  };


    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        userIdSet(parseFloat(pathSpliter(location.pathname,3)))
         axios.post(`${API_URL}/api/get-access`,{userId:parseFloat(pathSpliter(location.pathname,3))},{headers:{'auth-token':authInfo.token}}).then(res=>{
          user_full_name_set(res.data.user_full_name)
          
          let accessArr =  JSON.parse(res.data.user_access)
        accessSet(accessArr) 
       checkAccess(accessArr)
     })
    },[]);


    const userAccessBack = ()=>{
        history.push(`/administration/users-manage`)
     }

    

    
     
     let userAccessSave = async () =>{
         await axios.post(`${API_URL}/api/save-access`,{access,userId},{headers:{'auth-token':authInfo.token}}).then(res=>{
            if(authInfo.userInfo.user_id != res.data.user_id){
              swal({
                title:`${res.data.message}`,
                icon:'success'
              })
            }
          
         })
     }


     let reset = (event)=>{
      let acc  = access

      if(event.target.name=='sales'){
        if(event.target.checked){
          sales_set(true)
          sales_entry_set(true)
          sales_record_set(true)
  
          sales_invoice_set(true)
          customer_entry_set(true)
          quotation_entry_set(true)
          quotation_record_set(true)
          quotation_invoice_set(true)
          sales_return_set(true)
          sales_return_record_set(true)
          customer_due_list_set(true)
          customer_list_set(true)
          customer_ledger_set(true)
          customer_transaction_set(true)
  
        
          }else{
            sales_set(false)
            sales_entry_set(false)
            sales_record_set(false)
  
            sales_invoice_set(false)
            customer_entry_set(false)
            quotation_entry_set(false)
            quotation_record_set(false)
            quotation_invoice_set(false)
            sales_return_set(false)
            sales_return_record_set(false)
            customer_due_list_set(false)
            customer_list_set(false)
            customer_ledger_set(false)
            customer_transaction_set(false)
            
          }
      }

      // Service

      if(event.target.name=='service'){

        if(event.target.checked){
          service_set(true)
          service_entry_set(true)
          service_expense_entry_set(true)
          service_record_set(true)
          service_expense_record_set(true)
          service_invoice_set(true)
          service_expense_invoice_set(true)
          service_report_set(true)
        }else{
          service_set(false)
          service_entry_set(false)
          service_expense_entry_set(false)
          service_record_set(false)
          service_expense_record_set(false)
          service_invoice_set(false)
          service_expense_invoice_set(false)
          service_report_set(false)
        }

      }
      
       // Purchase
       if(event.target.name=='purchase'){
        if(event.target.checked){
          purchase_set(true)
          purchase_entry_set(true)
          purchase_record_set(true)
          purchase_invoice_set(true)
          supplier_entry_set(true)
          purchase_return_set(true)
          purchase_return_list_set(true)
          supplier_due_list_set(true)
          supplier_list_set(true)
          supplier_ledger_set(true)
          supplier_transaction_set(true)
          }else{
            purchase_set(false)
            purchase_entry_set(false)
            purchase_record_set(false)
            purchase_invoice_set(false)
            supplier_entry_set(false)
            purchase_return_set(false)
            purchase_return_list_set(false)
            supplier_due_list_set(false)
            supplier_list_set(false)
            supplier_ledger_set(false)
            supplier_transaction_set(false)
          }
       }

         // Production
         if(event.target.name=='production'){
          if(event.target.checked){
            production_set(true)
            production_entry_set(true)
            material_purchase_set(true)
            material_entry_set(true)
            material_names_set(true)
            material_damage_entry_set(true)
            production_invoice_set(true)
            material_purchase_invoice_set(true)
            material_stock_set(true)
            material_ledger_set(true)
            production_record_set(true)
            material_purchase_record_set(true)
            material_damage_list_set(true)
            material_list_set(true)
          }else{
            production_set(false)
            production_entry_set(false)
            material_purchase_set(false)
            material_entry_set(false)
            material_names_set(false)
            material_damage_entry_set(false)
            production_invoice_set(false)
            material_purchase_invoice_set(false)
            material_stock_set(false)
            material_ledger_set(false)
            production_record_set(false)
            material_purchase_record_set(false)
            material_damage_list_set(false)
            material_list_set(false)
          }
        }

        // Stock

        if(event.target.name=='stock'){
          if(event.target.checked){
            stock_set(true)
            product_stock_set(true)
            product_damage_set(true)
            material_stock_m_set(true)
            product_transfer_set(true)
            product_transfer_list_set(true)
            product_receive_list_set(true)
            product_price_list_set(true)
            product_damage_list_set(true)
            product_ledger_set(true)
            material_ledger_m_set(true)
            product_re_order_list_set(true)
            material_re_order_list_set(true)
          }else{
            stock_set(false)
            product_stock_set(false)
            product_damage_set(false)
            material_stock_m_set(false)
            product_transfer_set(false)
            product_price_list_set(false)
            product_transfer_list_set(false)
            product_receive_list_set(false)
            product_damage_list_set(false)
            product_ledger_set(false)
            material_ledger_m_set(false)

            product_re_order_list_set(false)
            material_re_order_list_set(false)
          }

        }

        if(event.target.name=='accounts'){
          if(event.target.checked){
            accounts_set(true)
            cash_transaction_set(true)
            bank_transaction_set(true)
            customer_transaction_m_set(true)
            supplier_payment_set(true)
            transaction_accounts_set(true)
            bank_accounts_set(true)
            cash_transaction_report_m_set(true)
            bank_transaction_report_m_set(true)
            cash_transaction_d_w_set(true)

            cash_ledger_set(true)
            daily_ledger_set(true)
            
          }else{
            accounts_set(false)
            cash_transaction_set(false)
            bank_transaction_set(false)
            customer_transaction_m_set(false)
            supplier_payment_set(false)
            transaction_accounts_set(false)
            bank_accounts_set(false)
            cash_transaction_report_m_set(false)
            bank_transaction_report_m_set(false)
            cash_transaction_d_w_set(false)
            cash_ledger_set(false)
            daily_ledger_set(false)

          }

        }

        if(event.target.name=='hrpayroll'){
          if(event.target.checked){
            hrpayroll_set(true)
            salary_set(true)
            salary_report_set(true)
            employee_manage_set(true)
            designation_manage_set(true)
            department_manage_set(true)
            month_manage_set(true)
          }else{
            hrpayroll_set(false)
            salary_set(false)
            salary_report_set(false)
            employee_manage_set(false)
            designation_manage_set(false)
            department_manage_set(false)
            month_manage_set(false)
          }
        }


        // Administration
        if(event.target.name=='administration'){
          if(event.target.checked){
            administration_set(true)
            product_manage_set(true)
            area_manage_set(true)
            product_name_entry_set(true)
            product_unit_set(true)
            user_manage_set(true)
            branch_manage_set(true)
            company_profile_set(true)
          }else{
            administration_set(false)
            product_manage_set(false)
            area_manage_set(false)
            product_name_entry_set(false)
            product_unit_set(false)
            user_manage_set(false)
            branch_manage_set(false)
            company_profile_set(false)
          }
        }

        // Reports
        if(event.target.name=='reports'){
          if(event.target.checked){
            reports_set(true)
            r_cash_bank_balance_set(true)
            r_profit_loss_set(true)
            r_cash_statement_set(true)
            r_material_stock_set(true)
            r_product_stock_set(true)
            r_customer_ledger_set(true)
            r_supplier_ledger_set(true)
            r_material_ledger_set(true)
            r_product_ledger_set(true)
            r_supplier_due_list_set(true)
            r_customer_due_list_set(true)
            r_sales_invoice_set(true)
            r_quotation_invoice_set(true)
            r_purchase_invoice_set(true)
            r_production_invoice_set(true)
            r_material_purchase_invoice_set(true)
            r_customer_transaction_set(true)
            r_supplier_transaction_set(true)
            r_cash_transaction_set(true)
            r_bank_transaction_set(true)
            r_salary_payment_set(true)
            r_sales_record_set(true)
            r_quotation_record_set(true)
            r_purchase_record_set(true)
            r_production_record_set(true)
            r_material_pur_record_set(true)
            r_prod_transfer_record_set(true)
            r_prod_receive_record_set(true)
            r_sales_return_list_set(true)
            r_purchase_return_list_set(true)
            r_customer_list_set(true)
            r_supplier_list_set(true)
            r_material_damage_list_set(true)
            r_material_list_set(true)
            r_product_damage_list_set(true)
            r_product_list_set(true)
            bank_account_ledger_set(true)
            customer_transaction_invoice_set(true)
          }else{
            reports_set(false)
            r_profit_loss_set(false)
            r_cash_statement_set(false)
            r_material_stock_set(false)
            r_product_stock_set(false)
            r_customer_ledger_set(false)
            r_supplier_ledger_set(false)
            r_material_ledger_set(false)
            r_product_ledger_set(false)
            r_supplier_due_list_set(false)
            r_customer_due_list_set(false)
            r_sales_invoice_set(false)
            r_quotation_invoice_set(false)
            r_purchase_invoice_set(false)
            r_production_invoice_set(false)
            r_material_purchase_invoice_set(false)
            r_customer_transaction_set(false)
            r_supplier_transaction_set(false)
            r_cash_transaction_set(false)
            r_bank_transaction_set(false)
            r_salary_payment_set(false)
            r_sales_record_set(false)
            r_quotation_record_set(false)
            r_purchase_record_set(false)
            r_production_record_set(false)
            r_material_pur_record_set(false)
            r_prod_transfer_record_set(false)
            r_prod_receive_record_set(false)
            r_sales_return_list_set(false)
            r_purchase_return_list_set(false)
            r_customer_list_set(false)
            r_supplier_list_set(false)
            r_material_damage_list_set(false)
            r_material_list_set(false)
            r_product_damage_list_set(false)
            r_product_list_set(false)
            bank_account_ledger_set(false)
            customer_transaction_invoice_set(false)
            
          }
        }
       
    }

    
     let checkAccess = (acc)=>{
      acc.forEach(element => {
            //   Sales
              if(element=='sales_entry'){
                sales_entry_set(true)
              }

              if(element=='sales_record'){
                sales_record_set(true)
              }

              if(element=='sales_invoice'){
                sales_invoice_set(true)
              }

              if(element=='customer_entry'){
                customer_entry_set(true)
              }

              if(element=='quotation_entry'){
                quotation_entry_set(true)
              }

              if(element=='quotation_record'){
                quotation_record_set(true)
              }

              if(element=='quotation_invoice'){
                quotation_invoice_set(true)
              }

              if(element=='sales_return'){
                sales_return_set(true)
              }
              if(element=='sales_return_record'){
                sales_return_record_set(true)
              }
              if(element=='customer_due_list'){
                customer_due_list_set(true)
              }
              if(element=='customer_list'){
                customer_list_set(true)
              }
              if(element=='customer_ledger'){
                customer_ledger_set(true)
              }
              if(element=='customer_transaction'){
                customer_transaction_set(true)
              }

              // Service

              if(element=='service_entry'){
                service_entry_set(true)
              }
              if(element=='service_expense_entry'){
                service_expense_entry_set(true)
              }

              if(element=='service_record'){
                service_record_set(true)
              }

              if(element=='service_expense_record'){
                service_expense_record_set(true)
              }
              if(element=='service_invoice'){
                service_invoice_set(true)
              }
              if(element=='service_expense_invoice'){
                service_expense_invoice_set(true)
              }
              if(element=='service_report'){
                service_report_set(true)
              }



              // Purchase
              if(element=='purchase_entry'){
                purchase_entry_set(true)
              }
              if(element=='purchase_record'){
                purchase_record_set(true)
              }
              if(element=='purchase_invoice'){
                purchase_invoice_set(true)
              }
              if(element=='supplier_entry'){
                supplier_entry_set(true)
              }
              if(element=='purchase_return'){
                purchase_return_set(true)
              }
              if(element=='purchase_return_list'){
                purchase_return_list_set(true)
              }
              if(element=='supplier_due_list'){
                supplier_due_list_set(true)
              }
              if(element=='supplier_list'){
                supplier_list_set(true)
              }
              if(element=='supplier_ledger'){
                supplier_ledger_set(true)
              }
              if(element=='supplier_transaction'){
                supplier_transaction_set(true)
              }
              // production
              if(element=='production_entry'){
                production_entry_set(true)
              }
              if(element=='material_purchase'){
                material_purchase_set(true)
              }
              if(element=='material_entry'){
                material_entry_set(true)
              }
              if(element=='material_names'){
                material_names_set(true)
              }
              
              if(element=='production_invoice'){
                production_invoice_set(true)
              }
              if(element=='material_purchase_invoice'){
                material_purchase_invoice_set(true)
              }
              if(element=='material_stock'){
                material_stock_set(true)
              }
              if(element=='material_ledger'){
                material_ledger_set(true)
              }
              if(element=='production_record'){
                production_record_set(true)
              }

              if(element=='material_damage_entry'){
                material_damage_entry_set(true)
              }
              if(element=='material_purchase_record'){
                material_purchase_record_set(true)
              }
              if(element=='material_damage_list'){
                material_damage_list_set(true)
              }
              if(element=='material_list'){
                material_list_set(true)
              }

              // Stock 
              if(element=='product_stock'){
                product_stock_set(true)
              }
              if(element=='product_damage'){
                product_damage_set(true)
              }
              if(element=='material_stock_m'){
                material_stock_m_set(true)
              }
              if(element=='product_transfer'){
                product_transfer_set(true)
              }
              if(element=='product_transfer_list'){
                product_transfer_list_set(true)
              }
              if(element=='product_receive_list'){
                product_receive_list_set(true)
              }
              if(element=='product_price_list'){
                product_price_list_set(true)
              }
              if(element=='product_ledger'){
                product_ledger_set(true)
              }
              if(element=='material_ledger'){
                material_ledger_set(true)
              }

              if(element=='product_damage_list'){
                product_damage_list_set(true)
              }

              if(element=='product_re_order_list'){
                product_re_order_list_set(true)
              }
              if(element=='material_re_order_list'){
                material_re_order_list_set(true)
              }

              // Accounts
              if(element=='cash_transaction'){
                cash_transaction_set(true)
              }
              if(element=='bank_transaction'){
                bank_transaction_set(true)
              }
              if(element=='customer_transaction_m'){
                customer_transaction_m_set(true)
              }
              if(element=='supplier_payment'){
                supplier_payment_set(true)
              }
              if(element=='transaction_accounts'){
                transaction_accounts_set(true)
              }
              if(element=='bank_accounts'){
                bank_accounts_set(true)
              }
              if(element=='cash_transaction_report_m'){
                cash_transaction_report_m_set(true)
              }
              if(element=='bank_transaction_report_m'){
                bank_transaction_report_m_set(true)
              }
              // HR Payroll
              if(element=='hrpayroll'){
                hrpayroll_set(true)
              }
              if(element=='salary'){
                salary_set(true)
              }
              if(element=='salary_report'){
                salary_report_set(true)
              }
              if(element=='employee_manage'){
                employee_manage_set(true)
              }
              if(element=='designation_manage'){
                designation_manage_set(true)
              }
              if(element=='department_manage'){
                department_manage_set(true)
              }
              if(element=='month_manage'){
                month_manage_set(true)
              }

              // Administration
              if(element=='product_manage'){
                product_manage_set(true)
              }
              if(element=='area_manage'){
                area_manage_set(true)
              }
              if(element=='product_name_entry'){
                product_name_entry_set(true)
              }
              if(element=='product_category'){
                product_category_set(true)
              }
              if(element=='product_unit'){
                product_unit_set(true)
              }
              if(element=='user_manage'){
                user_manage_set(true)
              }
              if(element=='branch_manage'){
                branch_manage_set(true)
              }
              if(element=='company_profile'){
                company_profile_set(true)
              }

              // Reports
              if(element=='r_cash_bank_balance'){
                r_cash_bank_balance_set(true)
              }
              if(element=='r_profit_loss'){
                r_profit_loss_set(true)
              }
              if(element=='r_cash_statement'){
                r_cash_statement_set(true)
                }
              
              if(element=='r_material_stock'){
                r_material_stock_set(true)
              }
              if(element=='r_product_stock'){
                r_product_stock_set(true)
              }
              if(element=='r_customer_ledger'){
                r_customer_ledger_set(true)
              }
              if(element=='r_supplier_ledger'){
                r_supplier_ledger_set(true)
              }
              if(element=='r_material_ledger'){
                r_material_ledger_set(true)
              }
              if(element=='r_product_ledger'){
                r_product_ledger_set(true)
              }
              if(element=='r_supplier_due_list'){
                r_supplier_due_list_set(true)
              }
              if(element=='r_customer_due_list'){
                r_customer_due_list_set(true)
              }
              if(element=='r_sales_invoice'){
                r_sales_invoice_set(true)
              }
              if(element=='r_quotation_invoice'){
                r_quotation_invoice_set(true)
              }
              if(element=='r_purchase_invoice'){
                r_purchase_invoice_set(true)
              }
              if(element=='r_production_invoice'){
                r_production_invoice_set(true)
              }
              if(element=='r_material_purchase_invoice'){
                r_material_purchase_invoice_set(true)
              }
              if(element=='r_customer_transaction'){
                r_customer_transaction_set(true)
              }
              if(element=='r_supplier_transaction'){
                r_supplier_transaction_set(true)
              }
              if(element=='r_cash_transaction'){
                r_cash_transaction_set(true)
              }
              if(element=='r_bank_transaction'){
                r_bank_transaction_set(true)
              }
              if(element=='r_salary_payment'){
                r_salary_payment_set(true)
              }
              if(element=='r_sales_record'){
                r_sales_record_set(true)
              }
              if(element=='r_quotation_record'){
                r_quotation_record_set(true)
              }
              if(element=='r_purchase_record'){
                r_purchase_record_set(true)
              }
              if(element=='r_production_record'){
                r_production_record_set(true)
              }
              if(element=='r_material_pur_record'){
                r_material_pur_record_set(true)
              }
              if(element=='r_prod_transfer_record'){
                r_prod_transfer_record_set(true)
              }
              if(element=='r_prod_receive_record'){
                r_prod_receive_record_set(true)
              }
              if(element=='r_sales_return_list'){
                r_sales_return_list_set(true)
              }
              if(element=='r_purchase_return_list'){
                r_purchase_return_list_set(true)
              }
              if(element=='r_customer_list'){
                r_customer_list_set(true)
              }
              if(element=='r_supplier_list'){
                r_supplier_list_set(true)
              }
              if(element=='r_material_damage_list'){
                r_material_damage_list_set(true)
              }
              if(element=='r_material_list'){
                r_material_list_set(true)
              }
              if(element=='r_product_damage_list'){
                r_product_damage_list_set(true)
              }
              if(element=='r_product_list'){
                r_product_list_set(true)
              }
              if(element=='bank_acount_ledger'){
                bank_account_ledger_set(true)
              }

             if(element=='customer_transaction_invoice'){
               customer_transaction_invoice_set(true)
              }

              if(element=='cash_transaction_d_w'){
                cash_transaction_d_w_set(true)
               }



               if(element=='cash_ledger'){
                cash_ledger_set(true)
               }

               if(element=='daily_ledger'){
                daily_ledger_set(true)
               }


           
              




              
      });
     }
     

    // Sales
    const [sales, sales_set] = useState(true);
    const [sales_entry, sales_entry_set] = useState(false);
    const [sales_record, sales_record_set] = useState(false);
    const [sales_invoice, sales_invoice_set] = useState(false);
    const [customer_entry, customer_entry_set] = useState(false);
    const [quotation_entry, quotation_entry_set] = useState(false);
    const [quotation_record, quotation_record_set] = useState(false);
    const [quotation_invoice, quotation_invoice_set] = useState(false);
    const [sales_return, sales_return_set] = useState(false);
    const [sales_return_record, sales_return_record_set] = useState(false);
    const [customer_due_list, customer_due_list_set] = useState(false);
    const [customer_list, customer_list_set] = useState(false);
    const [customer_ledger, customer_ledger_set] = useState(false);
    const [customer_transaction, customer_transaction_set] = useState(false);

    // Service
    const [service, service_set] = useState(false);
    const [service_entry, service_entry_set] = useState(false);
    const [service_expense_entry, service_expense_entry_set] = useState(false);
    const [service_record, service_record_set] = useState(false);
    const [service_expense_record, service_expense_record_set] = useState(false);
    const [service_invoice, service_invoice_set] = useState(false);
    const [service_expense_invoice, service_expense_invoice_set] = useState(false);
    const [service_report, service_report_set] = useState(false);

 

  // Purchase
  const [purchase, purchase_set] = useState(true);
  const [purchase_entry, purchase_entry_set] = useState(false);
  const [purchase_record, purchase_record_set] = useState(false);
  const [purchase_invoice, purchase_invoice_set] = useState(false);
  const [supplier_entry, supplier_entry_set] = useState(false);
  const [purchase_return, purchase_return_set] = useState(false);
  const [purchase_return_list, purchase_return_list_set] = useState(false);
  const [supplier_due_list, supplier_due_list_set] = useState(false);
  const [supplier_list, supplier_list_set] = useState(false);
  const [supplier_ledger, supplier_ledger_set] = useState(false);
  const [supplier_transaction, supplier_transaction_set] = useState(false);

//  Production
const [production, production_set] = useState(true);
const [production_entry, production_entry_set] = useState(false);
const [material_purchase, material_purchase_set] = useState(false);
const [material_entry, material_entry_set] = useState(false);
const [material_names, material_names_set] = useState(false);
const [material_damage_entry, material_damage_entry_set] = useState(false);
const [production_invoice, production_invoice_set] = useState(false);
const [material_purchase_invoice, material_purchase_invoice_set] = useState(false);
const [material_stock, material_stock_set] = useState(false);
const [material_ledger, material_ledger_set] = useState(false);
const [production_record, production_record_set] = useState(false);
const [material_purchase_record, material_purchase_record_set] = useState(false);
const [material_damage_list, material_damage_list_set] = useState(false);
const [material_list, material_list_set] = useState(false);


// Stock 
const [stock, stock_set] = useState(false);
const [product_stock, product_stock_set] = useState(false);
const [product_damage, product_damage_set] = useState(false);
const [material_stock_m, material_stock_m_set] = useState(false);
const [product_transfer, product_transfer_set] = useState(false);
const [product_transfer_list, product_transfer_list_set] = useState(false);
const [product_receive_list, product_receive_list_set] = useState(false);
const [product_damage_list, product_damage_list_set] = useState(false);
const [product_price_list, product_price_list_set] = useState(false);
const [product_ledger, product_ledger_set] = useState(false);
const [material_ledger_m, material_ledger_m_set] = useState(false);

const [product_re_order_list, product_re_order_list_set] = useState(false);
const [material_re_order_list, material_re_order_list_set] = useState(false);

// Accounts
const [accounts, accounts_set] = useState(false);
const [cash_transaction, cash_transaction_set] = useState(false);
const [bank_transaction, bank_transaction_set] = useState(false);
const [customer_transaction_m, customer_transaction_m_set] = useState(false);
const [supplier_payment, supplier_payment_set] = useState(false);
const [transaction_accounts, transaction_accounts_set] = useState(false);
const [bank_accounts, bank_accounts_set] = useState(false);
const [cash_transaction_report_m, cash_transaction_report_m_set] = useState(false);
const [bank_transaction_report_m, bank_transaction_report_m_set] = useState(false);

const [cash_ledger, cash_ledger_set] = useState(false);
const [daily_ledger, daily_ledger_set] = useState(false);

// HR Payroll
const [hrpayroll, hrpayroll_set] = useState(false);
const [salary, salary_set] = useState(false);
const [salary_report, salary_report_set] = useState(false);
const [employee_manage, employee_manage_set] = useState(false);
const [designation_manage, designation_manage_set] = useState(false);
const [department_manage, department_manage_set] = useState(false);
const [month_manage, month_manage_set] = useState(false);

// Administration
const [administration, administration_set] = useState(false);
const [product_manage, product_manage_set] = useState(false);
const [area_manage, area_manage_set] = useState(false);
const [product_name_entry, product_name_entry_set] = useState(false);
const [product_category, product_category_set] = useState(false);
const [product_unit, product_unit_set] = useState(false);
const [user_manage, user_manage_set] = useState(false);
const [branch_manage, branch_manage_set] = useState(false);
const [company_profile, company_profile_set] = useState(false);

// Reports
const [reports, reports_set] = useState(false);
const [r_cash_bank_balance, r_cash_bank_balance_set] = useState(false);
const [r_profit_loss, r_profit_loss_set] = useState(false);
const [r_cash_statement, r_cash_statement_set] = useState(false);

const [r_material_stock, r_material_stock_set] = useState(false);
const [r_product_stock, r_product_stock_set] = useState(false);
const [r_customer_ledger, r_customer_ledger_set] = useState(false);
const [r_supplier_ledger, r_supplier_ledger_set] = useState(false);
const [r_material_ledger, r_material_ledger_set] = useState(false);
const [r_product_ledger, r_product_ledger_set] = useState(false);
const [r_supplier_due_list, r_supplier_due_list_set] = useState(false);
const [r_customer_due_list, r_customer_due_list_set] = useState(false);
const [r_sales_invoice, r_sales_invoice_set] = useState(false);
const [r_quotation_invoice, r_quotation_invoice_set] = useState(false);
const [r_purchase_invoice, r_purchase_invoice_set] = useState(false);
const [r_production_invoice, r_production_invoice_set] = useState(false);
const [r_material_purchase_invoice, r_material_purchase_invoice_set] = useState(false);
const [r_customer_transaction, r_customer_transaction_set] = useState(false);
const [r_supplier_transaction, r_supplier_transaction_set] = useState(false);
const [r_cash_transaction, r_cash_transaction_set] = useState(false);
const [r_bank_transaction, r_bank_transaction_set] = useState(false);
const [r_salary_payment, r_salary_payment_set] = useState(false);
const [r_sales_record, r_sales_record_set] = useState(false);
const [r_quotation_record, r_quotation_record_set] = useState(false);
const [r_purchase_record, r_purchase_record_set] = useState(false);
const [r_production_record, r_production_record_set] = useState(false);
const [r_material_pur_record, r_material_pur_record_set] = useState(false);
const [r_prod_transfer_record, r_prod_transfer_record_set] = useState(false);
const [r_prod_receive_record, r_prod_receive_record_set] = useState(false);
const [r_sales_return_list, r_sales_return_list_set] = useState(false);
const [r_purchase_return_list, r_purchase_return_list_set] = useState(false);
const [r_customer_list, r_customer_list_set] = useState(false);
const [r_supplier_list, r_supplier_list_set] = useState(false);
const [r_material_damage_list, r_material_damage_list_set] = useState(false);
const [r_material_list, r_material_list_set] = useState(false);
const [r_product_damage_list, r_product_damage_list_set] = useState(false);
const [r_product_list, r_product_list_set] = useState(false);
const [bank_account_ledger, bank_account_ledger_set] = useState(false);
const [customer_transaction_invoice, customer_transaction_invoice_set] = useState(false);
const [cash_transaction_d_w, cash_transaction_d_w_set] = useState(false);

    const history = useHistory();
    
      return(
          <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-4px 0px 2px',
    marginBottom: '2px',color: '#3e8d54',
    fontSize: '18px'}}>User Access for {user_full_name}  </h4>

            <Grid container spacing={3}>
            <Grid item xs={12} sm={3} >
        
        <FormControl component="fieldset" className={classes.formControl}>

        <FormControlLabel style={{marginLeft: '-32px'}} 
            control={<Checkbox checked={sales}  onChange={(e)=>moduleAllCheck(e)} name="sales"  />}
            label="Sales"
          />

          
        <FormGroup>
        <div id="sales">
          <FormControlLabel
            control={<CheckboxIndependant checked={sales_entry} onChange={(e)=>handleChange(e,sales_entry,sales_entry_set)} name="sales_entry" />}
            label="Sales Entry" 
          />

<FormControlLabel
            control={<CheckboxIndependant checked={customer_entry} onChange={(e)=>handleChange(e,customer_entry,customer_entry_set)} name="customer_entry" />}
            label="Customer Entry" 
          />


          <FormControlLabel
            control={<CheckboxIndependant checked={sales_record} onChange={(e)=>handleChange(e,sales_record,sales_record_set)} name="sales_record" />}
            label="Sales Record"
          /> 
          <FormControlLabel
          control={<CheckboxIndependant checked={sales_invoice} onChange={(e)=>handleChange(e,sales_invoice,sales_invoice_set)} name="sales_invoice" />}
          label="Sales Invoice"
        />
       
        <FormControlLabel
          control={<CheckboxIndependant checked={quotation_entry} onChange={(e)=>handleChange(e,quotation_entry,quotation_entry_set)} name="quotation_entry" />}
          label="Quotation Entry"
        />
        <FormControlLabel
          control={<CheckboxIndependant checked={quotation_record} onChange={(e)=>handleChange(e,quotation_record,quotation_record_set)} name="quotation_record" />}
          label="Quotation Record"
        />
         <FormControlLabel
          control={<CheckboxIndependant checked={quotation_invoice} onChange={(e)=>handleChange(e,quotation_invoice,quotation_invoice_set)} name="quotation_invoice" />}
          label="Quotation Invoice"
        />

<FormControlLabel
          control={<CheckboxIndependant checked={sales_return} onChange={(e)=>handleChange(e,sales_return,sales_return_set)} name="sales_return" />}
          label="Sales Return"
        />
        <FormControlLabel
          control={<CheckboxIndependant checked={sales_return_record} onChange={(e)=>handleChange(e,sales_return_record,sales_return_record_set)} name="sales_return_record" />}
          label="Sales Return Record"
        />

<FormControlLabel
          control={<CheckboxIndependant checked={customer_due_list} onChange={(e)=>handleChange(e,customer_due_list,customer_due_list_set)} name="customer_due_list" />}
          label="Customer Due List"
        />

<FormControlLabel
          control={<CheckboxIndependant checked={customer_list} onChange={(e)=>handleChange(e,customer_list,customer_list_set)} name="customer_list" />}
          label="Customer  List"
        />

<FormControlLabel
          control={<CheckboxIndependant checked={customer_ledger} onChange={(e)=>handleChange(e,customer_ledger,customer_ledger_set)} name="customer_ledger" />}
          label="Customer Ledger"
        />

<FormControlLabel
          control={<CheckboxIndependant checked={customer_transaction} onChange={(e)=>handleChange(e,customer_transaction,customer_transaction_set)} name="customer_transaction" />}
          label="Customer Transaction"
        />
         </div>
        </FormGroup>
        <FormHelperText>Sales Module End</FormHelperText>
      </FormControl>
     
             </Grid>



             <Grid item xs={12} sm={3} >
        
        <FormControl component="fieldset" className={classes.formControl}>

        <FormControlLabel style={{marginLeft: '-32px'}} 
            control={<Checkbox checked={service}  onChange={(e)=>moduleAllCheck(e)} name="service"  />}
            label="Service"
          />

          
        <FormGroup>
        <div id="service">
          <FormControlLabel
            control={<CheckboxIndependant checked={service_entry} onChange={(e)=>handleChange(e,service_entry,service_entry_set)} name="service_entry" />}
            label="Service Entry" 
          />

<FormControlLabel
            control={<CheckboxIndependant checked={service_expense_entry} onChange={(e)=>handleChange(e,service_expense_entry,service_expense_entry_set)} name="service_expense_entry" />}
            label="Service Expense Entry" 
          />

<FormControlLabel
            control={<CheckboxIndependant checked={service_record} onChange={(e)=>handleChange(e,service_record,service_record_set)} name="service_record" />}
            label="Service Record" 
          />

<FormControlLabel
            control={<CheckboxIndependant checked={service_expense_record} onChange={(e)=>handleChange(e,service_expense_record,service_expense_record_set)} name="service_expense_record" />}
            label="Service Expense Record" 
          />

<FormControlLabel
            control={<CheckboxIndependant checked={service_invoice} onChange={(e)=>handleChange(e,service_invoice,service_invoice_set)} name="service_invoice" />}
            label="Service Invoice" 
          />

<FormControlLabel
            control={<CheckboxIndependant checked={service_expense_invoice} onChange={(e)=>handleChange(e,service_expense_invoice,service_expense_invoice_set)} name="service_expense_invoice" />}
            label="Service Expense Invoice" 
          />

<FormControlLabel
            control={<CheckboxIndependant checked={service_report} onChange={(e)=>handleChange(e,service_report,service_report_set)} name="service_report" />}
            label="Service Report" 
          />


         </div>
        </FormGroup>
        <FormHelperText>Service Module End</FormHelperText>
      </FormControl>
     
             </Grid>




           


             <Grid item xs={12} sm={3} >
             <FormControl component="fieldset" className={classes.formControl}>

<FormControlLabel style={{marginLeft: '-32px'}} 
    control={<Checkbox checked={purchase}  onChange={(e)=>moduleAllCheck(e)} name="purchase"  />}
    label="Purchase"
  />

  
<FormGroup>
<div id="purchase">
  <FormControlLabel
    control={<CheckboxIndependant checked={purchase_entry} onChange={(e)=>handleChange(e,purchase_entry,purchase_entry_set)} name="purchase_entry" />}
    label="Purchase Entry" 
  />

<FormControlLabel
    control={<CheckboxIndependant checked={purchase_record} onChange={(e)=>handleChange(e,purchase_record,purchase_record_set)} name="purchase_record" />}
    label="Purchase Record" 
  />


<FormControlLabel
    control={<CheckboxIndependant checked={purchase_invoice} onChange={(e)=>handleChange(e,purchase_invoice,purchase_invoice_set)} name="purchase_invoice" />}
    label="Purchase Invoice" 
  />

<FormControlLabel
    control={<CheckboxIndependant checked={supplier_entry} onChange={(e)=>handleChange(e,supplier_entry,supplier_entry_set)} name="supplier_entry" />}
    label="Supplier Entry" 
  />
  <FormControlLabel
    control={<CheckboxIndependant checked={purchase_return} onChange={(e)=>handleChange(e,purchase_return,purchase_return_set)} name="purchase_return" />}
    label="Purchase Return" 
  />
  <FormControlLabel
    control={<CheckboxIndependant checked={purchase_return_list} onChange={(e)=>handleChange(e,purchase_return_list,purchase_return_list_set)} name="purchase_return_list" />}
    label="Purchase Return Record" 
  />

<FormControlLabel
    control={<CheckboxIndependant checked={supplier_due_list} onChange={(e)=>handleChange(e,supplier_due_list,supplier_due_list_set)} name="supplier_due_list" />}
    label="Purchase Due List" 
  />
  <FormControlLabel
    control={<CheckboxIndependant checked={supplier_list} onChange={(e)=>handleChange(e,supplier_list,supplier_list_set)} name="supplier_list" />}
    label="Supplier List" 
  />
  <FormControlLabel
    control={<CheckboxIndependant checked={supplier_ledger} onChange={(e)=>handleChange(e,supplier_ledger,supplier_ledger_set)} name="supplier_ledger" />}
    label="Supplier Ledger" 
  />

<FormControlLabel
    control={<CheckboxIndependant checked={supplier_transaction} onChange={(e)=>handleChange(e,supplier_transaction,supplier_transaction_set)} name="supplier_transaction" />}
    label="Supplier Transaction" 
  />

 
 </div>
</FormGroup>
<FormHelperText>Purchase Module End</FormHelperText>
</FormControl>
             </Grid>

             <Grid item xs={12} sm={3} >
             <FormControl component="fieldset" className={classes.formControl}>

<FormControlLabel style={{marginLeft: '-32px'}} 
    control={<Checkbox checked={production}  onChange={(e)=>moduleAllCheck(e)} name="production"  />}
    label="Menufacturing"
  />

  
<FormGroup>
<div id="production">
  <FormControlLabel
    control={<CheckboxIndependant checked={production_entry} onChange={(e)=>handleChange(e,production_entry,production_entry_set)} name="production_entry" />}
    label="Production Entry" 
  />
  <FormControlLabel
    control={<CheckboxIndependant checked={material_purchase} onChange={(e)=>handleChange(e,material_purchase,material_purchase_set)} name="material_purchase" />}
    label="Material Purchase" 
  />
  <FormControlLabel
    control={<CheckboxIndependant checked={material_entry} onChange={(e)=>handleChange(e,material_entry,material_entry_set)} name="material_entry" />}
    label="Material Entry" 
  />

<FormControlLabel
    control={<CheckboxIndependant checked={material_names} onChange={(e)=>handleChange(e,material_names,material_names_set)} name="material_names" />}
    label="Material Names Entry" 
  />

<FormControlLabel
    control={<CheckboxIndependant checked={material_damage_entry} onChange={(e)=>handleChange(e,material_damage_entry,material_damage_entry_set)} name="material_damage_entry" />}
    label="Material Damage Entry" 
  />
<FormControlLabel
    control={<CheckboxIndependant checked={production_invoice} onChange={(e)=>handleChange(e,production_invoice,production_invoice_set)} name="production_invoice" />}
    label="Production Invoice" 
  />
 <FormControlLabel
    control={<CheckboxIndependant checked={material_purchase_invoice} onChange={(e)=>handleChange(e,material_purchase_invoice,material_purchase_invoice_set)} name="material_purchase_invoice" />}
    label="Material Purchase Invoice" 
  />
  <FormControlLabel
    control={<CheckboxIndependant checked={material_stock} onChange={(e)=>handleChange(e,material_stock,material_stock_set)} name="material_stock" />}
    label="Material  Stock" 
  />
   <FormControlLabel
    control={<CheckboxIndependant checked={material_ledger} onChange={(e)=>handleChange(e,material_ledger,material_ledger_set)} name="material_ledger" />}
    label="Material  Ledger" 
  />
   <FormControlLabel
    control={<CheckboxIndependant checked={production_record} onChange={(e)=>handleChange(e,production_record,production_record_set)} name="production_record" />}
    label="Production Record" 
  />
  <FormControlLabel
    control={<CheckboxIndependant checked={material_purchase_record} onChange={(e)=>handleChange(e,material_purchase_record,material_purchase_record_set)} name="material_purchase_record" />}
    label="Material Purchase Record" 
  />
    <FormControlLabel
    control={<CheckboxIndependant checked={material_damage_list} onChange={(e)=>handleChange(e,material_damage_list,material_damage_list_set)} name="material_damage_list" />}
    label="Material Damage List" 
  />

  <FormControlLabel
    control={<CheckboxIndependant checked={material_list} onChange={(e)=>handleChange(e,material_list,material_list_set)} name="material_list" />}
    label="Material  List" 
  />
 </div>
</FormGroup>
<FormHelperText>Production Module End</FormHelperText>
</FormControl>
             </Grid>

             <Grid item xs={12} sm={3} >
             <FormControl component="fieldset" className={classes.formControl}>

          <FormControlLabel style={{marginLeft: '-32px'}} 
              control={<Checkbox checked={stock}  onChange={(e)=>moduleAllCheck(e)} name="stock"  />}
              label="Inventory"
            />

            
          <FormGroup>
          <div id="stock">
            <FormControlLabel
              control={<CheckboxIndependant checked={product_stock} onChange={(e)=>handleChange(e,product_stock,product_stock_set)} name="product_stock" />}
              label="Product Stock" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={material_stock_m} onChange={(e)=>handleChange(e,material_stock_m,material_stock_m_set)} name="material_stock_m" />}
              label="Material Stock" 
            />
              <FormControlLabel
              control={<CheckboxIndependant checked={product_transfer} onChange={(e)=>handleChange(e,product_transfer,product_transfer_set)} name="product_transfer" />}
              label="Product Transfer" 
            />

<FormControlLabel
              control={<CheckboxIndependant checked={product_damage} onChange={(e)=>handleChange(e,product_damage,product_damage_set)} name="product_damage" />}
              label="Product Damage" 
            />
           
            <FormControlLabel
              control={<CheckboxIndependant checked={product_transfer_list} onChange={(e)=>handleChange(e,product_transfer_list,product_transfer_list_set)} name="product_transfer_list" />}
              label="Product Transfer List" 
            />

<FormControlLabel
              control={<CheckboxIndependant checked={product_receive_list} onChange={(e)=>handleChange(e,product_receive_list,product_receive_list_set)} name="product_receive_list" />}
              label="Product Receive List" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={product_damage_list} onChange={(e)=>handleChange(e,product_damage_list,product_damage_list_set)} name="product_damage_list" />}
              label="Product Damage List" 
            />
            
             <FormControlLabel
              control={<CheckboxIndependant checked={product_price_list} onChange={(e)=>handleChange(e,product_price_list,product_price_list_set)} name="product_price_list" />}
              label="Product Price List" 
            />


<FormControlLabel
              control={<CheckboxIndependant checked={material_re_order_list} onChange={(e)=>handleChange(e,material_re_order_list,material_re_order_list_set)} name="material_re_order_list" />}
              label="Material Re-Order List" 
            />
<FormControlLabel
              control={<CheckboxIndependant checked={product_re_order_list} onChange={(e)=>handleChange(e,product_re_order_list,product_re_order_list_set)} name="product_re_order_list" />}
              label="Product Re-Order List" 
            />





            <FormControlLabel
              control={<CheckboxIndependant checked={product_ledger} onChange={(e)=>handleChange(e,product_ledger,product_ledger_set)} name="product_ledger" />}
              label="Product Ledger" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={material_ledger} onChange={(e)=>handleChange(e,material_ledger,material_ledger_set)} name="material_ledger" />}
              label="Material Ledger" 
            />
           
          </div>
          </FormGroup>
          <FormHelperText>Inventory Module End</FormHelperText>
          </FormControl>
             </Grid>



             
             <Grid item xs={12} sm={3} >
             <FormControl component="fieldset" className={classes.formControl}>

          <FormControlLabel style={{marginLeft: '-32px'}} 
              control={<Checkbox checked={accounts}  onChange={(e)=>moduleAllCheck(e)} name="accounts"  />}
              label="Financial Accounting"
            />

            
          <FormGroup>
          <div id="accounts">
            <FormControlLabel
              control={<CheckboxIndependant checked={cash_transaction} onChange={(e)=>handleChange(e,cash_transaction,cash_transaction_set)} name="cash_transaction" />}
              label="Others Transaction" 
            />
          <FormControlLabel
              control={<CheckboxIndependant checked={bank_transaction} onChange={(e)=>handleChange(e,bank_transaction,bank_transaction_set)} name="bank_transaction" />}
              label="Bank Transaction" 
            />

<FormControlLabel
              control={<CheckboxIndependant checked={customer_transaction_m} onChange={(e)=>handleChange(e,customer_transaction_m,customer_transaction_m_set)} name="customer_transaction_m" />}
              label="Customer Transaction" 
            />
           <FormControlLabel
              control={<CheckboxIndependant checked={supplier_payment} onChange={(e)=>handleChange(e,supplier_payment,supplier_payment_set)} name="supplier_payment" />}
              label="Supplier Transaction" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={cash_transaction_d_w} onChange={(e)=>handleChange(e,cash_transaction_d_w,cash_transaction_d_w_set)} name="cash_transaction_d_w" />}
              label="Cash Transaction " 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={transaction_accounts} onChange={(e)=>handleChange(e,transaction_accounts,transaction_accounts_set)} name="transaction_accounts" />}
              label="Transaction Accounts" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={bank_accounts} onChange={(e)=>handleChange(e,bank_accounts,bank_accounts_set)} name="bank_accounts" />}
              label="Bank Accounts" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={cash_transaction_report_m} onChange={(e)=>handleChange(e,cash_transaction_report_m,cash_transaction_report_m_set)} name="cash_transaction_report_m" />}
              label="Cash Transaction Report" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={bank_transaction_report_m} onChange={(e)=>handleChange(e,bank_transaction_report_m,bank_transaction_report_m_set)} name="bank_transaction_report_m" />}
              label="Bank Transaction Report" 
            />


<FormControlLabel
              control={<CheckboxIndependant checked={cash_ledger} onChange={(e)=>handleChange(e,cash_ledger,cash_ledger_set)} name="cash_ledger" />}
              label="Cash Ledger" 
            />


<FormControlLabel
              control={<CheckboxIndependant checked={daily_ledger} onChange={(e)=>handleChange(e,daily_ledger,daily_ledger_set)} name="daily_ledger" />}
              label="Daily Ledger" 
            />

          </div>
          </FormGroup>
          <FormHelperText>Financial Accounting Module End</FormHelperText>
          </FormControl>
             </Grid>


               
             <Grid item xs={12} sm={3} >
             <FormControl component="fieldset" className={classes.formControl}>

          <FormControlLabel style={{marginLeft: '-32px'}} 
              control={<Checkbox checked={hrpayroll}  onChange={(e)=>moduleAllCheck(e)} name="hrpayroll"  />}
              label="HR Payroll"
            />

            
          <FormGroup>
          <div id="hrpayroll">
            <FormControlLabel
              control={<CheckboxIndependant checked={salary} onChange={(e)=>handleChange(e,salary,salary_set)} name="salary" />}
              label="Salary Payment" 
            />
            
            <FormControlLabel
            control={<CheckboxIndependant checked={salary_report} onChange={(e)=>handleChange(e,salary_report,salary_report_set)} name="salary_report" />}
            label="Salary Report" 
          />
          <FormControlLabel
              control={<CheckboxIndependant checked={employee_manage} onChange={(e)=>handleChange(e,employee_manage,employee_manage_set)} name="employee_manage" />}
              label="Employee Manage" 
            />


<FormControlLabel
              control={<CheckboxIndependant checked={designation_manage} onChange={(e)=>handleChange(e,designation_manage,designation_manage_set)} name="designation_manage" />}
              label="Designation Manage" 
            />

<FormControlLabel
              control={<CheckboxIndependant checked={department_manage} onChange={(e)=>handleChange(e,department_manage,department_manage_set)} name="department_manage" />}
              label="Department Manage" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={month_manage} onChange={(e)=>handleChange(e,month_manage,month_manage_set)} name="month_manage" />}
              label="Month Manage" 
            />

          
         
          </div>
          </FormGroup>
          <FormHelperText>HRPayroll Module End</FormHelperText>
          </FormControl>
             </Grid>
          
          

              
             <Grid item xs={12} sm={3} >
             <FormControl component="fieldset" className={classes.formControl}>

          <FormControlLabel style={{marginLeft: '-32px'}} 
              control={<Checkbox checked={administration}  onChange={(e)=>moduleAllCheck(e)} name="administration"  />}
              label="Administration"
            />

            
          <FormGroup>
          <div id="administration">
            <FormControlLabel
              control={<CheckboxIndependant checked={product_manage} onChange={(e)=>handleChange(e,product_manage,product_manage_set)} name="product_manage" />}
              label="Product Manage" 
            />
            
            <FormControlLabel
              control={<CheckboxIndependant checked={area_manage} onChange={(e)=>handleChange(e,area_manage,area_manage_set)} name="area_manage" />}
              label="Area Manage" 
            />
            
            <FormControlLabel
              control={<CheckboxIndependant checked={product_name_entry} onChange={(e)=>handleChange(e,product_name_entry,product_name_entry_set)} name="product_name_entry" />}
              label="Product Name Entry" 
            />
            
            <FormControlLabel
              control={<CheckboxIndependant checked={product_category} onChange={(e)=>handleChange(e,product_category,product_category_set)} name="product_category" />}
              label="Product Category Entry" 
            />
            
            <FormControlLabel
              control={<CheckboxIndependant checked={product_unit} onChange={(e)=>handleChange(e,product_unit,product_unit_set)} name="product_unit" />}
              label="Product Unit Entry" 
            />
            
            <FormControlLabel
              control={<CheckboxIndependant checked={user_manage} onChange={(e)=>handleChange(e,user_manage,user_manage_set)} name="user_manage" />}
              label="User Manage" 
            />
            
            <FormControlLabel
              control={<CheckboxIndependant checked={branch_manage} onChange={(e)=>handleChange(e,branch_manage,branch_manage_set)} name="branch_manage" />}
              label="Branch Manage" 
            />

            
            <FormControlLabel
              control={<CheckboxIndependant checked={company_profile} onChange={(e)=>handleChange(e,company_profile,company_profile_set)} name="company_profile" />}
              label="Company Profile" 
            />
            

          
         
          </div>
          </FormGroup>
          <FormHelperText>Administration Module End</FormHelperText>
          </FormControl>
             </Grid>


                
             <Grid item xs={12} sm={3} >
             <FormControl component="fieldset" className={classes.formControl}>

          <FormControlLabel style={{marginLeft: '-32px'}} 
              control={<Checkbox checked={reports}  onChange={(e)=>moduleAllCheck(e)} name="reports"  />}
              label="Reports"
            />

            
          <FormGroup>
          <div id="reports">
            <FormControlLabel
              control={<CheckboxIndependant checked={r_cash_bank_balance} onChange={(e)=>handleChange(e,r_cash_bank_balance,r_cash_bank_balance_set)} name="r_cash_bank_balance" />}
              label="Cash & Bank Balance" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_profit_loss} onChange={(e)=>handleChange(e,r_profit_loss,r_profit_loss_set)} name="r_profit_loss" />}
              label="Profit & Loss" 
            />


<FormControlLabel
              control={<CheckboxIndependant checked={r_cash_statement} onChange={(e)=>handleChange(e,r_cash_statement,r_cash_statement_set)} name="r_cash_statement" />}
              label="Cash Statement" 
            />

<FormControlLabel
              control={<CheckboxIndependant checked={customer_transaction_invoice} onChange={(e)=>handleChange(e,customer_transaction_invoice,customer_transaction_invoice_set)} name="customer_transaction_invoice" />}
              label="Customer Transaction Invoice" 
            />



            <FormControlLabel
              control={<CheckboxIndependant checked={r_material_stock} onChange={(e)=>handleChange(e,r_material_stock,r_material_stock_set)} name="r_material_stock" />}
              label="Material Stock" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={r_product_stock} onChange={(e)=>handleChange(e,r_product_stock,r_product_stock_set)} name="r_product_stock" />}
              label="Product Stock" 
            />

<FormControlLabel
              control={<CheckboxIndependant checked={bank_account_ledger} onChange={(e)=>handleChange(e,bank_account_ledger,bank_account_ledger_set)} name="bank_account_ledger" />}
              label="Bank Account Ledger" 
            />

             <FormControlLabel
              control={<CheckboxIndependant checked={r_customer_ledger} onChange={(e)=>handleChange(e,r_customer_ledger,r_customer_ledger_set)} name="r_customer_ledger" />}
              label="Customer Ledger" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_supplier_ledger} onChange={(e)=>handleChange(e,r_supplier_ledger,r_supplier_ledger_set)} name="r_supplier_ledger" />}
              label="Supplier Ledger" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_material_ledger} onChange={(e)=>handleChange(e,r_material_ledger,r_material_ledger_set)} name="r_material_ledger" />}
              label="Material Ledger" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_product_ledger} onChange={(e)=>handleChange(e,r_product_ledger,r_product_ledger_set)} name="r_product_ledger" />}
              label="Product Ledger" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={r_supplier_due_list} onChange={(e)=>handleChange(e,r_supplier_due_list,r_supplier_due_list_set)} name="r_supplier_due_list" />}
              label="Supplier Due List" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={r_customer_due_list} onChange={(e)=>handleChange(e,r_customer_due_list,r_customer_due_list_set)} name="r_customer_due_list" />}
              label="Customer Due List" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={r_sales_invoice} onChange={(e)=>handleChange(e,r_sales_invoice,r_sales_invoice_set)} name="r_sales_invoice" />}
              label="Sales Invoice" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={r_quotation_invoice} onChange={(e)=>handleChange(e,r_quotation_invoice,r_quotation_invoice_set)} name="r_quotation_invoice" />}
              label="Quotation Invoice" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={r_purchase_invoice} onChange={(e)=>handleChange(e,r_purchase_invoice,r_purchase_invoice_set)} name="r_purchase_invoice" />}
              label="Purchase Invoice" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={r_production_invoice} onChange={(e)=>handleChange(e,r_production_invoice,r_production_invoice_set)} name="r_production_invoice" />}
              label="Production Invoice" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={r_material_purchase_invoice} onChange={(e)=>handleChange(e,r_material_purchase_invoice,r_material_purchase_invoice_set)} name="r_material_purchase_invoice" />}
              label="Material Purchase Invoice" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={r_customer_transaction} onChange={(e)=>handleChange(e,r_customer_transaction,r_customer_transaction_set)} name="r_customer_transaction" />}
              label="Customer Transaction Report" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={r_supplier_transaction} onChange={(e)=>handleChange(e,r_supplier_transaction,r_supplier_transaction_set)} name="r_supplier_transaction" />}
              label="Supplier Transaction Report" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={r_cash_transaction} onChange={(e)=>handleChange(e,r_cash_transaction,r_cash_transaction_set)} name="r_cash_transaction" />}
              label="Cash Transaction Report" 
            />
         <FormControlLabel
              control={<CheckboxIndependant checked={r_bank_transaction} onChange={(e)=>handleChange(e,r_bank_transaction,r_bank_transaction_set)} name="r_bank_transaction" />}
              label="Bank Transaction Report" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_salary_payment} onChange={(e)=>handleChange(e,r_salary_payment,r_salary_payment_set)} name="r_salary_payment" />}
              label="Salary Payment Report" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_sales_record} onChange={(e)=>handleChange(e,r_sales_record,r_sales_record_set)} name="r_sales_record" />}
              label="Sales Record" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_quotation_record} onChange={(e)=>handleChange(e,r_quotation_record,r_quotation_record_set)} name="r_quotation_record" />}
              label="Quotation Record" 
            />
              <FormControlLabel
              control={<CheckboxIndependant checked={r_purchase_record} onChange={(e)=>handleChange(e,r_purchase_record,r_purchase_record_set)} name="r_purchase_record" />}
              label="Purchase Record" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_production_record} onChange={(e)=>handleChange(e,r_production_record,r_production_record_set)} name="r_production_record" />}
              label="Production Record" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_material_pur_record} onChange={(e)=>handleChange(e,r_material_pur_record,r_material_pur_record_set)} name="r_material_pur_record" />}
              label="Material Purchase Record" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_prod_transfer_record} onChange={(e)=>handleChange(e,r_prod_transfer_record,r_prod_transfer_record_set)} name="r_prod_transfer_record" />}
              label="Product Transfer Record" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_prod_receive_record} onChange={(e)=>handleChange(e,r_prod_receive_record,r_prod_receive_record_set)} name="r_prod_receive_record" />}
              label="Product Receive Record" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={r_sales_return_list} onChange={(e)=>handleChange(e,r_sales_return_list,r_sales_return_list_set)} name="r_sales_return_list" />}
              label="Sales Return List" 
            />
            <FormControlLabel
              control={<CheckboxIndependant checked={r_purchase_return_list} onChange={(e)=>handleChange(e,r_purchase_return_list,r_purchase_return_list_set)} name="r_purchase_return_list" />}
              label="Purchase Return List" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_customer_list} onChange={(e)=>handleChange(e,r_customer_list,r_customer_list_set)} name="r_customer_list" />}
              label="Customer List" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_supplier_list} onChange={(e)=>handleChange(e,r_supplier_list,r_supplier_list_set)} name="r_supplier_list" />}
              label="Supplier List" 
            />
             <FormControlLabel 
              control={<CheckboxIndependant checked={r_material_damage_list} onChange={(e)=>handleChange(e,r_material_damage_list,r_material_damage_list_set)} name="r_material_damage_list" />}
              label="Material Damage List" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_material_list} onChange={(e)=>handleChange(e,r_material_list,r_material_list_set)} name="r_material_list" />}
              label="Material List" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_product_damage_list} onChange={(e)=>handleChange(e,r_product_damage_list,r_product_damage_list_set)} name="r_product_damage_list" />}
              label="Product Damage List" 
            />
             <FormControlLabel
              control={<CheckboxIndependant checked={r_product_list} onChange={(e)=>handleChange(e,r_product_list,r_product_list_set)} name="r_product_list" />}
              label="Product List" 
            />
          </div>
          </FormGroup>
          <FormHelperText>Reports Module End</FormHelperText>
          </FormControl>
             </Grid>

            <Grid item xs={12} sm={12} >


                    <Button style={{fontSize:'12px'}} 
                            onClick={()=>userAccessSave()}
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            startIcon={<SaveIcon/>}
                        >
                       Save Access
                      </Button>


                      <Button style={{fontSize:'12px',marginLeft: '20px'}} 
                            
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            onClick={()=>userAccessBack()}
                            startIcon={<ArrowBackIcon/>}
                        >
                       Back
                      </Button>

                      
             </Grid>
            </Grid>
        </Paper>
   
          </div>
      )
}


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
      },
      formControl: {
        margin: theme.spacing(3),
      },
    root: {
      flexGrow: 1,
    },
    inputField:{
      width:'100%',
      marginTop:'5px'
    },
    plusLinkDiv:{
      position:'relative'  
    },
    plusLink:{
      margin: 0,
      padding: 0,
      marginTop: '-21px',
      fontSize: '29px',
      height: '21px',
      textAlign: 'right',
      position: 'absolute',
      right: 0,
      color: '#3e8d54'
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));


const mapStateToPops = (state)=>{
      return {
        currentRoute:state.currentRouteReducer,
        authInfo:state.authInfoReducer
      }
}
export default connect(mapStateToPops,{currentRouteSet})(UserAccess);