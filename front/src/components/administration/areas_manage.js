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
import {currentRouteSet,createdAreaSet,updatedAreaSet,disableRestoreAreaSet} from '../../actions/actions';
import moment from 'moment';

const AreaManage = ({location,currentRouteSet,authInfo,createdArea,updatedArea,areaDisableRestoreAction,
  createdAreaSet,updatedAreaSet,disableRestoreAreaSet})=>{
    const classes = useStyles();
    let [formValues,formSetValues] = useState({area_name:'',area_id:0,action:'create'});
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [areas,areasSet] = useState([])
    let [areaUpdateIndex,areaUpdateIndexSet] = useState('0')

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
    createdAreaSet(null)
    updatedAreaSet(null)
    disableRestoreAreaSet(null)
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        getAreas();
    },[]);

    useEffect(()=>{
      if(createdArea){
        if(checkAuthBranchWare(createdArea.user_branch_id)){          
          areasSet(createdArea.createdRow.concat(areas));
          setSuccessMsg({...successMsg,msg:`${createdArea.msg}`,open:true });
          formSetValues({area_name:'',area_id:0,action:'create'})
        }
       }
    },[createdArea])

    useEffect(()=>{
      if(updatedArea){
        if(checkAuthBranchWare(updatedArea.user_branch_id)){          
          areas[updatedArea.index] = updatedArea.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedArea.msg}`,open:true });
          formSetValues({area_name:'',area_id:0,action:'create'})
        }
       }
    },[updatedArea])

    useEffect(()=>{
      if(areaDisableRestoreAction){
        if(checkAuthBranchWare(areaDisableRestoreAction.user_branch_id)){
        areas[areaDisableRestoreAction.index] = areaDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${areaDisableRestoreAction.msg}`,open:true });
        }
       }
    },[areaDisableRestoreAction]);

    const handleFromInput = (e)=>{
        const {name,value} = e.target;
        formSetValues({...formValues,[name]:value}) 
      }
    const saveFormAction = async ()=>{
        if(formValues.area_name.trim()==''){
            swal({
              title:'Product area name is required',
              icon:'warning'
            })
          }else{
            formValues.areaUpdateIndex = areaUpdateIndex
            formValues.area_name =  formValues.area_name.trim()
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/area-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
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

    const areaEdit = (row,index)=>{
      formValues.area_name =  areas[index].area_name
      formValues.action =  'update'

      formSetValues({...formValues,area_name:areas[index].area_name,
        area_id:areas[index].area_id});
        areaUpdateIndexSet(index)
    }
    const areaDisableRestore = async (areaId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/area-disable-restore`,{area_id:areaId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    const getAreas = async ()=>{
          loadingListSet(true)
          await axios.post(`${API_URL}/api/get-areas`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingListSet(false)
            areasSet(res.data.message)
          })
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
       {
    authInfo.role !='user'?(
    <>
        <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>areaEdit(props.rowData[0],props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>areaDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>areaDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}         
   </>):''
 }
         
        </div>)
      
      }
    
    const columns = [
        {name: "area_id",options: { display: 'excluded' }},
        {name: "area_status",options: { display: 'excluded' }},
        {name: "area_name",label: "Area name",options: {filter: true,sort: true}},
        {name: "area_created_isodt",label: "created date & time",
        options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{moment(tableMeta.rowData[3]).format(dateTimeFormat)}</p>)
          }
        }
      },
        {name: "area_updated_isodt",label: "updated date & time",options: 
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
            <h2 className={classes.pageEntryLabel}> Area Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  style={{margin:'0px auto'}}> 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={formValues.area_name} 
            label="area name" name="area_name" variant="outlined" size="small" onChange={handleFromInput} />
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
      title={"Area List"}
      data={areas}
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
          createdArea:state.createdAreaReducer,
          updatedArea:state.updatedAreaReducer,
          areaDisableRestoreAction:state.areaDisableRestoreReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdAreaSet,updatedAreaSet,disableRestoreAreaSet})(AreaManage);