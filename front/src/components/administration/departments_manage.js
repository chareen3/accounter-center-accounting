import React,{useState,useEffect} from 'react';
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

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {pathSpliter,checkAuthBranchWare,dateTimeFormat} from '../../lib/functions'
import {currentRouteSet,createdDepartmentSet,updatedDepartmentSet,disableRestoreDepartmentSet} from '../../actions/actions';
import moment from 'moment';

const DepartmentsManage = ({location,currentRouteSet,authInfo,createdDepartment,updatedDepartment,departmentDisableRestoreAction,
  createdDepartmentSet,updatedDepartmentSet,disableRestoreDepartmentSet})=>{
    const classes = useStyles();
    let [formValues,formSetValues] = useState({department_name:'',department_id:0,action:'create'});
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [departments,departmentsSet] = useState([])
    let [departmentUpdateIndex,departmentUpdateIndexSet] = useState('0')

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
    createdDepartmentSet(null)
    updatedDepartmentSet(null)
    disableRestoreDepartmentSet(null)
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        getDepartments();
    },[]);

    useEffect(()=>{
      if(createdDepartment){
        if(checkAuthBranchWare(createdDepartment.user_branch_id)){          
          departmentsSet(createdDepartment.createdRow.concat(departments));
          setSuccessMsg({...successMsg,msg:`${createdDepartment.msg}`,open:true });
          formSetValues({department_name:'',department_id:0,action:'create'})
        }
       }
    },[createdDepartment])

    useEffect(()=>{
      if(updatedDepartment){
        if(checkAuthBranchWare(updatedDepartment.user_branch_id)){          
          departments[updatedDepartment.index] = updatedDepartment.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedDepartment.msg}`,open:true });
          formSetValues({department_name:'',department_id:0,action:'create'})
        }
       }
    },[updatedDepartment])

    useEffect(()=>{
      if(departmentDisableRestoreAction){
        if(checkAuthBranchWare(departmentDisableRestoreAction.user_branch_id)){
        departments[departmentDisableRestoreAction.index] = departmentDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${departmentDisableRestoreAction.msg}`,open:true });
        }
       }
    },[departmentDisableRestoreAction]);

    const handleFromInput = (e)=>{
        const {name,value} = e.target;
        formSetValues({...formValues,[name]:value}) 
      }
    const saveFormAction = async ()=>{
        if(formValues.department_name.trim()==''){
            swal({
              title:'Department name is required',
              icon:'warning'
            })
          }else{
            formValues.departmentUpdateIndex = departmentUpdateIndex
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/department-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)
            })
          }
    }

    const departmentEdit = (row,index)=>{
      formValues.department_name =  departments[index].department_name
      formValues.action =  'update'

      formSetValues({...formValues,department_name:departments[index].department_name,
        department_id:departments[index].department_id});
        departmentUpdateIndexSet(index)
    }
    const departmentDisableRestore = async (departmentId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/department-disable-restore`,{department_id:departmentId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    const getDepartments = async ()=>{
          loadingListSet(true)
          await axios.post(`${API_URL}/api/get-departments`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingListSet(false)
            departmentsSet(res.data.message)
          })
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
       {
    authInfo.role !='user'?(
    <>
         <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>departmentEdit(props.rowData[0],props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>departmentDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>departmentDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}        
   </>):''
 }
         
        </div>)
      
      }
    
    const columns = [
        {name: "department_id",options: { display: 'excluded' }},
        {name: "department_status",options: { display: 'excluded' }},
        {name: "department_name",label: "Department name",options: {filter: true,sort: true}},
        {name: "department_created_isodt",label: "created date & time",
        options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{moment(tableMeta.rowData[3]).format(dateTimeFormat)}</p>)
          }
        }
      },
        {name: "department_updated_isodt",label: "updated date & time",options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{ moment(tableMeta.rowData[4]).format(dateTimeFormat)}</p>) 
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
            <h2 className={classes.pageEntryLabel}>Department Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  style={{margin:'0px auto'}}> 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={formValues.department_name} 
            label=" department name" name="department_name" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid>
           </Grid>
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
            </Paper>
            {
      loadingList==true?(<b>Loading...</b>):(
        <Paper className={classes.paper} style={{marginTop:'20px'}}>
        <MUIDataTable
      title={"Department List"}
      data={departments}
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
          createdDepartment:state.createdDepartmentReducer,
          updatedDepartment:state.updatedDepartmentReducer,
          departmentDisableRestoreAction:state.departmentDisableRestoreReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdDepartmentSet,updatedDepartmentSet,disableRestoreDepartmentSet})(DepartmentsManage);