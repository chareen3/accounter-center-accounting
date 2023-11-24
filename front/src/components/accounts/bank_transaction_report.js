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
const CashTransactionHistory = ({location,currentRoute,currentRouteSet,authInfo})=>{
  const classes = useStyles();
  useEffect(()=>{
      currentRouteSet(pathSpliter(location.pathname,1));
  },[]);
  let [accounts,accountsSet] = useState([]);
  let [selectedAccount,selectedAccountSet] = useState(null);
  let [report,reportSet] = useState([]);
  let [print,printSet] = useState(false);
  let [reportLoading,reportLoadingSet] = useState(false);


  let [byDateTime,byDateTimeSet] = useState({
        fromDate: currentDateStartTime(),
        toDate:currentDateEndTime()
  })

  let customerRef = useRef(null);
  let fromDateRef = useRef(null);
  let reportRef = useRef(null);


  let [tranTypes,tranTypesSet] = useState([{label:'All',value:'all'},{label:'Deposit',value:'deposit'},
  {label:'Withdraw',value:'withdraw'}]);
  let [selectedTranType,selectedTranTypeSet] = useState({label:'All',value:'all'});

  useEffect(()=>{ 
    getAccounts();
  },[]);

  let getAccounts = async ()=>{
    await axios.post(`${API_URL}/api/get-bank-accounts`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
          accountsSet(res.data.message)
    })
  }
 
 

  let getSearchResult = async ()=>{

   

      let payload = {
          accountId: selectedAccount != null? selectedAccount.bank_acc_id:null,
          tranType: selectedTranType != null && selectedTranType.value != 'all'? selectedTranType.value:null,
          fromDate: byDateTime.fromDate,
          toDate: byDateTime.toDate
      }

     reportLoadingSet(true)

      await axios.post(`${API_URL}/api/get-bank-transactions`,{...payload},{headers:{'auth-token':authInfo.token}}).then(res=>{
        reportSet(res.data)
        printSet(true)
        reportLoadingSet(false)
  })

  }


  let ReportDom = React.forwardRef((props,ref)=>{
      return(<div ref={ref}>
        <InstitutionProfile />

        <div style={{clear:'both'}}></div>
<Paper style={{width:'100%',paddingLeft:'10px',paddingRight:'10px'}} className="print-source">
<p style={{width:'100%',textAlign:'center',fontWeight:'bold'}}>Bank Transaction Report</p>

  <p style={{float:'left',width:'30%',textAlign:'left',margin:0,padding:0,fontSize:'16px'}}>
    {`Transaction Type : ${selectedTranType!=null?selectedTranType.value:''}`}<br/>
    {`Transaction Account : ${selectedAccount!=null?selectedAccount.bank_acc_name:''}`}
    </p>

<p style={{float:'right',width:'40%',textAlign:'right',margin:0,padding:0}}> Statement From { moment(byDateTime.dateTimeFrom).format(dateTimeFormat)  } <br/> TO { moment(byDateTime.dateTimeTo).format(dateTimeFormat) }
</p>
</Paper> 


               {
     report.length>0?(
      <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
  

      <TableContainer >
        <Table className={classes.table} size="small" aria-label="a dense table" className="report-dom">
          <TableHead>
            <TableRow> 
              <TableCell align="left" style={{width:'1%'}}>SL</TableCell>
              <TableCell align="left" style={{width:'10%'}}>Date & Time</TableCell>
              <TableCell align="left" style={{width:'15%'}}>Transaction ID </TableCell>
              <TableCell align="left" style={{width:'15%'}}>Transaction Type </TableCell>
              <TableCell align="left" style={{width:'15%'}}>Note </TableCell>
              <TableCell align="left" style={{width:'15%'}}>In Amount </TableCell>
              <TableCell align="right" style={{width:'15%'}}>Out Amount </TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>


        
              
              {
                report.map((row,sl)=>(
                    <TableRow  key=""> 
                    <TableCell>{sl+parseFloat(1)}.</TableCell>
                  <TableCell  align="left">{moment(row.bank_tran_created_isodt).format('Y MMM DD')}</TableCell>
                
                  <TableCell  align="left">{row.bank_tran_code}</TableCell>
                  <TableCell  align="left">{row.bank_tran_type}</TableCell>
                  <TableCell  align="left">{row.bank_tran_note}</TableCell>
                  <TableCell  align="left">{format(parseFloat(row.bank_tran_in_amount).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.bank_tran_out_amount).toFixed(2))}</TableCell>
                   </TableRow>
                ))
                   
        
              }
         

            <TableRow  key=""> 
            <TableCell colSpan={5}  align="right">Total : </TableCell>
            <TableCell  align="left">{format(_.sumBy(report,curr => Number(curr.bank_tran_in_amount)).toFixed(2))}</TableCell>
            <TableCell  align="right">{format(_.sumBy(report,curr => Number(curr.bank_tran_out_amount)).toFixed(2))}</TableCell>
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
  marginBottom: '2px'}}>Bank Transaction Report</h4> 
  
  

<Grid container spacing={3} > 
     
      

        <Grid item  xs={12}   sm={2} > 
                <Select
                value={selectedTranType}
                onChange={(type)=>{
                    if(type == null){
                        return false;
                    }
                    selectedTranTypeSet(type);
                }}
                options={tranTypes}

            />
        </Grid>


        <Grid item  xs={12}   sm={2} > 
        <Autocomplete 
        size="small"

        autoHighlight
            openOnFocus={true}
            style={{width:'100%',height:'20px'}}
            options={accounts}
            value={selectedAccount}
            getOptionLabel={(option) => option.bank_acc_name}
            onChange={(event,selectedObj)=>{
               selectedAccountSet(selectedObj)
            }}
            inputRef={customerRef}

            onKeyDown={event => {
                if (event.key === "Enter") {
                    fromDateRef.current.focus()
                }
              }}

            renderInput={(params) => <TextField 
               
              {...params} 
              label="Account " 
              variant="outlined"
              />} 
        />
        </Grid>
        
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
export default connect(mapStateToPops,{currentRouteSet})(CashTransactionHistory);