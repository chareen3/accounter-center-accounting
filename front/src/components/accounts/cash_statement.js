import React,{useState,useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet} from '../../actions/actions';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'; 
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'
import {pathSpliter,dateTimeFormat,currentDateTime,getDateTimeFromISODT,currentDateStartTime,currentDateEndTime} from '../../lib/functions'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ReceiptIcon from '@material-ui/icons/Receipt';
import DateFnsUtils from '@date-io/date-fns'; // choose your libs
import {API_URL} from '../../config.json';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import SearchIcon from '@material-ui/icons/Search';
import moment from 'moment';
import _ from 'lodash';
import PrintIcon from '@material-ui/icons/Print';
import Select from 'react-select';


import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import swal from 'sweetalert';
import  InstitutionProfile from '../commons/institution_profile'
import ReactToPrint from "react-to-print";
import commaNumber from 'comma-number';
let format = commaNumber.bindWith(',', '.')
const CustomerTransactionHistory = ({location,currentRoute,currentRouteSet,authInfo})=>{
  const classes = useStyles();
  useEffect(()=>{
      currentRouteSet(pathSpliter(location.pathname,1));
  },[]);
  let [selectedCustomer,selectedCustomerSet] = useState(null);
  let [print,printSet] = useState(false);
  let [reportLoading,reportLoadingSet] = useState(false);

  let reportRef =React.useRef(null)

  let [sales,salesSet] = useState([]);
  let [purchase,purchaseSet] = useState([]);
  let [receivesFromCustomer,receivesFromCustomerSet] = useState([]);
  let [paidToCustomer,paidToCustomerSet] = useState([]);
  let [paidToSupplier,paidToSupplierSet] = useState([]);
  let [receiveFromSupplier,receiveFromSupplierSet] = useState([]);

  let [othersPayment,othersPaymentSet] = useState([]);
  let [othersReceive,othersReceiveSet] = useState([]);
  let [employeePays,employeePaysSet] = useState([]);
  
  

  



  let [byDateTime,byDateTimeSet] = useState({
        fromDate: currentDateStartTime(),
        toDate:currentDateEndTime()
  })



  let [types,typesSet] = useState([{label:'All',value:'all'},{label:'Customer Wise',value:'customer'}]);
  let [selectedType,selectedTypeSet] = useState({label:'All',value:'all'});

  


 
 

  let getSearchResult = async ()=>{

   

      let payload = {
          fromDate: byDateTime.fromDate,
          toDate: byDateTime.toDate
      }
        printSet(true)
        // Sales 
        await axios.post(`${API_URL}/api/get-sales`,{
            reqPayload:{
                dateTimeFrom :byDateTime.fromDate,
                dateTimeTo: byDateTime.toDate
            }
         
        },{headers:{'auth-token':authInfo.token}}).then(res=>{
            salesSet(res.data.message)
        })

        // Purchase 
        await axios.post(`${API_URL}/api/get-purchase`,{
            reqPayload:{
                dateTimeFrom :byDateTime.fromDate,
                dateTimeTo: byDateTime.toDate
            }
         
        },{headers:{'auth-token':authInfo.token}}).then(res=>{
            purchaseSet(res.data.message)
        })

        // Receives from customer 
        await axios.post(`${API_URL}/api/customer-transaction-history`,{
                fromDate :byDateTime.fromDate,
                toDate: byDateTime.toDate,
                payType: "receive"

        },{headers:{'auth-token':authInfo.token}}).then(res=>{
            receivesFromCustomerSet(res.data)
        })

        // Paid to customer 
        await axios.post(`${API_URL}/api/customer-transaction-history`,{
            fromDate :byDateTime.fromDate,
            toDate: byDateTime.toDate,
            payType: "payment"

    },{headers:{'auth-token':authInfo.token}}).then(res=>{
        paidToCustomerSet(res.data)
    })


      // Paid to supplier 
      await axios.post(`${API_URL}/api/supplier-transaction-history`,{
        fromDate :byDateTime.fromDate,
        toDate: byDateTime.toDate,
        payType: "payment"

},{headers:{'auth-token':authInfo.token}}).then(res=>{
    paidToSupplierSet(res.data)
})
      
  // Receive from supplier 
  await axios.post(`${API_URL}/api/supplier-transaction-history`,{
    fromDate :byDateTime.fromDate,
    toDate: byDateTime.toDate,
    payType: "receive"

},{headers:{'auth-token':authInfo.token}}).then(res=>{
receiveFromSupplierSet(res.data)
})


// Others payment  
await axios.post(`${API_URL}/api/get-cash-transactions`,{
    fromDate :byDateTime.fromDate,
    toDate: byDateTime.toDate,
    tranType: "payment"

},{headers:{'auth-token':authInfo.token}}).then(res=>{
othersPaymentSet(res.data)
})

// Others Receive  
await axios.post(`${API_URL}/api/get-cash-transactions`,{
    fromDate :byDateTime.fromDate,
    toDate: byDateTime.toDate,
    tranType: "receive"

},{headers:{'auth-token':authInfo.token}}).then(res=>{
othersReceiveSet(res.data)
})
//Salary Payments
await axios.post(`${API_URL}/api/get-salary-report`,{
    payLoad:{
        fromDate :byDateTime.fromDate,
        toDate: byDateTime.toDate,
        type: "payment records"

    }
    
},{headers:{'auth-token':authInfo.token}}).then(res=>{
employeePaysSet(res.data)
})

  }


  let ReportDom = React.forwardRef((props,ref)=>{
      return(<div ref={ref}>
        <InstitutionProfile />

        <div style={{clear:'both'}}></div>
<Paper style={{width:'100%',paddingLeft:'10px',paddingRight:'10px'}} className="print-source">
<p style={{width:'100%',textAlign:'center',fontWeight:'bold'}}>Cash statement Report</p>

  <p style={{float:'left',width:'30%',textAlign:'left',margin:0,padding:0,fontSize:'16px'}}>
    {selectedCustomer != null ?`Customer : ${selectedCustomer!=null?selectedCustomer.customer_name:''}`:''}
    </p>

<p style={{float:'right',width:'40%',textAlign:'right',margin:0,padding:0}}> Statement From { moment(byDateTime.dateTimeFrom).format(dateTimeFormat)  } <br/> TO { moment(byDateTime.dateTimeTo).format(dateTimeFormat) }
</p>
</Paper> 
<Paper style={{width:'100%',paddingLeft:'10px',paddingRight:'10px'}}>

<Grid container>
         <Grid item  xs={12}  sm={4}>
              <p>Total Credit </p>
              <p style={{fontWeight: 'bold',color: '#867979'}}>{format(parseFloat(_.sumBy(sales, sale => Number(sale.sale_paid_amount)) + 
                  parseFloat(_.sumBy(receivesFromCustomer, re => Number(re.pay_amount))) +
                  parseFloat(_.sumBy(receiveFromSupplier, re => Number(re.pay_amount))) +
                  parseFloat(_.sumBy(othersReceive, re => Number(re.cash_tran_in_amount)))
                   ).toFixed(2)) }</p>
          </Grid>
          <Grid item  xs={12}  sm={4}>
              <p>Total Debit </p>
              <p style={{fontWeight: 'bold',color: '#867979'}}>{format(parseFloat(_.sumBy(purchase, p => Number(p.pur_paid_amount)) +  
                    parseFloat(_.sumBy(paidToCustomer, re => Number(re.pay_amount))) +
                   parseFloat(_.sumBy(paidToSupplier, re => Number(re.pay_amount))) +
                   parseFloat(_.sumBy(othersPayment, re => Number(re.cash_tran_out_amount))) +
                   parseFloat(_.sumBy(employeePays, re => Number(re.payment_amount)))).toFixed(2))}</p>
          </Grid>
          <Grid item  xs={12}  sm={4}>
              <p>Total Balance </p>
              <p style={{fontWeight: 'bold',color: '#867979'}}>{ format(parseFloat((_.sumBy(sales, sale => Number(sale.sale_paid_amount)) + 
                  parseFloat(_.sumBy(receivesFromCustomer, re => Number(re.pay_amount))) +
                  parseFloat(_.sumBy(receiveFromSupplier, re => Number(re.pay_amount))) +
                  parseFloat(_.sumBy(othersReceive, re => Number(re.cash_tran_in_amount)))
                   ) - (
                    _.sumBy(purchase, p => Number(p.pur_paid_amount)) +  
                    parseFloat(_.sumBy(paidToCustomer, re => Number(re.pay_amount))) +
                   parseFloat(_.sumBy(paidToSupplier, re => Number(re.pay_amount))) +
                   parseFloat(_.sumBy(othersPayment, re => Number(re.cash_tran_out_amount))) +
                   parseFloat(_.sumBy(employeePays, re => Number(re.payment_amount))) 
                   
                    )).toFixed(2)) }</p>
          </Grid>
        
</Grid>
 </Paper>
        <Grid container>

        

        
         <Grid item  xs={12}  sm={6} style={{padding:'5px'}}>
           
         <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
         <h4 style={{padding:'0px',margin:'0px'}}># Sales Statement</h4>
      <TableContainer >
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow> 
              <TableCell align="left" style={{width:'10%'}}>Invoice</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Date</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Customer</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Bill</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Due</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Paid</TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>
              {
                  sales.map((sale)=>
                      (
                        <TableRow  key=""> 
                        <TableCell  align="left">{sale.sale_invoice}</TableCell>
                        <TableCell  align="right">{moment(sale.sale_created_isodt).format('M-DD-Y')}</TableCell>
                        <TableCell  align="right">{sale.customer_name}</TableCell>
                        <TableCell  align="right">{format(parseFloat(sale.sale_total_amount,2).toFixed(2))}</TableCell>
                        <TableCell  align="right">{format(parseFloat(sale.sale_due_amount,2).toFixed(2))}</TableCell>
                        <TableCell  align="right">{format(parseFloat(sale.sale_paid_amount,2).toFixed(2))}</TableCell>
                        
                        </TableRow>
                      )
                  )
              }

              <TableRow>
              <TableCell colSpan={3} style={{textAlign:'right'}}>Total : </TableCell>

              <TableCell align="right" >{format(parseFloat(_.sumBy(sales, sale => Number(sale.sale_total_amount)),2).toFixed(2)) }</TableCell>
              <TableCell align="right" >{ format(parseFloat(_.sumBy(sales, sale => Number(sale.sale_due_amount)),2).toFixed(2))}</TableCell>
              <TableCell align="right" >{ format(parseFloat(_.sumBy(sales, sale => Number(sale.sale_paid_amount)),2).toFixed(2))}</TableCell>

              </TableRow>
              
          </TableBody>
        </Table>
      </TableContainer>
          </Paper>
         </Grid>

         <Grid item  xs={12}  sm={6} style={{padding:'5px'}}>
           
           <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
           <h4 style={{padding:'0px',margin:'0px'}}># Purchase Statement</h4>
        <TableContainer >
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow> 
                <TableCell align="left" style={{width:'10%'}}>Invoice</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Date</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Customer</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Bill</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Due</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Paid</TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
                {
                    purchase.map((pur)=>
                        (
                          <TableRow  key=""> 
                          <TableCell  align="left">{pur.pur_invoice_no}</TableCell>
                          <TableCell  align="right">{moment(pur.pur_created_isodt).format('M-DD-Y')}</TableCell>
                          <TableCell  align="right">{pur.supplier_name}</TableCell>
                          <TableCell  align="right">{format(parseFloat(pur.pur_total_amount,2).toFixed(2))}</TableCell>
                          <TableCell  align="right">{format(parseFloat(pur.pur_due_amount,2).toFixed(2))}</TableCell>
                          <TableCell  align="right">{format(parseFloat(pur.pur_paid_amount,2).toFixed(2))}</TableCell>
                          
                          </TableRow>
                        )
                    )
                }
  
                <TableRow>
                <TableCell colSpan={3} style={{textAlign:'right'}}>Total : </TableCell>
  
                <TableCell align="right" >{format(parseFloat(_.sumBy(purchase, pur => Number(pur.pur_total_amount)),2).toFixed(2)) }</TableCell>
                <TableCell align="right" >{ format(parseFloat(_.sumBy(purchase, pur => Number(pur.pur_due_amount)),2).toFixed(2))}</TableCell>
                <TableCell align="right" >{ format(parseFloat(_.sumBy(purchase, pur => Number(pur.pur_paid_amount)),2).toFixed(2))}</TableCell>
  
                </TableRow>
                
            </TableBody>
          </Table>
        </TableContainer>
            </Paper>
           </Grid>


           {/* Received From Customer */}

           <Grid item  xs={12}  sm={6} style={{padding:'5px'}}>
           
           <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
           <h4 style={{padding:'0px',margin:'0px'}}># Received From Customer</h4>
        <TableContainer >
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow> 
                <TableCell align="left" style={{width:'10%'}}>Transaction ID</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Date</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Customer</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Received Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {
                    receivesFromCustomer.map((tran)=>
                        (
                          <TableRow  key=""> 
                          <TableCell  align="left">{tran.pay_code}</TableCell>
                          <TableCell  align="right">{moment(tran.created_isodt).format('M-DD-Y')}</TableCell>
                          <TableCell  align="right">{tran.customer_name}</TableCell>
                          <TableCell  align="right">{format(parseFloat(tran.pay_amount,2).toFixed(2))}</TableCell>
                          
                          </TableRow>
                        )
                    )
                }
  
                <TableRow>
                <TableCell colSpan={3} style={{textAlign:'right'}}>Total : </TableCell>
  
                <TableCell align="right" >{ format(parseFloat(_.sumBy(receivesFromCustomer, re => Number(re.pay_amount)),2).toFixed(2))}</TableCell>
  
                </TableRow>
                
            </TableBody>
          </Table>
        </TableContainer>
            </Paper>
           </Grid>

           {/* Paid to Supplier*/}

           <Grid item  xs={12}  sm={6} style={{padding:'5px'}}>
           
           <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
           <h4 style={{padding:'0px',margin:'0px'}}>#Paid To Supplier</h4>
        <TableContainer >
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow> 
                <TableCell align="left" style={{width:'10%'}}>Transaction ID</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Date</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Supplier</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Paid Amount</TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
                {
                    paidToSupplier.map((paid)=>
                        (
                          <TableRow  key=""> 
                          <TableCell  align="left">{paid.pay_code}</TableCell>
                          <TableCell  align="right">{moment(paid.created_isodt).format('M-DD-Y')}</TableCell>
                          <TableCell  align="right">{paid.supplier_name}</TableCell>
                          <TableCell  align="right">{format(parseFloat(paid.pay_amount,2).toFixed(2))}</TableCell>
                          
                          </TableRow>
                        )
                    )
                }
  
                <TableRow>
                <TableCell colSpan={3} style={{textAlign:'right'}}>Total : </TableCell>
  
                <TableCell align="right" >{ format(parseFloat(_.sumBy(paidToSupplier, paid => Number(paid.pay_amount)),2).toFixed(2))}</TableCell>
  
                </TableRow>
                
            </TableBody>
          </Table>
        </TableContainer>
            </Paper>
           </Grid>


            {/* Receive from  supplier */}

            <Grid item  xs={12}  sm={6} style={{padding:'5px'}}>
           
           <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
           <h4 style={{padding:'0px',margin:'0px'}}># Receive From Supplier</h4>
        <TableContainer >
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow> 
                <TableCell align="left" style={{width:'10%'}}>Transaction ID</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Date</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Supplier</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Received Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {
                    receiveFromSupplier.map((tran)=>
                        (
                          <TableRow  key=""> 
                          <TableCell  align="left">{tran.pay_code}</TableCell>
                          <TableCell  align="right">{moment(tran.created_isodt).format('M-DD-Y')}</TableCell>
                          <TableCell  align="right">{tran.supplier_name}</TableCell>
                          <TableCell  align="right">{format(parseFloat(tran.pay_amount,2).toFixed(2))}</TableCell>
                          
                          </TableRow>
                        )
                    )
                }
  
                <TableRow>
                <TableCell colSpan={3} style={{textAlign:'right'}}>Total : </TableCell>
  
                <TableCell align="right" >{ format(parseFloat(_.sumBy(receiveFromSupplier, re => Number(re.pay_amount)),2).toFixed(2))}</TableCell>
  
                </TableRow>
                
            </TableBody>
          </Table>
        </TableContainer>
            </Paper>
           </Grid>


             {/* Paid To Customer */}

             <Grid item  xs={12}  sm={6} style={{padding:'5px'}}>
           
           <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
           <h4 style={{padding:'0px',margin:'0px'}}># Paid To Customer</h4>
        <TableContainer >
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow> 
                <TableCell align="left" style={{width:'10%'}}>Transaction ID</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Date</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Customer</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Received Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {
                    paidToCustomer.map((tran)=>
                        (
                          <TableRow  key=""> 
                          <TableCell  align="left">{tran.pay_code}</TableCell>
                          <TableCell  align="right">{moment(tran.created_isodt).format('M-DD-Y')}</TableCell>
                          <TableCell  align="right">{tran.customer_name}</TableCell>
                          <TableCell  align="right">{format(parseFloat(tran.pay_amount,2).toFixed(2))}</TableCell>
                          
                          </TableRow>
                        )
                    )
                }
  
                <TableRow>
                <TableCell colSpan={3} style={{textAlign:'right'}}>Total : </TableCell>
  
                <TableCell align="right" >{ format(parseFloat(_.sumBy(paidToCustomer, re => Number(re.pay_amount)),2).toFixed(2))}</TableCell>
  
                </TableRow>
                
            </TableBody>
          </Table>
        </TableContainer>
            </Paper>
           </Grid>

{/* Other Receive */}

           <Grid item  xs={12}  sm={6} style={{padding:'5px'}}>
           
           <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
           <h4 style={{padding:'0px',margin:'0px'}}># Others Transaction Received</h4>
        <TableContainer >
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow> 
                <TableCell align="left" style={{width:'10%'}}>Transaction ID</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Date</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Head</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Received Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {
                    othersReceive.map((tran)=>
                        (
                          <TableRow  key=""> 
                          <TableCell  align="left">{tran.cash_tran_code}</TableCell>
                          <TableCell  align="right">{moment(tran.cash_tran_created_isodt).format('M-DD-Y')}</TableCell>
                          <TableCell  align="right">{tran.tran_acc_name}</TableCell>
                          <TableCell  align="right">{format(parseFloat(tran.cash_tran_in_amount,2).toFixed(2))}</TableCell>
                          
                          </TableRow>
                        )
                    )
                }
  
                <TableRow>
                <TableCell colSpan={3} style={{textAlign:'right'}}>Total : </TableCell>
  
                <TableCell align="right" >{ format(parseFloat(_.sumBy(othersReceive, re => Number(re.cash_tran_in_amount)),2).toFixed(2))}</TableCell>
  
                </TableRow>
                
            </TableBody>
          </Table>
        </TableContainer>
            </Paper>
           </Grid>

   {/* Other Receive */}

   <Grid item  xs={12}  sm={6} style={{padding:'5px'}}>
           
           <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
           <h4 style={{padding:'0px',margin:'0px'}}># Others Transaction Payment</h4>
        <TableContainer >
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow> 
                <TableCell align="left" style={{width:'10%'}}>Transaction ID</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Date</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Head</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Payment Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {
                    othersPayment.map((tran)=>
                        (
                          <TableRow  key=""> 
                          <TableCell  align="left">{tran.cash_tran_code}</TableCell>
                          <TableCell  align="right">{moment(tran.cash_tran_created_isodt).format('M-DD-Y')}</TableCell>
                          <TableCell  align="right">{tran.tran_acc_name}</TableCell>
                          <TableCell  align="right">{format(parseFloat(tran.cash_tran_out_amount,2).toFixed(2))}</TableCell>
                          
                          </TableRow>
                        )
                    )
                }
  
                <TableRow>
                <TableCell colSpan={3} style={{textAlign:'right'}}>Total : </TableCell>
  
                <TableCell align="right" >{ format(parseFloat(_.sumBy(othersPayment, re => Number(re.cash_tran_out_amount)),2).toFixed(2))}</TableCell>
  
                </TableRow>
                
            </TableBody>
          </Table>
        </TableContainer>
            </Paper>
           </Grid>

{/* Employee Payments */}

<Grid item  xs={12}  sm={6} style={{padding:'5px'}}>
           
         
           </Grid>

           
      <Grid item  xs={12}  sm={6} style={{padding:'5px'}}>
      <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
           <h4 style={{padding:'0px',margin:'0px'}}># Employee Salary Payments</h4>
        <TableContainer >
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow> 
                <TableCell align="left" style={{width:'10%'}}>Employee ID</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Employee Name</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Date</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Month</TableCell>
                <TableCell align="right" style={{width:'15%'}}>Pay Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {
                    employeePays.map((tran)=>
                        (
                          <TableRow  key=""> 
                          <TableCell  align="left">{tran.employee_code}</TableCell>
                          <TableCell  align="left">{tran.employee_name}</TableCell>
                          <TableCell  align="right">{moment(tran.payment_isodt).format('M-DD-Y')}</TableCell>
                          <TableCell  align="right">{tran.month_name}</TableCell>
                          <TableCell  align="right">{format(parseFloat(tran.payment_amount,2).toFixed(2))}</TableCell>
                          
                          </TableRow>
                        )
                    )
                }
  
                <TableRow>
                <TableCell colSpan={4} style={{textAlign:'right'}}>Total : </TableCell>
  
                <TableCell align="right" >{ format(parseFloat(_.sumBy(employeePays, re => Number(re.payment_amount)),2).toFixed(2))}</TableCell>
  
                </TableRow>
                
            </TableBody>
          </Table>
        </TableContainer>
            </Paper>
         
           </Grid>     
         </Grid>
  
      </div>)
  })

    return(
        <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
  marginBottom: '2px'}}>Cash statement Report</h4> 
  
  

