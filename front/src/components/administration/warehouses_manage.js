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
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {pathSpliter,checkAuthBranchWare,dateTimeFormat} from '../../lib/functions'
import {currentRouteSet,createdWarehouseSet,updatedWarehouseSet,disableRestoreWarehouseSet} from '../../actions/actions';
import moment from 'moment';

const WarehousesManage = ({location,currentRouteSet,authInfo,createdWarehouse,updatedWarehouse,warehouseDisableRestoreAction,
  createdWarehouseSet,updatedWarehouseSet,disableRestoreWarehouseSet})=>{
    const classes = useStyles();
    let [formValues,formSetValues] = useState({warehouse_name:'',warehouse_title:'',warehouse_address:'',warehouse_id:0,action:'create'});
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [warehouses,warehousesSet] = useState([])
    let [warehouseUpdateIndex,warehouseUpdateIndexSet] = useState('0')

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

    createdWarehouseSet(null)
    updatedWarehouseSet(null)
    disableRestoreWarehouseSet(null)
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        getWarehouses();
    },[]);

    useEffect(()=>{
      if(createdWarehouse){
        if(checkAuthBranchWare(createdWarehouse.user_branch_id,createdWarehouse.user_warehouse_id)){          
          warehousesSet(createdWarehouse.createdRow.concat(warehouses));
          setSuccessMsg({...successMsg,msg:`${createdWarehouse.msg}`,open:true });
          formSetValues({warehouse_name:'',warehouse_title:'',warehouse_address:'',warehouse_id:0,action:'create'})
        }
       }
    },[createdWarehouse])

    useEffect(()=>{
      if(updatedWarehouse){
        if(checkAuthBranchWare(updatedWarehouse.user_branch_id,updatedWarehouse.user_warehouse_id)){          
          warehouses[updatedWarehouse.index] = updatedWarehouse.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedWarehouse.msg}`,open:true });
          formSetValues({warehouse_name:'',warehouse_title:'',warehouse_address:'',warehouse_id:0,action:'create'})
        }
       }
    },[updatedWarehouse])

    useEffect(()=>{
      if(warehouseDisableRestoreAction){
        if(checkAuthBranchWare(warehouseDisableRestoreAction.user_branch_id,warehouseDisableRestoreAction.user_warehouse_id)){
        warehouses[warehouseDisableRestoreAction.index] = warehouseDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${warehouseDisableRestoreAction.msg}`,open:true });
        }
       }
    },[warehouseDisableRestoreAction]);

    const handleFromInput = (e)=>{
        const {name,value} = e.target;
        formSetValues({...formValues,[name]:value}) 
      }
    const saveFormAction = async ()=>{
        if(formValues.warehouse_name.trim()==''){
            swal({
              title:'Warehouse name is required',
              icon:'warning'
            })
          }else if(formValues.warehouse_title.trim()==''){
            swal({
              title:'Warehouse title is required',
              icon:'warning'
            })
          }else if(formValues.warehouse_address.trim()==''){
            swal({
              title:'Warehouse address is required',
              icon:'warning'
            })
          }else{
            formValues.warehouseUpdateIndex = warehouseUpdateIndex
            formValues.warehouse_name = formValues.warehouse_name.trim()
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/warehouse-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
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

    const warehouseEdit = (row,index)=>{
      formValues.warehouse_name =  warehouses[index].warehouse_name
      formValues.warehouse_title =  warehouses[index].warehouse_title
      formValues.warehouse_address =  warehouses[index].warehouse_address
      formValues.action =  'update'

      formSetValues({...formValues,warehouse_name:warehouses[index].warehouse_name,
        warehouse_id:warehouses[index].warehouse_id});
        warehouseUpdateIndexSet(index)
    }
    const warehouseDisableRestore = async (warehouseId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/warehouse-disable-restore`,{warehouse_id:warehouseId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    const getWarehouses = async ()=>{
          loadingListSet(true)
          await axios.post(`${API_URL}/api/get-warehouses`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingListSet(false)
            warehousesSet(res.data.message)
          })
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
      
          <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>warehouseEdit(props.rowData[0],props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>warehouseDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>warehouseDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}
        </div>)
      
      }
    
    const columns = [
        {name: "warehouse_id",options: { display: 'excluded' }},
        {name: "warehouse_status",options: { display: 'excluded' }},
        {name: "warehouse_name",label: "Warehouse name",options: {filter: true,sort: true}},
        {name: "warehouse_title",label: "Warehouse title",options: {filter: true,sort: true}},
        {name: "warehouse_address",label: "Warehouse address",options: {filter: true,sort: true}},
        {name: "warehouse_created_isodt",label: "created date & time",options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{ moment(tableMeta.rowData[5]).format(dateTimeFormat)}</p>) 
          }
        }},
        {name: "warehouse_updated_isodt",label: "updated date & time",options: 
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
            <h2 className={classes.pageEntryLabel}>Warehouse Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  style={{margin:'0px auto'}}> 
            <TextField autoComplete='off'  className={classes.fullWidth}  value={formValues.warehouse_name} 
            label="warehouse name" name="warehouse_name" variant="outlined" size="small" onChange={handleFromInput} />
            <TextField autoComplete='off'  className={classes.fullWidth}  value={formValues.warehouse_title} 
            label="warehouse title" name="warehouse_title" variant="outlined" size="small" onChange={handleFromInput} 
            style={{marginTop:'8px'}} />
           <TextareaAutosize 
            rowsMax={10}
            aria-label="Warehouse address"
            placeholder="Warehouse address"
            name="warehouse_address"
            onChange={handleFromInput} 
            defaultValue={formValues.warehouse_address}
            style={{marginTop:'8px',width: '100%',height:'30px'}} 
          />
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
      title={"Warehouse List"}
      data={warehouses}
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
          createdWarehouse:state.createdWarehouseReducer,
          updatedWarehouse:state.updatedWarehouseReducer,
          warehouseDisableRestoreAction:state.warehouseDisableRestoreReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdWarehouseSet,updatedWarehouseSet,disableRestoreWarehouseSet})(WarehousesManage);