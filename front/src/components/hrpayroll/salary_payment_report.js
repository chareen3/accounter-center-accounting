import React,{useState,useEffect,useRef} from 'react';
import {connect} from 'react-redux';
import {createdEmployeeSet, currentRouteSet} from '../../actions/actions';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'; 
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'
import {pathSpliter,dateTimeFormat,currentDateTime,getDateTimeFromISODT} from '../../lib/functions'
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
import commaNumber from 'comma-number';
let format = commaNumber.bindWith(',', '.')
const SalaryPaymentRecord = ({location,currentRoute,currentRouteSet,authInfo})=>{
  const classes = useStyles();
  useEffect(()=>{
      currentRouteSet(pathSpliter(location.pathname,1));
  },[]);

  let [types,typesSet] = useState([{'type_name':'payment records'},{'type_name':'salary summary'}]);
  let [employees,employeesSet] = useState([]);
  let [months,monthsSet] = useState([]);
  let [selectedType,selectedTypeSet] = useState(null);
  let [selectedEmployee,selectedEmployeeSet] = useState(null);
  let [selectedMonth,selectedMonthSet] = useState(null);
  let [reportList,reportListSet] = useState([]);

  let [print,printSet] = useState(false);

  let [reportLoading,reportLoadingSet] = useState(false);

 
 




  useEffect(()=>{ 
    getEmployees()
    getMonths()
      
  },[]);

  let getEmployees = async ()=>{
    await axios.post(`${API_URL}/api/get-employees`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          employeesSet(res.data.message)
    })
  }
  let getMonths = async ()=>{
    await axios.post(`${API_URL}/api/get-months`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          monthsSet(res.data.message)
    })
  }


  let getSearchResult = async ()=>{

      if(selectedType != null && selectedType.type_name=='salary summary' &&  selectedMonth == null){
        swal({title:'select month',icon:'warning'});return false;
      }
          if(selectedType.type_name=='salary summary'){
            selectedEmployeeSet(null)
          }
      let payLoad = {
          employeeId: selectedEmployee != null? selectedEmployee.employee_id:null,
          monthId: selectedMonth != null? selectedMonth.month_id:null,
          type: selectedType!= null? selectedType.type_name:null,
      }

        reportLoadingSet(true)
      await axios.post(`${API_URL}/api/get-salary-report`,{payLoad},{headers:{'auth-token':authInfo.token}}).then(res=>{
        reportListSet(res.data)
        reportLoadingSet(false)
        printSet(true)

  })

      

      



  }



  const ReportDom = React.forwardRef((props,ref)=>{
        return(<div ref={ref}>
              <InstitutionProfile/>


              <div style={{clear:'both'}}></div>
<Paper style={{width:'100%',paddingLeft:'10px',paddingRight:'10px'}} className="print-source">
<p style={{width:'100%',textAlign:'center',fontWeight:'bold'}}>Salary Payment Report</p>

  <p style={{float:'left',width:'50%',textAlign:'left',margin:0,padding:0,fontSize:'16px'}}>
    {selectedEmployee!=null?`Employee Name : ${selectedEmployee.employee_name}`:''} <br/>
    {selectedMonth!=null?`Month : ${selectedMonth.month_name}`:''}
   
    </p>


</Paper> 

              {
     reportList.length>0?(
        <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
  

      <TableContainer >
        <Table className={classes.table} size="small" aria-label="a dense table" className="report-dom">
          <TableHead>
            <TableRow> 
                {
                    selectedType!=null && selectedType.type_name=='payment records'?(
                        <TableCell align="left">Payment Date & Time</TableCell>
                    ):''
                }
              
              <TableCell align="left">Employee Code</TableCell>
              <TableCell align="left">Employee Name</TableCell>
              <TableCell align="left">Department</TableCell>
              <TableCell align="left">Designation</TableCell>
              <TableCell align="left">Month</TableCell>
              <TableCell align="right">Paid</TableCell>
              <TableCell align="right">Deducted</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                {
                    reportList.map((report)=>(
                  <TableRow>
                       {
                    selectedType!=null && selectedType.type_name=='payment records'?(
                        <TableCell  align="left">{moment(report.payment_isodt).format(dateTimeFormat)}</TableCell>
                    ):''
                } 
                  
                  <TableCell  align="left">{report.employee_code}</TableCell>
                  <TableCell  align="left">{report.employee_name}</TableCell>
                  <TableCell align="left">{report.department_name}</TableCell> 
                  <TableCell align="left">{report.designation_name}</TableCell>
                  <TableCell align="left">{report.month_name}</TableCell>
                  <TableCell align="right">{report.payment_amount}</TableCell>
                  <TableCell align="right">{report.deduction_amount}</TableCell>
                  </TableRow> 
                    ))
                }
                
            


             <TableRow>
             {
                    selectedType!=null && selectedType.type_name=='payment records'?(
                        <TableCell  align="left"></TableCell>
                    ):''
                } 
              
              <TableCell  align="left"></TableCell>
              <TableCell  align="left"></TableCell>
              <TableCell  align="left"></TableCell>
              <TableCell  align="left"></TableCell>
              <TableCell  align="left">Total : </TableCell>
              <TableCell  align="right">{reportList.reduce((prev,curr)=>{
                   return prev+parseFloat(curr.payment_amount)
              },0)}</TableCell>
                <TableCell  align="right">{reportList.reduce((prev,curr)=>{
                   return prev+parseFloat(curr.deduction_amount)
              },0)}</TableCell>
              </TableRow>
                  
            
    
       
         
    
    
          </TableBody>
        </Table>
      </TableContainer>
          </Paper>
     ):''
 }


        </div>)
  })
  const reportRef = useRef();

    return(
        <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
  marginBottom: '2px'}}>Salary Payment Report</h4>