<Grid container spacing={3} > 
     
      

       

       
       
        
        <Grid item  xs={12}  sm={3} style={{marginBottom: '-9px'}} > 
          <MuiPickersUtilsProvider  utils={DateFnsUtils} > 
        
          <KeyboardDateTimePicker
        //  inputRef={saleDateRef}
          onKeyDown={(e)=>{
            if(e.key==='Enter'){
              //supplierRef.current.focus()
            }
          }}
          style={{ width: '100%',marginTop: '' }}
          value={byDateTime.fromDate}
          onChange={(datet)=>{
            byDateTimeSet({...byDateTime,fromDate:datet})
          }}
          label="From Date &   Time"
          format="Y/MM/d hh:mm a"
          /> 
          </MuiPickersUtilsProvider>
        </Grid>


        <Grid item  xs={12}  sm={3} style={{marginBottom: '-9px'}} > 
          <MuiPickersUtilsProvider  utils={DateFnsUtils} > 
        
          <KeyboardDateTimePicker
          //inputRef={saleDateRef}
          onKeyDown={(e)=>{
            if(e.key==='Enter'){
             // supplierRef.current.focus()
            }
          }}
          style={{ width: '100%',marginTop: '' }}
          value={byDateTime.toDate}
          onChange={(datet)=>{
            byDateTimeSet({...byDateTime,toDate:datet})

          }}
          label="To Date &   Time"
          format="yyyy/MM/dd hh:mm a"
             />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item  xs={12}   sm={1} >
      <Button style={{marginTop: '5px',marginLeft: 'auto',fontSize:'14px'}} 
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          startIcon={<SearchIcon/>}
                          onClick={getSearchResult}
                          disabled={reportLoading?true:false}
                      >
                     Search 
                    </Button>
      </Grid>

      </Grid> 
      </Paper> 

      {
          print?(
            <Grid container >
            <Grid item xs={12} sm={12} >
              <Paper style={{borderRadius:'0px',marginTop: '-7px'}}>
              <ReactToPrint
                          trigger={() => <PrintIcon  style={{cursor:'pointer',marginLeft: '30px',marginTop: '3px',marginBottom: '-8px'}} />}
                          content={() => reportRef.current}
                        />
              </Paper>
           
            </Grid>
        </Grid>
          ):''
        }

            <ReportDom ref={reportRef} />
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
export default connect(mapStateToPops,{currentRouteSet})(CustomerTransactionHistory);