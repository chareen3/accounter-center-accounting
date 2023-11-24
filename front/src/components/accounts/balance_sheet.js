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
  let [cashHeads,cashHeadsSet] = useState([]);
  
  
  

  



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
      
//Salary Payments
await axios.post(`${API_URL}/api/get-cash-transaction-summary`,{

        fromDate :byDateTime.fromDate,
        toDate: byDateTime.toDate

    
    
},{headers:{'auth-token':authInfo.token}}).then(res=>{
    cashHeadsSet(res.data)
})

  }


  let ReportDom = React.forwardRef((props,ref)=>{
      return(<div ref={ref}>
        <InstitutionProfile />

        <div style={{clear:'both'}}></div>
<Paper style={{width:'100%',paddingLeft:'10px',paddingRight:'10px'}} className="print-source">
<p style={{width:'100%',textAlign:'center',fontWeight:'bold'}}>Balance Sheet</p>

  <p style={{float:'left',width:'30%',textAlign:'left',margin:0,padding:0,fontSize:'16px'}}>
    {selectedCustomer != null ?`Customer : ${selectedCustomer!=null?selectedCustomer.customer_name:''}`:''}
    </p>

<p style={{float:'right',width:'40%',textAlign:'right',margin:0,padding:0}}> Statement From { moment(byDateTime.dateTimeFrom).format(dateTimeFormat)  } <br/> TO { moment(byDateTime.dateTimeTo).format(dateTimeFormat) }
</p>
</Paper> 

<p style={{color:'#3e8d54',fontWeight:'bold',fontSize:'25px',margin:'0',padding:'0',marginTop:'1px',marginLeft: '48px'}}>Cash Credit  & Debit Balance Summary</p>
     
     <Grid container>
          <Grid item xs={12} sm={5} style={{background:'#0F7E77',padding:'10px',color:'white',fontWeight:'bold',borderRadius:'5px',    margin: '45px',marginTop:'1px'}}>
                <table>
                   <thead>
                       <tr>
                        <th style={{width:'100%',textAlign: 'center'}}>Credit  Transactions</th>
                        <th style={{width:'100%'}}></th>
                        </tr>
                        <tr>
                        <th style={{width:'100%',textAlign: 'left'}}>Transactions Head</th>
                        <th style={{width:'100%'}}>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td >Sales Invoice Paid Total  </td>
                            <td >{cashHeads != null ? format(parseFloat(cashHeads.received_sale_amount).toFixed(2)) : 0}</td>
                        </tr>
                        <tr>
                            <td>Total Receive  from Customer </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.received_customer_partial).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Total Receive from Cash Transaction </td>
                            <td>{cashHeads != null ? format(parseFloat(cashHeads.received_tran_amount).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Withdraw From Bank  </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.bank_withdraw_amount).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Receive from supplier </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.received_supplier_amount).toFixed(2)):0}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                            <th style={{width:'100%',textAlign: ''}}> Total Credit Amount :  </th>
                            <th style={{width:'100%',textAlign: 'right'}}> {cashHeads != null ?format(parseFloat(cashHeads.in_amount).toFixed(2)):0} </th>
                        </tfoot>
                    
                </table>
          </Grid>
         
          <Grid item xs={12} sm={5} style={{background:'#0F7E77',padding:'10px',color:'white',fontWeight:'bold',borderRadius:'5px',    margin: '45px',marginTop:'1px'}}>
          <table>
                    
                      <thead>
                      <tr>
                        <th style={{width:'100%',textAlign: 'center'}}>Debit  Transactions</th>
                        <th style={{width:'100%'}}></th>
                        </tr>
                      <tr>
                        <th style={{width:'100%',textAlign: 'left'}}>Transactions Head</th>
                        <th style={{width:'100%'}}> Amount</th>
                        </tr>
                      </thead>
                        <tbody>
                        <tr>
                            <td>Product Purchased Paid Amount </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.payment_purchase_amount).toFixed(2)):0}</td>
                        </tr>

                        <tr>
                            <td>Material Purchased Paid Amount </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.material_purchase_amount).toFixed(2)):0}</td>
                        </tr>

                        <tr>
                            <td>Total payment  to Supplier </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.payment_supplier_amount).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Total payment from Cash Transaction </td>
                            <td>{cashHeads != null ? format(parseFloat(cashHeads.payment_tran_amount).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Deposit to Bank  </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.bank_deposit_amount).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Payment To Customer</td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.payment_customer_partial).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Employee Salary Payment</td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.employe_salary_payment).toFixed(2)):0}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                            <th style={{width:'100%',textAlign: ''}}> Total Debit Amount  : </th>
                            <th style={{width:'100%',textAlign: 'right'}}> {cashHeads != null ?format(parseFloat(cashHeads.out_amount).toFixed(2)):0} </th>
                        </tfoot>
                   
                </table>
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