<Grid container spacing={3} > 

        <Grid item  xs={12}   sm={3} > 
        <Autocomplete 
        size="small"

        autoHighlight
            openOnFocus={true}
            style={{width:'100%',height:'20px'}}
            options={types}
            value={selectedType}
            getOptionLabel={(option) => option.type_name}
            onChange={(event,selectedObj)=>{
               selectedTypeSet(selectedObj)
            }}
            renderInput={(params) => <TextField 
              onKeyDown={event => {
                if (event.key === "Enter") {
                   // saleDateRef.current.focus()
                }
              }} 
              {...params} 
              label="Search Type" 
              variant="outlined"
              />} 
        />
        </Grid>


     
     
       

              {
                 selectedType != null && selectedType.type_name=='payment records'?(
                    <Grid item  xs={12}   sm={2} > 
        <Autocomplete 
        size="small"

        autoHighlight
            openOnFocus={true}
            style={{width:'100%',height:'20px'}}
            options={employees}
            value={selectedEmployee}
            getOptionLabel={(option) => option.employee_name}
            onChange={(event,selectedObj)=>{
               selectedEmployeeSet(selectedObj)
            }}
            renderInput={(params) => <TextField 
              onKeyDown={event => {
                if (event.key === "Enter") {
                   // saleDateRef.current.focus()
                }
              }} 
              {...params} 
              label="Select Employee" 
              variant="outlined"
              />} 
        />
        </Grid>
                  ):''
              }
        

        <Grid item  xs={12}   sm={2} > 
        <Autocomplete 
        size="small"

        autoHighlight
            openOnFocus={true}
            style={{width:'100%',height:'20px'}}
            options={months}
            value={selectedMonth}
            getOptionLabel={(option) => option.month_name}
            onChange={(event,selectedObj)=>{
               selectedMonthSet(selectedObj)
            }}
            renderInput={(params) => <TextField 
              onKeyDown={event => {
                if (event.key === "Enter") {
                   // saleDateRef.current.focus()
                }
              }} 
              {...params} 
              label="Select Month" 
              variant="outlined"
              />} 
        />
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
export default connect(mapStateToPops,{currentRouteSet})(SalaryPaymentRecord); 