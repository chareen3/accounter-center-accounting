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
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import socketIOClient from "socket.io-client";
import {pathSpliter,checkAuthBranchWare,dateTimeFormat} from '../../lib/functions'
import {currentRouteSet,createdBranchSet,updatedBranchSet,disableRestoreBranchSet} from '../../actions/actions';
import moment from 'moment';

const ProdBranchesManage = ({location,currentRouteSet,authInfo,createdBranch,updatedBranch,branchDisableRestoreAction,
  createdBranchSet,updatedBranchSet,disableRestoreBranchSet})=>{
    const classes = useStyles();
    let [formValues,formSetValues] = useState({branch_name:'',branch_title:'',branch_address:'',branch_id:0,action:'create'});
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [branches,branchesSet] = useState([])
    let [branchUpdateIndex,branchUpdateIndexSet] = useState('0')

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
    createdBranchSet(null)
    updatedBranchSet(null)
    disableRestoreBranchSet(null)
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        getBranches();
    },[]);

    useEffect(()=>{
      if(createdBranch){
        if(checkAuthBranchWare(createdBranch.user_branch_id)){          
          branchesSet(createdBranch.createdRow.concat(branches));
          setSuccessMsg({...successMsg,msg:`${createdBranch.msg}`,open:true });
          formSetValues({branch_name:'',branch_title:'',branch_address:'',branch_id:0,action:'create'})
        }
       }
    },[createdBranch])

    useEffect(()=>{
      if(updatedBranch){
        if(checkAuthBranchWare(updatedBranch.user_branch_id)){          
          branches[updatedBranch.index] = updatedBranch.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedBranch.msg}`,open:true });
          formSetValues({branch_name:'',branch_title:'',branch_address:'',branch_id:0,action:'create'})
        }
       }
    },[updatedBranch])

    useEffect(()=>{
      if(branchDisableRestoreAction){
        if(checkAuthBranchWare(branchDisableRestoreAction.user_branch_id)){
        branches[branchDisableRestoreAction.index] = branchDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${branchDisableRestoreAction.msg}`,open:true });
        }
       }
    },[branchDisableRestoreAction]);

    const handleFromInput = (e)=>{
        const {name,value} = e.target;
        formSetValues({...formValues,[name]:value}) 
      }
    const saveFormAction = async ()=>{
        if(formValues.branch_name.trim()==''){
            swal({
              title:'Branch name is required',
              icon:'warning'
            })
          }else if(formValues.branch_title.trim()==''){
            swal({
              title:'Branch title is required',
              icon:'warning'
            })
          }else if(formValues.branch_address.trim()==''){
            swal({
              title:'Branch address is required',
              icon:'warning'
            })
          }else{
            formValues.branchUpdateIndex = branchUpdateIndex
            formValues.branch_name = formValues.branch_name.trim()
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/branch-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)

            if(res.data.error){
              swal({
                title:res.data.message,
                icon:'warning'
              });
              return false;
            }


            })
          }
    }

    const branchEdit = (row,index)=>{
      formValues.branch_name =  branches[index].branch_name
      formValues.branch_title =  branches[index].branch_title
      formValues.branch_address =  branches[index].branch_address
      formValues.action =  'update'

      formSetValues({...formValues,branch_name:branches[index].branch_name,
        branch_id:branches[index].branch_id});
        branchUpdateIndexSet(index)
    }
    const branchDisableRestore = async (branchId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/branch-disable-restore`,{branch_id:branchId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    const getBranches = async ()=>{
          loadingListSet(true)
          await axios.post(`${API_URL}/api/get-branches`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingListSet(false)
            branchesSet(res.data.message)
          })
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
       {
    authInfo.role !='user'?(
    <>
          <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>branchEdit(props.rowData[0],props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>branchDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>branchDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}       
   </>):''
 }
         
        </div>)
      
      }
    
    const columns = [
        {name: "branch_id",options: { display: 'excluded' }},
        {name: "branch_status",options: { display: 'excluded' }},
        {name: "branch_name",label: " Branch name",options: {filter: true,sort: true}},
        {name: "branch_title",label: " Branch title",options: {filter: true,sort: true}},
        {name: "branch_address",label: " Branch address",options: {filter: true,sort: true}},
        {name: "branch_created_isodt",label: "created date & time",options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{ moment(tableMeta.rowData[5]).format(dateTimeFormat)}</p>) 
          }
        }},
        {name: "branch_updated_isodt",label: "updated date & time",options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{ moment(tableMeta.rowData[6]).format(dateTimeFormat)}</p>) 
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
            <h2 className={classes.pageEntryLabel}>Branch Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  style={{margin:'0px auto'}}> 
            <TextField autoComplete='off'  className={classes.fullWidth}  value={formValues.branch_name} 
            label="branch name" name="branch_name" variant="outlined" size="small" onChange={handleFromInput} />
            <TextField autoComplete='off'  className={classes.fullWidth}  value={formValues.branch_title} 
            label="branch title" name="branch_title" variant="outlined" size="small" onChange={handleFromInput} 
            style={{marginTop:'8px'}} />
           <TextareaAutosize 
            rowsMax={10}
            aria-label="Branch address"
            placeholder="Branch address"
            name="branch_address"
            onChange={handleFromInput} 
            defaultValue={formValues.branch_address}
            style={{marginTop:'8px',width: '100%',height:'30px'}} 
          />
            </Grid>
           </Grid>

           {
    authInfo.role !='user'?(
    <>
           <Grid item xs={12}>
          <Button style={{marginTop: '25px'}}
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
   </>):''
 }
         
            </Paper>
            {
      loadingList==true?(<b>Loading...</b>):(
        <Paper className={classes.paper} style={{marginTop:'20px'}}>
        <MUIDataTable
      title={"Branch List"}
      data={branches}
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
        textAlign:'center'
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
          createdBranch:state.createdBranchReducer,
          updatedBranch:state.updatedBranchReducer,
          branchDisableRestoreAction:state.branchDisableRestoreReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdBranchSet,updatedBranchSet,disableRestoreBranchSet})(ProdBranchesManage);