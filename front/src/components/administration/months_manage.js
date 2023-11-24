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
import {currentRouteSet,createdMonthSet,updatedMonthSet,disableRestoreMonthSet} from '../../actions/actions';
import moment from 'moment';

const MonthsManage = ({location,currentRouteSet,authInfo,createdMonth,updatedMonth,monthDisableRestoreAction,
  createdMonthSet,updatedMonthSet,disableRestoreMonthSet})=>{
    const classes = useStyles();
    let [formValues,formSetValues] = useState({month_name:'',month_id:0,action:'create'});
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [months,monthsSet] = useState([])
    let [monthUpdateIndex,monthUpdateIndexSet] = useState('0')

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
    createdMonthSet(null)
    updatedMonthSet(null)
    disableRestoreMonthSet(null)
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        getMonths();
    },[]);

    useEffect(()=>{
      if(createdMonth){
        if(checkAuthBranchWare(createdMonth.user_branch_id)){ 
          monthsSet(createdMonth.createdRow.concat(months));
          setSuccessMsg({...successMsg,msg:`${createdMonth.msg}`,open:true });
          formSetValues({month_name:'',month_id:0,action:'create'})
        }
       }
    },[createdMonth])

    useEffect(()=>{
      if(updatedMonth){
        if(checkAuthBranchWare(updatedMonth.user_branch_id)){          
          months[updatedMonth.index] = updatedMonth.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedMonth.msg}`,open:true });
          formSetValues({month_name:'',month_id:0,action:'create'})
        }
       }
    },[updatedMonth])

    useEffect(()=>{
      if(monthDisableRestoreAction){
        if(checkAuthBranchWare(monthDisableRestoreAction.user_branch_id)){
        months[monthDisableRestoreAction.index] = monthDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${monthDisableRestoreAction.msg}`,open:true });
        }
       }
    },[monthDisableRestoreAction]);

    const handleFromInput = (e)=>{
        const {name,value} = e.target;
        formSetValues({...formValues,[name]:value}) 
      }
    const saveFormAction = async ()=>{
        if(formValues.month_name.trim()==''){
            swal({
              title:'Month name is required',
              icon:'warning'
            })
          }else{
            formValues.monthUpdateIndex = monthUpdateIndex
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/month-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)
            })
          }
    }

    const monthEdit = (row,index)=>{
      formValues.month_name =  months[index].month_name
      formValues.action =  'update'

      formSetValues({...formValues,month_name:months[index].month_name,
        month_id:months[index].month_id});
        monthUpdateIndexSet(index)
    }
    const monthDisableRestore = async (monthId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/month-disable-restore`,{month_id:monthId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    const getMonths = async ()=>{
          loadingListSet(true)
          await axios.post(`${API_URL}/api/get-months`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingListSet(false)
            monthsSet(res.data.message)
          })
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
           {
    authInfo.role !='user'?(
    <>
            <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>monthEdit(props.rowData[0],props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>monthDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>monthDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}        
   </>):''
 }
      
        </div>)
      
      }
    
    const columns = [
        {name: "month_id",options: { display: 'excluded' }},
        {name: "month_status",options: { display: 'excluded' }},
        {name: "month_name",label: "Month name",options: {filter: true,sort: true}},
        {name: "month_created_isodt",label: "created date & time",
        options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{moment(tableMeta.rowData[3]).format(dateTimeFormat)}</p>)
          }
        }
      },
        {name: "month_updated_isodt",label: "updated date & time",options: 
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
            <h2 className={classes.pageEntryLabel}>Months Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  style={{margin:'0px auto'}}> 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={formValues.month_name} 
            label="month name" name="month_name" variant="outlined" size="small" onChange={handleFromInput} />
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
      title={"Month List"}
      data={months}
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
          createdMonth:state.createdMonthReducer,
          updatedMonth:state.updatedMonthReducer,
          monthDisableRestoreAction:state.monthDisableRestoreReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdMonthSet,updatedMonthSet,disableRestoreMonthSet})(MonthsManage);