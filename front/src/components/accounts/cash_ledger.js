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
import PrintIcon from '@material-ui/icons/Print';

import moment from 'moment';
import _ from 'lodash';
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
  let [banks,banksSet] = useState([]);
  let [selectedBank,selectedBankSet] = useState(null);
  let [ledger,ledgerSet] = useState([]);
  let [opening_balance,opening_balance_set] = useState(0);
  let [closing_balance,closing_balance_set] = useState(0);

  let [print,printSet] = useState(false);
  let reportRef = useRef(null);
  let [reportLoading,reportLoadingSet] = useState(false);

  let [byDateTime,byDateTimeSet] = useState({
        fromDate: currentDateStartTime(),
        toDate:currentDateEndTime()
  })

  let bankRef = useRef(null);
  let fromDateRef = useRef(null);
  let toDateRef = useRef(null);


 
 

  let getSearchResult = async ()=>{

   

      let payload = {
          fromDate: byDateTime.fromDate,
          toDate: byDateTime.toDate
      }

      reportLoadingSet(true)
      await axios.post(`${API_URL}/api/get-cash-ledger`,{...payload},{headers:{'auth-token':authInfo.token}}).then(res=>{
        printSet(true)
        reportLoadingSet(false)
        ledgerSet(res.data.ledger)
        opening_balance_set(res.data.opening_balance)
        closing_balance_set(res.data.closing_balance)
  })

  }


  let ReportDom = React.forwardRef((props,ref)=>{
      return (
        <div ref={ref}>
                  <InstitutionProfile />
                  <div style={{clear:'both'}}></div>
<Paper style={{width:'100%',paddingLeft:'10px',paddingRight:'10px'}} className="print-source">
<p style={{width:'100%',textAlign:'center',fontWeight:'bold'}}>Cash Ledger </p>



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
              <TableCell align="left" style={{width:'3%'}}>SL</TableCell>
              <TableCell align="left" style={{width:'12%'}}>Date & Time</TableCell>
              <TableCell align="left" style={{width:'20%'}}>Description </TableCell>
              <TableCell align="right" style={{width:'10%'}}>Debit</TableCell>
              <TableCell align="right" style={{width:'10%'}}>Credit </TableCell>
              <TableCell align="right" style={{width:'15%'}}>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          <TableRow  key=""> 
                    <TableCell colSpan={2}  align="right"></TableCell>
                    <TableCell style={{color: '#005400',fontWeight:'bold'}}>Opening Balance -> </TableCell>
                    <TableCell colSpan={2} align="right"> </TableCell>
                  <TableCell style={{color: '#005400',fontWeight:'bold'}} align="right">{ format(parseFloat(opening_balance).toFixed(2))}</TableCell>
                   </TableRow>
              {
                ledger.map((row,sl)=>(
                    <TableRow  key=""> 
                    <TableCell>{sl+parseFloat(1)}.</TableCell>
                  <TableCell  align="left">{moment(row.dateTime).format('DD MMM Y h:m a')}</TableCell>
                  <TableCell  align="left">{row.description}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.debitAmount).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.creditAmount).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.balance).toFixed(2))}</TableCell>
                   </TableRow>
                ))
                   
        
              }

                 <TableRow  style={{background: '#f1f1f1'}}> 
                    <TableCell colSpan={3}  align="right">Total (Debit & Credit) : </TableCell>
                    <TableCell  align="right">{format(ledger.reduce((prev,curr)=>{ return prev + curr.debitAmount},0).toFixed(2))}</TableCell>
                    <TableCell  align="right">{format(ledger.reduce((prev,curr)=>{ return prev + curr.creditAmount},0).toFixed(2))}</TableCell>
                    <TableCell  align="right" colSpan={1}></TableCell>
                   </TableRow>

<TableRow  key="" >  
                    <TableCell colSpan={4}  align="right"></TableCell>
                    <TableCell style={{color: '#005400',fontWeight:'bold'}} >Closing  Balance -> </TableCell>
                  <TableCell  style={{color: '#005400',fontWeight:'bold'}}  align="right">{ format(parseFloat(closing_balance).toFixed(2))}</TableCell>
                   </TableRow>
 
          </TableBody>
        </Table>
      </TableContainer>
          </Paper>
     ):''
  }

        </div>
      )
  })

    return(
        <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
  marginBottom: '2px'}}>Cash Ledger</h4> 
  
  

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
          style={{ width: '100%',marginTop: '',marginLeft:'30px'}}
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