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
import {pathSpliter,authInfo,checkAuthBranchWare,dateTimeFormat} from '../../lib/functions'
import {currentRouteSet,createdCategorySet,updatedCategorySet,disableRestoreSet,
       } from '../../actions/actions';
import moment from 'moment';



const ProdCategoriesManage = ({location,currentRouteSet,currentRoute,
  authInfo,createdCategory,updatedCategory,createdCategorySet,updatedCategorySet,
  disableRestoreCategory,disableRestoreSet})=>{
    const classes = useStyles();
    // Init properties
    const [successMsg, setSuccessMsg] = React.useState({
      open: false,
      vertical: 'top',
      horizontal: 'center',
      msg:''
    });
    // Init will be call.
  useEffect(()=>{
    currentRouteSet(pathSpliter(location.pathname,1));
    getCategories();
  },[])
   
  useEffect(()=>{
    if(disableRestoreCategory){
      if(checkAuthBranchWare(disableRestoreCategory.user_branch_id)){
      categories[disableRestoreCategory.index] = disableRestoreCategory.disableRestoreRow[0];
      setSuccessMsg({...successMsg,msg:`${disableRestoreCategory.msg}`,open:true });
      }
     }
  },[disableRestoreCategory]);

  useEffect(()=>{
    if(updatedCategory){
      if(checkAuthBranchWare(updatedCategory.user_branch_id)){
        categories[updatedCategory.index] = updatedCategory.updatedRow[0]
        setSuccessMsg({...successMsg,msg:`${updatedCategory.msg}`,open:true });
      }
     }
  },[updatedCategory]);
  
  useEffect(()=>{
    if(createdCategory){
      if(checkAuthBranchWare(createdCategory.user_branch_id)){
        categoriesSet(createdCategory.createdRow.concat(categories));
        setSuccessMsg({...successMsg,msg:`${createdCategory.msg}`,open:true });
      }
     }
  },[createdCategory]);
    // Init states start
    let [formValues,formSetValues] = useState({prod_cat_name:'',prod_cat_id:0,action:'create'});
    let [branches,branchesSet] = useState([]);
    let [categories,categoriesSet] = useState([]);
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [catUpdateIndex,catUpdateIndexSet] = useState('0')

    // Table Settings
    let categoryEdit = (prod_cat_id,index)=>{
       formValues.prod_cat_name =  categories[index].prod_cat_name
       formValues.action =  'update'

       formSetValues({...formValues,prod_cat_name:categories[index].prod_cat_name,
         prod_cat_id:categories[index].prod_cat_id});
         catUpdateIndexSet(index)

     }
   
     let categoryDisableRestore = async (catId,actionCond,index)=>{
         await axios.post(`${API_URL}/api/category-disable-restore`,{prod_cat_id:catId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
     }


const Options = (props)=>{
  return(<div style={{textAlign:'right'}}>
 {
    authInfo.role !='user'?(
    <>
     <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>categoryEdit(props.rowData[0],props.rowIndex)}/>
    {props.rowData[1]=='active'?(
          <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>categoryDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
    ):(
      <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>categoryDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
    )}           
   </>):''
 }
    
  </div>)

}

const columns = [
  {name: "prod_cat_id",options: { display: 'excluded' }},
  {name: "prod_cat_status",options: { display: 'excluded' }},
  {name: "prod_cat_name",label: "Product Category Name",options: {filter: true,sort: true}},
  {name: "prod_cat_created_isodt",label: "created date & time",
  options: 
  {filter: true,sort: true,
    customBodyRender:(value,tableMeta)=>{
      return(<p>{moment(tableMeta.rowData[3]).format(dateTimeFormat)}</p>)
    }
  }
},
  {name: "prod_cat_updated_isodt",label: "updated date & time",options: 
  {filter: true,sort: true,
    customBodyRender:(value,tableMeta)=>{
      return(<p>{ moment(tableMeta.rowData[4]).format(dateTimeFormat)}</p>) 
    }
  }},
  
  {name:"actions",options: {filter: false,sort: false,
    customBodyRender:(value,tableMeta)=>{
      return ( <Options   value={value} rowIndex={tableMeta.rowIndex}  rowData={tableMeta.rowData} 
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
    // Init states end
    // Methods script start
    const saveFormAction = async ()=>{
          if(formValues.prod_cat_name.trim()==''){
            swal({
              title:'Product category name is required',
              icon:'warning'
            })
          }else{
            formValues.catUpdateIndex = catUpdateIndex;
            formValues.prod_cat_name = formValues.prod_cat_name.trim();
            loadingSaveSet(true);
            await axios.post(`${API_URL}/api/category-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
              loadingSaveSet(false)
              if(res.data.error){
                swal({
                  title:res.data.message,
                  icon:'warning'
                });
                return false;
              }

              formSetValues({...formValues,prod_cat_name:'',action:'create'})
              })
            }
    }
    const handleFromInput = (e)=>{
      const {name,value} = e.target;
      formSetValues({...formValues,[name]:value}) 
    }
    
    const getCategories = async ()=>{
           loadingListSet(true)
          await axios.post(`${API_URL}/api/get-categories`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingListSet(false)
            categoriesSet(res.data.message)
          })

    }

   
    const { vertical, horizontal, open,msg } = successMsg;
    const handleClose = () => {
      setSuccessMsg({ ...successMsg, open: false });
    };


    createdCategorySet(null)
    updatedCategorySet(null)
    disableRestoreSet(null)
    // Methods script end
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
    <h2 className={classes.pageEntryLabel}>Product category Entry</h2>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={3}  style={{margin:'0px auto'}}> 
      <TextField  autoComplete='off'  className={classes.fullWidth}  value={formValues.prod_cat_name} 
      label="product category name" name="prod_cat_name" variant="outlined" size="small" onChange={handleFromInput} />
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
      title={"Categories List"}
      data={categories}
      columns={columns}
      options={options}
      adjustForCheckbox={false} 
      displaySelectAll={false}
      />
      </Paper>
      )
      
     } 
    </div>
    );
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
        updatedCategory:state.updatedCategoryReducer,
        createdCategory:state.createdCategoryReducer,
        disableRestoreCategory:state.disableRestoreCategoryReducer
      }
}
export default connect(mapStateToPops,{currentRouteSet,createdCategorySet,updatedCategorySet,
  disableRestoreSet})(ProdCategoriesManage);