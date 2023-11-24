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
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {pathSpliter,authInfo} from '../../lib/functions'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';


import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import '../../components/global.css'

import {currentRouteSet} from '../../actions/actions';



function CircularProgressWithLabel(props) {
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" {...props} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }


const InstitutionProfile = ({location,currentRouteSet,currentRoute,authInfo})=>{
    const classes = useStyles();
   
    
    let logoUploadChange = (e)=>{
        e.preventDefault()
        var src = document.getElementById("logo_upload_label");
        var target = document.getElementById("target");

        pro_logo_set(e.target.files[0])


        var fr = new FileReader();

             fr.onload = function(){
            target.src = fr.result;
            }
           fr.readAsDataURL(src.files[0]);
            
           


    }


    const [progress, setProgress] = React.useState(0);

  

  let [pro_logo,pro_logo_set] = useState(null);
  let [pro_print_type,pro_print_type_set] = useState('a4')
  let [pro_name,pro_name_set] = useState('')
  let [pro_desc,pro_desc_set] = useState('')

  let [logoPath,logoPathSet] = useState('')

  let saveFormAction = async (e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append('pro_logo', pro_logo);
    formData.append('pro_print_type', pro_print_type);
    formData.append('pro_name', pro_name);
    formData.append('pro_desc', pro_desc);
    
    await axios.post(`${API_URL}/api/save-institution`,formData,{
        headers:{
            'Content-Type': 'multipart/form-data',
            'auth-token':authInfo.token
        },
        onUploadProgress: progressEvent => {
            setProgress(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );
  
            // Clear percentage
            setTimeout(() => setProgress(0), 10000);
          }
    }).then(res=>{
        if(res.data.error){
            swal({title:res.data.message,icon:'warning'})
        }

        if(!res.data.error){
            swal({title:res.data.message,icon:'success'})
            getInstitution()
        }
    })

  }

  useEffect(()=>{
    getInstitution()
  },[])

  let getInstitution = async ()=>{
    await axios.get(`${API_URL}/api/get-institution`,{headers:{'auth-token':authInfo.token}}).then(res=>{
        if(res.data != null ){
            pro_print_type_set(res.data.pro_print_type)
            pro_name_set(res.data.pro_name)
            pro_desc_set(res.data.pro_desc)
            logoPathSet(`${API_URL}/`+res.data.pro_logo)
        }
       


       
    })
  }
   
   
    // Methods script end
    return (
    <div className={classes.root}>
     <Paper className={classes.paper} style={{marginTop:'-15px'}}>
    <h2 className={classes.pageEntryLabel}>Institution Profile Update </h2> 
    <form onSubmit={(e)=>saveFormAction(e)} id="profileForm">
      <Grid container spacing={2}>
    

          <Grid item xs={12} sm={6}>
          <Grid item xs={12} sm={12}>
          <label style={{color: '#109a07',fontWeight: 'bold',fontSize: '15px',float: 'left',width: '100%'}} htmlFor="logo_upload_label" className="logo_upload_label_style" >
 Choose Profile Logo...
</label>
<input id="logo_upload_label" style={{display:'none'}}  name="imgFiles"  type="file" onChange={(e)=>logoUploadChange(e)} />

          </Grid>
          <Grid item xs={12} sm={6}>
          <CircularProgressWithLabel value={progress} />
<img style={{width:' 100%',height: '90px',marginTop: '17px'}} id="target" alt="No Photo / Loading" src={logoPath} />
</Grid>





           


            <Grid item xs={12} sm={6} style={{marginTop:'30px'}}>
            <FormControl component="fieldset"  className={classes.formControl}>
        <FormLabel component="legend">Invoice Print Type</FormLabel>
        <RadioGroup aria-label="quiz" name="quiz" value={pro_print_type} onChange={(e)=>pro_print_type_set(e.target.value)} >
          <FormControlLabel value="a4" control={<Radio />} label="A4" />
          <FormControlLabel value="1/2a4" control={<Radio />} label="1/2 of A4" />
          <FormControlLabel value="pos" control={<Radio />} label="POS" />
        </RadioGroup>
        <FormHelperText></FormHelperText>
     
      </FormControl>
            </Grid>
          </Grid>
    
           
            <Grid item xs={12} sm={6}> 
            <TextField type="text" autoComplete='off' className={classes.fullWidth}
            onChange={(e)=>pro_name_set(e.target.value)}  value={pro_name}
            label="Institution Name" name="pro_name" variant="outlined" size="small"  />


<TextareaAutosize value={pro_desc}  name="pro_desc" onChange={(e)=>pro_desc_set(e.target.value)} style={{float:'left',marginTop:'20px',width: '100%'}} aria-label="Institution Description" rowsMin={3} placeholder="Institution Description" />

            </Grid>

        
  
  </Grid>

  {
    authInfo.role !='user'?(
    <>
       <Grid item xs={12}>
  <Button 
  type="submit"
  style={{marginTop: '25px'}}
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
 

  </form>
     </Paper>

    
     
    </div>
        
    );
}



 

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  
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
      color: '#7b7979',
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
 
}));

const mapStateToPops = (state)=>{
      return {
        currentRoute:state.currentRouteReducer,
        authInfo:state.authInfoReducer
      }
}

export default connect(mapStateToPops,{currentRouteSet})(InstitutionProfile);