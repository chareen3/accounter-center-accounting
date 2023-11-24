import React,{Fragment, useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import { useForm } from "react-hook-form";
import swal from 'sweetalert';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MUIDataTable from "mui-datatables";
import {APP_URL,API_URL} from '../../config.json';
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib

import { Modal } from 'react-responsive-modal';
import "react-responsive-modal/styles.css";


import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import socketIOClient from "socket.io-client";
import {pathSpliter,checkAuthBranchWare,dateTimeFormat,checkIntNum,currentDateTime,getDateTimeFromISODT} from '../../lib/functions'
import {currentRouteSet,createdBankTranSet,updatedBankTranSet,bankTranDisableRestoreSet,bankTranCodeSet} from '../../actions/actions';
import moment from 'moment';


const BankTransManage = ({location,currentRouteSet,authInfo,bankTranCodeAction,createdBankTran,updatedBankTran,bankTranDisableRestore,
  createdBankTranSet,updatedBankTranSet,bankTranDisableRestoreSet})=>{
    const classes = useStyles();
   
    
    let [action,actionSet] = useState('create');
    let [bank_tran_note,bank_tran_note_set] = useState('');
    let [bank_tran_amount,bank_tran_amount_set] = useState('');
    
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [bankTranUpdateIndex,bankTranUpdateIndexSet] = useState('0')

    let [bank_tran_id,bank_tran_id_set] = useState(0)

    
     
    let [bankTrans,bankTransSet] = useState([])
    let [bankTranAccs,bankTranAccsSet] = useState([])
    let [bankTranCode,bankTranCodeSet] = useState('')
    let [selectedBankTranAcc,selectedBankTranAccSet] = useState(null)
    let [selectedBankTranType,selectedBankTranTypeSet] = useState(null)
    let bankTranTypes = [{bank_tran_type_id:'deposit',bank_tran_type:'Bank deposit'},{bank_tran_type_id:'withdraw',bank_tran_type:'Bank withdraw'}]
    
    let [bankTran,bankTranSet] = useState({})
    
    const [selectedDate, handleDateChange] = useState(currentDateTime);

    let bankTranCodeRef = React.useRef(null)
    let bankTranTypeRef = React.useRef(null)
    let bankTranAccRef = React.useRef(null)
    let bankTranDateRef = React.useRef(null)
    let bankTranNoteRef = React.useRef(null)
    let bankTranAmountRef = React.useRef(null) 
    let bankTranActionRef = React.useRef(null) 
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
       getTranAccs();
       getBankTrans()
       getBankTranCode()

    },[]);

     const getBankTranCode = async ()=>{
      await axios.get(`${API_URL}/api/get-bank-transaction-code`,{headers:{'auth-token':authInfo.token}}).then(res=>{
           bankTranCodeSet(res.data.message)
      })
     }
     

     const getTranAccs = async ()=>{
        await axios.post(`${API_URL}/api/get-bank-accounts`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          bankTranAccsSet(res.data.message)
        })
       }
       const getBankTrans = async ()=>{
        loadingListSet(true)
        await axios.post(`${API_URL}/api/get-bank-transactions`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
          loadingListSet(false)
          bankTransSet(res.data)
        })
       }

       useEffect(()=>{
        if(bankTranCodeAction){
          if(action=='create'){         
           bankTranCodeSet(bankTranCodeAction.createdRow)
          }
         }
       },[bankTranCodeAction])

     // BankTran  Real time start
     useEffect(()=>{
      if(createdBankTran){
        if(checkAuthBranchWare(createdBankTran.user_branch_id)){
          bankTransSet(createdBankTran.createdRow.concat(bankTrans));
          setSuccessMsg({...successMsg,msg:`${createdBankTran.msg}`,open:true });
        }
       }
    },[createdBankTran]);
    useEffect(()=>{
      if(updatedBankTran){
          console.log(updatedBankTran)
        if(checkAuthBranchWare(updatedBankTran.user_branch_id)){          
          bankTrans[updatedBankTran.index] = updatedBankTran.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedBankTran.msg}`,open:true });
          
        }
       }
    },[updatedBankTran])

    useEffect(()=>{
      if(bankTranDisableRestore){
        if(checkAuthBranchWare(bankTranDisableRestore.user_branch_id)){
        bankTrans[bankTranDisableRestore.index] = bankTranDisableRestore.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${bankTranDisableRestore.msg}`,open:true });
        }
       }
    },[bankTranDisableRestore]);
 
  
    createdBankTranSet(null)
    updatedBankTranSet(null)
    bankTranDisableRestoreSet(null)

  
    const saveFormAction = async ()=>{   

      if(selectedBankTranType==null){  
        swal({
          title:'Select a bank transaction type',
          icon:'warning'
        })
      }else if(selectedBankTranAcc==null){  
        swal({
          title:'Select a bank transaction account',
          icon:'warning'
        })
      }else if(bank_tran_amount=='' && bank_tran_amount <='0' ){  
        swal({
          title:'Bank transaction amount is required.',
          icon:'warning'
        })
      }else{   
            let payLoad = {
              bankTranUpdateIndex,
              bank_tran_date_time : selectedDate,
              bank_tran_type : selectedBankTranType != null ? selectedBankTranType.bank_tran_type_id:null,
              bank_tran_acc_id : selectedBankTranAcc != null ? selectedBankTranAcc.bank_acc_id:null,
              bank_tran_note,
              bank_tran_amount : bank_tran_amount!=''?bank_tran_amount:0,
              action,
              bank_tran_id
            }
            
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/bank-transaction-cu`,payLoad,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)
            
             selectedBankTranTypeSet(null)
             selectedBankTranAccSet(null)
            handleDateChange(currentDateTime)

            bank_tran_note_set('')
            bank_tran_amount_set('')
            actionSet('create')

            getBankTranCode()
            
            })
         }
    }

    const bankTranEdit = (row,index)=>{
      bankTranCodeSet(bankTrans[index].bank_tran_code)
      let amount = 0;
      if(bankTrans[index].bank_tran_type=='deposit'){
          amount = bankTrans[index].bank_tran_in_amount
      }else{
        amount = bankTrans[index].bank_tran_out_amount
      }
      selectedBankTranTypeSet({bank_tran_type:bankTrans[index].bank_tran_type,bank_tran_type_id:bankTrans[index].bank_tran_type})
      selectedBankTranAccSet({bank_acc_id:bankTrans[index].bank_tran_acc_id,bank_acc_name:bankTrans[index].bank_acc_name})
      bankTranUpdateIndexSet(index)
      handleDateChange(bankTrans[index].bank_tran_created_isodt)

      bank_tran_amount_set(amount);
      bank_tran_note_set(bankTrans[index].bank_tran_note)
      bank_tran_id_set(bankTrans[index].bank_tran_id)
      actionSet('update')

    }
    const cusomerDisableRestore = async (bankTranId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/bank-transaction-disable-restore`,{bank_tran_id:bankTranId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
            {
    authInfo.role !='user'?(
    <>
        
          <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>bankTranEdit(props.rowData,props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>cusomerDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>cusomerDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}        
   </>):''
 }
        </div>)
      
      }
      
    const columns = [
        {name: "bank_tran_id",options: { display: 'excluded' }},
        {name: "bank_tran_status",options: { display: 'excluded' }},
        {name: "bank_tran_type",options: { display: 'excluded' }},
        {name: "bank_tran_in_amount",options: { display: 'excluded' }},
        {name: "bank_tran_out_amount",options: { display: 'excluded' }},
        {name:"SL",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
          return ( <p>{parseFloat(tableMeta.rowIndex)+1}</p> ); 
        }
        },headerStyle: {
          textAlign:'left'
        }},
        {name: "bank_tran_code",label: "Transaction code",options: {filter: true,sort: true}},
        {name: "bank_acc_name",label: "Account name",options: {filter: true,sort: true}},
        {name: "bank_tran_type",label: "Account type",options: {filter: true,sort: true}},
        {name: "bank_tran_created_isodt",label: "date time",options: {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{ moment(tableMeta.rowData[9]).format(dateTimeFormat) }</p>) 
          }
        }
        
      },
        {name: "bank_tran_amount",label: "Amount",options: {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
           return ( <p>{tableMeta.rowData[2]=='withdraw'?tableMeta.rowData[4]:tableMeta.rowData[3]}</p> ); 
        }}},
     
     
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
            <h2 className={classes.pageEntryLabel}> Bank Transaction Entry</h2> 

            <Grid container spacing={2}> 
            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={bankTranCode} 
            name="bankTranCode" style={{color:'#222'}} disabled variant="outlined" size="small"  

            />
            </Grid>

            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
                  
                <Autocomplete
                style={{ width: '100%' }}
                options={bankTranTypes}
                size="small"
                classes={{
                    option: classes.option
                }}
                autoHighlight={true}
                openOnFocus={true}
                getOptionLabel={(option) => option.bank_tran_type}
                value={selectedBankTranType} 
                onChange={(event,selectedObj)=>{
                  selectedBankTranTypeSet(selectedObj)
                }}
                loading={bankTranTypes.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={bankTranTypeRef}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            bankTranAccRef.current.focus()
                        }
                      }}
                    {...params}
                    label="Choose a transaction type"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {bankTranAccs.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
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
                options={bankTranAccs}
                size="small"
                classes={{
                    option: classes.option,
                }}
                openOnFocus={true}
                getOptionLabel={(option) => option.bank_acc_name}
                value={selectedBankTranAcc} 
                onChange={(event,selectedObj)=>{
                  selectedBankTranAccSet(selectedObj)
                }}
                autoHighlight={true}
                // loading={bankTranAccs.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={bankTranAccRef}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                          bankTranDateRef.current.focus()
                        }
                      }}
                    {...params}
                    label="Choose a transaction account"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {bankTranAccs.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment} */}
                          </React.Fragment>
                        ),
                        
                    }}
                    />
                )}
                /> 
            </Grid>

            
            <Grid item xs={12} sm={3}  > 
            <MuiPickersUtilsProvider  utils={DateFnsUtils}>
          
            <KeyboardDateTimePicker
            style={{ width: '100%',marginTop: '-8px' }}
             inputRef={bankTranDateRef}
             onKeyDown={event => {
                 if (event.key === "Enter") {
                   bankTranNoteRef.current.focus()
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
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={bank_tran_note} 
            label="bank transaction note" name="bank_tran_note" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>bank_tran_note_set(e.target.value)} 
            inputRef={bankTranNoteRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                  bankTranAmountRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField type="number"  autoComplete='off'  className={classes.fullWidth}  value={bank_tran_amount} 
            label="bank transaction amount" name="bank_tran_amount" style={{color:'#222'}}  variant="outlined" size="small" onChange={(e)=>bank_tran_amount_set(e.target.value)}
            inputRef={bankTranAmountRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                  bankTranActionRef.current.click()
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
            buttonRef={bankTranActionRef}
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
      title={"Bank Transaction List"}
      data={bankTrans}
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
          bankTranCodeAction:state.bankTranCodeReducer,
          createdBankTran:state.createdBankTranReducer,
          updatedBankTran:state.updatedBankTranReducer,
          bankTranDisableRestore:state.bankTranDisableRestoreReducer,
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdBankTranSet,updatedBankTranSet,bankTranDisableRestoreSet,bankTranCodeSet})(BankTransManage);