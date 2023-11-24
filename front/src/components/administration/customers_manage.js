import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import swal from 'sweetalert';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MUIDataTable from "mui-datatables";
import {API_URL} from '../../config.json';
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import CircularProgress from '@material-ui/core/CircularProgress';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {pathSpliter,checkAuthBranchWare} from '../../lib/functions'
import {currentRouteSet,createdCustomerSet,updatedCustomerSet,disableRestoreCustomerSet} from '../../actions/actions';

import { Modal } from 'react-responsive-modal';
import "react-responsive-modal/styles.css";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


const CustomersManage = ({location,currentRouteSet,authInfo,customerCodeAction,createdCustomer,updatedCustomer,customerDisableRestore,
  createdCustomerSet,updatedCustomerSet,disableRestoreCustomerSet,createdArea})=>{
    const classes = useStyles();
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [areaM,areaMSet] = useState(false)
    
    let [customerUpdateIndex,customerUpdateIndexSet] = useState('0')
    let [customer_id,customer_id_set] = useState('0')
    
    let [customers,customersSet] = useState([])
    let [areas,areasSet] = useState([])
    let [employees,employeesSet] = useState([])
    let [areaAction,areaActionSet] = useState(false)


    let [customer_name,customer_name_set] = useState('')
    let [customer_institution_name,customer_institution_name_set] = useState('')
    let [customer_address,customer_address_set] = useState('')
    let [customer_mobile_no,customer_mobile_no_set] = useState('')
    let [customer_phone_no,customer_phone_no_set] = useState('')
    let [customer_previous_due,customer_previous_due_set] = useState(0)
    let [customer_credit_limit,customer_credit_limit_set] = useState(0)


    let [customerCode,customerCodeSet] = useState('')
    let [action,action_set] = useState('create')
    let [customer_type,customer_type_set] = useState('retail')
    let [area_name,area_name_set] = useState('')

    let [wholesale,wholesaleSet] = useState(false)
    let [retail,retailSet] = useState(true)
    

   

    let [selectedArea,selectedAreaSet] = useState(null)
    let [selectedEmployee,selectedEmployeeSet] = useState(null)


    let customerNameRef = React.useRef(null)
    let customerInstitutionRef = React.useRef(null)
    let customerAddressRef = React.useRef(null)
    let customerAreaRef = React.useRef(null)
    let customerMobileRef = React.useRef(null)
    let customerPhoneRef = React.useRef(null)
    let customerPreviousDueRef = React.useRef(null)
    let customerCreditLimitRef = React.useRef(null)
    let customerActionRef = React.useRef(null)


    let saveAreaAction = async ()=>{
      if(area_name.trim()==''){
        swal({
          title:'Area name is required.',
          icon:'warning'
        });
        return false;
      }
      areaActionSet(true)
      await axios.post(`${API_URL}/api/area-cu`,{area_name:area_name.trim(),action:'create'},{headers:{'auth-token':authInfo.token}}).then(res=>{
        areaActionSet(false)
        if(res.data.error){
          swal({
            title:res.data.message,
            icon:'warning'
          });
          return false;
        }
        areaMSet(false)
        area_name_set('')
        areaActionSet(false)
     })
    }
    
    


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
       getAreas();
       getCustomers()
       getCustomerCode()
       getEmployees()

    },[]);


  
  
     const getCustomerCode = async ()=>{
      await axios.get(`${API_URL}/api/get-customer-code`,{headers:{'auth-token':authInfo.token}}).then(res=>{
           customerCodeSet(res.data.message)
      })
     }
     

     const getAreas = async ()=>{
        await axios.post(`${API_URL}/api/get-areas`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
           areasSet(res.data.message)
        })
       }

       const getEmployees = async ()=>{
        await axios.post(`${API_URL}/api/get-employees`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
           employeesSet(res.data.message)
        })
       }
       const getCustomers = async ()=>{
        loadingListSet(true)
        await axios.post(`${API_URL}/api/get-customers`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
          loadingListSet(false)
          customersSet(res.data.message)
        })
       }

      

       useEffect(()=>{
        if(customerCodeAction){
          if(action=='create'){         
           customerCodeSet(customerCodeAction.createdRow)
          }
         }
       },[customerCodeAction])



     // Customer  Real time start
     useEffect(()=>{
      if(createdCustomer){

        if(checkAuthBranchWare(createdCustomer.user_branch_id)){
          customersSet(createdCustomer.createdRow.concat(customers));
          setSuccessMsg({...successMsg,msg:`${createdCustomer.msg}`,open:true });
        }
       }
    },[createdCustomer]);

    

    useEffect(()=>{
      if(updatedCustomer){
        if(checkAuthBranchWare(updatedCustomer.user_branch_id)){          
          customers[updatedCustomer.index] = updatedCustomer.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedCustomer.msg}`,open:true });
          
        }
       }
    },[updatedCustomer])

  

    useEffect(()=>{
      if(customerDisableRestore){
        if(checkAuthBranchWare(customerDisableRestore.user_branch_id)){
        customers[customerDisableRestore.index] = customerDisableRestore.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${customerDisableRestore.msg}`,open:true });
        }
       }
    },[customerDisableRestore]);


    useEffect(()=>{
      if(createdArea){
        if(checkAuthBranchWare(createdArea.user_branch_id)){
          areasSet(createdArea.createdRow.concat(areas));
        }
       }
    },[createdArea]);
 
  
    createdCustomerSet(null)
    updatedCustomerSet(null)
    disableRestoreCustomerSet(null)

   
    const saveFormAction = async ()=>{
      
      if(customer_name.trim()==''){ 
        swal({
          title:'Customer name is required.',
          icon:'warning'
        })
      }else if(selectedArea == null){ 
        swal({
          title:'Customer Area is required.',
          icon:'warning'
        })
      }else{
            let payLoad = {
                customer_name,
                customer_institution_name,
                customer_address,
                customer_mobile_no, 
                customer_phone_no,
                customer_type,
                customer_previous_due: customer_previous_due =='' ? 0:customer_previous_due,
                customer_credit_limit: customer_credit_limit =='' ? 0:customer_credit_limit,
                customer_area_id:selectedArea != null ? selectedArea.area_id:null,
                employee_id:selectedEmployee != null ? selectedEmployee.employee_id:null,
                action,
                customerUpdateIndex,
                customer_id
            }
         
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/customer-cu`,payLoad,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)

            if(res.data.error){
              swal({
              title:`${res.data.message}`,
              icon:'warning'
            })
            return false
            }
            
            selectedAreaSet(null)

            customer_name_set('')
            customer_institution_name_set('')
            customer_mobile_no_set('')
            customer_address_set('')
            customer_mobile_no_set('')
            customer_phone_no_set('')
            customer_previous_due_set(0)
            customer_credit_limit_set(0)
            customer_type_set('retail')
            action_set('create')

            selectedEmployeeSet(null)
            getCustomerCode()


            
            })
          }
    }

    const customerEdit = (row,index)=>{
      let customer = customers[index];
      selectedAreaSet({area_name:customer.area_name,area_id:customer.customer_area_id}) 
      customerCodeSet(customer.customer_code)
      customer_name_set(customer.customer_name)
      customer_institution_name_set(customer.customer_institution_name)
      customer_address_set(customer.customer_address)
      customer_mobile_no_set(customer.customer_mobile_no)
      customer_phone_no_set(customer.customer_phone_no)
      customer_previous_due_set(customer.customer_previous_due)
      customer_credit_limit_set(customer.customer_credit_limit)
      selectedEmployeeSet({employee_id : customer.employee_id,employee_name: customer.employee_name})

      action_set('update')
      customer_id_set(customer.customer_id)
      customer_type_set(customer.customer_type)
      

      if(customer.customer_type=='retail'){
        retailSet(true)
      }else{
        retailSet(false)
      }

      if(customer.customer_type=='wholesale'){
        wholesaleSet(true)
      }else{
        wholesaleSet(false)
      }
      


      customerUpdateIndexSet(index)
    }
    const cusomerDisableRestore = async (customerId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/customer-disable-restore`,{customer_id:customerId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

  
    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}> 
         {
    authInfo.role !='user'?(
    <>
          <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>customerEdit(props.rowData,props.rowIndex)}/>
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
        {name: "customer_id",options: { display: 'excluded' }},
        {name: "customer_status",options: { display: 'excluded' }},
        {name:"SL",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
          return ( <p>{parseFloat(tableMeta.rowIndex)+1}</p> ); 
        }
        },headerStyle: {
          textAlign:'left'
        }},
        {name: "customer_code",label: "Customer code",options: {filter: true,sort: true}},
        {name: "customer_name",label: "Customer name",options: {filter: true,sort: true}},
        {name: "customer_type",label: "Customer Type",options: {filter: true,sort: true}},
        {name: "customer_institution_name",label: "institution name",options: {filter: true,sort: true}},
        {name: "customer_address",label: "address",options: {filter: true,sort: true}},
        {name: "area_name",label: "area",options: {filter: true,sort: true}},
        {name: "employee_name",label: "employee",options: {filter: true,sort: true}},
        {name: "customer_mobile_no",label: "mobile no",options: {filter: true,sort: true}},
        {name: "customer_phone_no",label: "phone no",options: {filter: true,sort: true}},
        {name: "customer_previous_due",label: "previous due",options: {filter: true,sort: true}},
        {name: "customer_credit_limit",label: "creadit limit",options: {filter: true,sort: true}},
     
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
            <h2 className={classes.pageEntryLabel}> Customer  Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={customerCode} 
            name="customer_code" style={{color:'#222'}} disabled variant="outlined" size="small"   
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={customer_name} 
            label="customer name" name="customer_name" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>customer_name_set(e.target.value)} 
            inputRef={customerNameRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    customerInstitutionRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={customer_institution_name} 
            label="Institution name" name="customer_institution_name" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>customer_institution_name_set(e.target.value)} 
            inputRef={customerInstitutionRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    customerAddressRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={customer_address} 
            label="Customer address" name="customer_address" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>customer_address_set(e.target.value)} 
            inputRef={customerAddressRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    customerAreaRef.current.focus()
                }
              }}
            />
            </Grid>

            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
            {
    authInfo.role !='user'?(
    <>
                     <a className={classes.plusLink} style={{cursor:'pointer'}} onClick={(e)=>areaMSet(true)} >+</a>  
       
   </>):''
 }
                <Autocomplete
                
                style={{ width: '100%' }}
                options={areas} 
                size="small"
               
                openOnFocus={true}
                getOptionLabel={(option) =>option.area_name}
               
                value={selectedArea}
                onChange={(event,selectedObj)=>{
                  selectedAreaSet(selectedObj)
                }}
                loading={areas.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={customerAreaRef}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            customerMobileRef.current.focus()
                        }
                      }}
                    {...params}
                    label="Choose a area"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {areas.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment} */}
                          </React.Fragment>
                        ),
                    }}
                    />
                )}
                />

                
            </Grid>


            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
  
                <Autocomplete
                
                style={{ width: '100%' }}
                options={employees} 
                size="small"
               
                openOnFocus={true}
                getOptionLabel={(option) =>option.employee_name}
               
                value={selectedEmployee}
                onChange={(event,selectedObj)=>{
                  selectedEmployeeSet(selectedObj)
                }}
                loading={employees.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                
                    {...params}
                    label="Choose a employee"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {areas.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment} */}
                          </React.Fragment>
                        ),
                    }}
                    />
                )}
                />

                
            </Grid>

            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={customer_mobile_no} 
            label="Mobile Number" name="customer_mobile_no" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>customer_mobile_no_set(e.target.value)} 
            inputRef={customerMobileRef}
            
            onKeyDown={event => {
                if (event.key === "Enter") {
                    customerPhoneRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={customer_phone_no} 
            label="Phone Number" name="customer_phone_no" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>customer_phone_no_set(e.target.value)}
            inputRef={customerPhoneRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    customerPreviousDueRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  type="number" autoComplete='off'  className={classes.fullWidth}  value={customer_previous_due} 
            label="Previous due" name="customer_previous_due" style={{color:'#222'}}  variant="outlined" size="small"   onChange={(e)=>customer_previous_due_set(e.target.value)}
            inputRef={customerPreviousDueRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    customerCreditLimitRef.current.focus()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField type="number"  autoComplete='off'  className={classes.fullWidth}  value={customer_credit_limit} 
            label="Credit limit" name="customer_credit_limit" style={{color:'#222'}}  variant="outlined" size="small" onChange={(e)=>customer_credit_limit_set(e.target.value)}
            inputRef={customerCreditLimitRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    customerActionRef.current.click()
                }
              }}
            />
            </Grid>
            <Grid item xs={12} sm={3} style={{textAlign: 'left'}}>
            <FormControl component="fieldset" > 
            <FormLabel component="legend" style={{textAlign:'left'}}>Customer Type</FormLabel>
            <RadioGroup row aria-label="customer_type" name="position"   defaultValue={customer_type} onChange={(e)=>{
              if(e.target.value=='retail'){
                retailSet(true)
              }else{
                retailSet(false)
              }

              if(e.target.value=='wholesale'){
                wholesaleSet(true)
              }else{
                wholesaleSet(false)
              }
              customer_type_set(e.target.value)
              }} >
              <FormControlLabel value="retail" control={<Radio color="primary"  />} checked={retail} label="Retail " />
              <FormControlLabel value="wholesale" control={<Radio color="primary" checked={wholesale} />}  label="WholeSale " />
            </RadioGroup>
            </FormControl>
            </Grid>
           </Grid>
           
           <Grid item xs={12}>
          <Button style={{marginTop: '25px'}}
            variant="contained"
            color="primary"
            size="small"
            buttonRef={customerActionRef}
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
      title={"Customer List"}
      data={customers}
      columns={columns}
      options={options}
      adjustForCheckbox={false} 
      displaySelectAll={false}
      />
      </Paper>
      )
      
     }





     {/* Area Add Modal */}
     <Modal
        open={areaM}
        onClose={() => areaMSet(false)}
        center
        style={{minWidth:'300px',minHeight:'500px'}}
 
      
      >
        <Grid item xs={12} sm={12}  > 
            <TextField  autoComplete='off' style={{marginTop:'10px'}}   className={classes.fullWidth}  value={area_name} onChange={(e)=>area_name_set(e.target.value)}
            label="Area Name"  type="text" name="area_name" variant="outlined" size="small"
            onKeyDown={(event)=>{
              if (event.key === "Enter") {
                saveAreaAction()
              }
              
            }}
            />
            

            <Button style={{marginTop: '25px'}}
            variant="contained"
            color="primary"
            size="small"
            disabled={areaAction?true:false}
            className={classes.button}
            startIcon={<SaveIcon/>}
            onClick={saveAreaAction}
        >
        Save
      </Button>
        </Grid>
      </Modal>


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
          customerCode:state.customerCodeReducer,
          createdCustomer:state.createdCustomerReducer,
          updatedCustomer:state.updatedCustomerReducer,
          customerDisableRestore:state.customerDisableRestoreReducer,
          createdArea: state.createdAreaReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdCustomerSet,updatedCustomerSet,disableRestoreCustomerSet})(CustomersManage);