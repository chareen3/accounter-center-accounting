import React,{Fragment,useEffect,useState} from 'react' 
import {connect} from 'react-redux';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'
import DashboardIcon from '@material-ui/icons/Dashboard';
import {Drawer,AppBar,Toolbar,List,
       ListItem,ListItemIcon,ListItemText,
       Menu,MenuItem,Badge,Fade,
       Divider,IconButton,BottomNavigation,
       BottomNavigationAction,Avatar} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';

import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import BuildIcon from '@material-ui/icons/Build';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ShopIcon from '@material-ui/icons/Shop';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
       
       
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import NoteIcon from '@material-ui/icons/Note';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PermDataSettingIcon from '@material-ui/icons/PermDataSetting';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import HomeIcon from '@material-ui/icons/Home';
import StyleIcon from '@material-ui/icons/Style';
import axios from 'axios';
import SettingsIcon from '@material-ui/icons/Settings';
import './global.css'
import { Modal } from 'react-responsive-modal';
import "react-responsive-modal/styles.css";
import TextField from '@material-ui/core/TextField';


import {APP_URL,API_URL} from '../config.json';
import {accessChecker} from '../lib/functions';
import socketIOClient from "socket.io-client";
import {createdCategorySet,updatedCategorySet,disableRestoreSet,createdBrandSet,updatedBrandSet,brandDisableRestoreSet,
  createdColorSet,updatedColorSet,disableRestoreColorSet,disableRestoreUnitSet,updatedUnitSet,createdUnitSet,
  createdBranchSet,updatedBranchSet,disableRestoreBranchSet,
  createdWarehouseSet,updatedWarehouseSet,disableRestoreWarehouseSet,
  createdAreaSet,updatedAreaSet,disableRestoreAreaSet,
  createdProdNameSet,updatedProdNameSet,disableRestoreProdNameSet,
  createdProductSet,updatedProductSet,productCodeSet,disableRestoreProductSet,customerCodeSet,
  createdMaterialSet,updatedMaterialSet,materialCodeSet,disableRestoreMaterialSet,
  createdCustomerSet,updatedCustomerSet,disableRestoreCustomerSet,
  createdSupplierSet,updatedSupplierSet,disableRestoreSupplierSet,
  createdDesignationSet,updatedDesignationSet,disableRestoreDesignationSet,
  createdDepartmentSet,updatedDepartmentSet,disableRestoreDepartmentSet,
  createdMonthSet,updatedMonthSet,disableRestoreMonthSet,createdEmployeeSet,updatedEmployeeSet,employeeDisableRestoreSet,
  employeeCodeSet,createdTranAccSet,updatedTranAccSet,tranAccDisableRestoreSet,tranAccCodeSet,
  createdBankAccSet,bankAccCodeSet,updatedBankAccSet,
  createdCashTranSet,updatedCashTranSet,cashTranDisableRestoreSet,cashTranCodeSet,
  createdBankTranSet,updatedBankTranSet,bankTranDisableRestoreSet,bankTranCodeSet,
  createdCustomerPaySet,updatedCustomerPaySet,customerPayDisableRestoreSet,
  createdSupplierPaySet,updatedSupplierPaySet,supplierPayDisableRestoreSet,
  createdMaterialNameSet,updatedMaterialNameSet,disableRestoreMaterialNameSet,
} from '../actions/actions';
import swal from 'sweetalert';





