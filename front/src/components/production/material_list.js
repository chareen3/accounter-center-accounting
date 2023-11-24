import React,{useState,useEffect,useRef} from 'react';
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

import ReactToPrint from "react-to-print";
import PrintIcon from '@material-ui/icons/Print';
import InstitutionProfile from '../commons/institution_profile'
import '../commons/commons.css'

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import swal from 'sweetalert';



const PurchaseRecord = ({location,currentRoute,currentRouteSet,authInfo})=>{
    const classes = useStyles();
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));

         axios.post(`${API_URL}/api/get-materials`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            printSet(true)
            searchResultSet(res.data.message); 
         });
    },[]);
    let [users,usersSet] = useState([]);
  
    let [suppliers,suppliersSet] = useState([]);
    let [materials,materialsSet] = useState([]);

    let [selectedSearchType,selectedSearchTypeSet] = useState({searchType:'All'})
    let [selectedMaterial,selectedMaterialSet] = useState(null)
    let [selectedUser,selectedUserSet] = useState(null)


    let employeeRef = React.useRef(null)
    let [searchResult,searchResultSet] = useState([]);
    let [print,printSet] = useState(false);


      const getUsers = async ()=>{
        await axios.post(`${API_URL}/api/get-users`,{'select-type': "active"},{headers:{'auth-token':authInfo.token}}).then(res=>{
          usersSet(res.data.message)
      })
      }


    let [byDateTime,byDateTimeSet] = useState({
          dateTimeFrom: currentDateStartTime(),
          dateTimeTo:currentDateEndTime()
    })

  

    useEffect(()=>{ 
        if(selectedSearchType != null && selectedSearchType.searchType=='By User'){
            getUsers();
        }
        
    },[selectedSearchType]);


    



    let [searchTypes,searchTypesSet] = useState([{searchType:'All'},
    {searchType:'By User'}]);

    
    let getSearchResult = async ()=>{

        let url = `${API_URL}/api/get-materials`;

          if(selectedSearchType == null){
            swal({
              title:'Select search Type',
              icon:'warning',
           })
           return false
          }


            
        let reqPayload = {
            userId: selectedUser != null && selectedSearchType.searchType=='By User' ?selectedUser.user_id:null,
            fromDate: byDateTime.dateTimeFrom,
            toDate: byDateTime.dateTimeTo,
        }

       

        await axios.post(`${url}`,reqPayload,{headers:{'auth-token':authInfo.token}}).then(res=>{
           printSet(true)
           searchResultSet(res.data.message);

            
        });
    }


    let ReportDom = React.forwardRef((props,ref)=>{
      
        return(
          <div ref={ref}>
               <InstitutionProfile />

          
  


{
( searchResult.length>0)?(
  <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
  
  {/* Purchase Record  without details */} 
  <TableContainer >
    <Table className={classes.table} size="small" aria-label="a dense table" className="report-dom">
      <TableHead>
        <TableRow>
          <TableCell align="left">SL</TableCell>
          <TableCell align="left">Material Code</TableCell>
          <TableCell align="left">Date & Time</TableCell>
          <TableCell align="left">Material Name</TableCell>
          <TableCell align="right">Category</TableCell>

          <TableCell align="right">Purchase Rate</TableCell>
          <TableCell align="right">Unit Name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
          {
            searchResult.map((ele,index)=>(
              <TableRow  key={index}> 
              <TableCell  align="left">{index+parseFloat(1)}</TableCell>
              <TableCell align="left">{ele.material_code}</TableCell> 
              <TableCell align="left">{moment(ele.material_created_isodt).format(dateTimeFormat)}</TableCell>
              <TableCell align="left">{ele.material_name}</TableCell>
              <TableCell align="right">{ele.prod_cat_name}</TableCell>

              <TableCell align="right">{parseFloat(ele.material_purchase_rate).toFixed(2)}</TableCell>

              <TableCell align="right">{ele.prod_unit_name}</TableCell>
               <TableCell align="right" className="print-no">

              
               
              </TableCell>
            </TableRow>
            ))
          }
          
        

 
     


      </TableBody>
    </Table>
  </TableContainer>
      </Paper>
):''
}
      





   

     
      </div>
       )
      })
const reportRef = useRef();

    
      return(
          <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '2px'}}> Material List</h4>
<Grid container spacing={3} > 
          <Grid item  xs={12}  sm={2}> 
          <Autocomplete 
          size="small"
          autoHighlight
              openOnFocus={true}
              style={{width:'100%',height:'20px'}}
              options={searchTypes} 
              value={selectedSearchType}
              getOptionLabel={(option) => option.searchType}
              onChange={(event,selectedObj)=>{
                selectedSearchTypeSet(selectedObj) 
              }}
              renderInput={(params) => <TextField 
                inputRef={employeeRef}
               
                {...params} 
                label="Search Type" 
                variant="outlined"
                />} 
          />

          </Grid>
         
          

        

          <br></br>
          
        
        

          <Grid item  xs={12}   sm={2} style={{display: selectedSearchType!=null && selectedSearchType.searchType=='By User'?'block':'none'}}> 
          <Autocomplete  
          size="small"
          autoHighlight
              openOnFocus={true}
              style={{width:'100%',height:'20px'}}
              options={users}
              value={selectedUser} 
              getOptionLabel={(option) => option.user_name}
              onChange={(event,selectedObj)=>{
                 selectedUserSet(selectedObj)
              }}
              renderInput={(params) => <TextField 
                {...params} 
                label="Select user" 
                variant="outlined"
                />} 
                
          />
          </Grid>

     


          
              
          <Grid item  xs={12}  sm={2} style={{marginBottom: '-9px'}} > 
            <MuiPickersUtilsProvider  utils={DateFnsUtils} > 
          
            <KeyboardDateTimePicker
          //  inputRef={purchaseDateRef}
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
            //inputRef={purchaseDateRef}
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
export default connect(mapStateToPops,{currentRouteSet})(PurchaseRecord); 