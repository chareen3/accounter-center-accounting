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
  let [products,productsSet] = useState([]);
  let [selectedProduct,selectedProductSet] = useState(null);
  let [report,reportSet] = useState([]);
  let [print,printSet] = useState(false);
  let [reportLoading,reportLoadingSet] = useState(false);

  let [opening_stock,opening_stock_set] = useState(0);
  let [closing_stock,closing_stock_set] = useState(0);

  



  let [byDateTime,byDateTimeSet] = useState({
        fromDate: currentDateStartTime(),
        toDate:currentDateEndTime()
  })

  let customerRef = useRef(null);
  let fromDateRef = useRef(null);
  let reportRef = useRef(null);

  useEffect(()=>{ 
    getProducts();
  },[]);

  let getProducts = async ()=>{
    await axios.post(`${API_URL}/api/get-products`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
          productsSet(res.data.message)
    })
  }
 
 

  let getSearchResult = async ()=>{

        if(selectedProduct == null){
            swal({title:'Select Product',icon:'warning'}); return false;
        }

      let payload = {
          productId: selectedProduct != null? selectedProduct.prod_id:null,
          fromDate: byDateTime.fromDate,
          toDate: byDateTime.toDate
      }

     
      reportLoadingSet(true)
      await axios.post(`${API_URL}/api/get-product-ledger`,{...payload},{headers:{'auth-token':authInfo.token}}).then(res=>{
        reportSet(res.data.ledger)
        opening_stock_set(res.data.opening_stock)
        closing_stock_set(res.data.closing_stock)
        printSet(true)
        reportLoadingSet(false)
  })

  }


  let ReportDom = React.forwardRef((props,ref)=>{
      return(<div ref={ref}>
        <InstitutionProfile />

        <div style={{clear:'both'}}></div>
<Paper style={{width:'100%',paddingLeft:'10px',paddingRight:'10px'}} className="print-source">
<p style={{width:'100%',textAlign:'center',fontWeight:'bold'}}>Product Ledger</p>

  <p style={{float:'left',width:'30%',textAlign:'left',margin:0,padding:0,fontSize:'16px'}}>
    {`Product Name : ${selectedProduct!=null?selectedProduct.prod_name:''}`}
    </p>

<p style={{float:'right',width:'40%',textAlign:'right',margin:0,padding:0}}> Statement From { moment(byDateTime.fromDate).format(dateTimeFormat)  } <br/> TO { moment(byDateTime.toDate).format(dateTimeFormat) }
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
              <TableCell align="left" style={{width:'15%'}}>Date & Time </TableCell>
              <TableCell align="left" style={{width:'15%'}}>Description</TableCell>
              <TableCell align="right" style={{width:'10%'}}>Rate</TableCell>
              <TableCell align="right" style={{width:'15%'}}>In Quantity</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Out Quantity</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Stock</TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>

          <TableRow  key=""> 
                    <TableCell colSpan={2}  align="right"></TableCell>
                    <TableCell style={{color: '#005400',fontWeight:'bold'}}>Opening Stock -> </TableCell>
                    <TableCell colSpan={3} align="right"> </TableCell>
                  <TableCell style={{color: '#005400',fontWeight:'bold'}} align="right">{ format(parseFloat(opening_stock).toFixed(2))}</TableCell>
                   </TableRow>
        
              
              {
                report.map((row,sl)=>(
                    <TableRow  key=""> 
                    <TableCell>{sl+parseFloat(1)}.</TableCell>
                  <TableCell  align="left">{moment(row.dateTime).format(dateTimeFormat)}</TableCell>
                
                  <TableCell  align="left">{row.description}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.rate).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.in_qty).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.out_qty).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.stock).toFixed(2))}</TableCell>
                   </TableRow>
                ))
              }

                   <TableRow style={{background: '#f1f1f1'}}> 
                    <TableCell colSpan={4}  align="right">Total (IN & Out) : </TableCell>
                    <TableCell  align="right">{format(report.reduce((prev,curr)=>{ return prev + curr.in_qty},0).toFixed(2))}</TableCell>
                    <TableCell  align="right">{format(report.reduce((prev,curr)=>{ return prev + curr.out_qty},0).toFixed(2))}</TableCell>
                    <TableCell  align="right" colSpan={1}></TableCell>
                   </TableRow>


<TableRow  key="" >  
                    <TableCell colSpan={5}  align="right"></TableCell>
                    <TableCell colSpan={1} align="right" style={{color: '#005400',fontWeight:'bold'}} >Closing  Stock -> </TableCell>
                  <TableCell  style={{color: '#005400',fontWeight:'bold'}}  align="right">{ format(parseFloat(closing_stock).toFixed(2))}</TableCell>
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
  marginBottom: '2px'}}>Product Ledger</h4> 
  
  

<Grid container spacing={3} > 
     
        <Grid item  xs={12}   sm={2} > 
        <Autocomplete 
        size="small"

        autoHighlight
            openOnFocus={true}
            style={{width:'100%',height:'20px'}}
            options={products}
            value={selectedProduct}
            getOptionLabel={(option) => option.prod_name}
            onChange={(event,selectedObj)=>{
               selectedProductSet(selectedObj)
            }}
            inputRef={customerRef}

            onKeyDown={event => {
                if (event.key === "Enter") {
                    fromDateRef.current.focus()
                }
              }}

            renderInput={(params) => <TextField 
               
              {...params} 
              label="Product " 
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