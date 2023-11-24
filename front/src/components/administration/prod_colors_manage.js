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
import {currentRouteSet,createdColorSet,updatedColorSet,disableRestoreColorSet} from '../../actions/actions';
import moment from 'moment';

const ProdColorsManage = ({location,currentRouteSet,authInfo,createdColor,updatedColor,colorDisableRestoreAction,
  createdColorSet,updatedColorSet,disableRestoreColorSet})=>{
    const classes = useStyles();
    let [formValues,formSetValues] = useState({prod_color_name:'',prod_color_id:0,action:'create'});
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [colors,colorsSet] = useState([])
    let [colorUpdateIndex,colorUpdateIndexSet] = useState('0')

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
    createdColorSet(null)
    updatedColorSet(null)
    disableRestoreColorSet(null)
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        getColors();
    },[]);

    useEffect(()=>{
      if(createdColor){
        if(checkAuthBranchWare(createdColor.user_branch_id)){          
          colorsSet(createdColor.createdRow.concat(colors));
          setSuccessMsg({...successMsg,msg:`${createdColor.msg}`,open:true });
          formSetValues({prod_color_name:'',prod_color_id:0,action:'create'})
        }
       }
    },[createdColor])

    useEffect(()=>{
      if(updatedColor){
        if(checkAuthBranchWare(updatedColor.user_branch_id)){          
          colors[updatedColor.index] = updatedColor.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedColor.msg}`,open:true });
          formSetValues({prod_color_name:'',prod_color_id:0,action:'create'})
        }
       }
    },[updatedColor])

    useEffect(()=>{
      if(colorDisableRestoreAction){
        if(checkAuthBranchWare(colorDisableRestoreAction.user_branch_id)){
        colors[colorDisableRestoreAction.index] = colorDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${colorDisableRestoreAction.msg}`,open:true });
        }
       }
    },[colorDisableRestoreAction]);

    const handleFromInput = (e)=>{
        const {name,value} = e.target;
        formSetValues({...formValues,[name]:value}) 
      }
    const saveFormAction = async ()=>{
        if(formValues.prod_color_name.trim()==''){
            swal({
              title:'Product color name is required',
              icon:'warning'
            })
          }else{
            formValues.colorUpdateIndex = colorUpdateIndex
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/color-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)
            })
          }
    }

    const colorEdit = (row,index)=>{
      formValues.prod_color_name =  colors[index].prod_color_name
      formValues.action =  'update'

      formSetValues({...formValues,prod_color_name:colors[index].prod_color_name,
        prod_color_id:colors[index].prod_color_id});
        colorUpdateIndexSet(index)
    }
    const colorDisableRestore = async (colorId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/color-disable-restore`,{prod_color_id:colorId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    const getColors = async ()=>{
          loadingListSet(true)
          await axios.post(`${API_URL}/api/get-colors`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingListSet(false)
            colorsSet(res.data.message)
          })
    }


    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
      
          <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>colorEdit(props.rowData[0],props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>colorDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>colorDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}
        </div>)
      
      }
    
    const columns = [
        {name: "prod_color_id",options: { display: 'excluded' }},
        {name: "prod_color_status",options: { display: 'excluded' }},
        {name: "prod_color_name",label: "Product color name",options: {filter: true,sort: true}},
        {name: "prod_color_created_isodt",label: "created date & time",
        options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{moment(tableMeta.rowData[3]).format(dateTimeFormat)}</p>)
          }
        }
      },
        {name: "prod_color_updated_isodt",label: "updated date & time",options: 
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
            <h2 className={classes.pageEntryLabel}>Product color Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  style={{margin:'0px auto'}}> 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={formValues.prod_color_name} 
            label="product color name" name="prod_color_name" variant="outlined" size="small" onChange={handleFromInput} />
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
      title={"Color List"}
      data={colors}
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
          createdColor:state.createdColorReducer,
          updatedColor:state.updatedColorReducer,
          colorDisableRestoreAction:state.colorDisableRestoreReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdColorSet,updatedColorSet,disableRestoreColorSet})(ProdColorsManage);