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
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'

import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import DateFnsUtils from '@date-io/date-fns'; // choose your lib

import './components/sale.css';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import swal from 'sweetalert';
import { CardContent } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import commaNumber from 'comma-number';
let format = commaNumber.bindWith(',', '.')




const SalesEntry = ({location,currentRoute,currentRouteSet,authInfo})=>{

    const classes = useStyles();
    const [selectedDate, handleDateChangeSet] = useState(currentDateTime);

    const history = useHistory();
   
    // States start 
       let [cart,cartSet] = useState([]);
       let [employees,employeesSet] = useState([]);
       let [customers,customersSet] = useState([]);
       let [products,productsSet] = useState([]);


       let [selectedEmployee,selectedEmployeeSet] = useState(null);
       let [selectedCustomer,selectedCustomerSet] = useState(null);
       let [selectedProduct,selectedProductSet] = useState(null);

       let [saveAction,saveActionSet] = useState(false);

       let [customerPayAccs,customerPayAccsSet] = useState([])
       let [customer_type,customer_type_set] = useState('retail');



       let [selectedCustomerPayMethod,selectedCustomerPayMethodSet] = useState({pay_method_id:'cash',pay_method:'Cash'},{pay_method_id:'bank',pay_method:'Bank'})
       let [selectedCustomerPayAcc,selectedCustomerPayAccSet] = useState(null)

       let [sale_invoice,sale_invoice_set] = useState('');
       let [sale_emp_id,sale_emp_id_set] = useState(0);
     
       let [sale_created_isodt,sale_created_isodt_set] = useState('');
       
       let [customer_name,customer_name_set] = useState('');
       let [customer_mobile_no,customer_mobile_no_set] = useState('');
       let [customer_address,customer_address_set] = useState('');

       let [product_rate,product_rate_set] = useState(0);
       let [product_qty,product_qty_set] = useState('');
       let [product_total,product_total_set] = useState(0);

       let [product_stock_status,product_stock_status_set] = useState('stock status');
       let [product_stock_qty,product_stock_qty_set] = useState('stock qty');
       let [product_unit,product_unit_set] = useState('unit');
       let [product_purchase_rate,product_purchase_rate_set] = useState('purchase rate');

       let [general_customer,general_customer_set] = useState(false);

       let [note,note_set] = useState('');
       let [sub_total,sub_total_set] = useState(0);
       let [previous_due,previous_due_set] = useState(0);
       let [vat,vat_set] = useState(0);
       let [vat_percent,vat_percent_set] = useState(0);
       let [discount,discount_set] = useState(0);
       let [discount_percent,discount_percent_set] = useState(0);
       let [total_amount,total_amount_set] = useState(0);
       let [paid,paid_set] = useState(0);
       let [due,due_set] = useState(0);
       let [transport_cost,transport_cost_set] = useState(0);
       let [saleAction,saleActionSet] = useState('create');
       let [saleId,saleIdSet] = useState(0);
       let [customer_credit_limit,customer_credit_limit_set] = useState(0);
       let customerPayMethods = [{pay_method_id:'cash',pay_method:'cash'},{pay_method_id:'bank',pay_method:'bank'}]

    // State End
    
    // Methods  start
       useEffect(()=>{
        selectedCustomerSet(null)
        customer_name_set('')
        customer_address_set('')
        customer_mobile_no_set('')
        selectedProductSet(null)
        product_rate_set('')
        if(customer_type=='retail'){
          getCustomers('retail')
        }
        if(customer_type=='wholesale'){
          getCustomers('wholesale')
        }
        
 
        let prods = products.map((prod)=>{
          if(customer_type=='wholesale'){
            prod.prod_rate = prod.prod_whole_sale_rate
          }
          if(customer_type=='retail'){
            prod.prod_rate = prod.prod_sale_rate
          }
          return prod;
        });

        productsSet(prods)

        
       },[customer_type])

      
       useEffect(()=>{
          currentRouteSet(pathSpliter(location.pathname,1));
          getInvoice()
          getEmployees()
          // getCustomers()
          getProducts()

          getTranAccs()

          if(pathSpliter(location.pathname,3) != undefined){
            saleActionSet('update');
            saleIdSet(parseFloat(pathSpliter(location.pathname,3)));
            getSales();
          }
          
         
          
       },[])


       const getTranAccs = async ()=>{
        await axios.post(`${API_URL}/api/get-bank-accounts`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          customerPayAccsSet(res.data.message)
        })
       } 




       // Calculate total 
     let  getSales = async ()=>{
         await axios.post(`${API_URL}/api/get-sales-with-details`,{reqPayload:{saleId:parseFloat(pathSpliter(location.pathname,3))}},{headers:{'auth-token':authInfo.token}}).then(async(res)=>{
               let sale = res.data.message[0];
               let cart = res.data.message[0].details;


               await axios.post(`${API_URL}/api/get-customer-due`,{customerId:sale.customer_id},{headers:{'auth-token':authInfo.token}}).then(res=>{
                if(res.data.length ==0){
                  previous_due_set(0)
                  return false
                } 
                previous_due_set(res.data[0].dueAmount)
              })

               sale_invoice_set(sale.sale_invoice);
               selectedEmployeeSet({employee_id:sale.sale_emp_id,employee_name:sale.employee_name});
               handleDateChangeSet(sale.sale_created_isodt);
               selectedCustomerSet({customer_name:sale.customer_name,display_text:sale.customer_name,customer_id:sale.customer_id})
               customer_name_set(sale.customer_name)
               customer_mobile_no_set(sale.customer_mobile_no)
               customer_address_set(sale.customer_address)
               customer_credit_limit_set(sale.customer_credit_limit);


              

               
              //sub_total_set(sale.sale_subtotal_amount)
              //  previous_due_set(sale.sale_previous_due);
               discount_set(sale.sale_discount_amount);
               discount_percent_set(sale.sale_discount_percent);
               vat_set(sale.sale_vat_amount);
               vat_percent_set(sale.sale_vat_percent);
               total_amount_set(sale.sale_total_amount);
               paid_set(sale.sale_paid_amount);
               due_set(sale.sale_due_amount);

              let newCart =  cart.map((ele)=>{
                 let product = {
                  prod_id: ele.sale_prod_id,
                  prod_name: ele.prod_name,
                  prod_sale_rate: ele.sale_rate,
                  prod_qty: ele.sale_qty,
                  prod_purchase_rate: ele.sale_prod_purchase_rate,
                  prod_total: ele.sale_prod_total
                 }
                 return product;
               })   
               cartSet(newCart);

               selectedCustomerPayMethodSet({pay_method_id:sale.sale_pay_method,pay_method:sale.sale_pay_method})
               selectedCustomerPayAccSet({bank_display_name:sale.bank_display_name,bank_acc_id:sale.sale_bank_id})
         });
       }
       
    useEffect(()=>{
        let subTotal = cart.reduce((prev,curr)=>{
          return prev+parseFloat(curr.prod_total);
        },0);

        sub_total_set(subTotal);

        let totalBill = (parseFloat(subTotal)+parseFloat(vat)+parseFloat(transport_cost))-(discount)
        total_amount_set(totalBill)
        if(general_customer){
          paid_set(totalBill)
          due_set(0)
        }else{
          due_set(totalBill-paid)
        }
    
  
    },[cart,sub_total,vat,vat_percent,discount,discount_percent,paid,due,selectedCustomer,transport_cost]) 

    let employeeRef = useRef(null)
    let dateRef = useRef(null)
    let customerRef = useRef(null)
    let productRef = useRef(null)
    let rateRef = useRef(null)
    let qtyRef = useRef(null)
    let addToCartRef = useRef(null)
    let vatRef = useRef(null)
    let vatPercentRef = useRef(null)
    let discountRef = useRef(null)
    let discountPercentRef = useRef(null)
    let paidRef = useRef(null)
    let dueRef = useRef(null)
    let saleRef = useRef(null)



   

       useEffect(()=>{
        product_total_set(product_rate*product_qty);
       },[product_rate,product_qty])

       useEffect(()=>{
         if(selectedProduct!=null){
           axios.post(`${API_URL}/api/get-product-current-stock`,{product_id:selectedProduct.prod_id},{headers:{'auth-token':authInfo.token}}).then(res=>{
            product_stock_qty_set(res.data.message)
           })
         }else{
          product_stock_qty_set('Stock Qty')
         }
       },[selectedProduct])
       
       let getInvoice = async ()=>{
           await axios.get(`${API_URL}/api/get-sales-invoice`,{headers:{'auth-token':authInfo.token}}).then(res=>{
                sale_invoice_set(res.data.message);
           })
       }

       let getEmployees = async ()=>{
           await axios.post(`${API_URL}/api/get-employees`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
                employeesSet( res.data.message)
          })
       }
       
       let getCustomers = async (type='retail')=>{
        await axios.post(`${API_URL}/api/get-customers`,{'select-type':'active','customer-type':type},{headers:{'auth-token':authInfo.token}}).then(res=>{
          res.data.message.unshift({customer_id:0,customer_name:'General customer',display_text:'General customer',customer_mobile_no:'',customer_address:'',customer_type:'general'})
          customersSet(res.data.message)
         });
       }

       let getProducts = async ()=>{
        await axios.post(`${API_URL}/api/get-individual-products`,{'select-type':'active',
           prodId : selectedProduct != null ? selectedProduct.prod_id : null,
       },{headers:{'auth-token':authInfo.token}}).then(res=>[
           productsSet(res.data.message)
        ]);
       }


       let productToCart = ()=>{
           if(selectedProduct==null){
             swal({title:'Select Product',icon:'warning'}); return false;
           }
          //  if(parseFloat(product_rate)<=0 || product_rate==''){
          //   swal({title:'Sale Rate is Invalid.',icon:'warning'}); return false;
          //  }
          //  if(parseFloat(product_qty)<=0 || product_qty==''){
          //   swal({title:'Quantity is Invalid ',icon:'warning'}); return false;
          //  }
           if(parseFloat(product_qty)>parseFloat(product_stock_qty) || parseFloat(product_stock_qty)<=0){
            swal({title:'Stock Unavailable',icon:'warning'}); return false;
           }
           let checkProdExist = cart.findIndex((curr)=>{
               if(curr.prod_id==selectedProduct.prod_id){
                  return true;
                }
           });
          //  if(checkProdExist>-1){
          //   let hardCopy =  [...cart];

          //   hardCopy[checkProdExist].prod_qty = parseFloat( hardCopy[checkProdExist].prod_qty) + parseFloat(product_qty)
          //   hardCopy[checkProdExist].prod_sale_rate =  product_rate == ''? 0 : product_rate
          //   hardCopy[checkProdExist].prod_total =  hardCopy[checkProdExist].prod_qty * product_rate
           
          //   cartSet(hardCopy)
    
          //  }else{
            cartSet([...cart,{prod_id: selectedProduct.prod_id,
              prod_name: selectedProduct.prod_name,
              prod_sale_rate: product_rate,prod_qty: product_qty,
              prod_purchase_rate: selectedProduct.prod_purchase_rate,
              prod_total: product_total}]); 
          //  }
                      
            product_rate_set(0);
            product_qty_set('');
            product_total_set(0);
            selectedProductSet(null); 
            productRef.current.focus();
           
       }

       let cartFromRemove = (index)=>{
        let hardCopy =  [...cart];
        hardCopy.splice(index, 1);
        cartSet(hardCopy)
       }


    

    const [purchaseRateShow,purchaseRateShowSet] = useState(true);

    let purchaseRateShowAction = ()=>{
        if(purchaseRateShow==true){
          purchaseRateShowSet(false)
        }else{
          purchaseRateShowSet(true)
        }
    }

    let saleSaveAction = async ()=>{
        if(selectedCustomer==null){
          swal({title:'Customer is required.',icon:'warning'});return false;
        }
        if(cart.length==0){
          swal({title:'Cart is Empty.',icon:'warning'});return false;
        }

        if(paid > 0 && selectedCustomerPayMethod == null){
          swal({
            title:'Select Payment  Receive Method',
            icon:'warning'
          });
          return false;
        }

        if(paid > 0 &&  selectedCustomerPayMethod != null && selectedCustomerPayMethod.pay_method_id=='bank' && selectedCustomerPayAcc == null ){
          swal({
            title:'Select  Payment Receive Account ',
            icon:'warning'
          });
          return false;
        }

        if(parseFloat(paid) <= 0 && selectedCustomerPayMethod !=null && selectedCustomerPayMethod.pay_method_id =='bank'){
          swal({
            title:'Paymentable Amount is 0 ',
            icon:'warning'
          });
          return false;
        }

        
        let sale = {
            sale_invoice,
            sale_emp_id: selectedEmployee != null? selectedEmployee.employee_id:0,
            created_isodt: selectedDate,
            customer_id: selectedCustomer.customer_id,
            customer_name: customer_name,
            customer_mobile_no: customer_mobile_no,
            customer_address: customer_address,
            sale_transport_cost:transport_cost,
            sub_total,
            previous_due,
            vat,
            vat_percent,
            discount,
            discount_percent,
            total_amount,
            paid,
            due,
            sale_id:saleId,
            sale_cus_type :  selectedCustomer.customer_type == undefined ? 'general':selectedCustomer.customer_type,
            sale_pay_method : selectedCustomerPayMethod !=null? selectedCustomerPayMethod.pay_method_id:'cash',
            sale_bank_id :   selectedCustomerPayMethod==null || selectedCustomerPayMethod.pay_method_id =='cash' ? 0 :selectedCustomerPayAcc.bank_acc_id,
            note
        }



        let totalDue =  parseFloat(previous_due)+parseFloat(due)
       
        // if(!general_customer && totalDue > customer_credit_limit && customer_credit_limit != 0){
        //   swal({
        //      title:`Credit Limit is  ${format(parseFloat(customer_credit_limit).toFixed(2))}. Total Due is ${format(parseFloat(totalDue).toFixed(2))}  `,
        //      icon:'warning'
        //   });
        //   return false;
        // }
       
        let url = `/api/save-sale`
        if(saleAction=='update'){
            url = `/api/update-sale`
        }
        saveActionSet(true)
         await axios.post(`${API_URL}${url}`,{cart,sale},{headers:{'auth-token':authInfo.token}}).then(res=>{
          
          if(!res.data.error){
            swal({title:`${res.data.message.msg} successfully. Do you want to view invoice?`,icon:'success',buttons:true}).then(confirm=>{
              if(confirm){
                history.push(`/sales/sales-invoice/${res.data.message.saleId}`)
                saveActionSet(false)
              }else{
                window.location.reload()
              }
            })
          }

          

         })
    }
    
      return(
          <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '2px'}}>Sales Entry</h4>
