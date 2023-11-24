import React,{Fragment,useState,useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {BrowserRouter as Router,Route,Redirect} from 'react-router-dom';
import { useHistory } from "react-router-dom";

import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

import swal from 'sweetalert';
import axios from 'axios'
import {API_URL,APP_URL,APP_CHECKER,APP_ID} from '../config.json'
import socketIOClient from "socket.io-client";



function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center" style={{textAlign:'center',fontWeight:'bold',color:'rgb(10 68 62)',fontStyle:'italic',
    fontSize: '14px'}}>
      {'Developed By  '}
      <Link color="inherit" target="_blank" href="http://soft-task.com" >
        Soft Task Ltd.
      </Link>{' '}
     - Hotline : 01749-508007
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  '@global': {
    '.MuiButton-containedPrimary:hover':{
      backgroundColor:'#188074 !important',
      color: '#005d1f',
      backgroundColor: '#65da63'
    },
    'body':{
    //  backgroundImage: `url("${API_URL}/bg.png") no-repeat !important`,

       backgroundColor: 'linear-gradient(to left, #e0f7fa 0%, #e0f7fa 100%) no-repeat',
      //  backgroundPosition: 'center !important' ,
      // backgroundRepeat: 'no-repeat !important',
      //  backgroundSize: 'cover !important',
      //  height:'100% !important'
  
    }
}
}));

const SignIn = ()=> {
  const classes = useStyles();
  const [formValues,formSetValues] = useState({user_name:'',user_password:''});
  const [ajaxReqStatus,ajaxReqStatusSet] = useState(false);
  const [open, setOpen] = React.useState(false);
  let userNameRef = React.useRef(null)
  let userPassRef = React.useRef(null)
    const history = useHistory();
  
    const [institution,institutionSet] = useState(null)

  

  useEffect(()=>{
    const socket = socketIOClient(API_URL);
    
    socket.on('connect', function() {
     
      if(open){
        setOpen(false)
      }
    });
    
    socket.on('connect_error', function() {
      if(!open){
        setOpen(true)
      }
    });

    
  }) 


  useEffect(()=>{
    axios.get(`${API_URL}/public/get-institution`).then(res=>{
      institutionSet(res.data)
})
  },[])
  const signinAction = async () =>{
        if(formValues.user_name==''){
          swal({
            title:'Username is required.',
            icon:'warning'
          })
        }else if(formValues.user_password==''){
          swal({
            title:'Password is required.',
            icon:'warning'
          })
        }else if(formValues.user_password.length<6){
          console.log(formValues.user_password)
          swal({
            title:'Password should be minimum 6 characters',
            icon:'warning'
          })
        }else{
           ajaxReqStatusSet(true)


           let status = 'YES'


           if(APP_ID != 'lifetime'){
              await axios.post(`${APP_CHECKER}/public/app-checker`,{
                appId: APP_ID
              }).then(res=>{
              ajaxReqStatusSet(false)
              //  return false
              if(res.data.active == 'NO'){
                status = 'NO'
              }
              })
           }

           


            if(status == 'NO'){
              swal({
                title:`Plz Pay Your Bill...  01749-508007 `,
                icon:'warning'
              });
              return false
            }




           await axios.post(`${API_URL}/signin`,formValues).then(res=>{
           ajaxReqStatusSet(false)
          //  return false
           if(res.data.error==false){
            sessionStorage.setItem('auth_info',JSON.stringify(res.data));
           
           window.location.href = `${APP_URL}dashboard`
           }else{
              swal({
                   title:`${res.data.message}`,
                   icon:'warning'
             })
           }
           })
        }
  }
  const handleFromInput = (e)=>{
    const {name,value} = e.target;
    formSetValues({...formValues,[name]:value})
  }
  return (
<>
      <CssBaseline />
      <Grid container sm={12}>
        <Grid Grid item xs={12} sm={3}>
        </Grid>
            <Grid item xs={12} sm={2} style={{marginTop: '124px',background: '#e0f7fa',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              padding: '6px',
    border: '1px dotted #94e0d8',
    marginRight: '10px'
              }}>
                

                <img alt="Logo Loading..." src={`${API_URL}/${institution!= null ? institution.pro_logo:''}`} style={{width: '100%',
    height: '95px',
    borderRadius: '10px'
}} />

<h4 style={{margin: 0,
    padding: 0,
    color: '#222'}}>{ `${institution!= null ? institution.pro_name:''}` }</h4>

    <p style={{fontStyle: 'italic',color: '#222'}}> { `${institution!= null ? institution.pro_desc:''}` }  </p>
            </Grid>
            <Grid item xs={12} sm={3}>
            <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Accounter Center - Soft Task Ltd.
        </Typography>
        <Collapse in={open}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Oops !! no internet connection
        </Alert>
      </Collapse>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="user name"
            name="user_name"
            autoComplete="off"
            inputRef={userNameRef}
            onChange={handleFromInput}
            onKeyDown={event => {
              if (event.key === "Enter") {
                userPassRef.current.focus()
              }
            }}

          />
          <TextField
            autoComplete="off"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="user_password"
            label="password"
            type="password"
            inputRef={userPassRef}

            onChange={handleFromInput}
            onKeyDown={event => {
              if (event.key === "Enter") {
                signinAction()
              }
            }}
          />
        
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={signinAction}
            className={classes.submit}
            disabled={ajaxReqStatus}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                {/* Forgot password? */}
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {/* {"Don't have an account? Sign Up"} */}
              </Link>
            </Grid>
          </Grid>

        
      </div>
            </Grid>


            <Grid Grid item xs={12} sm={4}>
        </Grid>


      </Grid>
     
      <Box mt={8}>
        <Copyright />
      </Box>

      </>
  );
}
export default SignIn