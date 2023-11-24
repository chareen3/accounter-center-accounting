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
import '../commons/commons.css'
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
  let [serviceincomes,serviceincomesSet] = useState([]);
  let [servicesexpense,servicesexpenseSet] = useState([]);
  let [print,printSet] = useState(false);


  let [byDateTime,byDateTimeSet] = useState({
        fromDate: currentDateStartTime(),
        toDate:currentDateEndTime()
  })

  let customerRef = useRef(null);
  let fromDateRef = useRef(null);
  let serviceincomesRef = useRef(null);



 useEffect(()=>{
    getServices()
    getServicesExpense()
 },[])
 
 let getServices = async()=>{
    let payload = {
        dateTimeFrom: byDateTime.fromDate,
        dateTimeTo: byDateTime.toDate
    }
    await axios.post(`${API_URL}/api/get-service`,{reqPayload:payload},{headers:{'auth-token':authInfo.token}}).then(res=>{
        serviceincomesSet(res.data.message)
        printSet(true)
      })
 }

 let getServicesExpense = async()=>{
    let payload = {
        dateTimeFrom: byDateTime.fromDate,
        dateTimeTo: byDateTime.toDate
    }

    await axios.post(`${API_URL}/api/get-service-item-purchase`,{reqPayload:payload},{headers:{'auth-token':authInfo.token}}).then(res=>{
        servicesexpenseSet(res.data.message)
        printSet(true)
      })
 }
 

  let getSearchResult = async ()=>{
    getServices()
    getServicesExpense()
  }


  let ServiceIncomesDom = React.forwardRef((props,ref)=>{
      return(<div ref={ref}>
        <InstitutionProfile />
               {
 

        <Grid container>
                <Grid item  xs={12}  sm={6} style={{padding:'8px'}}>
                 
                <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
  
                <h3 style={{padding: '0px',margin: '0',color: '#258a44'}}># Services Income</h3>
  <TableContainer >
    <Table className={classes.table} size="small" aria-label="a dense table" className="serviceincomes-dom">
      <TableHead>
        <TableRow> 
          <TableCell align="left" style={{width:'1%'}}>SL</TableCell>
          <TableCell align="left" style={{width:'10%'}}> Date & Time </TableCell>
          <TableCell align="left" style={{width:'15%'}}>Invoice No</TableCell>
          <TableCell align="left" style={{width:'15%'}}>Customer Name </TableCell>
          <TableCell align="right" style={{width:'15%'}}> Amount</TableCell>
         
        </TableRow>
      </TableHead>
      <TableBody>


    
          
          {
            serviceincomes.map((row,sl)=>(
                <TableRow  key=""> 
                <TableCell>{sl+parseFloat(1)}.</TableCell>
              <TableCell  align="left">{moment(row.service_created_isodt).format(dateTimeFormat)}</TableCell>
              <TableCell  align="left">  {row.service_invoice}</TableCell>
              <TableCell  align="left">{row.customer_name}</TableCell>
              <TableCell  align="right">{format(parseFloat(row.service_total_amount).toFixed(2))}</TableCell>

             
               </TableRow>
            ))
          }

          <TableRow>
          <TableCell colSpan={4} align="right">Total : </TableCell>
          <TableCell align="right">{format(parseFloat(serviceincomes.reduce((prev,curr)=> {return prev+parseFloat(curr.service_total_amount)},0)).toFixed(2))}</TableCell>
          </TableRow>
     
      </TableBody>
    </Table>
  </TableContainer>
      </Paper>
               </Grid>

               <Grid item  xs={12}  sm={6} style={{padding:'8px'}}>
               <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
  
               <h3 style={{padding: '0px',margin: '0',color: 'rgb(218 8 37)'}}># Services Expense</h3>

  <TableContainer >
    <Table className={classes.table} size="small" aria-label="a dense table" className="serviceincomes-dom">
      <TableHead>
        <TableRow> 
          <TableCell align="left" style={{width:'1%'}}>SL</TableCell>
          <TableCell align="left" style={{width:'10%'}}> Date & Time </TableCell>
          <TableCell align="left" style={{width:'10%'}}> Invoice No </TableCell>
          <TableCell align="left" style={{width:'15%'}}>Supplier Name </TableCell>
          <TableCell align="right" style={{width:'15%'}}>Amount</TableCell>
         
        </TableRow>
      </TableHead>
      <TableBody>


    
          
          {
            servicesexpense.map((row,sl)=>(
                <TableRow  key=""> 
                <TableCell>{sl+parseFloat(1)}.</TableCell>
              <TableCell  align="left">{moment(row.pur_ser_created_isodt).format(dateTimeFormat)}</TableCell>
            
              <TableCell  align="left">{row.pur_ser_invoice_no}</TableCell>
              <TableCell  align="left">{row.supplier_name}</TableCell>
              <TableCell  align="right">{format(parseFloat(row.pur_ser_total_amount).toFixed(2))}</TableCell>

             
               </TableRow>
            ))
          }

          <TableRow>
          <TableCell colSpan={4} align="right">Total : </TableCell>
          <TableCell align="right">{format(parseFloat(servicesexpense.reduce((prev,curr)=> {return prev+parseFloat(curr.pur_ser_total_amount)},0)).toFixed(2))}</TableCell>
          </TableRow>
     
      </TableBody>
    </Table>
  </TableContainer>
      </Paper>
        </Grid>
        <Paper className={classes.paper} style={{width: '100%'}}>
            <Grid container>
            <Grid item sm={12} sm={12}>
            
            <h3 style={{padding: '0px',margin: '0',color: 'rgb(47 82 2)'}}>Services Profit / Loss = {format(parseFloat(serviceincomes.reduce((prev,curr)=> {return prev+parseFloat(curr.service_total_amount)},0) - parseFloat(servicesexpense.reduce((prev,curr)=> {return prev+parseFloat(curr.pur_ser_total_amount)},0))).toFixed(2))} TK</h3>
             
          </Grid> 
            </Grid>
        
        </Paper>
        </Grid>

       
      
   
  }
      </div>)
  })

    return(
        <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
  marginBottom: '2px'}}>Services Report</h4> 
  
  

<Grid container spacing={3} > 
     
        
        
        <Grid item  xs={12}  sm={2} style={{marginBottom: '-9px'}} > 
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


        <Grid item  xs={12}  sm={2} style={{marginBottom: '-9px'}} > 
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
                          content={() => serviceincomesRef.current}
                        />
              </Paper>
           
            </Grid>
        </Grid>
          ):''
        }

            <ServiceIncomesDom ref={serviceincomesRef} />
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