<Grid container spacing={3} > 
          <Grid item  xs={12} sm={2}>
            <TextField label="invoice no" variant="outlined" value={sale_invoice} disabled className={classes.fullWidth} onChange={(e)=>sale_invoice_set(e.target.value)} name="sale_invoice" />
          </Grid> 
          <Grid item  xs={12}  sm={2}> 
          <Autocomplete 
          size="small"
              onKeyDown={(e)=>{
                if(e.key=='Enter'){
                  dateRef.current.focus()
                }
              }}
              value={selectedEmployee}
              openOnFocus={true}
              autoHighlight={true}
              style={{width:'100%',height:'20px'}}
              loading={true}
              options={employees}
              onChange={(e,employee)=>{
               selectedEmployeeSet(employee)
              }}
              getOptionLabel={(option) => option.employee_name}
              renderInput={(params) => <TextField
                {...params} 
                label="Sales by" 
                variant="outlined"

                />}
                
          />

          </Grid>

          

          <Grid item  xs={12}  sm={2} > 
            <MuiPickersUtilsProvider  utils={DateFnsUtils}>
          
            <KeyboardDateTimePicker
            style={{ width: '100%',marginTop: '' }}
            value={selectedDate}
            inputRef={dateRef}
            onKeyDown={(e)=>{
              if(e.key=='Enter'){
                customerRef.current.focus()
              }
            }}
            onChange={handleDateChangeSet}
            name="sale_date"
            label="Sales date  time"
            format="yyyy/MM/dd hh:mm a"
               />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        </Paper>

