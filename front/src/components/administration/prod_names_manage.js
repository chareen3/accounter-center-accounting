import React,{ useState,useEffect} from 'react';
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
import {currentRouteSet,createdProdNameSet,updatedProdNameSet,disableRestoreProdNameSet } from '../../actions/actions';
import moment from 'moment';

const ProdNamesManage = ({location,currentRouteSet,authInfo,createdProdName,updatedProdName,prodNameDisableRestoreAction,
  createdProdNameSet,updatedProdNameSet,disableRestoreProdNameSet })=>{
    const classes = useStyles();
    let [formValues,formSetValues] = useState({prod_name:'',prod_name_id:0,action:'create'});
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [prodNames,prodNamesSet] = useState([])
    let [prodNameUpdateIndex,prodNameUpdateIndexSet] = useState('0')

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
    createdProdNameSet(null)
    updatedProdNameSet(null)
    disableRestoreProdNameSet(null)
    useEffect(()=>{
     
      currentRouteSet(pathSpliter(location.pathname,1));
      getProdNames();
    },[]);

    useEffect(()=>{
      if(createdProdName){
        if(checkAuthBranchWare(createdProdName.user_branch_id)){          
          prodNamesSet(createdProdName.createdRow.concat(prodNames));
          setSuccessMsg({...successMsg,msg:`${createdProdName.msg}`,open:true });
          formSetValues({prod_name:'',prod_name_id:0,action:'create'})
        }
       }
    },[createdProdName])

    useEffect(()=>{
      if(updatedProdName){
        if(checkAuthBranchWare(updatedProdName.user_branch_id)){          
          prodNames[updatedProdName.index] = updatedProdName.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedProdName.msg}`,open:true });
          formSetValues({prod_name:'',prod_name_id:0,action:'create'})
        }
       }
    },[updatedProdName])

    useEffect(()=>{
      if(prodNameDisableRestoreAction){
        if(checkAuthBranchWare(prodNameDisableRestoreAction.user_branch_id)){
        prodNames[prodNameDisableRestoreAction.index] = prodNameDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${prodNameDisableRestoreAction.msg}`,open:true });
        }
       }
    },[prodNameDisableRestoreAction]);

    const handleFromInput = (e)=>{
        const {name,value} = e.target;
        formSetValues({...formValues,[name]:value}) 
      }
    const saveFormAction = async ()=>{
        if(formValues.prod_name.trim()==''){
            swal({
              title:'Product  name is required',
              icon:'warning'
            })
          }else{
            formValues.prodNameUpdateIndex = prodNameUpdateIndex
            formValues.prod_name = formValues.prod_name.trim()
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/prod-name-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
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

    const prodNameEdit = (row,index)=>{
      formValues.prod_name =  prodNames[index].prod_name
      formValues.action =  'update'

      formSetValues({...formValues,prod_name:prodNames[index].prod_name,
        prod_name_id:prodNames[index].prod_name_id});
        prodNameUpdateIndexSet(index)
    }
    const prodNameDisableRestore = async (prodNameId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/prod-name-disable-restore`,{prod_name_id:prodNameId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    const getProdNames = async ()=>{
          loadingListSet(true)
          await axios.post(`${API_URL}/api/get-prod-names`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingListSet(false)
            prodNamesSet(res.data.message)
          })
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
       {
    authInfo.role !='user'?(
    <>
         <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>prodNameEdit(props.rowData[0],props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>prodNameDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>prodNameDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}       
   </>):''
 }
          
        </div>)
      
      }
    
    const columns = [
        {name: "prod_name_id",options: { display: 'excluded' }},
        {name: "prod_name_status",options: { display: 'excluded' }},
        {name: "prod_name",label: "Area name",options: {filter: true,sort: true}},
        {name: "prod_name_created_isodt",label: "created date & time",
        options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{moment(tableMeta.rowData[3]).format(dateTimeFormat)}</p>)
          }
        }
      },
        {name: "prod_name_updated_isodt",label: "updated date & time",options: 
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
            <h2 className={classes.pageEntryLabel}> Product Name Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  style={{margin:'0px auto'}}> 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={formValues.prod_name} 
            label="product name" name="prod_name" variant="outlined" size="small" onChange={handleFromInput} />
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
      title={"Product List"}
      data={prodNames}
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
          createdProdName:state.createdProdNameReducer,
          updatedProdName:state.updatedProdNameReducer,
          prodNameDisableRestoreAction:state.prodNameDisableRestoreReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet, createdProdNameSet,updatedProdNameSet,disableRestoreProdNameSet })(ProdNamesManage);