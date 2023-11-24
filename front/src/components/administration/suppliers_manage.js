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
import {pathSpliter,checkAuthBranchWare} from '../../lib/functions'
import {currentRouteSet,createdSupplierSet,updatedSupplierSet,disableRestoreSupplierSet} from '../../actions/actions';


const SuppliersManage = ({location,currentRouteSet,authInfo,supplierCodeAction,createdSupplier,updatedSupplier,supplierDisableRestore,
  createdSupplierSet,updatedSupplierSet,disableRestoreSupplierSet})=>{
    const classes = useStyles();
    let [formValues,formSetValues] = useState({action:'create',supplier_id:0,supplier_name:'',supplier_institution_name:'',supplier_address:'',supplier_area_id:0,supplier_mobile_no:'',supplier_phone_no:'',supplier_previous_due:'',supplier_credit_limit:''});
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [supplierUpdateIndex,supplierUpdateIndexSet] = useState('0')

    let [suppliers,suppliersSet] = useState([])
    let [supplierCode,supplierCodeSet] = useState('')
   



    let supplierNameRef = React.useRef(null)
    let supplierInstitutionRef = React.useRef(null)
    let supplierAddressRef = React.useRef(null)
    let supplierAreaRef = React.useRef(null)
    let supplierMobileRef = React.useRef(null)
    let supplierPhoneRef = React.useRef(null)
    let supplierPreviousDueRef = React.useRef(null)
    let supplierActionRef = React.useRef(null)
    
    


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

    useEffect(()=>{
       currentRouteSet(pathSpliter(location.pathname,1));
       getSuppliers()
       getSupplierCode()

    },[]);


  
  
     const getSupplierCode = async ()=>{
      await axios.get(`${API_URL}/api/get-supplier-code`,{headers:{'auth-token':authInfo.token}}).then(res=>{
        supplierCodeSet(res.data.message)
      })
     }
     

     
       const getSuppliers = async ()=>{
        loadingListSet(true)
        await axios.post(`${API_URL}/api/get-suppliers`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
          loadingListSet(false)
          suppliersSet(res.data.message)
        })
       }

      

       useEffect(()=>{
        if(supplierCodeAction){
          if(formValues.action=='create'){         
           supplierCodeSet(supplierCodeAction.createdRow)
          }
         }
       },[supplierCodeAction])



     // supplier  Real time start
     useEffect(()=>{
      if(createdSupplier){
       

        if(checkAuthBranchWare(createdSupplier.user_branch_id)){
          suppliersSet(createdSupplier.createdRow.concat(suppliers));
          setSuccessMsg({...successMsg,msg:`${createdSupplier.msg}`,open:true });
        }
       }
    },[createdSupplier]);

    

    useEffect(()=>{
      if(updatedSupplier){
        if(checkAuthBranchWare(updatedSupplier.user_branch_id)){          
          suppliers[updatedSupplier.index] = updatedSupplier.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedSupplier.msg}`,open:true });
        }
       }
    },[updatedSupplier])

  

    useEffect(()=>{
      if(supplierDisableRestore){
        if(checkAuthBranchWare(supplierDisableRestore.user_branch_id)){
        suppliers[supplierDisableRestore.index] = supplierDisableRestore.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${supplierDisableRestore.msg}`,open:true });
        }
       }
    },[supplierDisableRestore]);
 
  
    createdSupplierSet(null)
    updatedSupplierSet(null)
    disableRestoreSupplierSet(null)

    const handleFromInput = (e)=>{
        const {name,value} = e.target;
        formSetValues({...formValues,[name]:value}) 
      }
    const saveFormAction = async ()=>{
      
      if(formValues.supplier_name.trim()==''){ 
        swal({
          title:'Supplier name is required.',
          icon:'warning'
        })
      }else{
            formValues.supplierUpdateIndex = supplierUpdateIndex
            formValues.supplierCode = supplierCode
            if(formValues.supplier_previous_due==''){
              formValues.supplier_previous_due = 0
            }
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/supplier-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)

            if(res.data.error){
              swal({
              title:`${res.data.message}`,
              icon:'warning'
            })
            return false
            }
            
            formSetValues({...formValues,supplier_id:0,supplier_name:'',supplier_institution_name:'',supplier_address:'',supplier_area_id:0,supplier_mobile_no:'',supplier_phone_no:'',supplier_previous_due:'',supplier_credit_limit:'',action:'create'})
            getSupplierCode()
            
            })
          }
    }

    const supplierEdit = (row,index)=>{
      supplierCodeSet(suppliers[index].supplier_code)
      formSetValues({...formSetValues,supplier_id:suppliers[index].supplier_id,supplier_name:suppliers[index].supplier_name,
        supplier_institution_name:suppliers[index].supplier_institution_name,supplier_address:suppliers[index].supplier_address,
        supplier_mobile_no:suppliers[index].supplier_mobile_no,supplier_phone_no:suppliers[index].supplier_phone_no,
        supplier_previous_due:suppliers[index].supplier_previous_due,supplier_credit_limit:suppliers[index].supplier_credit_limit,action:'update'});       

        supplierUpdateIndexSet(index)
    }
    const cusomerDisableRestore = async (supplierId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/supplier-disable-restore`,{supplier_id:supplierId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

  
    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}> 
         {
    authInfo.role !='user'?(
    <>
              <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>supplierEdit(props.rowData,props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>cusomerDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>cusomerDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}   
   </>):''
 }
         
        </div>)
      
      }
    
    const columns = [
        {name: "supplier_id",options: { display: 'excluded' }},
        {name: "supplier_status",options: { display: 'excluded' }},
        {name:"SL",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
          return ( <p>{parseFloat(tableMeta.rowIndex)+1}</p> ); 
        }
        },headerStyle: {
          textAlign:'left'
        }},
        {name: "supplier_code",label: "supplier code",options: {filter: true,sort: true}},
        {name: "supplier_name",label: "supplier name",options: {filter: true,sort: true}},
        {name: "supplier_institution_name",label: "institution name",options: {filter: true,sort: true}},
        {name: "supplier_address",label: "address",options: {filter: true,sort: true}},
        {name: "area_name",label: "area",options: {filter: true,sort: true}},
        {name: "supplier_mobile_no",label: "mobile no",options: {filter: true,sort: true}},
        {name: "supplier_phone_no",label: "phone no",options: {filter: true,sort: true}},
        {name: "supplier_previous_due",label: "previous due",options: {filter: true,sort: true}},
     
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
            <h2 className={classes.pageEntryLabel}>Supplier Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={supplierCode} 
            name="supplier_code" style={{color:'#222'}} disabled variant="outlined" size="small"  onChange={handleFromInput} 
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={formValues.supplier_name} 
            label="supplier name" name="supplier_name" style={{color:'#222'}}  variant="outlined" size="small"  onChange={handleFromInput} 
            inputRef={supplierNameRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    supplierInstitutionRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={formValues.supplier_institution_name} 
            label="Institution name" name="supplier_institution_name" style={{color:'#222'}}  variant="outlined" size="small"  onChange={handleFromInput} 
            inputRef={supplierInstitutionRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    supplierAddressRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={formValues.supplier_address} 
            label="supplier address" name="supplier_address" style={{color:'#222'}}  variant="outlined" size="small"  onChange={handleFromInput} 
            inputRef={supplierAddressRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    supplierMobileRef.current.focus()
                }
              }}
            />
            </Grid>

           

            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={formValues.supplier_mobile_no} 
            label="Mobile Number" name="supplier_mobile_no" style={{color:'#222'}}  variant="outlined" size="small"  onChange={handleFromInput} 
            inputRef={supplierMobileRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    supplierPhoneRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={formValues.supplier_phone_no} 
            label="Phone Number" name="supplier_phone_no" style={{color:'#222'}}  variant="outlined" size="small"  onChange={handleFromInput} 
            inputRef={supplierPhoneRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    supplierPreviousDueRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField type="number"  autoComplete='off'  className={classes.fullWidth}  value={formValues.supplier_previous_due} 
            label="Previous due" name="supplier_previous_due" style={{color:'#222'}}  variant="outlined" size="small"  onChange={handleFromInput} 
            inputRef={supplierPreviousDueRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                  supplierActionRef.current.click()
                }
              }}
            />
            </Grid>
           
           </Grid>
           
           <Grid item xs={12}>
          <Button style={{marginTop: '25px'}}
            variant="contained"
            color="primary"
            size="small"
            buttonRef={supplierActionRef}
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
      title={"Supplier List"}
      data={suppliers}
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
        textAlign:'left'
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
      },
      plusLinkDiv:{
            position:'relative'  
      },
      plusLink:{
        margin: 0,
        padding: 0,
        marginTop: '-21px',
        fontSize: '29px',
        height: '21px',
        textAlign: 'right',
        position: 'absolute',
        right: 0,
        color: '#3e8d54'
      }
  }));
  
  const mapStateToPops = (state)=>{
        return {
          currentRoute:state.currentRouteReducer,
          authInfo:state.authInfoReducer,
          supplierCode:state.supplierCodeReducer,
          createdSupplier:state.createdSupplierReducer,
          updatedSupplier:state.updatedSupplierReducer,
          supplierDisableRestore:state.supplierDisableRestoreReducer,
        }
  }

  export default connect(mapStateToPops,{currentRouteSet,createdSupplierSet,updatedSupplierSet,disableRestoreSupplierSet})(SuppliersManage);