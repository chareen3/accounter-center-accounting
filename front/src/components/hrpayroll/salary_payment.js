import React,{useState,useEffect, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import swal from 'sweetalert';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MUIDataTable from "mui-datatables";
import {APP_URL,API_URL} from '../../config.json';
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {pathSpliter,checkAuthBranchWare,dateTimeFormat,currentDateTime} from '../../lib/functions'
import {currentRouteSet} from '../../actions/actions';
import moment from 'moment';

import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker
  } from '@material-ui/pickers';
const SalaryPayment = ({location,currentRouteSet,authInfo})=>{
    const classes = useStyles();

    const [selectedDate, handleDateChangeSet] = useState(currentDateTime);
    let [loadingList,loadingListSet] = useState(false)

    let [loadingSave,loadingSaveSet] = useState(false)
    let [payments,paymentsSet] = useState([])
    let [paymentNote,paymentNoteSet] = useState('')
    let [employees,employeesSet] = useState([])
    let [selectedEmployee,selectedEmployeeSet] = useState(null)
    let [months,monthsSet] = useState([]);
    let [selectedMonth,selectedMonthSet] = useState(null);

    let payMethods = [{pay_method_id:'cash',pay_method:'cash'},
    {pay_method_id:'bank',pay_method:'bank'}];

    let [selectedPayMethod,selectedPayMethodSet] = useState(null)

    let [payAccs,payAccsSet] = useState([])
    let [selectedPayAcc,selectedPayAccSet] = useState(null)

    let [payableAmount,payableAmountSet] = useState(0)
    let [paymentAmount,paymentAmountSet] = useState(0)
    let [deductionAmount,deductionAmountSet] = useState(0)
    let [paymentAction,paymentActionSet] = useState('create')
  
    let [paymentId,paymentIdSet] = useState(0)

    let employeeRef = useRef(null)
    let monthRef = useRef(null)
    let paymentNoteRef = useRef(null)
    let payableAmountRef = useRef(null)
    let dateRef = useRef(null)
    let paymentAmountRef = useRef(null)
    let deductionAmountRef = useRef(null)
    let saveRef = useRef(null)
   

    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        getEmployees()
        getMonths()
        getPayments()
        getTranBankAccs()
    },[]);


    const getTranBankAccs = async ()=>{
      await axios.post(`${API_URL}/api/get-bank-accounts`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
        payAccsSet(res.data.message)
      })
     } 


   let getEmployees = async ()=>{
        await axios.post(`${API_URL}/api/get-employees`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
              employeesSet(res.data.message)
        })
    }
    let getPayments = async ()=>{
        await axios.get(`${API_URL}/api/get-salary-payments`,{headers:{'auth-token':authInfo.token}}).then(res=>{
              paymentsSet(res.data)
        })
    }

    let getMonths = async ()=>{
      await axios.post(`${API_URL}/api/get-months`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
            monthsSet(res.data.message)
      })
    }

    

    const saveFormAction = async ()=>{

      if(selectedPayMethod != null && selectedPayMethod.pay_method == 'bank'   && selectedPayAcc==null){  
        swal({
          title:'Select a bank  account',
          icon:'warning'
        });
        return false
      }


        if(selectedEmployee==null){
            swal({title:'select employee',icon:'warning'});return false;
        }
        if(selectedMonth==null){
            swal({title:'select month',icon:'warning'});return false;
        }

         if(selectedPayMethod==null){  
          swal({
            title:'Select a  payment method',
            icon:'warning'
          });
          return false;
        }
        
      
        let payload = {
            payment_id: paymentId,
            employee_id: selectedEmployee.employee_id,
            month_id: selectedMonth.month_id,
            payment_date: selectedDate,
            payment_amount: paymentAmount,
            payment_note: paymentNote,
            payable_amount:payableAmount,
            deduction_amount: deductionAmount,
            paymentAction: paymentAction,
            tran_method: selectedPayMethod != null   ? selectedPayMethod.pay_method:0,
            bank_acc_id: selectedPayAcc != null && selectedPayMethod.pay_method=='bank'  ? selectedPayAcc.bank_acc_id:0

        }

            loadingSaveSet(true) 

            await axios.post(`${API_URL}/api/save-salary-payment`,{payload},{headers:{'auth-token':authInfo.token}}).then(res=>{
                loadingSaveSet(false)
                if(!res.data.error){
                  getPayments() 
                  swal({title:res.data.message,icon:'success'})
                  selectedEmployeeSet(null)
                  selectedMonthSet(null)
                  payableAmountSet(0)
                  paymentAmountSet(0)
                  deductionAmountSet(0)
                  paymentActionSet('create')
                  paymentIdSet(0)
                  handleDateChangeSet(currentDateTime)
                  paymentNoteSet('')
                  selectedPayAccSet(null)
                  selectedPayMethodSet(null)
                }
          })
        
          
    }

    const paymentEdit = (row,index)=>{
          selectedEmployeeSet({employee_id:payments[index].employee_id,employee_name:payments[index].employee_name});
          selectedMonthSet({month_id:payments[index].month_id,month_name:payments[index].month_name});
          paymentAmountSet(payments[index].payment_amount)
          deductionAmountSet(payments[index].deduction_amount)
          paymentIdSet(payments[index].payment_id)
          paymentNoteSet(payments[index].paymentNote)
          handleDateChangeSet(payments[index].payment_isodt)
          paymentNoteSet(payments[index].payment_note)
          payableAmountSet(payments[index].payable_amount)
          paymentActionSet('update')
          selectedPayMethodSet({pay_method_id:payments[index].tran_method,pay_method:payments[index].tran_method})
          selectedPayAccSet({bank_acc_id:payments[index].bank_acc_id,bank_acc_name:payments[index].bank_acc_name})
    }

    const paymentDelete = async (index)=>{ 
      swal({
        title:'Are you sure delete this?',
        icon:'warning',
        buttons:true
      }).then(async res=>{
        if(res){
          let paymentId = payments[index].payment_id;
      await axios.post(`${API_URL}/api/delete-salary-payment`,{payment_id:paymentId},{headers:{'auth-token':authInfo.token}}).then(res=>{
        if(!res.data.error){
          getPayments()
          swal({title:res.data.message,icon:'success'})
        }
        })
        }else{
          return false;
        }
      })
      
    }
  
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
           {
    authInfo.role !='user'?(
    <>
             
          <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>paymentEdit(props.rowData,props.rowIndex)} />
          <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>paymentDelete(props.rowIndex)}/>   
   </>):''
 }
        </div>)
      
      }
    
    const columns = [
        {name: "payment_id",options: { display: 'excluded' }},
        {name: "payment_isodt",label: "Payment date & time",options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{moment(tableMeta.rowData[1]).format(dateTimeFormat)}</p>) 
          }
        }},
        {name: "employee_code",label: "Employee Code",options: {filter: true,sort: true}},
        {name: "employee_name",label: "Employee Name",options: {filter: true,sort: true}},
        {name: "month_name",label: "Month Name",options: {filter: true,sort: true}},
      
        {name: "tran_method",label: "Transaction Method",options: {filter: true,sort: true}},
        {name: "bank_acc_name",label: "Bank Account",options: {filter: true,sort: true}},
        
        {name: "payment_amount",label: "Payment Amount",options: {filter: true,sort: true}},
        {name: "deduction_amount",label: "Deduction Amount",options: {filter: true,sort: true}},
        {name:"actions",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
            return ( <ActionOptions   value={value} rowIndex={tableMeta.rowIndex}  rowData={tableMeta.rowData} 
               /> ); 
        }
        },headerStyle: {
          textAlign:'right'
        }}
       ];
              
       const options = {
         filterType: 'checkbox',
         selectableRows: 'none',
         display: "excluded"
        }

    return (
        <div className={classes.root}>
         
            <Paper className={classes.paper} style={{marginTop:'-15px'}}>
            <h2 className={classes.pageEntryLabel}>Salary Payment Entry</h2>
             
            <Grid container spacing={2}>
           
            <Grid item xs={12} sm={3}>
            <Autocomplete 
              openOnFocus={true}
              autoHighlight={true}
              style={{width:'100%',height:'20px'}}
              options={employees}
              value={selectedEmployee}
              inputRef={employeeRef}
              onKeyDown={(e)=>{
                if(e.key=='Enter'){
                 monthRef.current.focus();
                }
              }}
              onChange={(e,employee)=>{
                    if(employee==null){
                        selectedEmployeeSet(null)
                        return false
                    }
                    selectedEmployeeSet(employee)
                    
               }}
              size="small"
              getOptionLabel={(option) => option.employee_name}
             
              renderInput={(params) => <TextField 
              
                {...params} 
                label="Employee" 
                variant="outlined"
                
                />}
                
          />
            </Grid>

            
            <Grid item xs={12} sm={3}>
            <Autocomplete 
              openOnFocus={true}
              autoHighlight={true}
              style={{width:'100%',height:'20px'}}
              options={months} 
              value={selectedMonth}
              inputRef={monthRef}
              onKeyDown={(e)=>{
                if(e.key=='Enter'){
                 paymentAmountRef.current.focus();
                }
              }}
              onChange={(e,month)=>{
                    if(month==null){ 
                        selectedMonthSet(null)
                        return false
                    }
                    selectedMonthSet(month)
                    
               }}
              size="small"
              getOptionLabel={(option) => option.month_name}
             
              renderInput={(params) => <TextField 
              
                {...params} 
                label="Month" 
                variant="outlined"
                
                />}
                
          />
            </Grid>



            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
                <Autocomplete
                style={{ width: '100%' }}
                options={payMethods}
                size="small"
                classes={{
                    option: classes.option,
                }}
               
                openOnFocus={true}
                getOptionLabel={(option) =>option.pay_method}
                value={selectedPayMethod} 
                onChange={(event,selectedObj)=>{
                  selectedPayMethodSet(selectedObj)
                }}
                autoHighlight={true}
                // loading={cashTranAccs.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                   
                    {...params}
                    label="Choose a Pay Method"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {cashTranAccs.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment} */}
                          </React.Fragment>
                        ),
                        
                    }}
                    />
                )}
                /> 
            </Grid>


            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv} style={{display:(selectedPayMethod!=null && selectedPayMethod.pay_method_id=='bank')?'block':'none'}}>
                  <Autocomplete
                  style={{ width: '100%' }} 
                  options={payAccs} 
                  size="small"
                  classes={{
                      option: classes.option
                  }}
                  autoHighlight={true}
                  openOnFocus={true}
                  getOptionLabel={(option) =>option.bank_acc_name}
                  value={selectedPayAcc}  
                  onChange={(event,selectedObj)=>{
                    selectedPayAccSet(selectedObj)  
                   
                  }}
                  loading={payAccs.length==0?true:false}
                  renderInput={(params) => (
                      <TextField
                     
                      {...params}
                      label="Choose a  bank account"
                      variant="outlined"
                      inputProps={{
                          ...params.inputProps,
                          endAdornment: (
                            <React.Fragment>
                              {/* {supplierPayAccs.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment} */}
                            </React.Fragment>
                          )
                      }}
                      />
                  )}
                  /> 
              </Grid>




            <Grid item xs={12} sm={2} > 
            <TextField type="number" 
          
            autoComplete='off' disabled  className={classes.fullWidth}  value={payableAmount} 
            onChange={(e)=>payableAmountSet(e.target.value)}
            label="payable amount" name="payable_amount" disabled variant="outlined" size="small" 
            />
            </Grid>

            <Grid item xs={12} sm={2} > 
            <TextField type="number"
             inputRef={paymentAmountRef}
             onKeyDown={(e)=>{
                 if(e.key=='Enter'){
                  deductionAmountRef.current.focus();
                 }
               }}
            onChange={(e)=>paymentAmountSet(e.target.value)}
            autoComplete='off'   className={classes.fullWidth}  value={paymentAmount} 
            label="Payment amount" name="payment_amount"  variant="outlined" size="small" 
            />
            </Grid>

            <Grid item xs={12} sm={2} > 
            <TextField type="number" autoComplete='off' 
                onChange={(e)=>deductionAmountSet(e.target.value)}
             inputRef={deductionAmountRef}
             onKeyDown={(e)=>{
                 if(e.key=='Enter'){
                    paymentNoteRef.current.focus();
                 }
               }}

            className={classes.fullWidth}  value={deductionAmount} 
            label="Deduction amount" name="deduction_amount"  variant="outlined" size="small" 
            />
            </Grid>



          

            <Grid item xs={12} sm={3} style={{marginRight:'10px'}}>
            
            <TextareaAutosize value={paymentNote}  name="payment_note" 
            ref={paymentNoteRef}
             onKeyDown={(e)=>{
               if(e.key=='Enter'){
                dateRef.current.focus();
               }
             }}

             onChange={(e)=>paymentNoteSet(e.target.value)}
             
             style={{float:'left',marginTop:'20px',width: '325px',height: '40px',
             marginTop: '1px',width: '200px'}} aria-label="Payment Note..." rowsMin={3} placeholder="Payment Note..." />

            </Grid>
            <Grid item xs={12} sm={3}>
            <MuiPickersUtilsProvider  utils={DateFnsUtils}>
            <KeyboardDateTimePicker
            style={{ width: '100%',marginTop: '' }}
            value={selectedDate}
            inputRef={dateRef}
            onKeyDown={(e)=>{
              if(e.key=='Enter'){
               saveRef.current.click();
              }
            }}
            onChange={handleDateChangeSet}
            name="payment_date_time"
            label="Payment Date & Time"
            format="yyyy/MM/dd hh:mm a"
               />
            </MuiPickersUtilsProvider>
          </Grid>

           </Grid>
           <Grid item xs={12}>
          <Button style={{marginTop: '25px'}}
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<SaveIcon/>}
            buttonRef={saveRef}
            disabled={loadingSave}
            onClick={saveFormAction}
        >
        Save
      </Button>
  </Grid>
            </Paper>
            {
      loadingList==true?(<b>Loading...</b>):(
        <Paper className={classes.paper} style={{marginTop:'20px'}}>
        <MUIDataTable
      title={"Salary payment  List"}
      data={payments}
      columns={columns}
      options={options}
      adjustForCheckbox={false} 
      displaySelectAll={false}
      />
      </Paper>
      )
      
     }
        </div>
    )
}



const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  root: {},
  '& .MuiTextField-root': {
    margin: theme.spacing(1),
    width: '25ch',
   },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    pageEntryLabel:{
        color: '#7754cc',
        margin: '0px',
        padding: '0px',
        marginTop: '-11px',
        textAlign: 'left',
        marginLeft: '0px',
        marginBottom: '5px',
    },
    fullWidth:{
        width:'100%'
    },
    option: {
        fontSize: 15,
        '& > span': {
          marginRight: 10,
          fontSize: 18,
        },
      }
  }));
  
  const mapStateToPops = (state)=>{
        return {
          currentRoute:state.currentRouteReducer,
          authInfo:state.authInfoReducer,
        }
  }
  export default connect(mapStateToPops,{currentRouteSet})(SalaryPayment);