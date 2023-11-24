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



 useEffect(()=>{
    getProducts()
 },[])
 
 let getProducts = async()=>{
    reportLoadingSet(true)
    await axios.post(`${API_URL}/api/get-product-current-stock-detail`,{'fetch-type':'low'},{headers:{'auth-token':authInfo.token}}).then(res=>{
      reportSet(res.data)
      printSet(true)
      reportLoadingSet(false)
    })
 }
 




  let ReportDom = React.forwardRef((props,ref)=>{
      return(<div ref={ref}>
        <InstitutionProfile />
               {
     report.length>0?(
      <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
<div style={{clear:'both'}}></div>
<Paper style={{width:'100%',paddingLeft:'10px',paddingRight:'10px'}} className="print-source">
<p style={{width:'100%',textAlign:'center',fontWeight:'bold'}}>Product Re-Order List </p>


<p style={{float:'right',width:'50%',textAlign:'right',margin:0,padding:0}}> Statement Date & Time => {   moment(currentDateTime()).format(dateTimeFormat) }
</p>
</Paper> 

      <TableContainer >
        <Table className={classes.table} size="small" aria-label="a dense table" className="report-dom">
          <TableHead>
            <TableRow> 
              <TableCell align="left" style={{width:'1%'}}>SL</TableCell>
              <TableCell align="left" style={{width:'15%'}}>Product Code </TableCell>
              <TableCell align="left" style={{width:'15%'}}>Product Name </TableCell>
              <TableCell align="left" style={{width:'15%'}}>Product Category </TableCell>
              <TableCell align="right" style={{width:'15%'}}>Sale Rate</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Purchase Rate AVG.</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Re-Order Level</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Current Stock</TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>


        
              
              {
                report.map((row,sl)=>(
                    <TableRow  key=""> 
                    <TableCell>{sl+parseFloat(1)}.</TableCell>
                
                  <TableCell  align="left">  {row.prod_code}</TableCell>
                  <TableCell  align="left">{row.prod_name}</TableCell>
                  <TableCell  align="left">  {row.prod_cat_name}</TableCell>
                  <TableCell  align="right">{row.prod_sale_rate}</TableCell>
                  <TableCell  align="right">{parseFloat(row.prod_purchase_rate).toFixed(2)}</TableCell>
                  <TableCell  align="right">{parseFloat(row.prod_re_order_lebel).toFixed(2)}</TableCell>
                  <TableCell  align="right">{parseFloat(row.current_stock).toFixed(2)}</TableCell>

                 
                   </TableRow>
                ))
                   
        
              }
         
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
  marginBottom: '2px'}}>Product Re-Order  List</h4> 
  
  

 
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