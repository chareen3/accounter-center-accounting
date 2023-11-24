import React,{Fragment, useState,useEffect} from 'react';
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
import { Modal } from 'react-responsive-modal';
import "react-responsive-modal/styles.css";

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
import {currentRouteSet,createdCashTranSet,updatedCashTranSet,cashTranDisableRestoreSet,cashTranCodeSet} from '../../actions/actions';
import moment from 'moment';


const CashTransManage = ({location,currentRouteSet,authInfo,cashTranCodeAction,createdCashTran,updatedCashTran,cashTranDisableRestore,
  createdCashTranSet,updatedCashTranSet,cashTranDisableRestoreSet,createdTranAcc})=>{
    const classes = useStyles();
    
    let [action,actionSet] = useState('create')
    let [cash_tran_note,cash_tran_note_set] = useState('')
    let [cash_tran_amount,cash_tran_amount_set] = useState('')
    let [cash_tran_id,cash_tran_id_set] = useState(0)
    
    let payMethods = [{pay_method_id:'cash',pay_method:'cash'},
    {pay_method_id:'bank',pay_method:'bank'}];

    let [selectedPayMethod,selectedPayMethodSet] = useState(null)



    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [cashTranUpdateIndex,cashTranUpdateIndexSet] = useState(0)
     
    let [cashTrans,cashTransSet] = useState([])
    let [payAccs,payAccsSet] = useState([])
    let [selectedPayAcc,selectedPayAccSet] = useState(null)
    let [cashTranAccs,cashTranAccsSet] = useState([])
    let [cashTranCode,cashTranCodeSet] = useState('')
    let [selectedCashTranAcc,selectedCashTranAccSet] = useState(null)
    let [selectedCashTranType,selectedCashTranTypeSet] = useState({cash_tran_type_id:'payment',cash_tran_type:'payment'})

    let [tran_acc_name,tran_acc_name_set] = useState('')
    let [accM,accMSet] = useState(false)
    let [accNameCStatus,accNameCStatusSet] = useState(false)
    let cashTranTypes = [{cash_tran_type_id:'receive',cash_tran_type:'receive'},{cash_tran_type_id:'payment',cash_tran_type:'payment'}]
    
    
    const [selectedDate, handleDateChange] = useState(currentDateTime);

    let cashTranTypeRef = React.useRef(null)
    let cashTranAccRef = React.useRef(null)
    let cashTranDateRef = React.useRef(null)
    let cashTranNoteRef = React.useRef(null)
    let cashTranAmountRef = React.useRef(null) 
    let cashTranActionRef = React.useRef(null) 
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
       getTranBankAccs();
       getCashTrans()
       getCashTranCode()

    },[]);


    const getTranBankAccs = async ()=>{
      await axios.post(`${API_URL}/api/get-bank-accounts`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
        payAccsSet(res.data.message)
      })
     } 

     const getCashTranCode = async ()=>{
      await axios.get(`${API_URL}/api/get-cash-transaction-code`,{headers:{'auth-token':authInfo.token}}).then(res=>{
           cashTranCodeSet(res.data.message)
      })
     }


     const saveAccAction = async ()=>{
       if(tran_acc_name.trim()==''){
        swal({
          title:'Account Name is Required.',
          icon:'warning'
        });
        return false
       }
       tran_acc_name = tran_acc_name.trim()
       accNameCStatusSet(true)
      await axios.post(`${API_URL}/api/transaction-account-cu`,{tran_acc_name,action:'create'},{headers:{'auth-token':authInfo.token}}).then(res=>{
        accNameCStatusSet(false)
        
        if(res.data.error){
          swal({
            title:res.data.message,
            icon:'warning'
          });
        }else{
          accMSet(false)
          tran_acc_name_set('')
        }
      })
     }
     

     const getTranAccs = async ()=>{
        await axios.post(`${API_URL}/api/get-transaction-accounts`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          cashTranAccsSet(res.data.message)
        })
       }
       
       const getCashTrans = async ()=>{
        loadingListSet(true)
        await axios.post(`${API_URL}/api/get-cash-transactions`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
          loadingListSet(false)
          cashTransSet(res.data)
        })
       }

       useEffect(()=>{
        if(cashTranCodeAction){
          if(action=='create'){         
           cashTranCodeSet(cashTranCodeAction.createdRow)
          }
         }
       },[cashTranCodeAction])


       useEffect(()=>{
        if(createdTranAcc){
          if(checkAuthBranchWare(createdTranAcc.user_branch_id)){          
            cashTranAccsSet(createdTranAcc.createdRow.concat(cashTranAccs));
          }
         }
      },[createdTranAcc])

     // CashTran  Real time start
     useEffect(()=>{
      if(createdCashTran){
        if(checkAuthBranchWare(createdCashTran.user_branch_id)){
          cashTransSet(createdCashTran.createdRow.concat(cashTrans));
          setSuccessMsg({...successMsg,msg:`${createdCashTran.msg}`,open:true });
        }
       }
    },[createdCashTran]);
    useEffect(()=>{
      if(updatedCashTran){
        if(checkAuthBranchWare(updatedCashTran.user_branch_id)){          
          cashTrans[updatedCashTran.index] = updatedCashTran.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedCashTran.msg}`,open:true });
          
        }
       }
    },[updatedCashTran])

    useEffect(()=>{
      if(cashTranDisableRestore){
        if(checkAuthBranchWare(cashTranDisableRestore.user_branch_id)){
        cashTrans[cashTranDisableRestore.index] = cashTranDisableRestore.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${cashTranDisableRestore.msg}`,open:true });
        }
       }
    },[cashTranDisableRestore]);
 
  
    createdCashTranSet(null)
    updatedCashTranSet(null)
    cashTranDisableRestoreSet(null)

  
    const saveFormAction = async ()=>{   

      if(selectedPayMethod != null && selectedPayMethod.pay_method == 'bank'   && selectedPayAcc==null){  
        swal({
          title:'Select a bank  account',
          icon:'warning'
        });
        return false
      }



      if(selectedCashTranType==null){  
        swal({
          title:'Select a cash transaction type',
          icon:'warning'
        })
      }else if(selectedPayMethod==null){  
        swal({
          title:'Select a  payment method',
          icon:'warning'
        })
      }else if(selectedCashTranAcc==null){  
        swal({
          title:'Select a cash transaction account',
          icon:'warning'
        })
      }else if(cash_tran_amount=='' && cash_tran_amount <= 0){  
        swal({
          title:'Cash transaction amount is required.',
          icon:'warning'
        })
      }else{   
           
            let payLoad = {
              cash_tran_date_time : selectedDate,
              cashTranUpdateIndex,
              cash_tran_acc_id : selectedCashTranAcc != null ? selectedCashTranAcc.tran_acc_id : null,
              cash_tran_type : selectedCashTranType != null ? selectedCashTranType.cash_tran_type_id:null,
              cash_tran_method: selectedPayMethod != null   ? selectedPayMethod.pay_method:0,
              bank_acc_id: selectedPayAcc != null && selectedPayMethod.pay_method=='bank'  ? selectedPayAcc.bank_acc_id:0,
              cash_tran_note,
              cash_tran_amount: cash_tran_amount==''?0:cash_tran_amount,
              action,
              cash_tran_id,
            }


           
            
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/cash-transaction-cu`,payLoad,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)
            
             selectedCashTranTypeSet({cash_tran_type_id:'payment',cash_tran_type:'payment'})
             selectedCashTranAccSet(null)
             handleDateChange(currentDateTime)

             cash_tran_note_set('')
             cash_tran_amount_set('')
             actionSet('create')
             getCashTranCode()
             selectedPayMethodSet(null)
            
            
            })
         }
    }

    const cashTranEdit = (row,index)=>{
      cashTranCodeSet(cashTrans[index].cash_tran_code)
      let amount = 0;
      if(cashTrans[index].cash_tran_type=='receive'){
          amount = cashTrans[index].cash_tran_in_amount
      }else{
        amount = cashTrans[index].cash_tran_out_amount
      }
      selectedCashTranTypeSet({cash_tran_type:cashTrans[index].cash_tran_type,cash_tran_type_id:cashTrans[index].cash_tran_type})
      selectedCashTranAccSet({tran_acc_id:cashTrans[index].tran_acc_id,tran_acc_name:cashTrans[index].tran_acc_name})
      cashTranUpdateIndexSet(index)
      handleDateChange(cashTrans[index].cash_tran_created_isodt)


      selectedPayMethodSet({pay_method_id:cashTrans[index].cash_tran_method,pay_method:cashTrans[index].cash_tran_method})
      selectedPayAccSet({bank_acc_id:cashTrans[index].bank_acc_id,bank_acc_name:cashTrans[index].bank_acc_name})


      cash_tran_note_set(cashTrans[index].cash_tran_note)
      cash_tran_amount_set(amount)
      actionSet('update')
      cash_tran_id_set(cashTrans[index].cash_tran_id);

    }
    const cusomerDisableRestore = async (cashTranId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/cash-transaction-disable-restore`,{cash_tran_id:cashTranId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
            {
    authInfo.role !='user'?(
    <>
          <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>cashTranEdit(props.rowData,props.rowIndex)}/>
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
        {name: "cash_tran_id",options: { display: 'excluded' }},
        {name: "cash_tran_status",options: { display: 'excluded' }},
        {name: "cash_tran_type",options: { display: 'excluded' }},
        {name: "cash_tran_in_amount",options: { display: 'excluded' }},
        {name: "cash_tran_out_amount",options: { display: 'excluded' }},
        {name:"SL",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
          return ( <p>{parseFloat(tableMeta.rowIndex)+1}</p> ); 
        }
        },headerStyle: {
          textAlign:'left'
        }},
        {name: "cash_tran_code",label: "Transaction code",options: {filter: true,sort: true}},
        {name: "tran_acc_name",label: "Account name",options: {filter: true,sort: true}},
        {name: "cash_tran_type",label: "Account type",options: {filter: true,sort: true}},
        {name: "cash_tran_method",label: "Transaction Method",options: {filter: true,sort: true}},
        {name: "bank_acc_name",label: "Bank Account ",options: {filter: true,sort: true}},

        {name: "cash_tran_created_isodt",label: "date time",options: {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{ moment(tableMeta.rowData[11]).format(dateTimeFormat) }</p>) 
          }
        }
        
      },
        {name: "cash_tran_amount",label: "Amount",options: {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
           return ( <p>{tableMeta.rowData[2]=='payment'?tableMeta.rowData[4]:tableMeta.rowData[3]}</p> ); 
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
            <h2 className={classes.pageEntryLabel}> Others Transaction Entry</h2> 

            <Grid container spacing={2}> 
            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={cashTranCode} 
            name="cashTranCode" style={{color:'#222'}} disabled variant="outlined" size="small" 

            />
            </Grid>

            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
                  
                <Autocomplete
                style={{ width: '100%' }}
                options={cashTranTypes}
                size="small"
                classes={{
                    option: classes.option
                }}
                autoHighlight={true}
                openOnFocus={true}
                getOptionLabel={(option) => option.cash_tran_type}
                value={selectedCashTranType} 
                onChange={(event,selectedObj)=>{
                  selectedCashTranTypeSet(selectedObj)
                }}
                // loading={cashTranTypes.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={cashTranTypeRef}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            cashTranAccRef.current.focus()
                        }
                      }}
                    {...params}
                    label="Choose a transaction type"
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
            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
            {
    authInfo.role !='user'?(
    <>
                  <a className={classes.plusLink} style={{cursor:'pointer'}} onClick={(e)=>accMSet(true)} >+</a>  
          
   </>):''
 }
                <Autocomplete
                style={{ width: '100%' }}
                options={cashTranAccs}
                size="small"
                classes={{
                    option: classes.option,
                }}
               
                openOnFocus={true}
                getOptionLabel={(option) =>option.tran_acc_name}
                value={selectedCashTranAcc} 
                onChange={(event,selectedObj)=>{
                  selectedCashTranAccSet(selectedObj)
                }}
                autoHighlight={true}
                // loading={cashTranAccs.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={cashTranAccRef}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                          cashTranDateRef.current.focus()
                        }
                      }}
                    {...params}
                    label="Choose a transaction account"
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
                    inputRef={cashTranAccRef}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                          cashTranDateRef.current.focus()
                        }
                      }}
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


           

            
            <Grid item xs={12} sm={3}  > 
            <MuiPickersUtilsProvider  utils={DateFnsUtils}>
          
            <KeyboardDateTimePicker
            style={{ width: '100%',marginTop: '-8px' }}
             inputRef={cashTranDateRef}
             onKeyDown={event => {
                 if (event.key === "Enter") {
                   cashTranNoteRef.current.focus()
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
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={cash_tran_note} 
            label="Transaction note" name="cash_tran_note" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>cash_tran_note_set(e.target.value)} 
            inputRef={cashTranNoteRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                  cashTranAmountRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  type="number" autoComplete='off'  className={classes.fullWidth}  value={cash_tran_amount} 
            label="Transaction amount" name="cash_tran_amount" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>cash_tran_amount_set(e.target.value)} 
            inputRef={cashTranAmountRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                  cashTranActionRef.current.click()
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
            buttonRef={cashTranActionRef}
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
      title={"Others Transaction List"}
      data={cashTrans}
      columns={columns}
      options={options}
      adjustForCheckbox={false} 
      displaySelectAll={false}
      />
      </Paper>
      )
      
     }



       {/* Cash Transaction Account Add Modal */}
       <Modal
        open={accM}
        onClose={() => accMSet(false)}
        center
        style={{minWidth:'300px',minHeight:'500px'}}
 
      
      >
        <Grid item xs={12} sm={12}  > 
            <TextField  autoComplete='off' style={{marginTop:'10px'}}   className={classes.fullWidth}  value={tran_acc_name} onChange={(e)=>tran_acc_name_set(e.target.value)}
            label="Transaction Acc Name"  type="text" name="tran_acc_name" variant="outlined" size="small"
            onKeyDown={(event)=>{
              if (event.key === "Enter") {
                saveAccAction()
              }
              
            }}
            />
            

            <Button style={{marginTop: '25px'}}
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            disabled={accNameCStatus?true:false}
            startIcon={<SaveIcon/>}
            onClick={saveAccAction}
        >
        Save
      </Button>
        </Grid>
      </Modal>


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
          cashTranCodeAction:state.cashTranCodeReducer,
          createdCashTran:state.createdCashTranReducer,
          updatedCashTran:state.updatedCashTranReducer,
          cashTranDisableRestore:state.cashTranDisableRestoreReducer,
          createdTranAcc: state.createdTranAccReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdCashTranSet,updatedCashTranSet,cashTranDisableRestoreSet,cashTranCodeSet})(CashTransManage);