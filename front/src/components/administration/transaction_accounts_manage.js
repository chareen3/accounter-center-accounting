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
import {pathSpliter,checkAuthBranchWare,dateTimeFormat} from '../../lib/functions'
import {currentRouteSet,createdTranAccSet,updatedTranAccSet,tranAccDisableRestoreSet} from '../../actions/actions';
import moment from 'moment';
const ProductsManage = ({location,currentRouteSet,authInfo, createdTranAccSet,updatedTranAccSet,tranAccDisableRestoreSet,
    createdTranAcc,updatedTranAcc,tranAccDisableRestoreAction,tranAccCodeGet})=>{
    const classes = useStyles();
    let [formValues,formSetValues] = useState({tran_acc_id:0,tran_acc_name:'',tran_acc_note:'',action:'create'});
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [tranAccUpdateIndex,tranAccUpdateIndexSet] = useState('0')
    let [tranAccs,tranAccsSet] =  useState([])
    let [tranAccCode,tranAccCodeSet] =  useState('')


    let codeRef = React.useRef(null)
    let tranAccNameRef = React.useRef(null)
    let tranAccNoteRef = React.useRef(null)
    let saveFormActionRef = React.useRef(null)
   
    
    
        
    updatedTranAccSet(null)
    tranAccDisableRestoreSet(null) 
    createdTranAccSet(null)

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
        getTranAccCode();
        currentRouteSet(pathSpliter(location.pathname,1));
        getTranAccs();
       
    },[]);
    const getTranAccs = async ()=>{
      await axios.post(`${API_URL}/api/get-transaction-accounts`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
        tranAccsSet(res.data.message)
      })
     }
  
     const getTranAccCode = async ()=>{
      await axios.get(`${API_URL}/api/get-transaction-account-code`,{headers:{'auth-token':authInfo.token}}).then(res=>{
        tranAccCodeSet(res.data.message)
      })
     }
     
     /// TranAcc code  Real time start
     useEffect(()=>{
       if(formValues.action=='create' && tranAccCodeGet){
        tranAccCodeSet(tranAccCodeGet.createdRow)
       }
    },[tranAccCodeGet]);
    
    
    // TranAccs  real time end
    useEffect(()=>{
      if(createdTranAcc){
        if(checkAuthBranchWare(createdTranAcc.user_branch_id)){          
          tranAccsSet(createdTranAcc.createdRow.concat(tranAccs));
          setSuccessMsg({...successMsg,msg:`${createdTranAcc.msg}`,open:true });
        }
       }
    },[createdTranAcc]);

    useEffect(()=>{
      if(updatedTranAcc){
        if(checkAuthBranchWare(updatedTranAcc.user_branch_id)){          
          tranAccs[updatedTranAcc.index] = updatedTranAcc.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedTranAcc.msg}`,open:true });
        }
       }
    },[updatedTranAcc])

    useEffect(()=>{
      if(tranAccDisableRestoreAction){
        if(checkAuthBranchWare(tranAccDisableRestoreAction.user_branch_id)){
        tranAccs[tranAccDisableRestoreAction.index] = tranAccDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${tranAccDisableRestoreAction.msg}`,open:true });
        }
       }
    },[tranAccDisableRestoreAction]);
    

    const handleFromInput = (e)=>{
        const {name,value} = e.target;
        formSetValues({...formValues,[name]:value}) 
      }
    const saveFormAction = async ()=>{
        if(formValues.tran_acc_name.trim()==''){ 
            swal({
              title:'Transaction account name is required',
              icon:'warning'
            })
          }else{
            formValues.tranAccUpdateIndex = tranAccUpdateIndex
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/transaction-account-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)

            if(res.data.error){
              swal({
                title:res.data.message,
                icon:'warning'
              });

              return false
            }

            getTranAccCode()
            formSetValues({tran_acc_id:0,tran_acc_name:'',tran_acc_note:'',action:'create'})


            
            })
         }
    }

    const tranAccEdit = (row,index)=>{
     
      formSetValues({...formValues,tran_acc_id:tranAccs[index].tran_acc_id,tran_acc_name:tranAccs[index].tran_acc_name,tran_acc_note:tranAccs[index].tran_acc_note,action:'update'})
      tranAccCodeSet(tranAccs[index].tran_acc_code)
      tranAccUpdateIndexSet(index)
    }
    const tranAccDisableRestore = async (tranAccId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/transaction-account-disable-restore`,{tran_acc_id:tranAccId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
       {
    authInfo.role !='user'?(
    <>
         <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>tranAccEdit(props.rowData,props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>tranAccDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>tranAccDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}        
   </>):''
 }
         
        </div>)
      
      }
    
    const columns = [
        {name: "tran_acc_id",options: { display: 'excluded' }},
        {name: "tran_acc_status",options: { display: 'excluded' }},
        {name:"SL",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
          return ( <p>{parseFloat(tableMeta.rowIndex)+1}</p> ); 
        }
        },headerStyle: {
          textAlign:'left'
        }},
        {name: "tran_acc_code",label: "Transaction Account code",options: {filter: true,sort: true}},
        {name: "tran_acc_name",label: "Transaction Account name",options: {filter: true,sort: true}},
        {name: "tran_acc_note",label: "Transaction Account note",options: {filter: true,sort: true}},
        {name: "tran_acc_created_isodt",label: "created date & time",
        options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{moment(tableMeta.rowData[6]).format(dateTimeFormat)}</p>)
          }
        }
      },
        {name: "tran_acc_updated_isodt",label: "updated date & time",options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{ moment(tableMeta.rowData[7]).format(dateTimeFormat)}</p>) 
          }
        }},
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
            <h2 className={classes.pageEntryLabel}> Transaction Account Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={tranAccCode} 
            label="Transaction account code" name="tran_acc_code" style={{color:'#222'}} disabled variant="outlined" size="small"  onChange={handleFromInput} 
            inputRef={codeRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    // catRef.current.focus()
                }
              }}
            />
            </Grid>

            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={tranAccNameRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                         tranAccNoteRef.current.focus()
                      }
                    }}  className={classes.fullWidth}  value={formValues.tran_acc_name} 
            label="Transaction account name" name="tran_acc_name" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 

            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={tranAccNoteRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                        saveFormActionRef.current.click()
                      }
                    }}  className={classes.fullWidth}  value={formValues.tran_acc_note} 
            label="Transaction account note" name="tran_acc_note" variant="outlined" size="small" onChange={handleFromInput} />
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
      title={"Transaction account List"}
      data={tranAccs}
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
          createdTranAcc:state.createdTranAccReducer,
          updatedTranAcc:state.updatedTranAccReducer,
          tranAccDisableRestoreAction:state.tranAccDisableRestoreReducer,
          tranAccCodeGet:state.tranAccCodeReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdTranAccSet,updatedTranAccSet,tranAccDisableRestoreSet})(ProductsManage);