<Grid container spacing={3} >
        <Grid item xs={12} sm={8} >
          <Paper className={classes.paper}>
          <h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '0px'}}>Customer   & Product Information</h4>
          <Grid container spacing={3} >

        


                <Grid item xs={12} sm={5} className={classes.plusLinkDiv}>

                <Grid item xs={12} sm={5} >
                <FormControl component="fieldset" > 

            {/* <FormLabel component="legend" style={{textAlign:'left'}}>Customer Type</FormLabel> */}
            <RadioGroup row aria-label="customer_type" name="position" style={{    display: 'flex',
    flexWrap: 'initial'}}   defaultValue={customer_type} onChange={(e)=>{
     
      customer_type_set(e.target.value)}} >
              <FormControlLabel value="retail" control={<Radio color="primary" />} label="Retail " />
              <FormControlLabel value="wholesale" control={<Radio color="primary" />} label="WholeSale " />
            </RadioGroup>
            </FormControl>

            </Grid>


                <Link className={classes.plusLink} to="/sales/customers-manage" >+</Link> 
                <Autocomplete
                
             autoHighlight={true}
              size="small"
              openOnFocus={true}
              style={{width:'100%'}}
              options={customers}
              value={selectedCustomer}
              loading={true}
              onChange={async (e,customer)=>{
               
                selectedCustomerSet(customer)
               if(customer==null){
                customer_name_set('')
                customer_mobile_no_set('')
                customer_address_set('')
                general_customer_set(false)
                 return false;
               }
               if(customer.customer_id==0){
                general_customer_set(true)
                previous_due_set(0)

               }else{

                general_customer_set(false)
                 // Get customer Due
                await axios.post(`${API_URL}/api/get-customer-due`,{customerId:customer.customer_id},{headers:{'auth-token':authInfo.token}}).then(res=>{
                  previous_due_set(res.data[0].dueAmount)
                  customer_credit_limit_set(customer.customer_credit_limit)
                })
               }
                customer_name_set(customer.customer_name)
                customer_mobile_no_set(customer.customer_mobile_no)
                customer_address_set(customer.customer_address)


                
                
               }}
              getOptionLabel={(option) => option.display_text}
              renderInput={(params) => <TextField 
                inputRef={customerRef}
                onKeyDown={(e)=>{
                  if(e.key=='Enter'){
                    productRef.current.focus()
                  }
                }}
                {...params} 
                label="Choose a customer " 
                variant="outlined"
                
                />}
          />

                
                <TextField autoComplete="off" style={{display:general_customer==true?'':'none'}} label="customer name" variant="outlined" className={classes.inputField} value={customer_name} onChange={(e)=>customer_name_set(e.target.value)} name="customer_name" />
                <TextField autoComplete="off" disabled={general_customer==true?false:true} label="customer mobile" variant="outlined" className={classes.inputField} value={customer_mobile_no} onChange={(e)=>customer_mobile_no_set(e.target.value)} name="customer_mobile_no" />
                <TextField autoComplete="off" disabled={general_customer==true?false:true} label="customer address" variant="outlined" className={classes.inputField} value={customer_address} onChange={(e)=>customer_address_set(e.target.value)} name="customer_address"/>

                </Grid>
                <Grid item xs={12} sm={5} className={classes.plusLinkDiv} style={{marginTop: '5px'}}>
                <Link className={classes.plusLink} to="/administration/products-manage" >+</Link> 
                <Autocomplete 
              openOnFocus={true}
              autoHighlight={true}
              style={{width:'100%',height:'20px'}}
              options={products}
              value={selectedProduct}
              loading={true}
              size="small"
              getOptionLabel={(option) => option.prod_name}
              onChange={(e,product)=>{
                qtyRef.current.focus();
                if(product==null){ 
                  product_rate_set(0);
                  product_qty_set('');
                  selectedProductSet(null)
                  return false
                }


                  product_rate_set(product.prod_rate);
                  selectedProductSet(product)
                  
               }}
              renderInput={(params) => <TextField 
                inputRef={productRef}
                onKeyDown={(e)=>{
                  if(e.key=='Enter'){
                    rateRef.current.focus();
                  }
                }}
                {...params} 
                label="choose a product" 
                variant="outlined"
                
                />}
                
          />
        <br/>
               
                <Grid container >
                      <Grid item xs={12} sm={6}>
                      <TextField type="number" style={{marginRight:'5px'}} label="sale rate" variant="outlined" className={classes.inputField} 
                      value={product_rate} onChange={(e)=>{product_rate_set(e.target.value)}} 
                      inputRef={rateRef}

                      onKeyDown={(e)=>{
                        if(e.key=='Enter'){
                          qtyRef.current.focus();
                        }
                      }} />
                      </Grid>
                      <Grid item sm={1} >
                      </Grid>
                      <Grid item xs={12} sm={5} >
                      <TextField type="number" label="quantity" variant="outlined" className={classes.inputField}
                      value={product_qty} onChange={(e)=>{product_qty_set(e.target.value)}} 
                      inputRef={qtyRef}
                      onKeyDown={(e)=>{
                        if(e.key=='Enter'){
                          addToCartRef.current.click();
                        }
                      }} />
                      </Grid>

                      <Grid item xs={12} sm={12} >
                      <TextField label="total" variant="outlined" value={product_total} onChange={(e)=>{product_total_set(e.target.value)}} disabled={true} className={classes.inputField} />
                      </Grid>


                </Grid>


                <Grid container >
                      
                      <Button style={{marginTop: '5px',marginLeft: 'auto',fontSize:'14px'}} 
                            
                            buttonRef={addToCartRef}
                           
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={()=>productToCart()}
                            className={classes.button}
                            startIcon={<SaveIcon/>}
                        >
                       Add  To Cart
                      </Button>
                </Grid>

              

                
                </Grid>

                <Grid item xs={12} sm={2}> 
              <strong style={{color:selectedProduct!=null?(parseFloat(product_stock_qty)>0?'green':'red'):'green',fontSize:'12px'}} className={"stock-info-msg"}>{selectedProduct!=null ?(parseFloat(product_stock_qty)>0?'Stock Available':'Stock Unavailable'):'Stock Status'}</strong> 
                      <div className={"stock-info"}>
                           <strong style={{color: selectedProduct!=null?(parseFloat(product_stock_qty)>0?'green':'red'):'green',fontSize:'12px'}}>{product_stock_qty}</strong>
                           <p style={{color: '#005600',fontSize:'12px'}}>{selectedProduct!=null?selectedProduct.prod_unit_name:'Unit Name'}</p>
                      </div>
                      <div  className={"stock-info-purchaserate"} onClick={()=>{purchaseRateShowAction()}}> 
                         <input  type={purchaseRateShow?"password":"text"} value={selectedProduct!=null?parseFloat(selectedProduct.prod_purchase_rate).toFixed(2):'Purchase Rate'} disabled></input>
                      </div>
                </Grid>
                </Grid>
          </Paper>


          <Grid container>
            
            <Grid item xs={12}>
                  <Paper className={classes.paper} style={{marginTop:'5px'}}>
                  <h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '3px'}}>Sales Cart</h4>
                  <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
              <TableRow>
              <TableCell>SL</TableCell>
              <TableCell align="left">Product</TableCell>
              <TableCell align="center">Sale Rate</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell align="right" >Remove</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
        {
            cart.map((product,sl)=>(
              <TableRow key={parseFloat(sl)+1}>
              <TableCell>{parseFloat(sl)+1}</TableCell>
              <TableCell align="left">{product.prod_name}</TableCell>
              <TableCell align="center">{product.prod_sale_rate}</TableCell>
              <TableCell align="center">{product.prod_qty}</TableCell>
              <TableCell align="right">{format(parseFloat(product.prod_total).toFixed(2))}</TableCell>
              <TableCell align="right" >
              <RemoveCircleIcon style={{cursor:'pointer',color:'#FF0202',marginLeft:'2px'}} onClick={()=>{cartFromRemove(sl)}}></ RemoveCircleIcon></TableCell>
            </TableRow>
            ))
          }

