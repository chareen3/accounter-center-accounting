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
import {currentRouteSet,createdSupplierPaySet,updatedSupplierPaySet,supplierPayDisableRestoreSet} from '../../actions/actions';
import moment from 'moment';


const SupplierPaymentsManage = ({location,currentRouteSet,authInfo,createdSupplierPay,updatedSupplierPay,supplierPayDisableRestore,
  createdSupplierPaySet,updatedSupplierPaySet,supplierPayDisableRestoreSet,createdBankAcc,createdSupplier})=>{
    const classes = useStyles();
  
    let [action,actionSet] = useState('create');
    let [pay_type,pay_typeSet] = useState('');
    let [pay_id,pay_id_set] = useState(0);
    let [pay_method,pay_methodSet] = useState('');
    let [bank_acc_id,bank_acc_id_Set] = useState(0);
    let [supplier_id,supplier_id_Set] = useState(0);
    let [note,note_set] = useState('');
    let [previous_due,previous_due_set] = useState(0);
    let [pay_amount,pay_amount_set] = useState('');

    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [supplierPayUpdateIndex,supplierPayUpdateIndexSet] = useState('0')
     
    let [supplierPays,supplierPaysSet] = useState([])
    let [suppliers,suppliersSet] = useState([])
    let [supplierPayAccs,supplierPayAccsSet] = useState([])
    let [supplierPayments,supplierPaymentsSet] = useState([])
    let [selectedSupplierPayAcc,selectedSupplierPayAccSet] = useState(null)
    let [selectedSupplier,selectedSupplierSet] = useState(null)
    let [selectedSupplierPayType,selectedSupplierPayTypeSet] = useState({pay_type_id:'payment',pay_type:'payment'})
    let [selectedSupplierPayMethod,selectedSupplierPayMethodSet] = useState(null)
    let supplierPayTypes = [{pay_type_id:'receive',pay_type:'receive'},{pay_type_id:'payment',pay_type:'payment'}]
    let supplierPayMethods = [{pay_method_id:'cash',pay_method:'cash'},{pay_method_id:'bank',pay_method:'bank'}]
    
    
    const [selectedDate, handleDateChange] = useState(currentDateTime);

    let supplierPayMethodRef = React.useRef(null)
    let supplierPayTypeRef = React.useRef(null)
    let supplierPayAccRef = React.useRef(null)
    let supplierPayDateRef = React.useRef(null)
    let supplierPayNoteRef = React.useRef(null)
    let supplierPayAmountRef = React.useRef(null) 
    let supplierPayActionRef = React.useRef(null) 
    let supplierRef = React.useRef(null) 
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
       getSupplierPayments()
       getTranAccs();
      getSuppliers()
    },[]);
    useEffect(()=>{
      if(selectedSupplier != null){
        axios.post(`${API_URL}/api/get-supplier-due`,{supplierId: selectedSupplier != null? selectedSupplier.supplier_id:0},{headers:{'auth-token':authInfo.token}}).then(res=>{
          previous_due_set(res.data[0].dueAmount)
        })
      }
       
    },[selectedSupplier])


    useEffect(()=>{
      console.log(createdSupplierPay)
      if(createdSupplierPay){
        if(checkAuthBranchWare(createdSupplierPay.user_branch_id)){
          supplierPaymentsSet(createdSupplierPay.createdRow.concat(supplierPayments));
          setSuccessMsg({...successMsg,msg:`${createdSupplierPay.msg}`,open:true });
        }
       }
    },[createdSupplierPay]); 



    useEffect(()=>{

      if(updatedSupplierPay){
        if(checkAuthBranchWare(updatedSupplierPay.user_branch_id)){          
          supplierPayments[updatedSupplierPay.index] = updatedSupplierPay.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedSupplierPay.msg}`,open:true });
          
        }
       }
    },[updatedSupplierPay])

   useEffect(()=>{
      if(supplierPayDisableRestore){
        if(checkAuthBranchWare(supplierPayDisableRestore.user_branch_id)){
          supplierPayments[supplierPayDisableRestore.index] = supplierPayDisableRestore.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${supplierPayDisableRestore.msg}`,open:true });
        }
       }
    },[supplierPayDisableRestore]);




    const getSupplierPayments = async ()=>{
      await axios.post(`${API_URL}/api/get-supplier-payments`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
        supplierPaymentsSet(res.data.message)
      })
     }
     const getTranAccs = async ()=>{
        await axios.post(`${API_URL}/api/get-bank-accounts`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          supplierPayAccsSet(res.data.message)
        })
       } 
       const getSupplierPays = async ()=>{
        loadingListSet(true)
        await axios.post(`${API_URL}/api/get-bank-transactions`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
          loadingListSet(false)
          supplierPaysSet(res.data.message)
        })
       }

        const getSuppliers = async ()=>{
        await axios.post(`${API_URL}/api/get-suppliers`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          suppliersSet(res.data.message)
        })
       }
    
     // Banks  Real time start
    //  useEffect(()=>{
    //   if(createdBankAcc){
    //     if(checkAuthBranchWare(createdBankAcc.user_branch_id)){
    //       supplierPayAccsSet(createdBankAcc.createdRow.concat(supplierPayAccs));
    //       setSuccessMsg({...successMsg,msg:`${createdBankAcc.msg}`,open:true });
    //     }
    //    }
    // },[createdBankAcc]);
      // Supplier  Real time start 
      useEffect(()=>{
        if(createdSupplier){
          if(checkAuthBranchWare(createdSupplier.user_branch_id)){
            suppliersSet(createdSupplier.createdRow.concat(suppliers));
          }
         }
      },[createdSupplier]);
      
     // SupplierPay  Real time start 
  

    const saveFormAction = async ()=>{   
      
      if(selectedSupplierPayMethod != null && selectedSupplierPayMethod.pay_method == 'bank'   && selectedSupplierPayAcc==null){  
        swal({
          title:'Select a bank  account',
          icon:'warning'
        });
        return false
      }


      if(selectedSupplierPayType==null){  
        swal({
          title:'Select Transaction  Type',
          icon:'warning'
        })
      }else if(selectedSupplierPayMethod==null){  
        swal({
          title:'Select a  payment method',
          icon:'warning'
        })
      }else if(pay_amount=='' && pay_amount <=0){  
        swal({
          title:'Supplier payment amount is required.',
          icon:'warning'
        })
      }else{   
            let payload = {
              pay_id,
              supplierPayUpdateIndex,
              pay_type : selectedSupplierPayType.pay_type,
              pay_method: selectedSupplierPayMethod != null ? selectedSupplierPayMethod.pay_method:null,
              supplier_id: selectedSupplier.supplier_id,
              bank_acc_id: selectedSupplierPayMethod != null && selectedSupplierPayMethod.pay_method=='bank'  ? selectedSupplierPayAcc.bank_acc_id:0,
              previous_due: previous_due==''?0:previous_due,
              created_isodt : selectedDate,
              note,
              pay_amount:pay_amount =='' ? 0 : pay_amount,
              action
            }

        
           
             loadingSaveSet(true)
            await axios.post(`${API_URL}/api/supplier-payment-cu`,{...payload},{headers:{'auth-token':authInfo.token}}).then(res=>{
             loadingSaveSet(false)
             previous_due_set(0)
             note_set('')
             pay_amount_set(0)
             selectedSupplierPayTypeSet({pay_type_id:'payment',pay_type:'payment'})
             selectedSupplierPayAccSet(null)
             selectedSupplierPayMethodSet(null)
             selectedSupplierSet(null)
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

    const supplierPayEdit = (row,index)=>{
      
      selectedSupplierPayTypeSet({pay_type:supplierPayments[index].pay_type,pay_type_id:supplierPayments[index].pay_type}) 
      selectedSupplierPayMethodSet({pay_method_id:supplierPayments[index].pay_method,pay_method:supplierPayments[index].pay_method})
      selectedSupplierSet({supplier_id:supplierPayments[index].cus_id,supplier_name:supplierPayments[index].supplier_name,display_text:supplierPayments[index].supplier_name})
      selectedSupplierPayAccSet({bank_acc_id:supplierPayments[index].bank_acc_id,bank_acc_name:supplierPayments[index].bank_acc_name})
     
      supplierPayUpdateIndexSet(index)
      handleDateChange(supplierPayments[index].supplier_pay_created_isodt)
      pay_amount_set(supplierPayments[index].pay_amount)
      pay_id_set(supplierPayments[index].pay_id) 
      actionSet('update')


    }
    const cusomerDisableRestore = async (supplierPayId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/supplier-payment-disable-restore`,{pay_id:supplierPayId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
            {
    authInfo.role !='user'?(
    <>
        
          <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>supplierPayEdit(props.rowData,props.rowIndex)}/>
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
        {name: "supplier_name",label: "Supplier Name",options: {filter: true,sort: true}},
        {name: "pay_type",label: "Transaction Type",options: {filter: true,sort: true}},
        {name: "pay_method",label: "Transaction Method",options: {filter: true,sort: true}},
        {name: "bank_acc_name",label: "Bank Acc Name",options: {filter: true,sort: true}},
        {name: "note",label: "Note",options: {filter: true,sort: true}},
        {name: "pay_amount",label: "Amount",options: {filter: true,sort: true}},
        {name: "created_isodt",label: "date time",options: {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{ moment(tableMeta.rowData[11]).format(dateTimeFormat) }</p>) 
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
            <h2 className={classes.pageEntryLabel}> Supplier  Payment / Receive  Entry</h2> 

            <Grid container spacing={2}> 
           

            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
                <Autocomplete
                style={{ width: '100%' }}
                options={supplierPayTypes}
                size="small"
                classes={{
                    option: classes.option
                }}
                autoHighlight={true}
                openOnFocus={true}
                getOptionLabel={(option) =>option.pay_type}
                value={selectedSupplierPayType} 
                onChange={(event,selectedObj)=>{

                  selectedSupplierPayTypeSet(selectedObj)
                  
                }}
                loading={supplierPayTypes.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={supplierPayTypeRef}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                          supplierPayMethodRef.current.focus() 
                        }
                      }}
                    {...params}
                    label="Choose a transaction type"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {supplierPayAccs.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
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
                  options={supplierPayMethods}
                  size="small"
                  classes={{
                      option: classes.option
                  }}
                  autoHighlight={true}
                  openOnFocus={true}
                  getOptionLabel={(option) => option.pay_method}
                  value={selectedSupplierPayMethod}  
                  onChange={(event,selectedObj)=>{
           
                    selectedSupplierPayMethodSet(selectedObj) 
                    
                  }}
                  loading={supplierPayMethods.length==0?true:false}
                  renderInput={(params) => (
                      <TextField
                      inputRef={supplierPayMethodRef}
                      onKeyDown={event => {
                          if (event.key === "Enter") {
                            supplierPayAccRef.current.focus() 
                          }
                        }}
                      {...params}
                      label="Choose a  payment Method"
                      variant="outlined"
                      inputProps={{
                          ...params.inputProps,
                          endAdornment: (
                            <React.Fragment>
                              {/* {supplierPayMethods.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment} */}
                            </React.Fragment>
                          ),
                      }}
                      />
                  )}
                  /> 
              </Grid>
              <Grid item xs={12} sm={3}  className={classes.plusLinkDiv} style={{display:(selectedSupplierPayMethod!=null && selectedSupplierPayMethod.pay_method_id=='bank')?'block':'none'}}>
                  <Autocomplete
                  style={{ width: '100%' }} 
                  options={supplierPayAccs} 
                  size="small"
                  classes={{
                      option: classes.option
                  }}
                  autoHighlight={true}
                  openOnFocus={true}
                  getOptionLabel={(option) =>option.bank_acc_name}
                  value={selectedSupplierPayAcc}  
                  onChange={(event,selectedObj)=>{
                    selectedSupplierPayAccSet(selectedObj)  
                   
                  }}
                  loading={supplierPayAccs.length==0?true:false}
                  renderInput={(params) => (
                      <TextField
                      inputRef={supplierPayAccRef}
                      onKeyDown={event => {
                          if (event.key === "Enter") {
                              supplierPayMethodRef.current.focus() 
                          }
                        }}
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
            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
                <Autocomplete
                style={{ width: '100%' }}
                options={suppliers}
                size="small"
                classes={{
                    option: classes.option,
                }}
                openOnFocus={true}
                getOptionLabel={(option) => (option.display_text ? option.display_text : "")}
                value={selectedSupplier} 
                onChange={(event,selectedObj)=>{

                  selectedSupplierSet(selectedObj)
                }}
                autoHighlight={true}
                loading={suppliers.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={supplierRef}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                          supplierPayDateRef.current.focus()
                        }
                      }}
                    {...params}
                    label="Choose a supplier"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {suppliers.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment} */}
                          </React.Fragment>
                        ),
                        
                    }}
                    />
                )}
                /> 
            </Grid>
          

            <Grid item xs={12} sm={3}> 
            <TextField type="number"  disabled autoComplete='off'  className={classes.fullWidth}  value={previous_due} 
            label="Current due" name="previous_due" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>previous_due_set(e.target.value)} 
            inputRef={supplierPayAmountRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                  supplierPayActionRef.current.click()
                }
              }}
            />
            </Grid>
            
            <Grid item xs={12} sm={3}  > 
            <MuiPickersUtilsProvider  utils={DateFnsUtils}>
          
            <KeyboardDateTimePicker
            style={{ width: '100%',marginTop: '-8px' }}
             inputRef={supplierPayDateRef}
             onKeyDown={event => {
                 if (event.key === "Enter") {
                   supplierPayNoteRef.current.focus()
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
            inputRef={supplierPayNoteRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                  supplierPayAmountRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField type="number"  autoComplete='off'  className={classes.fullWidth}  value={pay_amount} 
            label=" amount" name="pay_amount" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>pay_amount_set(e.target.value)} 
            inputRef={supplierPayAmountRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                  supplierPayActionRef.current.click()
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
            buttonRef={supplierPayActionRef}
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
      title={"Supplier Transaction List"}
      data={supplierPayments}
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
          supplierPayCodeAction:state.supplierPayCodeReducer,
          createdSupplierPay:state.createdSupplierPayReducer,
          updatedSupplierPay:state.updatedSupplierPayReducer,
          supplierPayDisableRestore:state.supplierPayDisableRestoreReducer,
          createdBankAcc:state.createdBankAccReducer,
          createdSupplier:state.createdSupplierReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdSupplierPaySet,updatedSupplierPaySet,supplierPayDisableRestoreSet})(SupplierPaymentsManage);