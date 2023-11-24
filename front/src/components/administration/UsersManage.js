import React,{ useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import { useHistory } from "react-router-dom";

import swal from 'sweetalert';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MUIDataTable from "mui-datatables";
import {API_URL} from '../../config.json';
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import socketIOClient from "socket.io-client";
import {pathSpliter,authInfo} from '../../lib/functions'

import {currentRouteSet} from '../../actions/actions';

import Modal from '../commons/Modal'
const UsersManage = ({location,currentRouteSet,currentRoute,authInfo})=>{
    const classes = useStyles();
    // Init properties
    const userRoles = [
        { user_role: 'super_admin',user_label:'super admin'},
        { user_role: 'admin',user_label:'admin'},
        { user_role: 'user',user_label:'user'}
      ];
    
    
    // Init will be call.
    
    
  useEffect(()=>{
    getBranches();
    getWarehouses()
    getUsers()
    currentRouteSet(pathSpliter(location.pathname,1));
    // Socket
    const socket = socketIOClient(API_URL);
    socket.on("signup_record", (data) => {
      signupRecordSet(data.message[0].user_full_name)
  });
  },[])

    // Init states start
    let [formValues,formSetValues] = useState({user_full_name:'',user_email:'',
    selectedBranch:null,selectedWarehouse:null,selectedUserRole:null,user_name:'',user_password:'',user_confirm_password:'',
    showPassword:'',showConfirmPassword:'',action:'create',user_id:0});
    let [branches,branchesSet] = useState([]);
    let [warehouses,warehousesSet] = useState([]);
    let [users,userSet] = useState([]);
    let [signupRecord,signupRecordSet] = useState('')
    let [loadingList,loadingListSet] = useState(false)

    const history = useHistory();
    // Init states end
    // Methods script start
    const saveFormAction = async ()=>{
      if(formValues.action=='update' && formValues.user_password.trim()!=''){
      if(formValues.user_password==''){
        swal({
          title:'Password is required.',
          icon:'warning'
        })
        return false
      }else if(formValues.user_confirm_password==''){
        swal({
          title:'Confirm password is required.',
          icon:'warning'
        })
        return false
      }else if(formValues.user_password.length<6){
        swal({
          title:'password should be minimum 6 characters.',
          icon:'warning'
        })
        return false
      }else if(formValues.user_confirm_password<6){
        swal({
          title:'Confirm password should be minimum 6 characters.',
          icon:'warning'
        })
        return false
      }else if(formValues.user_password!=formValues.user_confirm_password){
        swal({
          title:'Password and confirm password not match.',
          icon:'warning'
        })
        return false
      }
    }

    if(formValues.action=='create'){
      if(formValues.user_password==''){
        swal({
          title:'Password is required.',
          icon:'warning'
        })
        return false
      }else if(formValues.user_confirm_password==''){
        swal({
          title:'Confirm password is required.',
          icon:'warning'
        })
        return false
      }else if(formValues.user_password.length<6){
        swal({
          title:'password should be minimum 6 characters.',
          icon:'warning'
        })
        return false
      }else if(formValues.user_confirm_password<6){
        swal({
          title:'Confirm password should be minimum 6 characters.',
          icon:'warning'
        })
        return false
      }else if(formValues.user_password!=formValues.user_confirm_password){
        swal({
          title:'Password and confirm password not match.',
          icon:'warning'
        })
        return false
      }
    }

          if(formValues.user_full_name==''){
            swal({
              title:'Full name is required',
              icon:'warning'
            })
          }else if(formValues.user_email==''){
            swal({
              title:'User E-mail is required',
              icon:'warning'
            })
          }else if(!validationEmail(formValues.user_email)){
            swal({
              title:'E-mail is Invalid',
              icon:'warning'
            })
          }else if(formValues.selectedBranch==null){
            swal({
              title:'Choose a Branch',
              icon:'warning'
            })
          }else if(formValues.selectedUserRole==null){
            swal({
              title:'Choose a Role',
              icon:'warning'
            })
          }else if(formValues.user_name==''){
            swal({
              title:'Username is required.',
              icon:'warning'
            })
          } else{
            let url = `signup`
            if(formValues.action=='update'){
                url = `user-update`
            }
            await axios.post(`${API_URL}/api/${url}`,formValues,{headers:{'auth-token':authInfo.token}}).then(res=>{
                  if(!res.data.error){
                    swal({
                      title:res.data.message,
                      icon:'success'
                    })

                    formSetValues({...formValues,user_full_name:'',user_email:'',
                    selectedBranch:null,selectedWarehouse:null,selectedUserRole:null,user_name:'',user_password:'',user_confirm_password:'',
                    showPassword:'',showConfirmPassword:''})
                    getUsers()
                  }
                 
            })
          }
    }
    const handleFromInput = (e)=>{
      const {name,value} = e.target;
      formSetValues({...formValues,[name]:value}) 
    }
    const validationEmail = (email)=>{
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    const getBranches = async ()=>{
          await axios.post(`${API_URL}/api/get-branches`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
            branchesSet(res.data.message)
          })
    }
    const getUsers = async ()=>{
      loadingListSet(true)

      await axios.post(`${API_URL}/api/get-users`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
        loadingListSet(false)

        userSet(res.data.message)
      })
    }

    const getWarehouses = async ()=>{
      // await axios.post(`${API_URL}/api/get-warehouses`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
      //   warehousesSet(res.data.message)
      // })
}
    const handleClickShowPassword = () => {
      formSetValues({ ...formValues, showPassword: !formValues.showPassword });
    };
    const handleClickShowConfirmPassword = () => {
      formSetValues({ ...formValues, showConfirmPassword: !formValues.showConfirmPassword });
    };
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    const handleMouseDownConfirmPassword = (event) => {
      event.preventDefault();
    };

    const userAccess = (ind)=>{
       let userId = users[ind].user_id; 
       history.push(`/administration/user-access/${userId}`)
    }


    // Methods script end
    const ActionOptions = (props)=>{
      return(<div style={{textAlign:'right'}}> 

{
    authInfo.role !='user'?(
    <>
        <VpnKeyIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>userAccess(props.rowIndex)} />
        <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>userEdit(props.rowData,props.rowIndex)}/>
        {props.rowData[1]=='active'?(
              <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>userDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
        ):(
          <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>userDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
        )}        
   </>):''
 }
      
      </div>)
    
    }


    const userEdit = (row,index)=>{
      let user =  users[index];
      formSetValues({...formValues,user_full_name:user.user_full_name,user_email:user.user_email,
      selectedBranch:{branch_name:user.branch_name,branch_id:user.user_branch_id},selectedWarehouse:user.user_warehouse_id!=0?{warehouse_name:user.warehouse_name,warehouse_id:user.user_warehouse_id}:null,selectedUserRole:{user_role:user.user_role,user_label:user.user_label},user_name:user.user_name,user_password:'',user_confirm_password:'',
      showPassword:'',showConfirmPassword:'',action:'update',user_id:user.user_id});

    }


    const userDisableRestore = async  (userId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/user-disable-restore`,{user_id:userId,action:actionCond,index},{
        headers:{'auth-token':authInfo.token}}).then(res=>{
          getUsers()
        })
    }

    const columns = [
      {name: "user_id",options: { display: 'excluded' }},
      {name: "user_status",options: { display: 'excluded' }},
      {name:"SL",options: {filter: false,sort: false,
        customBodyRender:(value,tableMeta)=>{
        return ( <p>{parseFloat(tableMeta.rowIndex)+1}</p> ); 
      }
      },headerStyle: {
        textAlign:'left'
      }},
      {name: "user_full_name",label: "User Full Name",options: {filter: true,sort: true}},
      {name: "user_name",label: "User Name",options: {filter: true,sort: true}},
      {name: "branch_name",label: "Branch Name",options: {filter: true,sort: true}},
      // {name: "warehouse_name",label: "Warehouse ",options: {filter: true,sort: true}},
      {name: "user_label",label: "Role",options: {filter: true,sort: true}},
      {name: "user_email",label: "Email",options: {filter: true,sort: true}},
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

     <Paper className={classes.paper} style={{marginTop:'-15px'}}>
    <h2 className={classes.pageEntryLabel}>User Entry {signupRecord}</h2>
      <Grid container spacing={2}>
      
            <Grid item xs={12} sm={3}> 
            <TextField  autoComplete='off' className={classes.fullWidth} 
            label="full name" name="user_full_name" value={formValues.user_full_name} variant="outlined" size="small" onChange={handleFromInput} />
            </Grid>
            <Grid item xs={12} sm={3}> 
            <TextField type="email" autoComplete='off' className={classes.fullWidth} value={formValues.user_email}
            label="user email" name="user_email" variant="outlined" size="small" onChange={handleFromInput} />
            </Grid>

            <Grid item xs={12} sm={3}>
      <Autocomplete
        autoHighlight={true}
        openOnFocus={true}
      style={{ width: '100%' }}
      options={branches} 
      size="small"
      classes={{
        option: classes.option,
      }}
      autoHighlight
      getOptionLabel={(option) => option.branch_name}
      getOptionSelected={(option, value) => {
        return option.branch_id === value.branch_id;
     }}
     value={formValues.selectedBranch}
     onChange={(event,selectedObj)=>{
        formSetValues({...formValues,selectedBranch:selectedObj})
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a Branch"
          variant="outlined"
         
        />
      )}
    />
  </Grid>


  <Grid item xs={12} sm={3} style={{display:'none'}}>
      <Autocomplete
        autoHighlight={true}
        openOnFocus={true}
      style={{ width: '100%' }}
      options={warehouses} 
      size="small"
      classes={{
        option: classes.option,
      }}
      autoHighlight
      getOptionLabel={(option) => option.warehouse_name}
     value={formValues.selectedWarehouse}
     onChange={(event,selectedObj)=>{
        formSetValues({...formValues,selectedWarehouse:selectedObj})
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a Warehouse"
          variant="outlined"
         
        />
      )}
    />
  </Grid>


  <Grid item xs={12} sm={3}>
      <Autocomplete
        autoHighlight={true}
        openOnFocus={true}
      style={{ width: '100%' }}
      options={userRoles} 
      size="small"
      classes={{
        option: classes.option,
      }}
      autoHighlight
      getOptionLabel={(option) => option.user_label}
      getOptionSelected={(option, value) => {
        return option.user_role === value.user_role;
     }}
     value={formValues.selectedUserRole}
      onChange={(event,selectedObj)=>{
        formSetValues({...formValues,selectedUserRole:selectedObj}) 
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a User Role"
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password'
          }}
        />
      )}
    />
  </Grid>

  <Grid item xs={12} sm={3}>
            <TextField  autoComplete='off' className={classes.fullWidth} value={formValues.user_name}
            label="user name" autoComplete="off" name="user_name" variant="outlined" size="small" onChange={handleFromInput} />
  </Grid>
  <Grid item xs={12} sm={3}>
  <FormControl className={classes.fullWidth} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput

            type={formValues.showPassword ? 'text' : 'password'}
            value={formValues.user_password}
            onChange={handleFromInput}
            name="user_password"
            autoComplete="off"
            size="small"
            endAdornment={
              <InputAdornment position="end" >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {formValues.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
  
  </Grid>
  <Grid item xs={12} sm={3}>
  <FormControl className={classes.fullWidth} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Confirm password</InputLabel>
          <OutlinedInput
            type={formValues.showConfirmPassword ? 'text' : 'password'}
            value={formValues.user_confirm_password}
            onChange={handleFromInput}
            name="user_confirm_password"
            size="small"
            autoComplete="off"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownConfirmPassword}
                  edge="end"
                >
                  {formValues.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={130}
          />
        </FormControl>
  </Grid>
  
  </Grid>

  {
    authInfo.role !='user'?(
    <>
         <Grid item xs={12}>
  <Button style={{marginTop: '25px'}}
        variant="contained"
        color="primary"
        size="small"
        className={classes.button}
        startIcon={<SaveIcon />}
        onClick={saveFormAction}
      >
        Save
      </Button>
  </Grid>         
   </>):''
 }

     </Paper>

     {
      loadingList==true?(<b>Loading...</b>):(
        <Paper className={classes.paper} style={{marginTop:'20px'}}>
        <MUIDataTable
      title={"User List"}
      data={users}
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


 const options = {
   filterType: 'checkbox',
 };
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
      marginBottom: '5px'
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
        authInfo:state.authInfoReducer
      }
}
export default connect(mapStateToPops,{currentRouteSet})(UsersManage);