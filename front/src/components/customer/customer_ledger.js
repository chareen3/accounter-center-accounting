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
const TransferRecord = ({location,currentRoute,currentRouteSet,authInfo})=>{
  const classes = useStyles();
  useEffect(()=>{
      currentRouteSet(pathSpliter(location.pathname,1));
  },[]);
  let [customers,customersSet] = useState([]);
  let [selectedCustomer,selectedCustomerSet] = useState(null);
  let [ledger,ledgerSet] = useState([]);
  let [opening_balance,opening_balance_set] = useState(0);
  let [closing_balance,closing_balance_set] = useState(0);
  let [print,printSet] = useState(false);
  let [reportLoading,reportLoadingSet] = useState(false);


  let [byDateTime,byDateTimeSet] = useState({
        fromDate: currentDateStartTime(),
        toDate:currentDateEndTime()
  })

  let customerRef = useRef(null);
  let fromDateRef = useRef(null);
  let reportRef = useRef(null);




  useEffect(()=>{ 
    getCusomers();
  },[]);

  let getCusomers = async ()=>{
    await axios.post(`${API_URL}/api/get-customers`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          customersSet(res.data.message)
    })
  }
 
 

  let getSearchResult = async ()=>{

    if(selectedCustomer == null){
        swal({title:'select a customer',icon:'warning'});return false;
    }

   

      let payload = {
          customerId: selectedCustomer != null? selectedCustomer.customer_id:null,
          fromDate: byDateTime.fromDate,
          toDate: byDateTime.toDate
      }
      reportLoadingSet(true)
      await axios.post(`${API_URL}/api/get-customer-ledger`,{...payload},{headers:{'auth-token':authInfo.token}}).then(res=>{
        ledgerSet(res.data.ledger)
        opening_balance_set(res.data.opening_balance)
        closing_balance_set(res.data.closing_balance)
        printSet(true)
        reportLoadingSet(false)
  })

  }


  let ReportDom = React.forwardRef((props,ref)=>{
      return(<div ref={ref}>
        <InstitutionProfile />

        <div style={{clear:'both'}}></div>

        <Paper style={{width:'100%',paddingLeft:'10px',paddingRight:'10px'}} className="print-source">
        <p style={{width:'100%',textAlign:'center',fontWeight:'bold'}}>Customer Ledger </p>

  <p style={{float:'left',width:'30%',textAlign:'left',margin:0,padding:0,fontSize:'16px'}}>
    {selectedCustomer != null ?`Customer : ${selectedCustomer!=null?selectedCustomer.customer_name:''}`:''} <br/>
    {selectedCustomer != null ?`Institution : ${selectedCustomer!=null?selectedCustomer.customer_institution_name:''}`:''}
    </p>

<p style={{float:'right',width:'40%',textAlign:'right',margin:0,padding:0}}> Statement From { moment(byDateTime.fromDate).format(dateTimeFormat)  } <br/> TO { moment(byDateTime.toDate).format(dateTimeFormat) }
</p>
</Paper> 


               {
     ledger.length>0?(
      <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
  

      <TableContainer >
        <Table className={classes.table} size="small" aria-label="a dense table" className="report-dom">
          <TableHead>
            <TableRow> 
              <TableCell align="left" style={{width:'2%'}}>SL</TableCell>
              <TableCell align="left" style={{width:'15%'}}>Date & Time</TableCell>
              <TableCell align="left" style={{width:'20%'}}>Description </TableCell>
              <TableCell align="right" style={{width:'10%'}}>Bill</TableCell>
              <TableCell align="right" style={{width:'10%'}}>Paid</TableCell>
              <TableCell align="right" style={{width:'10%'}}>Bill Due</TableCell>
              <TableCell align="right" style={{width:'10%'}}>Returned</TableCell>
              <TableCell align="right" style={{width:'10%'}}>Payment </TableCell>
              <TableCell align="right" style={{width:'15%'}}>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

          <TableRow  key=""> 
                    <TableCell colSpan={2}  align="right"></TableCell>
                    <TableCell style={{color: '#005400',fontWeight:'bold'}}>Opening Balance -> </TableCell>
                    <TableCell colSpan={5} align="right"> </TableCell>
                  <TableCell style={{color: '#005400',fontWeight:'bold'}} align="right">{ format(parseFloat(opening_balance).toFixed(2))}</TableCell>
                   </TableRow>
              
              {
                ledger.map((row,sl)=>(
                    <TableRow  key=""> 
                    <TableCell>{sl+parseFloat(1)}.</TableCell>
                  <TableCell  align="left">{moment(row.date).format('DD MMM Y H:m a')}</TableCell>
                  <TableCell  align="left">{row.description}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.bill).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.paid).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.due).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.returned).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.payment).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.balance).toFixed(2))}</TableCell>
                   </TableRow>
                ))
                   
        
              }
 
                  
            
    
 <TableRow  key="" >  
                    <TableCell colSpan={6}  align="right"></TableCell>
                    <TableCell colSpan={2} align="right" style={{color: '#005400',fontWeight:'bold'}} >Closing  Balance -> </TableCell>
                  <TableCell  style={{color: '#005400',fontWeight:'bold'}}  align="right">{ format(parseFloat(closing_balance).toFixed(2))}</TableCell>
                   </TableRow>
         
    
    
          </TableBody>
        </Table>
      </TableContainer>
          </Paper>
     ):''
  }
      </div>)
  })

    return(
        <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
  marginBottom: '2px'}}>Customer Ledger</h4> 
  
  

<Grid container spacing={3} > 
     
        <Grid item  xs={12}   sm={3} > 
        <Autocomplete 
        size="small"

        autoHighlight
            openOnFocus={true}
            style={{width:'100%',height:'20px'}}
            options={customers}
            value={selectedCustomer}
            getOptionLabel={(option) => option.display_text}
            onChange={(event,selectedObj)=>{
               selectedCustomerSet(selectedObj)
            }}
            inputRef={customerRef}

            onKeyDown={event => {
                if (event.key === "Enter") {
                    fromDateRef.current.focus()
                }
              }}

            renderInput={(params) => <TextField 
               
              {...params} 
              label="Customer " 
              variant="outlined"
              />} 
        />
        </Grid>
        
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
export default connect(mapStateToPops,{currentRouteSet})(TransferRecord);