{cart.length!=0?
        <TableRow >
          <TableCell colSpan={3} align="right" style={{fontWeight:'bold'}} >Total :</TableCell>
          <TableCell align="center" style={{fontWeight:'bold'}}>{cart.reduce((prev,curr)=>{
                         return prev +parseFloat(curr.prod_qty)
                       },0).toFixed(2)}</TableCell>
          <TableCell align="right" style={{fontWeight:'bold'}} > {format(parseFloat(sub_total).toFixed(2))}</TableCell>
         <TableCell colSpan={1}></TableCell>
        </TableRow>
        :''}
        </TableBody>
      </Table>
    </TableContainer>



    <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table">
      {cart.length!=0?
          <TableRow > 
             <TableCell style={{width: '325px'}}><TextareaAutosize onChange={(e)=>{note_set(e.target.value)}}  name="note" style={{float:'left',marginTop:'20px',width: '325px'}} aria-label="Sale Note..." rowsMin={3} placeholder="Sales Note..." />
             </TableCell>

             <TableCell colSpan={2}></TableCell>

           
          
          </TableRow>
          :''}
      </Table>
    </TableContainer>
                  </Paper>
            </Grid>
          
          </Grid>
        
        </Grid>

        <Grid item xs={12} sm={4} >
        
        <Paper className={classes.paper}>
        <h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
  marginBottom: '3px'}}>Amount Details</h4>
        <Grid container style={{paddingRight:'1px'}}>
                    <Grid item xs={12} sm={5}>
                    <TextField type="number" style={{marginRight:'5px'}} label="Subtotal"  
                       size="small"  disabled value={sub_total} name="sub_total" onChange={(e)=>sub_total_set(e.target.value)} 
                      variant="outlined" className={classes.inputField} 
                      />
                    </Grid>
                    <Grid item xs={0} sm={1}>
                    </Grid>


                  

                    <Grid item xs={12} sm={6}>
                    <TextField type="number" style={{marginRight:'5px'}}  size="small"  label="Transport Cost"  variant="outlined" className={classes.inputField} 
                
                value={transport_cost} name="transport_cost" onChange={(e)=>transport_cost_set(e.target.value)}
                    />
                    </Grid>


                   
                    
                   
                   
        </Grid>

        <Grid container>
                    <Grid item xs={12} sm={5} >
                    <TextField type="number" label="Vat (TK)" 
                    value={vat} name="vat" onChange={(e)=>{
                      
                      let vatPercent = parseFloat((100 * e.target.value)/sub_total).toFixed(2)
                      vat_percent_set(vatPercent)

                      vat_set(e.target.value)}} 
                    variant="outlined"  size="small"   className={classes.inputField} 
                    inputRef={vatRef}
                    onKeyDown={(e)=>{
                      if(e.key=='Enter'){
                        vatPercentRef.current.focus()
                      }
                    }}
                   
                   />
                    </Grid>
                    <Grid item xs={0} sm={1}>
                    </Grid>

                    <Grid item xs={12} sm={6} >

                    <TextField type="number" label="vat (%)" variant="outlined"  size="small"   className={classes.inputField} 
                    value={vat_percent} name="vat_percent" onChange={(e)=>{

                      let vatAmount = (sub_total*(e.target.value/100));
                      vat_set(parseFloat(vatAmount).toFixed(0))

                      vat_percent_set(e.target.value)}} 
                    inputRef={vatPercentRef}
                    onKeyDown={(e)=>{
                      if(e.key=='Enter'){
                        discountRef.current.focus()
                      }
                    }}
                    />
                    </Grid>

        </Grid>
        <Grid container style={{paddingRight:'1px'}}>
                    <Grid item xs={12} sm={5}>
                    <TextField type="number" style={{marginRight:'5px'}}  size="small"  label="Discount(TK)" variant="outlined" className={classes.inputField} 
                    value={discount} name="discount" onChange={(e)=>{
                      let discountPercent = ((100 * e.target.value)/sub_total)
                       discount_percent_set(discountPercent)

                      discount_set(e.target.value)}} 
                    inputRef={discountRef}
                    onKeyDown={(e)=>{
                      if(e.key=='Enter'){
                        discountPercentRef.current.focus()
                      }
                    }} 
                    /> 
                    </Grid>
                    <Grid item xs={0} sm={1}>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                    <TextField type="number" label="Discount (%)"  size="small"  variant="outlined" className={classes.inputField} 
                     value={discount_percent} name="discount_percent" onChange={(e)=>{
                      let discountAmount = (sub_total*e.target.value)/100;
                        discount_set(discountAmount) 
                      discount_percent_set(e.target.value)
                    }}
                     inputRef={discountPercentRef}
                     onKeyDown={(e)=>{
                      if(e.key=='Enter'){
                        paidRef.current.focus()
                      }
                    }}
                     />
                    </Grid>    
        </Grid>
        <Grid container style={{paddingRight:'1px'}}>

        <Grid item xs={12} sm={5}>
                    <TextField type="number" style={{marginRight:'5px'}}  size="small"  label="Total" disabled variant="outlined" className={classes.inputField} 
                
                value={total_amount} name="total_amount" onChange={(e)=>total_amount_set(e.target.value)}
                    />
                    </Grid>
       
                    <Grid item xs={0} sm={1}>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                    <TextField type="number" style={{marginRight:'5px'}}  size="small" 
                    value={previous_due} name="previous_due" onChange={(e)=>previous_due_set(e.target.value)} 
                    label="Current due" disabled variant="outlined" className={classes.inputField} 
                 
                   />
                    </Grid>
                  
                   
                      
        </Grid>


        <Grid container style={{paddingRight:'1px'}}>
        <Grid item xs={12} sm={5} >
                    <TextField type="number" label="Paid" variant="outlined"  size="small"  className={classes.inputField} 
                    value={paid} name="paid" onChange={(e)=>{
                      selectedCustomerPayMethodSet(null)
                      paid_set(e.target.value)}}
                    inputRef={paidRef}
                    onKeyDown={(e)=>{

                      if(e.key=='Enter'){
                        dueRef.current.focus()
                      }
                    }}
                    />
                    </Grid> 

                    <Grid item xs={0} sm={1}>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                    <TextField type="number" label="Due" variant="outlined"  size="small"  className={classes.inputField} 
                     disabled
                     value={due} name="due" onChange={(e)=>due_set(e.target.value)}
                     inputRef={dueRef}
                    onKeyDown={(e)=>{
                      if(e.key=='Enter'){
                        saleRef.current.click()
                      }
                    }}
                    /> 
                    </Grid>    
                    {
                      paid > 0 ?(
                        <Grid item xs={12} sm={5}  className={classes.plusLinkDiv} style={{marginTop:'15px',marginBottom:'10px'}}>
                        <Autocomplete
                        style={{ width: '100%' }}
                        options={customerPayMethods}
                        size="small"
                        classes={{
                            option: classes.option
                        }}
                        autoHighlight={true}
                        openOnFocus={true}
                        getOptionLabel={(option) => option.pay_method}
                        value={selectedCustomerPayMethod}  
                        onChange={(event,selectedObj)=>{
                 
                          selectedCustomerPayMethodSet(selectedObj) 
                          if(selectedObj != null && selectedObj.pay_method_id =='cash'){
                            selectedCustomerPayAccSet(null)
                          }
                          
                        }}
                        loading={customerPayMethods.length==0?true:false}
                        renderInput={(params) => (
                            <TextField
                            //inputRef={customerPayMethodRef}
                            // onKeyDown={event => {
                            //     if (event.key === "Enter") {
                            //       customerPayAccRef.current.focus() 
                            //     }
                            //   }}
                            {...params}
                            label="Payment Method"
                            variant="outlined"
                            inputProps={{
                                ...params.inputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {/* {customerPayMethods.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment} */}
                                  </React.Fragment>
                                ),
                            }}
                            />
                        )}
                        /> 
                    </Grid>
                      ):''
                    }
                    

              <Grid item xs={12} sm={1}>

              </Grid>


              {paid > 0 ?(
                  selectedCustomerPayMethod != null && selectedCustomerPayMethod.pay_method =='bank'?(
                    <Grid item xs={12} sm={6}   className={classes.plusLinkDiv} style={{display:(selectedCustomerPayMethod!=null && selectedCustomerPayMethod.pay_method_id=='bank')?'block':'none',marginTop:'15px',marginBottom:'10px'}}>
                    <Autocomplete
                    style={{ width: '100%' }} 
                    options={customerPayAccs} 
                    size="small"
                    classes={{
                        option: classes.option
                    }}
                    autoHighlight={true}
                    openOnFocus={true}
                    getOptionLabel={(option) =>option.bank_display_name}
                    value={selectedCustomerPayAcc}  
                    onChange={(event,selectedObj)=>{
                      selectedCustomerPayAccSet(selectedObj)  
                     
                    }}
                    loading={customerPayAccs.length==0?true:false}
                    renderInput={(params) => (
                        <TextField
                        //inputRef={customerPayAccRef}
                        // onKeyDown={event => {
                        //     if (event.key === "Enter") {
                        //         customerPayMethodRef.current.focus() 
                        //     }
                        //   }}
                        {...params}
                        label="Bank account"
                        variant="outlined"
                        inputProps={{
                            ...params.inputProps,
                            endAdornment: (
                              <React.Fragment>
                                {/* {customerPayAccs.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment} */}
                              </React.Fragment>
                            )
                        }}
                        />
                    )}
                    /> 
                </Grid>
                  ):''
              ):''
                
              }


        </Grid>
      

        <Grid container style={{paddingRight:'1px'}}>
                    <Grid item xs={12} sm={6}>
                    <Button style={{marginTop: '5px',fontSize:'18px',float:'left'}} 
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={saveAction?true:false}
                          buttonRef={saleRef}
                          onClick={()=>{saleSaveAction()}}
                          className={classes.button}
                          startIcon={<SaveIcon/>}
                      >
                     Sale
                    </Button>
                    </Grid>
                
                    <Grid item xs={12} sm={6} >
                    <Button 
                    style={{marginTop: '5px',fontSize:'10px',float:'right'}} 
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={()=>window.location.reload()}
                          className={classes.button}
                          startIcon={<SaveIcon/>}
                      >
                     New Sale
                    </Button>
                    </Grid>    
        </Grid>


        </Paper>
      </Grid>

        
      </Grid>
          </div>
      )
}


const useStyles = makeStyles((theme) => ({
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
export default connect(mapStateToPops,{currentRouteSet})(SalesEntry);