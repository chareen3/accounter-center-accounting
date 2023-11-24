import React,{ useState,useEffect} from 'react';
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
import {pathSpliter,checkAuthBranchWare,dateTimeFormat,checkIntNum} from '../../lib/functions'
import {currentRouteSet,createdEmployeeSet,updatedEmployeeSet,employeeDisableRestoreSet} from '../../actions/actions';
const ProductsManage = ({location,currentRouteSet,authInfo,createdEmployeeSet,updatedEmployeeSet,employeeDisableRestoreSet,
    createdDesignation,createdDepartment,createdEmployee,updatedEmployee,employeeDisableRestoreAction,employeeCodeGet})=>{
    const classes = useStyles();
    let [formValues,formSetValues] = useState({employee_id:0,employee_name:'',employee_designation_id:null,employee_department_id:null,employee_gender_id:null,employee_marital_id:null,
    employee_joining_date:'',employee_salary:0,employee_father_name:'',employee_mother_name:'',employee_date_of_birth:'',
    employee_present_address:'',employee_permanent_address:'',employee_contact_no:'',employee_email:'',action:'create'});
    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [employeeUpdateIndex,employeeUpdateIndexSet] = useState('0')
    let [employeeCode,employeeCodeSet] =  useState('')


    let [genders,gendersSet] = useState([{gender_id:'Male',gender_name:'Male'},{gender_id:'F-male',gender_name:'F-male'}])
    let [maritals,maritalsSet] = useState([{marital_id:'Marrited',marital_name:'Marrited'},{marital_id:'Unmarrited',marital_name:'Unmarrited'}])
    let [employees,employeesSet] = useState([])
    let [designations,designationsSet] = useState([])
    let [departments,departmentsSet] = useState([])
    
    let [selectedDesignation,selectedDesignationSet] = useState({})
    let [selectedDepartment,selectedDepartmentSet] = useState({})
    let [selectedGender,selectedGenderSet] = useState({})
    let [selectedMarital,selectedMaritalSet] = useState({})
    
        
   

    let codeRef = React.useRef(null)
    let employeeNameRef = React.useRef(null)
    let employeeJoiningDateRef = React.useRef(null)
    let employeeSalaryRef = React.useRef(null)
    let employeeDesinationRef = React.useRef(null)
    let materialRef = React.useRef(null)
    
    
    let genderRef = React.useRef(null)
    let designationRef = React.useRef(null)
    let departmentRef = React.useRef(null)
    let saveFormActionRef = React.useRef(null)

    let employeeFatherNameRef = React.useRef(null)
    let employeeMotherNameRef = React.useRef(null)
    let employeeDateOfBirthRef = React.useRef(null)

    let employeePresentAddressRef = React.useRef(null)
    let employeePermanentAddressRef = React.useRef(null)
    let employeeContactNoRef = React.useRef(null)
    let employeeEmailRef = React.useRef(null)

   
        
    updatedEmployeeSet(null)
    employeeDisableRestoreSet(null) 
    createdEmployeeSet(null)

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
        getEmployeeCode();
        currentRouteSet(pathSpliter(location.pathname,1));
        getDesignations();
        getDepartments();
        getEmployees();
       
    },[]);
    const getEmployees = async ()=>{
      await axios.post(`${API_URL}/api/get-employees`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
        employeesSet(res.data.message)
      })
     }
    const getDesignations = async ()=>{
     await axios.post(`${API_URL}/api/get-designations`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
       designationsSet(res.data.message)
     })
    }
    const getDepartments = async ()=>{
     await axios.post(`${API_URL}/api/get-departments`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
       departmentsSet(res.data.message)
     })
    }
    
     const getEmployeeCode = async ()=>{
      await axios.get(`${API_URL}/api/get-employee-code`,{headers:{'auth-token':authInfo.token}}).then(res=>{
        employeeCodeSet(res.data.message)
      })
     }
     
     /// Employee code  Real time start
     useEffect(()=>{
       if(formValues.action=='create' && employeeCodeGet){
        employeeCodeSet(employeeCodeGet.createdRow)
       }
    },[employeeCodeGet]);
     /// designation  Real time start
     useEffect(()=>{
      if(createdDesignation){
        if(checkAuthBranchWare(createdDesignation.user_branch_id)){
            designationsSet(createdDesignation.createdRow.concat(designations));
        }
       }
    },[createdDesignation]);
    /// Department  Real time start
    useEffect(()=>{
      if(createdDepartment){
        if(checkAuthBranchWare(createdDepartment.user_branch_id)){
            departmentsSet[createdDepartment.index] = createdDepartment.updatedRow[0]
        }
       }
    },[createdDepartment]);
    
    // Employees  real time end
    useEffect(()=>{
      if(createdEmployee){
        if(checkAuthBranchWare(createdEmployee.user_branch_id)){          
          employeesSet(createdEmployee.createdRow.concat(employees));
          setSuccessMsg({...successMsg,msg:`${createdEmployee.msg}`,open:true });
        }
       }
    },[createdEmployee])

    useEffect(()=>{
      if(updatedEmployee){
        if(checkAuthBranchWare(updatedEmployee.user_branch_id)){          
          employees[updatedEmployee.index] = updatedEmployee.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedEmployee.msg}`,open:true });
        }
       }
    },[updatedEmployee])

    useEffect(()=>{
      if(employeeDisableRestoreAction){
        if(checkAuthBranchWare(employeeDisableRestoreAction.user_branch_id)){
        employees[employeeDisableRestoreAction.index] = employeeDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${employeeDisableRestoreAction.msg}`,open:true });
        }
       }
    },[employeeDisableRestoreAction]);
    

    const handleFromInput = (e)=>{
        const {name,value} = e.target;
        formSetValues({...formValues,[name]:value}) 
      }
    const saveFormAction = async ()=>{

      if(formValues.employee_salary==''){
        formValues.employee_salary = 0
      }
     
        if(formValues.employee_name.trim()==''){ 
            swal({
              title:'Employee name is required',
              icon:'warning'
            })
          }else if(checkIntNum(formValues.employee_designation_id)){
            swal({
              title:'Select a Desination',
              icon:'warning'
            })
          }else if(checkIntNum(formValues.employee_department_id)){
            swal({
              title:'Select a department',
              icon:'warning'
            })
          }else if(formValues.employee_gender_id==null){
            swal({
              title:'Select a Gender',
              icon:'warning'
            })
          }else if(formValues.employee_marital_id==null){
            swal({
              title:'Select a Marital',
              icon:'warning'
            })
          }else  if(formValues.employee_salary==''){ 
            swal({
              title:'Employee salary is required',
              icon:'warning'
            })
          }else{
            formValues.employeeUpdateIndex = employeeUpdateIndex
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/employee-cu`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)

            
          selectedDesignationSet({})
          selectedDepartmentSet({})
          selectedGenderSet({})
          selectedMaritalSet({})

            formSetValues({employee_id:0,employee_name:'',employee_designation_id:null,employee_department_id:null,employee_gender_id:null,employee_marital_id:null,
            employee_joining_date:'',employee_salary:0,employee_father_name:'',employee_mother_name:'',employee_date_of_birth:'',
            employee_present_address:'',employee_permanent_address:'',employee_contact_no:'',employee_email:'',action:'create'})
            
            })
         }
    }

    const employeeEdit = (row,index)=>{
      selectedDesignationSet({designation_id:employees[index].employee_designation_id,designation_name:employees[index].designation_name})
      selectedDepartmentSet({department_id:employees[index].employee_department_id,department_name:employees[index].department_name})
      selectedGenderSet({gender_id:employees[index].employee_gender_id,gender_name:employees[index].employee_gender_id})
      selectedMaritalSet({marital_id:employees[index].employee_marital_id,marital_name:employees[index].employee_marital_id})
       
      formSetValues({...formValues,employee_id:employees[index].employee_id,employee_name:employees[index].employee_name,employee_designation_id:employees[index].employee_designation_id,employee_department_id:employees[index].employee_department_id,employee_gender_id:employees[index].employee_gender_id,employee_marital_id:employees[index].employee_marital_id,
      employee_joining_date:employees[index].employee_joining_date,employee_salary:employees[index].employee_salary,employee_father_name:employees[index].employee_father_name,employee_mother_name:employees[index].employee_mother_name,employee_date_of_birth:employees[index].employee_date_of_birth,
      employee_present_address:employees[index].employee_present_address,employee_permanent_address:employees[index].employee_permanent_address,employee_contact_no:employees[index].employee_contact_no,employee_email:employees[index].employee_email,action:'update'})
      employeeCodeSet(employees[index].employee_code)
      employeeUpdateIndexSet(index)
    }
    const employeeDisableRestore = async (employeeId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/employee-disable-restore`,{employee_id:employeeId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
       {
    authInfo.role !='user'?(
    <>
       <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>employeeEdit(props.rowData,props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>employeeDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>employeeDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}         
   </>):''
 }
          
        </div>)
      
      }
    
    const columns = [
        {name: "employee_id",options: { display: 'excluded' }},
        {name: "employee_status",options: { display: 'excluded' }},
        {name:"SL",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
          return ( <p>{parseFloat(tableMeta.rowIndex)+1}</p> ); 
        }
        },headerStyle: {
          textAlign:'left'
        }},
        {name: "employee_code",label: "Employee code",options: {filter: true,sort: true}},
        {name: "employee_name",label: "Employee name",options: {filter: true,sort: true}},
        {name: "department_name",label: "Department",options: {filter: true,sort: true}},
        {name: "designation_name",label: "Designation ",options: {filter: true,sort: true}},
        {name: "employee_contact_no",label: "Contact no",options: {filter: true,sort: true}},
        {name: "employee_email",label: "E-mail",options: {filter: true,sort: true}},
        {name: "employee_joining_date",label: "joining date",options: {filter: true,sort: true}},
        {name: "employee_salary",label: "Salary",options: {filter: true,sort: true}},
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
            <h2 className={classes.pageEntryLabel}> Employee Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={employeeCode} 
            label="employee code" name="employee_code" style={{color:'#222'}} disabled variant="outlined" size="small"  onChange={handleFromInput} 
            inputRef={codeRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    // catRef.current.focus()
                }
              }}
            />
            </Grid>

            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={employeeNameRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                        employeeDesinationRef.current.focus()
                      }
                    }}  className={classes.fullWidth}  value={formValues.employee_name} 
            label="employee name" name="employee_name" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 

                <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
                    {/* <a className={classes.plusLink} href="/administration/designations-manage" target="_blank">+</a>   */}
                <Autocomplete
                autoHighlight
                style={{ width: '100%' }}
                options={designations} 
                size="small"
                classes={{
                    option: classes.option,
                }}
                openOnFocus={true}
                getOptionLabel={(option) => (option.designation_name ? option.designation_name : "")}
               
                value={selectedDesignation}
                onChange={(event,selectedObj)=>{
                  selectedObj?(formSetValues({...formValues,employee_designation_id:selectedObj.designation_id})):
                  (formSetValues({...formValues,employee_designation_id:null}))
                  selectedDesignationSet(selectedObj)
                }}
                loading={designations.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={employeeDesinationRef}
                  
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            departmentRef.current.focus()
                        }
                      }}
                    {...params}
                    label="Choose a designation"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {designations.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                    }}
                    />
                )}
                />

                
            </Grid>

                       {/* Departments */}
            <Grid item xs={12} sm={3} className={classes.plusLinkDiv}>
                    {/* <a className={classes.plusLink} href="/administration/departments-manage" target="_blank">+</a>  */}
                <Autocomplete
                style={{ width: '100%' }}
                options={departments} 
                size="small"
                classes={{
                    option: classes.option,
                }}
                value={selectedDepartment}
                openOnFocus={true}
                autoHighlight
                getOptionLabel={(option) => (option.department_name?option.department_name:'')}
                getOptionSelected={(option, value) => {
                    return option.department_id === value.department_id;
                }}
                onChange={(event,selectedObj)=>{
                     selectedObj?(formSetValues({...formValues,employee_department_id:selectedObj.department_id})):
                     (formSetValues({...formValues,employee_department_id:null}))
                     selectedDepartmentSet(selectedObj)
                }}
                loading={departments.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={departmentRef}
                    onKeyDown={event => {
                      if (event.key === "Enter") {
                        genderRef.current.focus()
                      }
                    }}
                    {...params}
                    label="Choose a department"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {departments.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                    }}
                    />
                )}
                />
            </Grid>
           
            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
                    {/* <a className={classes.plusLink} href="/administration/designations-manage" target="_blank">+</a>   */}
                <Autocomplete
                autoHighlight
                style={{ width: '100%' }}
                options={genders} 
                size="small"
                classes={{
                    option: classes.option,
                }}
                openOnFocus={true}
                getOptionLabel={(option) => (option.gender_name ? option.gender_name : "")}
                value={selectedGender}
                onChange={(event,selectedObj)=>{
                  selectedObj?(formSetValues({...formValues,employee_gender_id:selectedObj.gender_id})):
                  (formSetValues({...formValues,employee_gender_id:null}))
                  selectedGenderSet(selectedObj)
                }}
                loading={genders.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={genderRef}
                  
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            materialRef.current.focus()
                        }
                      }}
                    {...params}
                    label="Choose a gender"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {genders.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                    }}
                    />
                )}
                />

                
            </Grid>
            <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
                    {/* <a className={classes.plusLink} href="/administration/designations-manage" target="_blank">+</a>   */}
                <Autocomplete
                autoHighlight
                style={{ width: '100%' }}
                options={maritals} 
                size="small"
                classes={{
                    option: classes.option,
                }}
                openOnFocus={true}
                getOptionLabel={(option) => (option.marital_name ? option.marital_name : "")}
               
                value={selectedMarital}
                onChange={(event,selectedObj)=>{
                  selectedObj?(formSetValues({...formValues,employee_marital_id:selectedObj.marital_id})):
                  (formSetValues({...formValues,employee_marital_id:null}))
                  selectedMaritalSet(selectedObj)
                }}
                loading={maritals.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={materialRef}
                  
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            employeeJoiningDateRef.current.focus()
                        }
                      }}
                    {...params}
                    label="Choose a marital"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {maritals.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                    }}
                    />
                )}
                />

                
            </Grid>
            
         




            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={employeeJoiningDateRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                        employeeSalaryRef.current.focus() 
                      }
                    }}  className={classes.fullWidth}  value={formValues.employee_joining_date} 
            label="employee joining date" name="employee_joining_date" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 

            <Grid item xs={12} sm={3}> 
            <TextField type="number" autoComplete='off'  inputRef={employeeSalaryRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                        employeeFatherNameRef.current.focus()
                      }
                    }}  className={classes.fullWidth}    value={formValues.employee_salary} 
            label="salary" name="employee_salary" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 

            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={employeeFatherNameRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                        employeeMotherNameRef.current.focus()
                      }
                    }}  className={classes.fullWidth}  value={formValues.employee_father_name} 
            label="father name" name="employee_father_name" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 

            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={employeeMotherNameRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                        employeeDateOfBirthRef.current.focus()
                      }
                    }}  className={classes.fullWidth}  value={formValues.employee_mother_name} 
            label="mother name" name="employee_mother_name" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 

            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={employeeDateOfBirthRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                        employeePresentAddressRef.current.focus() 
                      }
                    }}  className={classes.fullWidth}  value={formValues.employee_date_of_birth} 
            label="date of birth" name="employee_date_of_birth" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 

            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={employeePresentAddressRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                        employeePermanentAddressRef.current.focus() 
                      }
                    }}  className={classes.fullWidth}  value={formValues.employee_present_address} 
            label="employee present address" name="employee_present_address" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 
           
            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={employeePermanentAddressRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                        employeeContactNoRef.current.focus() 
                      }
                    }}  className={classes.fullWidth}  value={formValues.employee_permanent_address} 
            label="employee permanent address" name="employee_permanent_address" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid> 

            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={employeeContactNoRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                        employeeEmailRef.current.focus() 
                      }
                    }}  className={classes.fullWidth}  value={formValues.employee_contact_no} 
            label="contact no" name="employee_contact_no" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid>

             <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off'  inputRef={employeeEmailRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                        saveFormActionRef.current.click()
                      }
                    }}  className={classes.fullWidth}  value={formValues.employee_email} 
            label="employee email" name="employee_email" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid>  
           
         
           </Grid>
           <Grid item xs={12}>
          <Button style={{marginTop: '25px'}}
            buttonRef={saveFormActionRef}
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
      title={"Employee List"}
      data={employees}
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
          createdEmployee:state.createdEmployeeReducer,
          updatedEmployee:state.updatedEmployeeReducer,
          employeeDisableRestoreAction:state.employeeDisableRestoreReducer,
          createdDesignation:state.createdDesignationReducer,
          createdDepartment:state.createdDepartmentReducer,
          employeeCodeGet:state.employeeCodeReducer
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,createdEmployeeSet,updatedEmployeeSet,employeeDisableRestoreSet})(ProductsManage);