import React,{Fragment,useEffect} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet} from '../actions/actions';
import {pathSpliter} from '../lib/functions';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import {APP_URL,API_URL} from '../config.json';
import './global.css'
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import {Typography} from '@material-ui/core';
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory';
import NoteIcon from '@material-ui/icons/Note';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import BuildIcon from '@material-ui/icons/Build';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ShopIcon from '@material-ui/icons/Shop';

const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
  box:{
    color: '#e1f8fb',
    height: '177px',
    margin: '0px',
    background: '#23B7A7',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '20px',
    marginTop: '10px',
    width: '23%',
    margin: '1%'
  },
  
  boxTitle:{
    color: '#484848',
    fontWeight:'bold',
    fontSize:'18px',
    margin:'0px'
  },
  '@global': {
    '.MuiBox-root':{
      paddingBottom:'0px !important',
      paddingTop: '20px'
    },
    '.MuiBox-root p':{
      color:'white'
    },
    '.MuiBox-root svg':{
      color:'white',
      fontWidth:'bold'
    }
  }
}));

const logout = ()=>{
  sessionStorage.clear();
  window.location.href = `${APP_URL}`
}

const Dashboard = ({location,currentRoute,currentRouteSet,authInfo})=>{
  useEffect(()=>{
      currentRouteSet(pathSpliter(location.pathname,1))
  },[]);
  
  const classes = useStyles();
  return(
    <>
    <h2 class="soft-title">Accounter Center - SoftTask</h2>




    <h2 class="soft-title-with-mobile" style={{
    fontWeight: 'bold',fontFamily: 'cursive'}}>Branch  : ( {authInfo.userInfo.branch_name} ) {authInfo.userInfo.warehouse_name!=null?`Warehouse : (${authInfo.userInfo.warehouse_name})`:''} and  User  : ( {authInfo.userInfo.user_full_name} ) {authInfo.userInfo.warehouse_name!=null?`Warehouse : (${authInfo.userInfo.warehouse_name})`:''} </h2>

     {
         currentRoute==undefined?( 
                <div style={{padding:'20px'}}>
              <div className="modules-box" style={{marginTop: '65px'}}>
            
             
                 <div   className="module-box" style={{background:'rgb(95 132 7)'}}>
                <Link to="/sales">
                    <Box   p={4}  >
                        <ShopIcon  style={{textAlign: 'center',fontSize: '70px',    marginTop: '14px'}} /><br/>
                        <p  className={classes.boxTitle}>Sales Module</p>
                    </Box>
                  </Link>
                </div>

                <div   className="module-box" style={{background:'rgb(80 165 16)'}}>
                <Link to="/service">
                    <Box   p={4}  >
                        <EmojiPeopleIcon  style={{textAlign: 'center',fontSize: '70px',    marginTop: '14px'}} /><br/>
                        <p  className={classes.boxTitle}>Service Module</p>
                    </Box>
                  </Link>
                </div>



                <div   className="module-box" style={{background:'rgb(175 128 0)'}}>
                <Link to="/purchase">
                    <Box   p={4}  >
                        <EmojiTransportationIcon  style={{textAlign: 'center',fontSize: '70px',    marginTop: '14px'}} /><br/>
                        <p  className={classes.boxTitle}>Purchase Module</p>
                    </Box>
                  </Link>
                </div>


                <div   className="module-box" style={{background:'#0C717D'}}>
                <Link to="/production">
                    <Box   p={4}  >
                        <HomeWorkIcon  style={{textAlign: 'center',fontSize: '70px',    marginTop: '14px'}} /><br/>
                        <p  className={classes.boxTitle}>Manufacturing  Module</p> 
                    </Box>
                  </Link>
                </div>
                


                <div   className="module-box" style={{background:'#0D8C30'}}>
                <Link to="/stock">
                    <Box   p={4}  >
                        <StoreMallDirectoryIcon  style={{textAlign: 'center',fontSize: '70px',    marginTop: '14px'}} /><br/>
                        <p  className={classes.boxTitle}>Inventory  Module</p>
                    </Box>
                  </Link>
                </div>

                <div   className="module-box" style={{background:'#1e8f9c'}}>
                <Link to="/accounts">
                    <Box   p={4}  >
                        <AccountBalanceIcon  style={{textAlign: 'center',fontSize: '70px',    marginTop: '14px'}} /><br/>
                        <p  className={classes.boxTitle}>Financial Accounts Module</p>
                    </Box>
                  </Link>
                </div>
               
               

                <div   className="module-box" style={{background:'#0f7e77'}}>
                <Link to="/hrpayroll">
                    <Box   p={4}  >
                        <SupervisorAccountIcon  style={{textAlign: 'center',fontSize: '70px',    marginTop: '14px'}} /><br/>
                        <p  className={classes.boxTitle}>HR & Payroll Module</p>
                    </Box>
                  </Link>
                </div>

                <div   className="module-box" style={{background:'#7D1C1C'}}>
                <Link to="/reports">
                    <Box   p={4}  >
                        <NoteIcon  style={{textAlign: 'center',fontSize: '70px',    marginTop: '14px'}} /><br/>
                        <p  className={classes.boxTitle}>Reports Module</p>
                    </Box>
                  </Link>
                </div>

                
                <div   className="module-box" style={{background:'rgb(0 105 29)'}}>
                <Link to="/administration">
                    <Box   p={4}  >
                        <BuildIcon  style={{textAlign: 'center',fontSize: '70px',    marginTop: '14px'}} /><br/>
                        <p  className={classes.boxTitle}>Administration </p>
                    </Box>
                  </Link>
                </div>
               

                </div>
                </div>
              ):''
            }
  </>
  )
}
const mapStateToProps = (state)=>{
  return{
    currentRoute:state.returnReducer,
    authInfo:state.authInfoReducer
  }
}
export default connect(mapStateToProps,{currentRouteSet})(Dashboard)