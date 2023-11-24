import React,{ useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import swal from 'sweetalert';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MUIDataTable from "mui-datatables";
import {API_URL} from '../../config.json';
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import ReceiptIcon from '@material-ui/icons/Receipt';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import CircularProgress from '@material-ui/core/CircularProgress';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {pathSpliter,checkAuthBranchWare,dateTimeFormat,currentDateTime} from '../../lib/functions'
import {currentRouteSet,createdCustomerPaySet,updatedCustomerPaySet,customerPayDisableRestoreSet} from '../../actions/actions';
import moment from 'moment';
import { useHistory } from "react-router-dom";


const CustomerPaymentsManage = ({location,currentRouteSet,authInfo,createdCustomerPay,updatedCustomerPay,customerPayDisableRestore,
  createdCustomerPaySet,updatedCustomerPaySet,customerPayDisableRestoreSet,createdBankAcc,createdCustomer})=>{
    const classes = useStyles();
    const history = useHistory();

    let [action,actionSet] = useState('create');
    let [pay_type,pay_typeSet] = useState('');
    let [pay_id,pay_id_set] = useState(0);
    let [pay_method,pay_methodSet] = useState('');
    let [bank_acc_id,bank_acc_id_Set] = useState(0);
    let [customer_id,customer_id_Set] = useState(0);
    let [note,note_set] = useState('');
    let [previous_due,previous_due_set] = useState(0);
    let [pay_amount,pay_amount_set] = useState('');

    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [customerPayUpdateIndex,customerPayUpdateIndexSet] = useState('0')
     
    let [customerPays,customerPaysSet] = useState([])
    let [customers,customersSet] = useState([])
    let [customerPayAccs,customerPayAccsSet] = useState([])
    let [customerPayments,customerPaymentsSet] = useState([])
    let [selectedCustomerPayAcc,selectedCustomerPayAccSet] = useState(null)
    let [selectedCustomer,selectedCustomerSet] = useState(null)
    let [selectedCustomerPayType,selectedCustomerPayTypeSet] = useState({pay_type_id:'receive',pay_type:'receive'})
    let [selectedCustomerPayMethod,selectedCustomerPayMethodSet] = useState(null)
    let customerPayTypes = [{pay_type_id:'receive',pay_type:'receive'},{pay_type_id:'payment',pay_type:'payment'}]
    let customerPayMethods = [{pay_method_id:'cash',pay_method:'cash'},{pay_method_id:'bank',pay_method:'bank'}]
    
    
    const [selectedDate, handleDateChange] = useState(currentDateTime);

    let customerPayMethodRef = React.useRef(null)
    let customerPayTypeRef = React.useRef(null)
    let customerPayAccRef = React.useRef(null)
    let customerPayDateRef = React.useRef(null)
    let customerPayNoteRef = React.useRef(null)
    let customerPayAmountRef = React.useRef(null) 
    let customerPayActionRef = React.useRef(null) 
    let customerRef = React.useRef(null) 
    const [successMsg, setSuccessMsg] = useState({
      open: false,
      vertical: 'top',
      horizontal: 'center',
      msg:''
    });

    const { vertical, horizontal, open,msg } = successMsg;
    const handleClose = () => {
      setSuccessMsg({ ...successMsg, open: false });
    };

    useEffect(()=>{
       currentRouteSet(pathSpliter(location.pathname,1));
      //  getCustomerPayments()
       getTranAccs();
       getCustomers()
    },[]);


    useEffect(()=>{
      if(action=='create'){
         getCustomerPayments()
      }
     
    },[selectedDate])
    useEffect(()=>{
      if(selectedCustomer != null){
        axios.post(`${API_URL}/api/get-customer-due`,{customerId: selectedCustomer != null? selectedCustomer.customer_id:0},{headers:{'auth-token':authInfo.token}}).then(res=>{
          previous_due_set(res.data[0].dueAmount)
        })
      }
       
    },[selectedCustomer])


    useEffect(()=>{
      if(createdCustomerPay){
        if(checkAuthBranchWare(createdCustomerPay.user_branch_id)){
          customerPaymentsSet(createdCustomerPay.createdRow.concat(customerPayments));
          setSuccessMsg({...successMsg,msg:`${createdCustomerPay.msg}`,open:true });
        }
       }
    },[createdCustomerPay]); 



    useEffect(()=>{

      if(updatedCustomerPay){
        if(checkAuthBranchWare(updatedCustomerPay.user_branch_id)){          
          customerPayments[updatedCustomerPay.index] = updatedCustomerPay.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedCustomerPay.msg}`,open:true });
          
        }
       }
    },[updatedCustomerPay])

   useEffect(()=>{
      if(customerPayDisableRestore){
        if(checkAuthBranchWare(customerPayDisableRestore.user_branch_id)){
          customerPayments[customerPayDisableRestore.index] = customerPayDisableRestore.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${customerPayDisableRestore.msg}`,open:true });
        }
       }
    },[customerPayDisableRestore]);




    const getCustomerPayments = async ()=>{
      await axios.post(`${API_URL}/api/get-customer-payments`,{dailyDate:selectedDate},{headers:{'auth-token':authInfo.token}}).then(res=>{
        customerPaymentsSet(res.data.message)
      })
     }
     const getTranAccs = async ()=>{
        await axios.post(`${API_URL}/api/get-bank-accounts`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          customerPayAccsSet(res.data.message)
        })
       } 

        
     

        const getCustomers = async ()=>{
        await axios.post(`${API_URL}/api/get-customers`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          customersSet(res.data.message)
        })
       }
    
     // Banks  Real time start
    //  useEffect(()=>{
    //   if(createdBankAcc){
    //     if(checkAuthBranchWare(createdBankAcc.user_branch_id)){
    //       customerPayAccsSet(createdBankAcc.createdRow.concat(customerPayAccs));
    //       setSuccessMsg({...successMsg,msg:`${createdBankAcc.msg}`,open:true });
    //     }
    //    }
    // },[createdBankAcc]);
      // Customer  Real time start 
      useEffect(()=>{
        if(createdCustomer){
          if(checkAuthBranchWare(createdCustomer.user_branch_id)){
            customersSet(createdCustomer.createdRow.concat(customers));
          }
         }
      },[createdCustomer]);
      
     // CustomerPay  Real time start 
  

    const saveFormAction = async ()=>{   


      if(selectedCustomerPayMethod != null && selectedCustomerPayMethod.pay_method == 'bank'   && selectedCustomerPayAcc==null){  
        swal({
          title:'Select a bank  account',
          icon:'warning'
        });
        return false
      }


      if(selectedCustomerPayType==null){  
        swal({
          title:'Select Transaction  Type',
          icon:'warning'
        })
      }else if(selectedCustomerPayMethod==null){  
        swal({
          title:'Select a  payment method',
          icon:'warning'
        })
      }else if(pay_amount=='' && pay_amount <=0){  
        swal({
          title:'Customer payment amount is required.',
          icon:'warning'
        })
      }else{   
        console.log(selectedDate)
            let payload = {
              pay_id,
              customerPayUpdateIndex,
              pay_type : selectedCustomerPayType.pay_type,
              pay_method: selectedCustomerPayMethod != null ? selectedCustomerPayMethod.pay_method:null,
              cus_id: selectedCustomer.customer_id,
              bank_acc_id: selectedCustomerPayMethod != null && selectedCustomerPayMethod.pay_method=='bank'  ? selectedCustomerPayAcc.bank_acc_id:0,
              previous_due: previous_due==''?0:previous_due,
              created_isodt : selectedDate,
              note,
              pay_amount:pay_amount =='' ? 0 : pay_amount,
              action
            }

        
           
             loadingSaveSet(true)
            await axios.post(`${API_URL}/api/customer-payment-cu`,{...payload},{headers:{'auth-token':authInfo.token}}).then(res=>{


             if(!res.data.error){
              swal({title:` Transaction success. Do you want to view invoice?`,icon:'success',buttons:true}).then(confirm=>{
                if(confirm){
                  history.push(`/accounts/customer-transaction/${res.data.payId}`)
                  
                }else{
                  return false
                }
              })
            }

            loadingSaveSet(false)
             previous_due_set(0)
             note_set('')
             pay_amount_set(0)
             selectedCustomerPayTypeSet({pay_type_id:'receive',pay_type:'receive'})
             selectedCustomerPayAccSet(null)
             selectedCustomerPayMethodSet(null)
             selectedCustomerSet(null)
             handleDateChange(currentDateTime)

             actionSet('create')


            //  if(!res.data.error){
            //   swal({title:res.data.message,icon:'success'});
              
              
            //  }else{
            //   swal({title:'Network problem.'})
            //  }
             
            
            })
         }
    }

    const customerPayEdit = (row,index)=>{
      
      selectedCustomerPayTypeSet({pay_type:customerPayments[index].pay_type,pay_type_id:customerPayments[index].pay_type}) 
      selectedCustomerPayMethodSet({pay_method_id:customerPayments[index].pay_method,pay_method:customerPayments[index].pay_method})
      selectedCustomerSet({customer_id:customerPayments[index].cus_id,customer_name:customerPayments[index].customer_name,display_text:customerPayments[index].customer_name})
      selectedCustomerPayAccSet({bank_acc_id:customerPayments[index].bank_acc_id,bank_acc_name:customerPayments[index].bank_acc_name})
     
      customerPayUpdateIndexSet(index)
      handleDateChange(customerPayments[index].created_isodt)
      pay_amount_set(customerPayments[index].pay_amount)
      pay_id_set(customerPayments[index].pay_id) 
      actionSet('update')


    }
    const cusomerDisableRestore = async (customerPayId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/customer-payment-disable-restore`,{pay_id:customerPayId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
                     <Link to={{pathname:`/accounts/customer-transaction/${props.rowData[0]}`}}> <ReceiptIcon style={{cursor:'pointer',color:'black',marginLeft:'2px'}} > </ReceiptIcon></Link>


                     {
    authInfo.role !='user'?(
    <>
          <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>customerPayEdit(props.rowData,props.rowIndex)}/>
                {props.rowData[1]=='a'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>cusomerDisableRestore(props.rowData[0],'d',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>cusomerDisableRestore(props.rowData[0],'a',props.rowIndex)}/>
          )}        
   </>):''
 }
        
        </div>)
      
      }
      
    const columns = [
        {name: "pay_id",options: { display: 'excluded' }},
        {name: "status",options: { display: 'excluded' }},
        {name: "pay_type",options: { display: 'excluded' }},
       
        {name:"SL",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
          return ( <p>{parseFloat(tableMeta.rowIndex)+1}</p> ); 
        }
        },headerStyle: {
          textAlign:'left'
        }},
        {name: "pay_code",label: "Transaction Code ",options: {filter: true,sort: true}},
        {name: "customer_name",label: "Customer Name",options: {filter: true,sort: true}},
        {name: "customer_institution_name",label: "Institution",options: {filter: true,sort: true}},
        {name: "pay_type",label: "Transaction type",options: {filter: true,sort: true}},
        {name: "pay_method",label: "Transaction method",options: {filter: true,sort: true}},
        {name: "bank_acc_name",label: "Bank Acc Name",options: {filter: true,sort: true}},
        {name: "note",label: "Note",options: {filter: true,sort: true}},
        {name: "pay_amount",label: "Amount",options: {filter: true,sort: true}},
        
        {name: "created_isodt",label: "date time",options: {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{ moment(tableMeta.rowData[13]).format('Y MMM DD') }</p>) 
          }
        }
        
      },
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
             {/* Success message */}
              <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                  {successMsg.msg}
                </Alert>
              </Snackbar>  
              {/* End of message */}
            <Paper className={classes.paper} style={{marginTop:'-15px'}}> 
            <h2 className={classes.pageEntryLabel}> Customer  Receive / Payment Entry</h2> 

            <Grid container spacing={2}> 
           

            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
                <Autocomplete
                style={{ width: '100%' }}
                options={customerPayTypes}
                size="small"
                classes={{
                    option: classes.option
                }}
                autoHighlight={true}
                openOnFocus={true}
                getOptionLabel={(option) =>option.pay_type}
                value={selectedCustomerPayType} 
                onChange={(event,selectedObj)=>{

                  selectedCustomerPayTypeSet(selectedObj)
                  
                }}
                loading={customerPayTypes.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={customerPayTypeRef}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                          customerPayMethodRef.current.focus() 
                        }
                      }}
                    {...params}
                    label="Choose a transaction type"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {customerPayAccs.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment} */}
                          </React.Fragment>
                        ),
                    }}
                    />
                )}
                /> 
            </Grid>

            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
                  <Autocomplete
                  style={{ width: '100%' }}
                  options={customerPayMethods}
                  size="small"
                  classes={{
                      option: classes.option
                  }}
                  autoHighlight={true}
                  openOnFocus={true}
                  getOptionLabel={(option) => option.pay_method}
                  value={selectedCustomerPayMethod}  
                  onChange={(event,selectedObj)=>{
           
                    selectedCustomerPayMethodSet(selectedObj) 
                    
                  }}
                  loading={customerPayMethods.length==0?true:false}
                  renderInput={(params) => (
                      <TextField
                      inputRef={customerPayMethodRef}
                      onKeyDown={event => {
                          if (event.key === "Enter") {
                            customerPayAccRef.current.focus() 
                          }
                        }}
                      {...params}
                      label="Choose a  payment Method"
                      variant="outlined"
                      inputProps={{
                          ...params.inputProps,
                          endAdornment: (
                            <React.Fragment>
                              {/* {customerPayMethods.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment} */}
                            </React.Fragment>
                          ),
                      }}
                      />
                  )}
                  /> 
              </Grid>
              <Grid item xs={12} sm={3}  className={classes.plusLinkDiv} style={{display:(selectedCustomerPayMethod!=null && selectedCustomerPayMethod.pay_method_id=='bank')?'block':'none'}}>
                  <Autocomplete
                  style={{ width: '100%' }} 
                  options={customerPayAccs} 
                  size="small"
                  classes={{
                      option: classes.option
                  }}
                  autoHighlight={true}
                  openOnFocus={true}
                  getOptionLabel={(option) =>option.bank_acc_name}
                  value={selectedCustomerPayAcc}  
                  onChange={(event,selectedObj)=>{
                    selectedCustomerPayAccSet(selectedObj)  
                   
                  }}
                  loading={customerPayAccs.length==0?true:false}
                  renderInput={(params) => (
                      <TextField
                      inputRef={customerPayAccRef}
                      onKeyDown={event => {
                          if (event.key === "Enter") {
                              customerPayMethodRef.current.focus() 
                          }
                        }}
                      {...params}
                      label="Choose a  bank account"
                      variant="outlined"
                      inputProps={{
                          ...params.inputProps,
                          endAdornment: (
                            <React.Fragment>
                              {/* {customerPayAccs.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment} */}
                            </React.Fragment>
                          )
                      }}
                      />
                  )}
                  /> 
              </Grid>
            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
                <Autocomplete
                style={{ width: '100%' }}
                options={customers}
                size="small"
                classes={{
                    option: classes.option,
                }}
                openOnFocus={true}
                getOptionLabel={(option) => (option.display_text ? option.display_text : "")}
                value={selectedCustomer} 
                onChange={(event,selectedObj)=>{

                  selectedCustomerSet(selectedObj)
                }}
                autoHighlight={true}
                loading={customers.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={customerRef}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                          customerPayDateRef.current.focus()
                        }
                      }}
                    {...params}
                    label="Choose a customer"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {customers.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment} */}
                          </React.Fragment>
                        ),
                        
                    }}
                    />
                )}
                /> 
            </Grid>
          

            <Grid item xs={12} sm={3}> 
            <TextField type="number" disabled  autoComplete='off'  className={classes.fullWidth}  value={previous_due} 
            label="Current due" name="previous_due" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>previous_due_set(e.target.value)} 
            inputRef={customerPayAmountRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                  customerPayActionRef.current.click()
                }
              }}
            />
            </Grid>
            
            <Grid item xs={12} sm={3}  > 
            <MuiPickersUtilsProvider  utils={DateFnsUtils}>
          
            <KeyboardDateTimePicker
            style={{ width: '100%',marginTop: '-8px' }}
             inputRef={customerPayDateRef}
             onKeyDown={event => {
                 if (event.key === "Enter") {
                   customerPayNoteRef.current.focus()
                 }
               }}
        value={selectedDate}
        onChange={handleDateChange}
        label="Entry date  time"
        format="yyyy/MM/dd hh:mm a"
      />
    </MuiPickersUtilsProvider>
</Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={note} 
            label="Note" name="note" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>note_set(e.target.value)} 
            inputRef={customerPayNoteRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                  customerPayAmountRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField type="number"  autoComplete='off'  className={classes.fullWidth}  value={pay_amount} 
            label=" amount" name="pay_amount" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>pay_amount_set(e.target.value)} 
            inputRef={customerPayAmountRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                  customerPayActionRef.current.click()
                }
              }}
            />
            </Grid>
           
           </Grid>
           
           <Grid item xs={12}>
          <Button style={{marginTop: '25px'}}
            variant="contained"
            color="primary"
            size="small"
            buttonRef={customerPayActionRef}
            className={classes.button}
            startIcon={<SaveIcon/>}
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
      title={"Customer Transaction List"}
      data={customerPayments}
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
        textAlign:'left'
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
      }
  }));
  
  const mapStateToPops = (state)=>{
        return {
          currentRoute:state.currentRouteReducer,
          authInfo:state.authInfoReducer,
          customerPayCodeAction:state.customerPayCodeReducer,
          createdCustomerPay:state.createdCustomerPayReducer,
          updatedCustomerPay:state.updatedCustomerPayReducer,
          customerPayDisableRestore:state.customerPayDisableRestoreReducer,
          createdBankAcc:state.createdBankAccReducer,
          createdCustomer:state.createdCustomerReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdCustomerPaySet,updatedCustomerPaySet,customerPayDisableRestoreSet})(CustomerPaymentsManage);