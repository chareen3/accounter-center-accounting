import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import swal from 'sweetalert';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MUIDataTable from "mui-datatables";
import {API_URL} from '../../config.json';
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {pathSpliter,checkAuthBranchWare,dateTimeFormat,checkIntNum} from '../../lib/functions'
import {currentRouteSet,createdBankAccSet,updatedBankAccSet,bankAccDisableRestoreSet} from '../../actions/actions';
import moment from 'moment';
const BankAccountsManage = ({location,currentRouteSet,authInfo, createdBankAccSet,updatedBankAccSet,bankAccDisableRestoreSet,
    createdBankAcc,updatedBankAcc,bankAccDisableRestoreAction,bankAccCodeGet})=>{
    const classes = useStyles();
    let [formValues,formSetValues] = useState({bank_acc_id:0,bank_acc_name:'',bank_acc_note:'',bank_acc_branch:'',bank_acc_number:'',bank_name:'',
    bank_acc_init_balance:0,bank_acc_branch:'',bank_acc_note:'',bank_acc_type:'',action:'create'});
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [bankAccUpdateIndex,bankAccUpdateIndexSet] = useState('0')
    let [bankAccs,bankAccsSet] =  useState([])
    let [bankAccCode,bankAccCodeSet] =  useState('')


    let codeRef = React.useRef(null)
    let bankAccNumberRef = React.useRef(null)
    let bankAccTypeRef = React.useRef(null)
    let bankAccNameRef = React.useRef(null)
    let bankNameRef = React.useRef(null)
    let bankAccBranchRef = React.useRef(null)
    let bankAccInitBRef = React.useRef(null)
    let bankAccNoteRef = React.useRef(null)
    let saveFormActionRef = React.useRef(null)
   
    
    
        
    updatedBankAccSet(null)
    bankAccDisableRestoreSet(null) 
    createdBankAccSet(null)

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
        getBankAccCode();
        currentRouteSet(pathSpliter(location.pathname,1));
        getBankAccs();
       
    },[]);
    const getBankAccs = async ()=>{
      await axios.post(`${API_URL}/api/get-bank-accounts`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
        bankAccsSet(res.data.message)
      })
     }
  
     const getBankAccCode = async ()=>{
      await axios.get(`${API_URL}/api/get-bank-account-code`,{headers:{'auth-token':authInfo.token}}).then(res=>{
        bankAccCodeSet(res.data.message)
      })
     }
     
     /// BankAcc code  Real time start
     useEffect(()=>{
       if(formValues.action=='create' && bankAccCodeGet){
        bankAccCodeSet(bankAccCodeGet.createdRow)
       }
    },[bankAccCodeGet]);
    
    
    // BankAccs  real time end
    // useEffect(()=>{
    //   if(createdBankAcc){
    //     if(checkAuthBranchWare(createdBankAcc.user_branch_id,createdBankAcc.user_warehouse_id)){          
    //       bankAccsSet(createdBankAcc.createdRow.concat(bankAccs));
    //       setSuccessMsg({...successMsg,msg:`${createdBankAcc.msg}`,open:true });
    //     }
    //    }
    // },[createdBankAcc]);
    // useEffect(()=>{
   
    //   if(updatedBankAcc){
      
 

    //     if(checkAuthBranchWare(updatedBankAcc.user_branch_id,updatedBankAcc.user_warehouse_id)){   

    //       bankAccs[updatedBankAcc.index] = updatedBankAcc.updatedRow[0]
    //       setSuccessMsg({...successMsg,msg:`${updatedBankAcc.msg}`,open:true });
    //     }
    //    }
    // },[updatedBankAcc])

    // useEffect(()=>{
    //   if(bankAccDisableRestoreAction){
    //     if(checkAuthBranchWare(bankAccDisableRestoreAction.user_branch_id,bankAccDisableRestoreAction.user_warehouse_id)){
    //     bankAccs[bankAccDisableRestoreAction.index] = bankAccDisableRestoreAction.disableRestoreRow[0];
    //     setSuccessMsg({...successMsg,msg:`${bankAccDisableRestoreAction.msg}`,open:true });
    //     }
    //    }
    // },[bankAccDisableRestoreAction]);
    

    const handleFromInput = (e)=>{
        const {name,value} = e.target;
        formSetValues({...formValues,[name]:value}) 
      }
    const saveFormAction = async ()=>{
        if(formValues.bank_acc_name.trim()==''){ 
            swal({
              title:'Bank account name is required',
              icon:'warning'
            })
          }else{

            formValues.bankAccUpdateIndex = bankAccUpdateIndex
            if(formValues.bank_acc_init_balance==''){
              
               formValues.bank_acc_init_balance = 0
            }
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/bank-account-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)

            swal({
              title: res.data.message,
              icon:'success'
            })
            
            getBankAccCode()
            getBankAccs()
            formSetValues({...formValues,bank_acc_id:0,bank_acc_name:'',bank_acc_note:'',bank_acc_branch:'',bank_acc_number:'',bank_name:'',
            bank_acc_init_balance:0,bank_acc_branch:'',bank_acc_note:'',bank_acc_type:'',action:'create'})


            
            })
         }
    }

    const bankAccEdit = (row,index)=>{
     
      
      
      formSetValues({...formValues,bank_acc_id:bankAccs[index].bank_acc_id,bank_acc_name:bankAccs[index].bank_acc_name,bank_acc_note:bankAccs[index].bank_acc_note,bank_acc_branch:bankAccs[index].bank_acc_branch,bank_acc_number:bankAccs[index].bank_acc_number,bank_name:bankAccs[index].bank_name,
            bank_acc_init_balance:bankAccs[index].bank_acc_init_balance,bank_acc_branch:bankAccs[index].bank_acc_branch,bank_acc_note:bankAccs[index].bank_acc_note,bank_acc_type:bankAccs[index].bank_acc_type,action:'update'})

      bankAccCodeSet(bankAccs[index].bank_acc_code)
      bankAccUpdateIndexSet(index)
    }
    const bankAccDisableRestore = async (bankAccId,actionCond,index)=>{

      swal({
        title:'Are you sure  ?',
        icon:'warning',
        buttons:true
      }).then(async (res)=>{
        if(res){
          await axios.post(`${API_URL}/api/bank-account-disable-restore`,{bank_acc_id:bankAccId,action:actionCond,index},{headers:{'auth-token':authInfo.token}}).then(res=>{
        
            swal({
              title: res.data.message,
              icon:'success'
            })
            getBankAccs()
          })
        }
      })
      
      
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
       {
    authInfo.role !='user'?(
    <>
          <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>bankAccEdit(props.rowData,props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>bankAccDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>bankAccDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}       
   </>):''
 }
         
        </div>)
      
      }
    
    const columns = [
        {name: "bank_acc_id",options: { display: 'excluded' }},
        {name: "bank_acc_status",options: { display: 'excluded' }},
        {name:"SL",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
          return ( <p>{parseFloat(tableMeta.rowIndex)+1}</p> ); 
        }
        },headerStyle: {
          textAlign:'left'
        }},
        {name: "bank_acc_code",label: "Account code",options: {filter: true,sort: true}},
        {name: "bank_acc_name",label: " Account name",options: {filter: true,sort: true}},
        {name: "bank_acc_number",label: " Account number",options: {filter: true,sort: true}},
        {name: "bank_acc_type",label: " Account type",options: {filter: true,sort: true}},
        {name: "bank_name",label: "Bank name",options: {filter: true,sort: true}},
        {name: "bank_branch_name",label: "Branch name",options: {filter: true,sort: true}},
        {name: "bank_acc_init_balance",label: "Initial balance",options: {filter: true,sort: true}},
        {name: "bank_acc_created_isodt",label: "created date & time",
        options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{moment(tableMeta.rowData[10]).format(dateTimeFormat)}</p>)
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
            <h2 className={classes.pageEntryLabel}> Bank Account Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={bankAccCode} 
            label="Bank account code" name="bank_acc_code" style={{color:'#222'}} disabled variant="outlined" size="small"  onChange={handleFromInput} 
            inputRef={codeRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    // catRef.current.focus()
                }
              }}
            />
            </Grid>

            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={bankAccNameRef}   onKeyDown={event => {
                      if (event.key == "Enter") {
                         bankAccNumberRef.current.focus()
                      }
                    }}  className={classes.fullWidth}  value={formValues.bank_acc_name} 
            label="Bank account name" name="bank_acc_name" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 

            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={bankAccNumberRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                         bankAccTypeRef.current.focus() 
                      }
                    }}  className={classes.fullWidth}  value={formValues.bank_acc_number} 
            label="Bank account Number" name="bank_acc_number" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 

            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={bankAccTypeRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                         bankNameRef.current.focus()
                      }
                    }}  className={classes.fullWidth}  value={formValues.bank_acc_type} 
            label="Bank account type" name="bank_acc_type" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 
            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={bankNameRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                        bankAccBranchRef.current.focus()
                      }
                    }}  className={classes.fullWidth}  value={formValues.bank_name} 
            label="Bank  name" name="bank_name" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 
            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={bankAccBranchRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                         bankAccInitBRef.current.focus()
                      }
                    }}  className={classes.fullWidth}  value={formValues.bank_acc_branch} 
            label="Bank account branch" name="bank_acc_branch" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 

            <Grid item xs={12} sm={3}> 
            <TextField  type="number" autoComplete='off'  inputRef={bankAccInitBRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                         bankAccNoteRef.current.focus()
                      }
                    }}  className={classes.fullWidth}  value={formValues.bank_acc_init_balance} 
            label=" account initial balance" name="bank_acc_init_balance" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 
            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={bankAccNoteRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                        saveFormActionRef.current.click()
                      }
                    }}  className={classes.fullWidth}  value={formValues.bank_acc_note} 
            label=" account note" name="bank_acc_note" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 
           

         
           </Grid>
           <Grid item xs={12}>
          <Button style={{marginTop: '25px'}}
            buttonRef={saveFormActionRef}
            variant="contained"
            color="primary"
            size="small"
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
      title={"Bank Account List"}
      data={bankAccs}
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
          createdBankAcc:state.createdBankAccReducer,
          updatedBankAcc:state.updatedBankAccReducer,
          bankAccDisableRestoreAction:state.bankAccDisableRestoreReducer,
          bankAccCodeGet:state.bankAccCodeReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdBankAccSet,updatedBankAccSet,bankAccDisableRestoreSet})(BankAccountsManage);