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
import {currentRouteSet,createdDesignationSet,updatedDesignationSet,disableRestoreDesignationSet} from '../../actions/actions';
import moment from 'moment';

const DesignationsManage = ({location,currentRouteSet,authInfo,createdDesignation,updatedDesignation,designationDisableRestoreAction,
  createdDesignationSet,updatedDesignationSet,disableRestoreDesignationSet})=>{
    const classes = useStyles();
    let [formValues,formSetValues] = useState({designation_name:'',designation_id:0,action:'create'});
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [designations,designationsSet] = useState([])
    let [designationUpdateIndex,designationUpdateIndexSet] = useState('0')

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
    createdDesignationSet(null)
    updatedDesignationSet(null)
    disableRestoreDesignationSet(null)
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        getDesignations();
    },[]);

    useEffect(()=>{
      if(createdDesignation){
        if(checkAuthBranchWare(createdDesignation.user_branch_id)){          
          designationsSet(createdDesignation.createdRow.concat(designations));
          setSuccessMsg({...successMsg,msg:`${createdDesignation.msg}`,open:true });
          formSetValues({designation_name:'',designation_id:0,action:'create'})
        }
       }
    },[createdDesignation])

    useEffect(()=>{
      if(updatedDesignation){
        if(checkAuthBranchWare(updatedDesignation.user_branch_id)){          
          designations[updatedDesignation.index] = updatedDesignation.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedDesignation.msg}`,open:true });
          formSetValues({designation_name:'',designation_id:0,action:'create'})
        }
       }
    },[updatedDesignation])

    useEffect(()=>{
      if(designationDisableRestoreAction){
        if(checkAuthBranchWare(designationDisableRestoreAction.user_branch_id)){
        designations[designationDisableRestoreAction.index] = designationDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${designationDisableRestoreAction.msg}`,open:true });
        }
       }
    },[designationDisableRestoreAction]);

    const handleFromInput = (e)=>{
        const {name,value} = e.target;
        formSetValues({...formValues,[name]:value}) 
      }
    const saveFormAction = async ()=>{
        if(formValues.designation_name.trim()==''){
            swal({
              title:'Designation name is required',
              icon:'warning'
            })
          }else{
            formValues.designationUpdateIndex = designationUpdateIndex
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/designation-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)
            })
          }
    }

    const designationEdit = (row,index)=>{
      formValues.designation_name =  designations[index].designation_name
      formValues.action =  'update'

      formSetValues({...formValues,designation_name:designations[index].designation_name,
        designation_id:designations[index].designation_id});
        designationUpdateIndexSet(index)
    }
    const designationDisableRestore = async (designationId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/designation-disable-restore`,{designation_id:designationId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    const getDesignations = async ()=>{
          loadingListSet(true)
          await axios.post(`${API_URL}/api/get-designations`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingListSet(false)
            designationsSet(res.data.message)
          })
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
       {
    authInfo.role !='user'?(
    <>
         <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>designationEdit(props.rowData[0],props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>designationDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>designationDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}        
   </>):''
 }
         
        </div>)
      
      }
    
    const columns = [
        {name: "designation_id",options: { display: 'excluded' }},
        {name: "designation_status",options: { display: 'excluded' }},
        {name: "designation_name",label: "Designation name",options: {filter: true,sort: true}},
        {name: "designation_created_isodt",label: "created date & time",
        options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{moment(tableMeta.rowData[3]).format(dateTimeFormat)}</p>)
          }
        }
      },
        {name: "designation_updated_isodt",label: "updated date & time",options: 
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
            <h2 className={classes.pageEntryLabel}>Designation Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  style={{margin:'0px auto'}}> 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={formValues.designation_name} 
            label=" designation name" name="designation_name" variant="outlined" size="small" onChange={handleFromInput} />
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
      title={"Designation List"}
      data={designations}
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
          createdDesignation:state.createdDesignationReducer,
          updatedDesignation:state.updatedDesignationReducer,
          designationDisableRestoreAction:state.designationDisableRestoreReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdDesignationSet,updatedDesignationSet,disableRestoreDesignationSet})(DesignationsManage);