const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
  
  root: {
    display: 'flex',
  },
  drawerIconColor:{
    color:'rgb(255, 255, 255)'
  },
  linkStyle:{
       textDecoration:'none',
       color:'#484848',
       paddingTop:'4px !important',
       paddingBottom:'4px !important'
  },
  appBar: {
    backgroundColor:theme.topNavApp.bg,
    color:theme.topNavApp.color,
    borderBottom: "1px solid #9CE1E7",
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift:{
    backgroundColor:theme.topNavApp.bg,
    color:theme.topNavApp.color,
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    background:theme.sidebar,
  },
  drawerOpen: {
    width: drawerWidth,
    background:theme.sidebar,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(0) + 0,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(0) + 0,
    },
  },
  toolbarspace:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  toolbar: {
    backgroundColor:'#E0F7FA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  companyTitle:{
    textAlign:'left',
    color: '#568389',
    fontSize: '20px'
  },
  '@global': {

    '.MuiListItem-gutters': {
      paddingLeft: '5px',
      paddingRight: '0px'
  },
   
    '.MuiTableCell-head:last-child':{
         textAlign:'right'
    },
    '.MuiTableCell-head:first-child':{
      textAlign:'left'
 },

 '.MuiAlert-standardSuccess': {
  color: '#ffff !important',
  fontSize: '15px !important',
  backgroundColor: 'green !important',
  fontWeight: 'bold !important'
},
 
    '.MuiTableCell-root':{
      padding:'1px !important'
    },
    '.MuiTypography-h6':{
    'textAlign': 'left',
    'marginLeft': '-22px'
    },
    // You should target [class*="MuiButton-root"] instead if you nest themes.
    '.MuiBottomNavigation-root': {
      background: 'transparent'
    },
    '.MuiListItem-root':{
      paddingBottom:'1px',
      paddingTop:'1px'
    },
    '.MuiListItemIcon-root':{
      minWidth: '30px'
    },
    'a':{
      textDecoration:'none'
    },
    '.MuiInputBase-input':{
      width:'100% !important'
    },
    '.MuiButton-containedPrimary':{
      backgroundColor:'#188074 !important',
      color: '#005d1f',
      backgroundColor: '#95f3ff'
    },
    '.MuiButton-containedPrimary:hover':{
      backgroundColor:'#188074 !important',
      color: '#005d1f',
      backgroundColor: '#65da63'
    },
    '.MuiOutlinedInput-input': {
      padding: '10.5px 14px !important'
    },
    '.MuiInputLabel-outlined': {
      zIndex: '1',
      transform: 'translate(14px, 13px) scale(1)',
      pointerEvents: 'none'
  },
  '.MuiDrawer-paperAnchorLeft':{
    overflowX: 'hidden'
  },
  '.MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"][class*="MuiOutlinedInput-marginDense"]': {
    padding: '0px !important'
}
},
usersettingaction:{
    marginLeft: 0,
    cursor:'pointer',
    marginLeft:'15px',
    marginRight:'15px'
},
whiteSpace:{
    width: '100%',
},
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
})); 
const Header = ({path,menuAction,currentRoute,createdCategorySet,
  updatedCategorySet,disableRestoreSet,createdBrandSet,updatedBrandSet,brandDisableRestoreSet,
  createdColorSet,updatedColorSet,disableRestoreColorSet,createdUnitSet,updatedUnitSet,disableRestoreUnitSet,
  createdBranchSet,updatedBranchSet,disableRestoreBranchSet,createdWarehouseSet,updatedWarehouseSet,disableRestoreWarehouseSet,
  createdAreaSet,updatedAreaSet,disableRestoreAreaSet,
  createdProdNameSet,updatedProdNameSet,disableRestoreProdNameSet,authInfo,
  createdMaterialNameSet,updatedMaterialNameSet,disableRestoreMaterialNameSet,
  createdProductSet,updatedProductSet,productCodeSet,disableRestoreProductSet,customerCodeSet,
  createdCustomerSet,updatedCustomerSet,disableRestoreCustomerSet,
  createdSupplierSet,updatedSupplierSet,disableRestoreSupplierSet,
  createdDesignationSet,updatedDesignationSet,disableRestoreDesignationSet,
  createdDepartmentSet,updatedDepartmentSet,disableRestoreDepartmentSet,
  createdMonthSet,updatedMonthSet,disableRestoreMonthSet,
  createdEmployeeSet,updatedEmployeeSet,employeeDisableRestoreSet,
  employeeCodeSet,
  createdTranAccSet,updatedTranAccSet,tranAccDisableRestoreSet,tranAccCodeSet,
  createdBankAccSet,bankAccCodeSet,
  createdCashTranSet,updatedCashTranSet,cashTranDisableRestoreSet,cashTranCodeSet,
  createdBankTranSet,updatedBankTranSet,bankTranDisableRestoreSet,bankTranCodeSet,
  createdCustomerPaySet,updatedCustomerPaySet,customerPayDisableRestoreSet,
  createdSupplierPaySet,updatedSupplierPaySet,supplierPayDisableRestoreSet,
  createdMaterialSet,updatedMaterialSet,materialCodeSet,disableRestoreMaterialSet,


})=>{
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [value, setValue] = React.useState(0);
    const handleDrawerOpen = () => {
      setOpen(true);
    };
    const handleDrawerClose = () => {
      setOpen(false);
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openusersetting = Boolean(anchorEl);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };


    const [branchSwitch, branchSwitchSet] = React.useState(false);
    const [branches, branchesSet] = React.useState([]);
    const [selectedBranch, selectedBranchSet] = React.useState(null);
    const [user_password,user_password_set] = React.useState('');
    let [ajaxReqStatus,ajaxReqStatusSet] = useState(false);

  
   

  
  const logout = ()=>{
    sessionStorage.clear();
        window.location.href = `${APP_URL}`
  }
  
   
  useEffect(()=>{ 
    const socket = socketIOClient(API_URL); 

    
    socket.on("accessChanged", (data) => {
          console.log(authInfo.userInfo.user_id,' -- ',data.user_id)
         if(data.access=='changed' && (authInfo.userInfo.user_id == data.user_id)){
          swal({
            title:data.msg,
            icon:'warning',

          }).then(res=>{
            if(res){
              logout()
            }else{
              logout()
            }
          })
           
          
         }
    });



   


     // Supplier payments  
    socket.on("createdSupplierPay", (data) => {
      createdSupplierPaySet(data)
    });
    
    socket.on("updatedSupplierPay", (data) => {
      updatedSupplierPaySet(data)
    });
     socket.on("disableRestoreSupplierPay", (data) => {
      supplierPayDisableRestoreSet(data); 
     });


    // Bank Accounts time 
    socket.on("createdBankAcc", (data) => {
      createdBankAccSet(data)
    });

   
    
   
    
     socket.on("bankAccCode", (data) => {
      bankAccCodeSet(data); 
    });

    socket.on("updatedBankAcc", (data) => {
      updatedBankAccSet(data)
    });

    
    // Transaction Accounts real time 
    socket.on("createdTranAcc", (data) => {
      createdTranAccSet(data)
    });
    
    socket.on("updatedTranAcc", (data) => {
      updatedTranAccSet(data)
    });
     socket.on("disableRestoreTranAcc", (data) => {
      tranAccDisableRestoreSet(data); 
     });
     

     socket.on("disableRestoreCashTranAcc", (data) => {
      cashTranDisableRestoreSet(data); 
     });
     
     
     socket.on("tranAccCode", (data) => {
      tranAccCodeSet(data); 
    });
    //  category real time
    socket.on("createdCategory", (data) => {
      createdCategorySet(data)
    });
    
    socket.on("updatedCategory", (data) => {
      updatedCategorySet(data)
    });
     socket.on("disableRestoreCategory", (data) => {
       disableRestoreSet(data); 
     });
       //  Employee real time
       socket.on("createdEmployee", (data) => {
        createdEmployeeSet(data); 
      });
      socket.on("updatedEmployee", (data) => {
        updatedEmployeeSet(data); 
      });
      socket.on("disableRestoreEmployee", (data) => {
        employeeDisableRestoreSet(data); 
      });
      socket.on("employeeCode", (data) => {
        employeeCodeSet(data); 
      });
     //  Brand real time
     socket.on("createdBrand", (data) => {
      createdBrandSet(data); 
    });
    socket.on("updatedBrand", (data) => {
      updatedBrandSet(data); 
    });
    socket.on("disableRestoreBrand", (data) => {
      brandDisableRestoreSet(data); 
    });
    // Color real time
    socket.on("createdColor", (data) => {
      createdColorSet(data); 
    });
    socket.on("updatedColor", (data) => {
      updatedColorSet(data); 
    });
    socket.on("disableRestoreColor", (data) => {
      disableRestoreColorSet(data); 
    });
    // Unit real time
    socket.on("createdUnit", (data) => {
      createdUnitSet(data); 
    });
    socket.on("updatedUnit", (data) => {
      updatedUnitSet(data); 
    });
    socket.on("disableRestoreUnit", (data) => {
      disableRestoreUnitSet(data); 
    });
    // Branch real time
    socket.on("createdBranch", (data) => {
      createdBranchSet(data); 
    });
    socket.on("updatedBranch", (data) => {
      updatedBranchSet(data); 
    });
    socket.on("disableRestoreBranch", (data) => {
      disableRestoreBranchSet(data); 
    });
    // Warehouse real time
    socket.on("createdWarehouse", (data) => {
      createdWarehouseSet(data); 
    });
    socket.on("updatedWarehouse", (data) => {
      updatedWarehouseSet(data); 
    });
    socket.on("disableRestoreWarehouse", (data) => {
      disableRestoreWarehouseSet(data); 
    });
     // Area real time
     socket.on("createdArea", (data) => {
      createdAreaSet(data); 
    });
    socket.on("updatedArea", (data) => {
      updatedAreaSet(data); 
    });
    socket.on("disableRestoreArea", (data) => {
      disableRestoreAreaSet(data); 
    });
     // Product name real time
     socket.on("createdProdName", (data) => {
      createdProdNameSet(data); 
    });
    socket.on("updatedPordName", (data) => {
      updatedProdNameSet(data); 
    });
    socket.on("disableRestoreProdName", (data) => {
      disableRestoreProdNameSet(data); 
    });

     // Product name real time
     socket.on("createdMaterialName", (data) => {
      createdMaterialNameSet(data); 
    });
    socket.on("updatedMaterialName", (data) => {
      updatedMaterialNameSet(data); 
    });
    socket.on("disableRestoreMaterialName", (data) => {
      disableRestoreMaterialNameSet(data); 
    });


     // Supplier name real time
     socket.on("createdSupplier", (data) => {
      createdSupplierSet(data); 
    });
    socket.on("updatedSupplier", (data) => {
      updatedSupplierSet(data); 
    });
    socket.on("disableRestoreSupplier", (data) => {
      disableRestoreSupplierSet(data); 
    });
     
    


    // Month name real time
     socket.on("createdMonth", (data) => {
      createdMonthSet(data); 
    });
    socket.on("updatedMonth", (data) => {
      updatedMonthSet(data); 
    });
    socket.on("disableRestoreMonth", (data) => {
      disableRestoreMonthSet(data); 
    });
     // Department name real time
     socket.on("createdDepartment", (data) => {
      createdDepartmentSet(data); 
    });
    socket.on("updatedDepartment", (data) => {
      updatedDepartmentSet(data); 
    });
    socket.on("disableRestoreDepartment", (data) => {
      disableRestoreDepartmentSet(data); 
    });
    // Designation  real time
    socket.on("createdDesignation", (data) => {
      createdDesignationSet(data); 
    });
    socket.on("updatedDesignation", (data) => {
      updatedDesignationSet(data); 
    });
    socket.on("disableRestoreDesignation", (data) => {
      disableRestoreDesignationSet(data); 
    });
     // customer name real time
     socket.on("createdCustomer", (data) => {
      createdCustomerSet(data); 
    });
    socket.on("updatedCustomer", (data) => {
      updatedCustomerSet(data); 
    });
    socket.on("disableRestoreCustomer", (data) => {
      disableRestoreCustomerSet(data); 
    });
     // Cash transaction real time
     socket.on("createdCashTran", (data) => {
      createdCashTranSet(data); 
    });
    socket.on("updatedCashTran", (data) => {
      updatedCashTranSet(data); 
    });
    socket.on("cashTranDisableRestoreSet", (data) => {
      cashTranDisableRestoreSet(data); 
    });
    // Bank transaction real time
    socket.on("createdBankTran", (data) => {
      createdBankTranSet(data); 
    });
    socket.on("updatedBankTran", (data) => {
      updatedBankTranSet(data); 
    });
    socket.on("bankTranDisableRestoreSet", (data) => {
      bankTranDisableRestoreSet(data); 
    });
    socket.on("bankTranCode", (data) => {
      bankTranCodeSet(data); 
    });
    // Product real time
    socket.on("createdProduct", (data) => { 
      createdProductSet(data); 
    });
    socket.on("updatedProduct", (data) => {
      updatedProductSet(data); 
    });
    socket.on("customerCode", (data) => {
      customerCodeSet(data); 
    });
    socket.on("productCode", (data) => {
      productCodeSet(data); 
    });
    socket.on("disableRestoreProduct", (data) => {
      disableRestoreProductSet(data); 
    });


    //  Material 

    socket.on("createdMaterial", (data) => { 
    
      createdMaterialSet(data); 
    });
    socket.on("updatedMaterial", (data) => {
      updatedMaterialSet(data); 
    });
    socket.on("materialCode", (data) => {
      materialCodeSet(data); 
    });
   
    socket.on("disableRestoreMaterial", (data) => {
      disableRestoreMaterialSet(data); 
    });



    //


    socket.on("createdCustomerPay", (data) => {
      createdCustomerPaySet(data); 
    });
    socket.on("updatedCustomerPay", (data) => {
      updatedCustomerPaySet(data); 
    });
     
    socket.on("disableRestoreCustomerPay", (data) => {
      customerPayDisableRestoreSet(data); 
    });

    getBranches()

  },[]);






  let actionToSwitch = async ()=>{
    if(selectedBranch==null){
     swal({
       title:'Select a Switching Branch',
       icon:'warning'
     })
    }else if(user_password.trim()==''){
     swal({
       title:'Your current account password is Required.',
       icon:'warning'
     })
    }else{
     ajaxReqStatusSet(true)
     let new_branch_id = selectedBranch.branch_id;
     let new_branch_name = selectedBranch.branch_name;
     await axios.post(`${API_URL}/api/switch-branch`,{user_password,new_branch_id,new_branch_name},{headers:{'auth-token':authInfo.token}}).then(res=>{
       ajaxReqStatusSet(false)
      //  return false
       if(res.data.error==false){
        sessionStorage.setItem('auth_info',JSON.stringify(res.data));
        
       window.location.reload()
       }else{
          swal({
               title:`${res.data.message}`,
               icon:'warning'
         })
       }
       })

    }
}





  let getBranches = async ()=>{
      await axios.post(`${API_URL}/api/get-branches`,null,{headers:{'auth-token':authInfo.token}}).then((res)=>{
       let data = res.data.message 
      //  data.unshift({branch_name:'All Branch',branch_id:0})
       branchesSet(data);
 
      })
  }
 
 
 

  return (
      <div  className="app-gap">
          <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
          
        <Toolbar>
            
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <BottomNavigation
  value={value}
  className={classes.Mui}
  onChange={(event, newValue) => {
    setValue(newValue);
  }}
  showLabels
  className={classes.root}
>





<BottomNavigationAction component={Link} to="/"  label="Dashboard" style={{color:'#0F7E77',fontSize:'2rem'}} icon={<DashboardIcon style={{fontSize:'2rem'}} />} />
<BottomNavigationAction {...(path=='sales'? '':'')}   component={Link}
        to="/sales"   label="Sales" style={{color:'#5F8407'}}  icon={<ShopIcon style={{fontSize:'2rem'}}/>} />
  <BottomNavigationAction component={Link} to="/service"  label="Service" style={{color:'#50A510'}} icon={<EmojiPeopleIcon style={{fontSize:'2rem'}}/>} />
  <BottomNavigationAction component={Link} to="/purchase"  label="Purchase" style={{color:'#9C7200'}} icon={<EmojiTransportationIcon style={{fontSize:'2rem'}}/>} />
  <BottomNavigationAction component={Link} to="/production"  label="Manufacturing" style={{color:'#00899a'}} icon={<HomeWorkIcon style={{fontSize:'2rem'}}/>} />
  <BottomNavigationAction component={Link} to="/stock" label="Inventory" style={{color:'#3E8D54'}} icon={<StoreMallDirectoryIcon style={{fontSize:'2rem'}}/>} />
  <BottomNavigationAction component={Link} to="/accounts" label="Accounts" style={{color:'#0F7E77'}} icon={<AccountBalanceIcon style={{fontSize:'2rem'}}/>} />
  <BottomNavigationAction component={Link} to="/hrpayroll" label="HR&Payroll" style={{color:'#009C8B'}} icon={<SupervisorAccountIcon style={{fontSize:'2rem'}}/>} />
  <BottomNavigationAction component={Link} to="/reports" label="Reports" style={{color:'#FF0000'}} icon={<NoteIcon style={{fontSize:'2rem'}}/>} />

  <BottomNavigationAction component={Link} to="/administration" label="administration"  
   style={{color:'#00691D'}} icon={<BuildIcon style={{fontSize:'2rem'}}/>} />

   


  {
     authInfo.role=='super_admin'?(<span>
        <BottomNavigationAction component={Link} to="#" onClick={()=>branchSwitchSet(true)} label="Switch"  
   style={{color:'#00691D'}} icon={<SettingsIcon style={{fontSize:'2rem'}}/>} />
     </span>):''
   }


</BottomNavigation> 
{/*  */}

     
<IconButton style={{display:'none'}} aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
      <div className={classes.root,classes.usersettingaction} aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
      <Avatar>{ authInfo.userInfo.user_full_name.substring(0,1)  } </Avatar>
    </div> 
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={openusersetting}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem> */}
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>

    {/*  */}
        </Toolbar> 
      </AppBar>
      <Drawer 
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
            <b className={classes.companyTitle} >  {authInfo.institution}</b>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <List>
            { 
              currentRoute=='stock'?( 
                <>
                <Link to="/stock" className={classes.linkStyle} >
                <ListItem button key="HomeIcon">
                  <ListItemText className="module-text" primary={"Inventory  Module"} />
                </ListItem> 
                </Link>


               </>
              ):''

              
            }

            {
              currentRoute=='sales'?( 
                <>
                <Link to="/sales" className={classes.linkStyle} >
                <ListItem button key="HomeIcon">
                  <ListItemText className="module-text" primary={"Sales Module"} />
                </ListItem> 
                </Link>
               </>
              ):''
            }

{
              currentRoute=='service'?( 
                <>
                <Link to="/service" className={classes.linkStyle} >
                <ListItem button key="HomeIcon">
                  <ListItemText className="module-text" primary={"Service Module"} />
                </ListItem> 
                </Link>
               </>
              ):''
            }

           {
              currentRoute=='purchase'?( 
                <>
                <Link to="/purchase" className={classes.linkStyle} >
                <ListItem button key="HomeIcon">
                  <ListItemText className="module-text" primary={"Purchase Module"} />
                </ListItem> 
                </Link>
               </>
              ):''
            }

{
              currentRoute=='production'?( 
                <>
                <Link to="/production" className={classes.linkStyle} >
                <ListItem button key="HomeIcon">
                  <ListItemText className="module-text" primary={"Manufacturing Module"} />
                </ListItem> 
                </Link>
               </>
              ):''
            }

             {
              currentRoute=='accounts'?( 
                <>
                <Link to="/accounts" className={classes.linkStyle} style={{fontSize:'14px'}}>
                <ListItem button key="HomeIcon" style={{fontSize:'14px'}}>
                  <ListItemText className="module-text"  primary={"Financial Accounts"} />
                </ListItem> 
                </Link>
               </>
              ):''
            }


{
              currentRoute=='service'?( 
                <>

              {
        accessChecker('service_entry') > -1?(

          <Link to="/service/service-entry" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Services Entry"} />
          </ListItem> 
          </Link> 

            ):''
           }


            {
        accessChecker('service_expense_entry') > -1?( 

          <Link to="/service/service-purchase-entry" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Services Expense Entry"} />
          </ListItem> 
          </Link> 

            ):''
           } 

      


             {
        accessChecker('service_record') > -1?(

          <Link to="/service/service-record" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Services Record"} />
          </ListItem> 
          </Link> 

             ):''
           }


             {
        accessChecker('service_expense_record') > -1?(

          <Link to="/service/service-expense-record" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Services Expense Record"} />
          </ListItem> 
          </Link> 

            ):''
           }

              {
        accessChecker('service_invoice') > -1?(

          <Link to="/service/service-invoice" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Services Invoice"} />
          </ListItem> 
          </Link> 

             ):''
           } 


   {
        accessChecker('service_expense_invoice') > -1?( 

<Link to="/service/service-item-invoice" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Services Expense Invoice"} />
          </ListItem> 
          </Link> 

            ):''
           } 
        {
        accessChecker('service_report') > -1?( 

        <Link to="/service/services-report" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Services Report"} />
          </ListItem> 
          </Link> 

          ):''
           } 

                
               </>
              ):''
            }

               {
              currentRoute=='reports'?( 
                <>


          <Link to="/reports" className={classes.linkStyle} >
          <ListItem button key="HomeIcon">
            <ListItemText className="module-text" primary={"Reports Module"} />
          </ListItem> 
          </Link>
           
  
               
{
        accessChecker('r_profit_loss') > -1?(
          <Link to="/reports/cash_bank_balance" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Cash & Bank Balance"} />
          </ListItem> 
          </Link> 

            ):''
   }
                
             
                {
        accessChecker('r_profit_loss') > -1?(
          <Link to="/reports/profit-loss" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Profit & Loss"} />
          </ListItem> 
          </Link> 

            ):''
   }





{
        accessChecker('r_product_stock') > -1?(
<Link to="/reports/product-stock-report" className={classes.linkStyle}>
        <ListItem button key="StyleIcon">
          <ListItemText primary={"Product Stock"} />
        </ListItem> 
        </Link> 

            ):''
   }

{
        accessChecker('r_material_stock') > -1?(

          <Link to="/reports/material-stock" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Material Stock "} />
          </ListItem> 
          </Link> 
            ):''
   }
  {
        accessChecker('daily_ledger') > -1?( 
          <Link to="/reports/daily-ledger" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Daily Ledger"} />
          </ListItem> 
          </Link>

            ):''
   } 

{
        accessChecker('cash_ledger') > -1?( 
          <Link to="/reports/cash-ledger" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Cash Ledger"} />
          </ListItem> 
          </Link>

            ):''
   }


 

 {
        accessChecker('bank_account_ledger') > -1?( 
          <Link to="/reports/bank-ledger" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Bank Account   Ledger"} />
          </ListItem> 
          </Link> 

             ):''
    } 


{
        accessChecker('r_customer_ledger') > -1?(
          <Link to="/reports/customer-ledger" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Customer   Ledger"} />
          </ListItem> 
          </Link> 

            ):''
   }

      
{
        accessChecker('r_supplier_ledger') > -1?(
<Link to="/reports/supplier-ledger" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Supplier  Ledger"} />
</ListItem> 
</Link> 

            ):''
   }


{
        accessChecker('r_material_ledger') > -1?(
<Link to="/reports/material-ledger" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Material Ledger "} />
</ListItem> 
</Link> 

            ):''
   }



{
        accessChecker('r_product_ledger') > -1?(
<Link to="/reports/product-ledger" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Product Ledger"} />
</ListItem> 
</Link> 

            ):''
   }


{
        accessChecker('r_supplier_due_list') > -1?(


<Link to="/reports/supplier-due-list" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Supplier Due Report"} />
</ListItem> 
</Link> 
            ):''
   }


{
        accessChecker('r_customer_due_list') > -1?(
<Link to="/reports/customer-due-list" className={classes.linkStyle}>
        <ListItem button key="StyleIcon">
          <ListItemText primary={"Customer  Due Report"} />
        </ListItem> 
        </Link> 

            ):''
   }

{
        accessChecker('r_cash_statement') > -1?(
          <Link to="/reports/cash_statement" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Cash Statement"} />
          </ListItem> 
          </Link> 

            ):''
   }

{
        accessChecker('r_sales_invoice') > -1?(

          <Link to="/reports/sales-invoice" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Sales Invoice"} />
          </ListItem> 
          </Link> 

            ):''
   }
        
 {
        accessChecker('customer_transaction_invoice') > -1?( 

          <Link to="/reports/customer-transactions" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Customer Tran. Invoice"} />
          </ListItem> 
          </Link>
             ):''
   } 


        {
        accessChecker('r_quotation_invoice') > -1?(

<Link to="/reports/quotation-invoice" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Quotation Invoice"} />
</ListItem> 
</Link> 
            ):''
   }


{
        accessChecker('r_purchase_invoice') > -1?(

<Link to="/reports/purchase-invoice" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Product Purchase Invoice"} />
</ListItem> 
</Link> 
            ):''
   }



{
        accessChecker('r_production_invoice') > -1?(

<Link to="/reports/production-invoice" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Production  Invoice"} />
</ListItem> 
</Link> 
            ):''
   }


{
        accessChecker('r_material_purchase_invoice') > -1?(
<Link to="/reports/material-purchase-invoice" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Material Purchase Invoice"} />
</ListItem> 
</Link> 

            ):''
   }


{
        accessChecker('r_customer_transaction') > -1?(
<Link to="/reports/customer-transation-history" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Customer   Transactions"} />
</ListItem> 
</Link> 

            ):''
   }

{
        accessChecker('r_supplier_transaction') > -1?(

<Link to="/reports/supplier-transaction-history" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Supplier  Transactions"} />
</ListItem> 
</Link> 
            ):''
   }

{
        accessChecker('r_cash_transaction') > -1?(

<Link to="/reports/cash-transaction-report" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Others Transaction Report"} />
</ListItem> 
</Link> 
            ):''
   }



{
        accessChecker('r_bank_transaction') > -1?(

<Link to="/reports/bank-transaction-report" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Bank Transaction Report"} />
</ListItem> 
</Link> 

            ):''
   }

{
        accessChecker('r_salary_payment') > -1?(

          <Link to="/reports/salary-payment-report" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Salary Payment Report"} />
          </ListItem> 
          </Link> 
          
            ):''
   }



   {
     accessChecker('r_sales_record') > -1?(
      <Link to="/reports/sales-record" className={classes.linkStyle}>
      <ListItem button key="StyleIcon">
        <ListItemText primary={"Sales Record"} />
      </ListItem> 
      </Link> 
     ):''
   }   


{
        accessChecker('r_quotation_record') > -1?(
<Link to="/reports/quotation-record" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Quotation Record"} />
</ListItem> 
</Link> 
            ):''
   }

{
        accessChecker('r_purchase_record') > -1?(

<Link to="/reports/purchase-record" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Product Purchase Record"} />
</ListItem> 
</Link> 
            ):''
   }

{
        accessChecker('r_production_record') > -1?(
<Link to="/reports/production-record" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Production Record "} />
</ListItem> 
</Link> 

            ):''
   }


{
        accessChecker('r_material_pur_record') > -1?(
<Link to="/reports/material-purchase-record" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Material Purchase Record "} />
</ListItem> 
</Link> 


            ):''
   }


{
        accessChecker('r_prod_transfer_record') > -1?(
<Link to="/reports/transfer-record" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Product Transfer Record"} />
</ListItem> 
</Link> 


            ):''
   }


{
        accessChecker('r_prod_receive_record') > -1?(
<Link to="/reports/receive-record" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Product Receive Record"} />
</ListItem> 
</Link> 

            ):''
   }


       
{
        accessChecker('r_sales_return_list') > -1?(
<Link to="/reports/sales-return-list" className={classes.linkStyle}>
        <ListItem button key="StyleIcon">
          <ListItemText primary={"Sales Return List"} />
        </ListItem> 
        </Link> 


            ):''
   }



{
        accessChecker('r_purchase_return_list') > -1?(

<Link to="/reports/purchase-return-list" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Product Purchase Return List"} />
</ListItem> 
</Link> 

            ):''
   }

{
        accessChecker('r_customer_list') > -1?(
          <Link to="/reports/customer-list" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Customer   List"} />
          </ListItem> 
          </Link> 

            ):''
   }
 

 {
        accessChecker('r_supplier_list') > -1?(


<Link to="/reports/supplier-list" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Supplier  List"} />
</ListItem> 
</Link> 
            ):''
   }
       
       {
        accessChecker('r_material_damage_list') > -1?(
<Link to="/reports/material-damage-list" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Material Damage List "} />
</ListItem> 
</Link>

            ):''
   }



{
        accessChecker('r_material_list') > -1?(
<Link to="/reports/material-list" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Material  List "} />
</ListItem> 
</Link> 


            ):''
   }

{
        accessChecker('r_product_damage_list') > -1?(

<Link to="/reports/product-damage-list" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Product Damage Record"} />
</ListItem> 
</Link> 
            ):''
   }


{
        accessChecker('r_product_list') > -1?(

<Link to="/reports/product-list" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Product List"} />
</ListItem> 
</Link> 
            ):''
   }


{
        accessChecker('product_re_order_list') > -1?(

<Link to="/reports/product-re-order-list" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Product Re-Order List"} />
</ListItem> 
</Link> 
            ):''
   }




{
        accessChecker('material_re_order_list') > -1?(

<Link to="/reports/material-re-order-list" className={classes.linkStyle}>
<ListItem button key="StyleIcon">
  <ListItemText primary={"Material Re-Order List"} />
</ListItem> 
</Link> 
            ):''
   }
               </>
              ):''
            }

            {
              currentRoute=='hrpayroll'?( 
                <>
                <Link to="/hrpayroll" className={classes.linkStyle} >
                <ListItem button key="HomeIcon">
                  <ListItemText className="module-text" primary={"HR&Payroll Module"} />
                </ListItem> 
                </Link>
               </>
              ):''
            }
            
            {
              currentRoute=='administration'?( 
                <>
                <Link to="/administration" className={classes.linkStyle} >
                <ListItem button key="HomeIcon">
                  <ListItemText className="module-text" primary={"Administration"} />
                </ListItem> 
                </Link>
               </>
              ):''
            }

            
                
            {
            currentRoute=='' || currentRoute=='dashboard' ?(
              <Fragment>
            <Link to="/sales" className={classes.linkStyle} >
            <ListItem button key="StyleIcon">
              <ListItemIcon><ShopIcon className={classes.drawerIconColor} style={{color:'#5F8407'}}/></ListItemIcon>
              <ListItemText primary={"Sales Module"} />
            </ListItem> 
            </Link> 
            <Link to="/purchase" className={classes.linkStyle} >
            <ListItem button key="StyleIcon">
              <ListItemIcon><EmojiTransportationIcon className={classes.drawerIconColor} style={{color:'#AF8000'}}/></ListItemIcon>
              <ListItemText primary={"Purchase Module"} />
            </ListItem> 
            </Link> 

            <Link to="/production" className={classes.linkStyle} >
            <ListItem button key="StyleIcon">
              <ListItemIcon><HomeWorkIcon className={classes.drawerIconColor} style={{color:'#0C717D'}}/></ListItemIcon>
              <ListItemText primary={"Manufacturing Module"} />
            </ListItem> 
            </Link> 

            <Link to="/stock" className={classes.linkStyle} >
            <ListItem button key="StyleIcon">
              <ListItemIcon><StoreMallDirectoryIcon className={classes.drawerIconColor} style={{color:'#0D8C30'}}/></ListItemIcon>
              <ListItemText primary={"Inventory Module"} />
            </ListItem> 
            </Link> 

            <Link to="/accounts" className={classes.linkStyle} >
            <ListItem button key="StyleIcon">
              <ListItemIcon><AccountBalanceIcon className={classes.drawerIconColor} style={{color:'#1e8f9c'}}/></ListItemIcon>
              <ListItemText primary={"Financial Accounts"} />
            </ListItem> 
            </Link> 
            <Link to="/hrpayroll" className={classes.linkStyle} >
            <ListItem button key="StyleIcon"> 
              <ListItemIcon><SupervisorAccountIcon className={classes.drawerIconColor} style={{color:'#0F7E77'}}/></ListItemIcon>
              <ListItemText primary={"HR & Payroll"} />
            </ListItem> 
            </Link> 
            <Link to="/reports" className={classes.linkStyle} >
            <ListItem button key="StyleIcon">
              <ListItemIcon><NoteIcon className={classes.drawerIconColor} style={{color:'#7D1C1C'}}/></ListItemIcon>
              <ListItemText primary={"Reports Module"} />
            </ListItem> 
            </Link> 

            <Link to="/administration" className={classes.linkStyle} >
            <ListItem button key="StyleIcon">
              <ListItemIcon><BuildIcon className={classes.drawerIconColor} style={{color:'#00691D'}}/></ListItemIcon>
              <ListItemText primary={"Administration"} />
            </ListItem> 
            </Link> 
 
            </Fragment>
                ):''
            }
            {
              currentRoute=='stock'?(
               <>

           
       

{
        accessChecker('product_transfer') > -1?(
          <Link to="/stock/product-transfer" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Product Transfer Entry"} />
          </ListItem> 
          </Link> 

            ):''
   }
               {
        accessChecker('product_damage') > -1?(
          <Link to="/stock/product-damage" className={classes.linkStyle}>
            <ListItem button key="StyleIcon">
              <ListItemText primary={"Product Damage Entry"} />
            </ListItem> 
            </Link> 

            ):''
   }

{
        accessChecker('material_damage') > -1?(
          <Link to="/stock/material-damage" className={classes.linkStyle}>
            <ListItem button key="StyleIcon">
              <ListItemText primary={"Material Damage Entry"} />
            </ListItem> 
            </Link> 

            ):''
   }
    

    {
        accessChecker('product_stock') > -1?(

          <Link to="/stock/product-stock-report" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Product  Stock"} />
          </ListItem> 
          </Link> 
            ):''
   }

{
        accessChecker('material_stock_m') > -1?(
          <Link to="/stock/material-stock" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Material Stock"} />
          </ListItem> 
          </Link> 

            ):''
   }

           
{
        accessChecker('product_ledger') > -1?(
          <Link to="/stock/product-ledger" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Product Ledger "} />
          </ListItem> 
          </Link> 


            ):''
   }
   {
        accessChecker('material_ledger') > -1?(
<Link to="/stock/material-ledger" className={classes.linkStyle}>
            <ListItem button key="StyleIcon">
              <ListItemText primary={"Material Ledger "} />
            </ListItem> 
            </Link> 


            ):''
   }
           {
        accessChecker('product_transfer_list') > -1?(

          <Link to="/stock/transfer-record" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Product Transfer List"} />
          </ListItem> 
          </Link> 

            ):''
   }

{
        accessChecker('product_receive_list') > -1?(
          <Link to="/stock/receive-record" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Product Receive List"} />
          </ListItem> 
          </Link> 

            ):''
   }

{
        accessChecker('product_damage_list') > -1?(
          <Link to="/stock/product-damage-list" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Product Damage List"} />
          </ListItem> 
          </Link> 

            ):''
   }
           
           {

        accessChecker('material_damage_list') > -1?(
          <Link to="/stock/material-damage-list" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Material Damage List"} />
          </ListItem> 
          </Link> 

            ):''
   }
            
           {
        accessChecker('product_price_list') > -1?(
          <Link to="/stock/product-list" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Product Price List"} />
          </ListItem> 
          </Link> 

            ):''
   }



{
        accessChecker('product_re_order_list') > -1?(
<Link to="/stock/product-re-order-list" className={classes.linkStyle}>
            <ListItem button key="StyleIcon">
              <ListItemText primary={"Product Re-Order  List "} />
            </ListItem> 
            </Link> 


            ):''
   }
            
            {
        accessChecker('material_re_order_list') > -1?(
<Link to="/stock/material-re-order-list" className={classes.linkStyle}>
            <ListItem button key="StyleIcon">
              <ListItemText primary={"Material Re-Order  List "} />
            </ListItem> 
            </Link> 


            ):''
   }
         

            
         
             
            


            
               </>
              ):''
            }
           {/* Sales's Menus */}
           {
            currentRoute=='sales'?(
              <Fragment>

                {
                  accessChecker('sales_entry') > -1?(
                    <Link to="/sales/sales-entry" className={classes.linkStyle}>
                    <ListItem button key="StyleIcon">
                      <ListItemText primary={"Sales Entry"} />
                    </ListItem> 
                    </Link> 
                  ):''
                }


{
        accessChecker('customer_entry') > -1?(
                
            <Link to="/sales/customers-manage" className={classes.linkStyle}>
            <ListItem button key="StyleIcon">
              <ListItemText primary={"Customer Entry "} />
            </ListItem> 
            </Link> 

            ):''
   }


{
        accessChecker('sales_return') > -1?(
          <Link to="/sales/sales-return" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Sales Return Entry"} />
          </ListItem> 
          </Link> 

            ):''
   }
          

          {
        accessChecker('quotation_entry') > -1?(
          <Link to="/sales/quotation-entry" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Quotation Entry "} />
          </ListItem> 
          </Link> 
            ):''
   }
           

              {
                accessChecker('sales_record') > -1?(
                  <Link to="/sales/sales-record" className={classes.linkStyle}>
                  <ListItem button key="StyleIcon">
                    <ListItemText primary={"Sales Record"} />
                  </ListItem> 
                  </Link> 
                ):''
              }


            {
              accessChecker('sales_invoice') > -1?(
                <Link to="/sales/sales-invoice" className={classes.linkStyle}>
                <ListItem button key="StyleIcon">
                  <ListItemText primary={"Sales Invoice"} />
                </ListItem> 
                </Link>
              ):''
            }

            {
        accessChecker('quotation_record') > -1?(
          <Link to="/sales/quotation-record" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Quotation Record "} />
          </ListItem> 
          </Link> 
            ):''
   }

            
{
        accessChecker('quotation_invoice') > -1?(
<Link to="/sales/quotation-invoice" className={classes.linkStyle}>
            <ListItem button key="StyleIcon">
              <ListItemText primary={"Quotation Invoice "} />
            </ListItem> 
            </Link> 

            ):''
   }
            
   
        
        {
        accessChecker('sales_return_record') > -1?(
          <Link to="/sales/sales-return-list" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Sales Return Record"} />
          </ListItem> 
          </Link>

            ):''
   }
         {
        accessChecker('customer_due_list') > -1?(

          <Link to="/sales/customer-due-list" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Customer Due Report"} />
          </ListItem> 
          </Link>

            ):''
   }

         {
        accessChecker('customer_list') > -1?(
          <Link to="/sales/customer-list" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Customer List"} />
          </ListItem> 
          </Link> 
            

            ):''
   }
       
       
         
           
       {
        accessChecker('customer_ledger') > -1?(
          <Link to="/sales/customer-ledger" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Customer Ledger"} />
          </ListItem> 
          </Link>

            ):''
   }

           

           
{
        accessChecker('customer_transaction') > -1?(
          <Link to="/sales/customer-transation-history" className={classes.linkStyle}>
          <ListItem button key="StyleIcon" style={{fontSize:'10px'}}>
            <ListItemText primary={"Customer Transaction History"} />
          </ListItem> 
          </Link>

            ):''
   }
           

            </Fragment>
            
        
              ):''
            }
            {
              currentRoute=='accounts'?(
                <Fragment>


{
        accessChecker('customer_transaction_m') > -1?(

          <Link to="/accounts/customer-payments-manage" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Customer TransactionEntry"} />
          </ListItem> 
          </Link>
            ):''
   }

       


                 {
        accessChecker('supplier_payment') > -1?(
<Link to="/accounts/supplier-payments-manage" className={classes.linkStyle}>
                  <ListItem button key="StyleIcon">
                    <ListItemText primary={"Supplier Transaction Entry"} />
                  </ListItem> 
                  </Link>

            ):''
   }


    
{
        accessChecker('bank_transaction') > -1?(

          <Link to="/accounts/bank-transactions-manage" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Bank Transaction Entry"} />
          </ListItem> 
          </Link>

            ):''
   }


           {
        accessChecker('cash_transaction') > -1?(
          <Link to="/accounts/cash-transactions-manage" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Others Transaction Entry"} />
          </ListItem> 
          </Link>

            ):''
   }

   
{
        accessChecker('transaction_accounts') > -1?(
<Link to="/accounts/transaction-accounts-manage" className={classes.linkStyle}>
                  <ListItem button key="StyleIcon">
                    <ListItemText primary={"Others Transaction Acc. Entry"} />
                  </ListItem> 
                  </Link>

            ):''
   }
                    {
        accessChecker('bank_accounts') > -1?(

          <Link to="/accounts/bank-accounts-manage" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Bank Account Entry"} />
          </ListItem> 
          </Link>
            ):''
   }

{
        accessChecker('cash_transaction_d_w') > -1?(

          <Link to="/accounts/cash-deposit-withdraw" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Cash Transaction Entry"} />
          </ListItem> 
          </Link>
            ):''
   }



{
        accessChecker('customer_transaction_invoice') > -1?( 

          <Link to="/accounts/customer-transactions" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Customer Tran. Invoice"} />
          </ListItem> 
          </Link>
             ):''
   } 
   
         

   










                  

                  {
        accessChecker('bank_transaction_report_m') > -1?(
          <Link to="/accounts/bank-transaction-report" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Bank Transaction Report"} />
          </ListItem> 
          </Link>

            ):''
   }

{
        accessChecker('r_customer_transaction') > -1?(
          <Link to="/accounts/customer-transation-history" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Customer Transaction Report"} />
          </ListItem> 
          </Link>

            ):''
   }
{
        accessChecker('r_supplier_transaction') > -1?(
          <Link to="/accounts/supplier-transation-history" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Supplier Transaction Report"} />
          </ListItem> 
          </Link>

            ):''
   }
{
        accessChecker('cash_transaction_report') > -1?(
          <Link to="/accounts/cash-transaction-report" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Others Transaction Report"} />
          </ListItem> 
          </Link>

            ):''
   }



{
        accessChecker('bank_account_ledger') > -1?( 

          <Link to="/accounts/bank-ledger" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Bank Account Ledger"} />
          </ListItem> 
          </Link>
             ):''
   } 

{
        accessChecker('cash_ledger') > -1?( 
          <Link to="/accounts/cash-ledger" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Cash Ledger"} />
          </ListItem> 
          </Link>

            ):''
   }


   {
        accessChecker('daily_ledger') > -1?( 
          <Link to="/accounts/daily-ledger" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Daily Ledger"} />
          </ListItem> 
          </Link>

            ):''
   } 


                 
                </Fragment>
              ):''
            }


                
       
                  



            {
               currentRoute=='production'?(
                  <>
                    {
        accessChecker('production_entry') > -1?(
          <Link to="/production/production-entry" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Production Entry"} />
          </ListItem> 
          </Link>

            ):''
   }
                 
                 {
        accessChecker('material_purchase') > -1?(
<Link to="/production/material-purchase-entry" className={classes.linkStyle}>
                  <ListItem button key="StyleIcon">
                    <ListItemText primary={"Material Purchase Entry"} />
                  </ListItem> 
                  </Link>

            ):''
   }


{
        accessChecker('supplier_entry') > -1?(
<Link to="/production/suppliers-manage" className={classes.linkStyle}>
                  <ListItem button key="StyleIcon">
                    <ListItemText primary={"Supplier Entry"} />
                  </ListItem> 
                  </Link>

            ):''
   }
                 
                 {
        accessChecker('material_entry') > -1?(
<Link to="/production/material-entry" className={classes.linkStyle}>
                  <ListItem button key="StyleIcon">
                    <ListItemText primary={"Material Entry"} />
                  </ListItem> 
                  </Link>

            ):''
   }


{
        accessChecker('material_damage_entry') > -1?(
<Link to="/production/material-damage-entry" className={classes.linkStyle}>
                  <ListItem button key="StyleIcon">
                    <ListItemText primary={"Material Damage Entry"} />
                  </ListItem> 
                  </Link>
            ):''
   }


                   
{
        accessChecker('material_names') > -1?(
          <Link to="/production/material-name-entry" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Material Names Manage"} />
          </ListItem> 
          </Link>
            ):''
   }
  
  {
        accessChecker('production_invoice') > -1?(
          <Link to="/production/production-invoice" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Production Invoice"} />
          </ListItem> 
          </Link>
            ):''
   }
                  
                 
                  {
        accessChecker('material_purchase_invoice') > -1?(
<Link to="/production/material-purchase-invoice" className={classes.linkStyle}>
                  <ListItem button key="StyleIcon">
                    <ListItemText primary={"Material Purchase Invoice"} />
                  </ListItem> 
                  </Link>

            ):''
   }
                    {
        accessChecker('material_stock') > -1?(
          <Link to="/production/material-stock" className={classes.linkStyle}>
                  <ListItem button key="StyleIcon">
                    <ListItemText primary={"Material Stock"} />
                  </ListItem> 
                  </Link>
            ):''
   }
                    {
        accessChecker('material_ledger') > -1?(
          <Link to="/production/material-ledger" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Material Ledger"} />
          </ListItem> 
          </Link>

            ):''
   }

{
        accessChecker('production_record') > -1?(
          <Link to="/production/production-record" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Production Record"} />
          </ListItem> 
          </Link>

            ):''
   }

                 

{
        accessChecker('material_purchase_record') > -1?(
          <Link to="/production/material-purchase-record" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Material Purchase Record"} />
          </ListItem> 
          </Link>

            ):''
   }

{
        accessChecker('material_damage_list') > -1?(
<Link to="/production/material-damage-list" className={classes.linkStyle}>
                  <ListItem button key="StyleIcon">
                    <ListItemText primary={"Material Damage List"} />
                  </ListItem> 
                  </Link>

            ):''
   }

{
        accessChecker('material_list') > -1?(
<Link to="/production/material-list" className={classes.linkStyle}>
                  <ListItem button key="StyleIcon">
                    <ListItemText primary={"Material  List"} />
                  </ListItem> 
                  </Link>

            ):''
   }

                  

                  </>
               ):''
            }

            {
              currentRoute=='purchase'?(
               
                <Fragment>
               

                {
        accessChecker('purchase_entry') > -1?(
          <Link to="/purchase/purchase-entry" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Purchase Entry"} />
          </ListItem> 
          </Link>
            ):''
   }


{
        accessChecker('supplier_entry') > -1?(
          <Link to="/purchase/suppliers-manage" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Supplier Entry"} />
          </ListItem> 
          </Link>

            ):''
   }

                

{
        accessChecker('purchase_return') > -1?(
            
          <Link to="/purchase/purchase-return" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Purchase Return Entry"} />
          </ListItem> 
          </Link>

            ):''
   }

{
        accessChecker('purchase_record') > -1?(

          <Link to="/purchase/purchase-record" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Product Purchase Record"} />
          </ListItem> 
          </Link>
            ):''
   }

{
        accessChecker('purchase_invoice') > -1?(
<Link to="/purchase/purchase-invoice" className={classes.linkStyle}>
                <ListItem button key="StyleIcon">
                  <ListItemText primary={"Product Purchase Invoice"} />
                </ListItem> 
                </Link>

            ):''
   }



{
        accessChecker('purchase_return_list') > -1?(
          <Link to="/purchase/purchase-return-list" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Purchase Return List"} />
          </ListItem> 
          
          </Link>

            ):''
   }
               
               {
        accessChecker('supplier_due_list') > -1?(
<Link to="/purchase/supplier-due-list" className={classes.linkStyle}>
                <ListItem button key="StyleIcon">
                  <ListItemText primary={"Supplier Due Report"} />
                </ListItem> 
                </Link>

            ):''
   }

{
        accessChecker('supplier_list') > -1?(
          <Link to="/purchase/supplier-list" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Supplier  List"} />
          </ListItem> 
          </Link>

            ):''
   }

               
{
        accessChecker('supplier_ledger') > -1?(
          <Link to="/purchase/supplier-ledger" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Supplier Ledger"} />
          </ListItem> 
          </Link>

            ):''
   }
                {
        accessChecker('supplier_transaction') > -1?(
          <Link to="/purchase/supplier-transaction-history" className={classes.linkStyle}>
          <ListItem button key="StyleIcon">
            <ListItemText primary={"Supplier Transaction history"} />
          </ListItem> 
          </Link>

            ):''
   }
               
                </Fragment>
                
              ):''
            }
            {
              currentRoute=='hrpayroll'?(
                <Fragment> 
                 {
        accessChecker('salary') > -1?(
          <Link to="/hrpayroll/salary-payment" className={classes.linkStyle}>
          <ListItem button key="PermDataSettingIcon">
            <ListItemText primary={"Salary Payment Entry"} />
          </ListItem> 
          </Link>
            ):''
   }
     

{
        accessChecker('employee_manage') > -1?(
<Link to="/hrpayroll/employees-manage" className={classes.linkStyle}>
                  <ListItem button key="PermDataSettingIcon">
                    <ListItemText primary={"Employee Manage"} />
                  </ListItem> 
                  </Link>

            ):''
   }   

{
        accessChecker('designation_manage') > -1?(
<Link to="/hrpayroll/designations-manage" className={classes.linkStyle}>
                  <ListItem button key="PermDataSettingIcon">
                    <ListItemText primary={"Designation Manage"} />
                  </ListItem> 
                  </Link>

            ):''
   }

{
        accessChecker('department_manage') > -1?(
<Link to="/hrpayroll/departments-manage" className={classes.linkStyle}>
                  <ListItem button key="PermDataSettingIcon">
                    <ListItemText primary={"Department Manage"} />
                  </ListItem> 
                  </Link>

            ):''
   }
                   {
        accessChecker('month_manage') > -1?(
<Link to="/hrpayroll/months-manage" className={classes.linkStyle}>
                  <ListItem button key="PermDataSettingIcon">
                    <ListItemText primary={"Month Manage"} />
                  </ListItem> 
                  </Link>

            ):''
   }
                  

                  {
        accessChecker('salary_report') > -1?(

          <Link to="/hrpayroll/salary-payment-report" className={classes.linkStyle}>
          <ListItem button key="PermDataSettingIcon">
            <ListItemText primary={"Salary Payment   Report"} />
          </ListItem> 
          </Link>
            ):''
   }


                </Fragment>
              ):''
            }
            {/* Administrator's Menus */}
            {
            currentRoute=='administration'?(
              <Fragment>

{
        accessChecker('product_manage') > -1?(
          <Link to="/administration/products-manage" className={classes.linkStyle}>
          <ListItem button key="PermDataSettingIcon">
            <ListItemText primary={"Product Entry"} />
          </ListItem> 
          </Link> 

            ):''
   }


{
        accessChecker('material_entry') > -1?(
          <Link to="/administration/material-entry" className={classes.linkStyle}>
          <ListItem button key="PermDataSettingIcon">
            <ListItemText primary={"Material Entry"} />
          </ListItem> 
          </Link> 

            ):''
   }


{
        accessChecker('product_name_entry') > -1?(
          <Link to="/administration/prod-names-manage" className={classes.linkStyle}>
          <ListItem button key="PermDataSettingIcon">
            <ListItemText primary={"Product Name Entry"} />
          </ListItem> 
          </Link> 

            ):''
   }

{
        accessChecker('material_name') > -1?(
          <Link to="/administration/material-name-entry" className={classes.linkStyle}>
          <ListItem button key="PermDataSettingIcon">
            <ListItemText primary={"Material Name Entry"} />
          </ListItem> 
          </Link> 

            ):''
   }


               
{
        accessChecker('area_manage') > -1?(

          <Link to="/administration/areas-manage" className={classes.linkStyle}>
          <ListItem button key="PermDataSettingIcon">
            <ListItemText primary={"Area Manage"} />
          </ListItem> 
          </Link> 
            ):''
   }
          
    
           
           {
        accessChecker('product_category') > -1?(
<Link to="/administration/prod-category-manage" className={classes.linkStyle}>
            <ListItem button key="PermDataSettingIcon">
              <ListItemText primary={"Product Categories"} />
            </ListItem> 
            </Link> 

            ):''
   }
            

            {/* <Link to="/administration/prod-brands-manage" className={classes.linkStyle}>
            <ListItem button key="PermDataSettingIcon">
              <ListItemIcon><StyleIcon className={classes.drawerIconColor}/></ListItemIcon>
              <ListItemText primary={"Product Brands"} />
            </ListItem> 
            </Link>  */}
{/*            
            <Link to="/administration/prod-colors-manage" className={classes.linkStyle}>
            <ListItem button key="PermDataSettingIcon">
              <ListItemIcon><StyleIcon className={classes.drawerIconColor}/></ListItemIcon>
              <ListItemText primary={"Product Colors"} />
            </ListItem> 
            </Link>  */}

{
        accessChecker('product_unit') > -1?(
<Link to="/administration/prod-units-manage" className={classes.linkStyle}>
            <ListItem button key="PermDataSettingIcon">
              <ListItemText primary={"Product Units"} />
            </ListItem> 
            </Link> 

            ):''
   }
            
            {
        accessChecker('user_manage')  > -1 || authInfo.role =='super_admin' ?(
<Link to="/administration/users-manage" className={classes.linkStyle}>
            <ListItem button key="PermDataSettingIcon">
              <ListItemText primary={"Users Manage"} />
            </ListItem> 
            </Link> 

            ):''
   }

            
            {/* <Link to="/administration/warehouses-manage" className={classes.linkStyle}>
            <ListItem button key="PermDataSettingIcon">
              <ListItemIcon><StyleIcon className={classes.drawerIconColor}/></ListItemIcon>
              <ListItemText primary={"Warehouse Manage"} />
            </ListItem> 
            </Link> */}

{
        accessChecker('branch_manage') > -1?(

          <Link to="/administration/branches-manage" className={classes.linkStyle}>
          <ListItem button key="PermDataSettingIcon">
            <ListItemText primary={"Branch Manage"} />
          </ListItem> 
          </Link> 

            ):''
   }

{
        accessChecker('company_profile') > -1?(
          <Link to="/administration/institution-profile" className={classes.linkStyle}>
          <ListItem button key="PermDataSettingIcon">
            <ListItemText primary={"Company Profile"} />
          </ListItem> 
          </Link> 

            ):''
   }
           
            
            </Fragment>
              ):''
            }
            
        </List>
      </Drawer>




      
    {/* Switch Branch  Modal */}
     <Modal
        open={branchSwitch}
        onClose={() => branchSwitchSet(false)}
        center
        style={{minWidth:'300px',minHeight:'500px'}}
 
      
      >
        <Grid item xs={12} sm={12}  > 
         
        <Autocomplete
                
                style={{ width: '100%',padding:'10px' }}
                options={branches} 
                size="small"
               
                getOptionLabel={(option) =>option.branch_name}
               
                value={selectedBranch}
                onChange={(event,selectedObj)=>{
                  selectedBranchSet(selectedObj)
                }}
                renderInput={(params) => (
                    <TextField
                    
                    {...params}
                    type="text"
                    autoComplete="off"
                    label="Switch a Branch"
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



<Grid item xs={12} sm={12} style={{marginTop:'6px',marginLeft:'10px'}} > 
            <TextField   type="text" autoComplete="off"  className={classes.fullWidth}  value={user_password} 
            label="Enter your  password" name="user_password" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>user_password_set(e.target.value)}
           
            />
            
            </Grid>




          <Button style={{marginTop: '25px'}}
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<SaveIcon/>}
            onClick={()=>actionToSwitch()}
        >
        Switch To Branch
      </Button>



         
        </Grid>


        
      </Modal>
      </div>
      
  )
}
function mapStateToProps(state){
      return {
          currentRoute:state.currentRouteReducer,
          authInfo:state.authInfoReducer
      }
}
export default connect(mapStateToProps,{updatedCategorySet,createdCategorySet,disableRestoreSet,
  createdBrandSet,updatedBrandSet,brandDisableRestoreSet,
  createdColorSet,updatedColorSet,disableRestoreColorSet,createdUnitSet,updatedUnitSet,disableRestoreUnitSet,
  createdBranchSet,updatedBranchSet,disableRestoreBranchSet,
  createdWarehouseSet,updatedWarehouseSet,disableRestoreWarehouseSet,
  createdAreaSet,updatedAreaSet,disableRestoreAreaSet,
  createdProdNameSet,updatedProdNameSet,disableRestoreProdNameSet,
  createdProductSet,updatedProductSet,productCodeSet,disableRestoreProductSet,customerCodeSet,
  createdCustomerSet,updatedCustomerSet,disableRestoreCustomerSet,
  createdSupplierSet,updatedSupplierSet,disableRestoreSupplierSet,
  createdDesignationSet,updatedDesignationSet,disableRestoreDesignationSet,
  createdDepartmentSet,updatedDepartmentSet,disableRestoreDepartmentSet,
  createdMonthSet,updatedMonthSet,disableRestoreMonthSet,
  createdEmployeeSet,updatedEmployeeSet,employeeDisableRestoreSet,employeeCodeSet,
  createdTranAccSet,updatedTranAccSet,tranAccDisableRestoreSet,tranAccCodeSet,
  createdBankAccSet,bankAccCodeSet,updatedBankAccSet,
  createdCashTranSet,updatedCashTranSet,cashTranDisableRestoreSet,cashTranCodeSet,
  createdBankTranSet,updatedBankTranSet,bankTranDisableRestoreSet,bankTranCodeSet,
  createdCustomerPaySet,updatedCustomerPaySet,customerPayDisableRestoreSet,
  createdSupplierPaySet,updatedSupplierPaySet,supplierPayDisableRestoreSet,
  createdMaterialNameSet,updatedMaterialNameSet,disableRestoreMaterialNameSet,
  createdMaterialSet,updatedMaterialSet,materialCodeSet,disableRestoreMaterialSet,
})(Header)