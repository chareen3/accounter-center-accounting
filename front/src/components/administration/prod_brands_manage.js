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
import {currentRouteSet,createdBrandSet,
  updatedBrandSet,brandDisableRestoreSet} from '../../actions/actions';
import moment from 'moment';

const ProdBrandsManage = ({location,currentRouteSet,authInfo,createBrand,updateBrand,brandDisableRestoreAction,createdBrandSet,
  updatedBrandSet,brandDisableRestoreSet})=>{
    const classes = useStyles();
    let [formValues,formSetValues] = useState({prod_brand_name:'',prod_brand_id:0,action:'create'});
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [brands,brandsSet] = useState([])
    let [brandUpdateIndex,brandUpdateIndexSet] = useState('0')

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

    createdBrandSet(null)
    updatedBrandSet(null)
    brandDisableRestoreSet(null)
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        getBrands();
    },[]);

    useEffect(()=>{
      if(createBrand){
        if(checkAuthBranchWare(createBrand.user_branch_id)){          
          brandsSet(createBrand.createdRow.concat(brands));
          setSuccessMsg({...successMsg,msg:`${createBrand.msg}`,open:true });
          formSetValues({prod_brand_name:'',prod_brand_id:0,action:'create'})
        }
       }
    },[createBrand])

    useEffect(()=>{
      if(updateBrand){
        if(checkAuthBranchWare(updateBrand.user_branch_id)){          
          brands[updateBrand.index] = updateBrand.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updateBrand.msg}`,open:true });
          formSetValues({prod_brand_name:'',prod_brand_id:0,action:'create'})
        }
       }
    },[updateBrand])

    useEffect(()=>{
      if(brandDisableRestoreAction){
        if(checkAuthBranchWare(brandDisableRestoreAction.user_branch_id)){
        brands[brandDisableRestoreAction.index] = brandDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${brandDisableRestoreAction.msg}`,open:true });
        }
       }
    },[brandDisableRestoreAction]);

    const handleFromInput = (e)=>{
        const {name,value} = e.target;
        formSetValues({...formValues,[name]:value}) 
      }
    const saveFormAction = async ()=>{
      if(formValues.prod_brand_name.trim()==''){
        swal({
          title:'Product brand name is required',
          icon:'warning'
        })
      }else{
        formValues.brandUpdateIndex = brandUpdateIndex
        loadingSaveSet(true)
        await axios.post(`${API_URL}/api/brand-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
         loadingSaveSet(false)
        })
      }
    }

    const brandEdit = (row,index)=>{
      formValues.prod_brand_name =  brands[index].prod_brand_name
      formValues.action =  'update'

      formSetValues({...formValues,prod_brand_name:brands[index].prod_brand_name,
        prod_brand_id:brands[index].prod_brand_id});
        brandUpdateIndexSet(index)
    }
    const brandDisableRestore = async (brandId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/brand-disable-restore`,{prod_brand_id:brandId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    const getBrands = async ()=>{
          loadingListSet(true)
          await axios.post(`${API_URL}/api/get-brands`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingListSet(false)
            brandsSet(res.data.message)
          })
    }


    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
      
          <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>brandEdit(props.rowData[0],props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>brandDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>brandDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}
        </div>)
      
      }
    
    const columns = [
        {name: "prod_brand_id",options: { display: 'excluded' }},
        {name: "prod_brand_status",options: { display: 'excluded' }},
        {name: "prod_brand_name",label: "Product brand name",options: {filter: true,sort: true}},
        {name: "prod_brand_created_isodt",label: "created date & time",
        options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{moment(tableMeta.rowData[3]).format(dateTimeFormat)}</p>)
          }
        }
      },
        {name: "prod_brand_updated_isodt",label: "updated date & time",options: 
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
            <h2 className={classes.pageEntryLabel}>Product brand Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  style={{margin:'0px auto'}}> 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={formValues.prod_brand_name} 
            label="product brand name" name="prod_brand_name" variant="outlined" size="small" onChange={handleFromInput} />
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
      title={"Brands List"}
      data={brands}
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
          createBrand:state.createBrandReducer,
          updateBrand:state.updateBrandReducer,
          brandDisableRestoreAction:state.brandDisableRestoreReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdBrandSet,
    updatedBrandSet,brandDisableRestoreSet})(ProdBrandsManage);