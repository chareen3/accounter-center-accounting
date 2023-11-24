import React,{useState,useEffect} from 'react';
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
import '../commons/commons.css'

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import swal from 'sweetalert';

const TransferRecord = ({location,currentRoute,currentRouteSet,authInfo})=>{
  const classes = useStyles();
  useEffect(()=>{
      currentRouteSet(pathSpliter(location.pathname,1));
  },[]);
  let [branches,branchesSet] = useState([]);
  let [warehouses,warehousesSet] = useState([]);
  let [selectedBranch,selectedBranchSet] = useState(null);
  let [selectedWarehouse,selectedWarehouseSet] = useState(null);
  let [transferList,transferListSet] = useState([]);
  let [reportLoading,reportLoadingSet] = useState(false);


  
 
 

  let [byDateTime,byDateTimeSet] = useState({
        dateTimeFrom: currentDateStartTime(),
        dateTimeTo:currentDateEndTime()
  })



  useEffect(()=>{ 
    getBranches()
    getWarehouses()
      
  },[]);

  let getBranches = async ()=>{
    await axios.post(`${API_URL}/api/get-branches`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          branchesSet(res.data.message)
    })
  }
  let getWarehouses = async ()=>{
    await axios.post(`${API_URL}/api/get-warehouses`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          warehousesSet(res.data.message)
    })
  }

  let transferDelete = async (transferId)=>{

              swal({
                title:'Are you sure delete this?',
                icon:'warning',
                buttons:true
              }).then(async (confirm)=>{
              if(confirm){
                await axios.post(`${API_URL}/api/transfer-delete`,{transferId:transferId},{headers:{'auth-token':authInfo.token}}).then(res=>{
                  if(!res.data.error){
                    swal({
                      title:res.data.message,
                      icon:'success'
                  })
                  getSearchResult()
                  } 
              })
              }else{
                return false
              }
 
})


  }

  let getSearchResult = async ()=>{

      
          
      let obj = {
          branchId: selectedBranch != null? selectedBranch.branch_id:null,
          warehouseId: selectedWarehouse != null? selectedWarehouse.warehouse_id:null,
          dateTimeFrom: byDateTime.dateTimeFrom,
          dateTimeTo: byDateTime.dateTimeTo
      }

      reportLoadingSet(true)
      await axios.post(`${API_URL}/api/get-product-transfer-list`,{payLoad:{transfer_b_to:obj.branchId,
        transfer_w_to:obj.warehouseId,from_date:obj.dateTimeFrom,to_date:obj.dateTimeTo
      }},{headers:{'auth-token':authInfo.token}}).then(res=>{
        transferListSet(res.data.message)
        reportLoadingSet(false)
  })

      

      



  }

    return(
        <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
  marginBottom: '2px'}}>Transfer  Record</h4>
<Grid container spacing={3} > 
     
        <Grid item  xs={12}   sm={2} > 
        <Autocomplete 
        size="small"

        autoHighlight
            openOnFocus={true}
            style={{width:'100%',height:'20px'}}
            options={branches}
            value={selectedBranch}
            getOptionLabel={(option) => option.branch_name}
            onChange={(event,selectedObj)=>{
               selectedBranchSet(selectedObj)
            }}
            renderInput={(params) => <TextField 
              onKeyDown={event => {
                if (event.key === "Enter") {
                   // saleDateRef.current.focus()
                }
              }} 
              {...params} 
              label="Transfer  Branch" 
              variant="outlined"
              />} 
        />
        </Grid>


        <Grid item  xs={12}   sm={2} > 
        <Autocomplete 
        size="small"

        autoHighlight
            openOnFocus={true}
            style={{width:'100%',height:'20px'}}
            options={warehouses}
            value={selectedWarehouse}
            getOptionLabel={(option) => option.warehouse_name}
            onChange={(event,selectedObj)=>{
               selectedWarehouseSet(selectedObj)
            }}
            renderInput={(params) => <TextField 
              onKeyDown={event => {
                if (event.key === "Enter") {
                   // saleDateRef.current.focus()
                }
              }} 
              {...params} 
              label="Transfer  Warehouse" 
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
          value={byDateTime.dateTimeFrom}
          onChange={(datet)=>{
            byDateTimeSet({...byDateTime,dateTimeFrom:getDateTimeFromISODT(datet)})
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
          value={byDateTime.dateTimeTo}
          onChange={(datet)=>{
            byDateTimeSet({...byDateTime,dateTimeTo:getDateTimeFromISODT(datet)})
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
     transferList.length>0?(
      <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
  

      <TableContainer >
        <Table className={classes.table} size="small" aria-label="a dense table" className="report-dom">
          <TableHead>
            <TableRow> 
              <TableCell align="left">SL</TableCell>
              <TableCell align="left">Transfer Date & Time</TableCell>
              <TableCell align="left">Transfer Branch</TableCell>
              <TableCell align="left">Transfer Warehouse</TableCell>
              <TableCell align="left">Transfer By</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              
              {
                 transferList.map((transfer,sl)=>(
                  <TableRow  key={sl}> 
                  <TableCell  align="left">{sl+parseFloat(1)}</TableCell>
                  <TableCell  align="left">{moment(transfer.transfer_c_isodt).format(dateTimeFormat)}</TableCell>
                 <TableCell align="left">{transfer.branch_name}</TableCell> 
                  <TableCell align="left">{transfer.warehouse_name}</TableCell>
                  <TableCell align="left">{transfer.employee_name}</TableCell>
                  <TableCell align="right">{(transfer.transfer_amount).toFixed(2)}</TableCell>
                    
                  <TableCell align="right"> 
                 <Link to={{pathname:`/stock/product-transfer/${transfer.transfer_id}`}}>  <EditIcon style={{cursor:'pointer',color:'green',marginLeft:'2px'}} > </EditIcon></Link>
                 <Link to={{pathname:`/stock/transfer-invoice/${transfer.transfer_id}`}}>   <ReceiptIcon style={{cursor:'pointer',color:'black',marginLeft:'2px'}} > </ReceiptIcon></Link>
                  <DeleteIcon onClick={()=>{transferDelete(transfer.transfer_id)}} style={{cursor:'pointer',color:'#FF0202',marginLeft:'2px'}} > </DeleteIcon>
                  </TableCell>
                  </TableRow> 
                 ))
              }


             <TableRow>
              <TableCell  align="left"></TableCell>
              <TableCell  align="left"></TableCell>
              <TableCell  align="left"></TableCell>
              <TableCell  align="left"></TableCell>
              <TableCell  align="left">Total : </TableCell>
              <TableCell  align="right">{transferList.reduce((prev,curr)=>{
                            return prev+parseFloat(curr.transfer_amount)
              },0).toFixed(2)}</TableCell>
              </TableRow>
                  
            
    
       
         
    
    
          </TableBody>
        </Table>
      </TableContainer>
          </Paper>
     ):''
  }
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