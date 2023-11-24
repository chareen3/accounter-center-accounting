import React,{useState,useEffect,useRef} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet, productCodeSet} from '../../actions/actions';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'; 
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'
import {pathSpliter,dateTimeFormat,currentDateTime,getDateTimeFromISODT,currentDateStartTime,currentDateEndTime} from '../../lib/functions'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ReceiptIcon from '@material-ui/icons/Receipt';
import DateFnsUtils from '@date-io/date-fns'; // choose your libs
import {API_URL} from '../../config.json';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import SearchIcon from '@material-ui/icons/Search';
import moment from 'moment';
import _ from 'lodash';
import Barcode from 'react-barcode';
import ReactToPrint from "react-to-print";
import PrintIcon from '@material-ui/icons/Print';
import InstitutionProfile from '../commons/institution_profile'

import commaNumber from 'comma-number';

import '../commons/commons.css'
import { useBarcode } from 'react-barcodes';


import { useHistory } from "react-router-dom";


import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import swal from 'sweetalert';


let format = commaNumber.bindWith(',', '.')

const PurchaseRecord = ({location,currentRoute,currentRouteSet,authInfo})=>{
    const classes = useStyles();
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));

       

         axios.post(`${API_URL}/api/get-individual-products`,{productId:parseFloat(pathSpliter(location.pathname,3))},{headers:{'auth-token':authInfo.token}}).then(res=>{
            printSet(true)
            if(res.data.message.length !=0){
                product_code_set(res.data.message[0].prod_code)
                prodInfoSet(res.data.message[0]);

            }
         });
    },[]);
    let [users,usersSet] = useState([]);
    const history = useHistory();

    let [product_code,product_code_set] = useState('');
    let [bar_code_qty,bar_code_qty_set] = useState(5);
    
    let [suppliers,suppliersSet] = useState([]);
    let [materials,materialsSet] = useState([]);


    let [prodInfo,prodInfoSet] = useState([]);

    let [selectedSearchType,selectedSearchTypeSet] = useState({searchType:'All'})
    let [selectedMaterial,selectedMaterialSet] = useState(null)
    let [selectedUser,selectedUserSet] = useState(null)


    let employeeRef = React.useRef(null)
    let [searchResult,searchResultSet] = useState([]);
    let [print,printSet] = useState(false);


   


    let [byDateTime,byDateTimeSet] = useState({
          dateTimeFrom: currentDateStartTime(),
          dateTimeTo:currentDateEndTime()
    })

  



    



    let [searchTypes,searchTypesSet] = useState([{searchType:'All'},
    {searchType:'By User'}]);

    
    let getSearchResult = async ()=>{

        let url = `${API_URL}/api/get-materials`;

          if(selectedSearchType == null){
            swal({
              title:'Select search Type',
              icon:'warning',
           })
           return false
          }


            
        let reqPayload = {
            userId: selectedUser != null && selectedSearchType.searchType=='By User' ?selectedUser.user_id:null,
            fromDate: byDateTime.dateTimeFrom,
            toDate: byDateTime.dateTimeTo,
        }

       

        await axios.post(`${url}`,reqPayload,{headers:{'auth-token':authInfo.token}}).then(res=>{
           printSet(true)
           searchResultSet(res.data.message);

            
        });
    }

    

    const { inputRef } = useBarcode({
      value: `${product_code==''?'Product Code':product_code}`,
      options: {
        background: '#ffffff',
        width:1,
        height:30,
        margin:0,
        displayValue: false,

      }
    });

    let ReportDom = React.forwardRef((props,ref)=>{
        return(
          <div ref={ref} >
               {/* <InstitutionProfile /> */}

          
 


{
  <>
  {/* <div > */}
     <Paper className={classes.paper} style={{textAlign:'center',fontSize:'12px',color:'#222'}}  >

<p style={{padding:'0px',marginBottom: '0px',
    marginTop: '-10px',fontSize:'14px',color: '#222',
    fontWeight: 'bold',fontFamily:'sans-serif',fontSize:'18px'}}> {   prodInfo.prod_name != undefined ?prodInfo.prod_name.substring(0,15):''}</p>

        <svg ref={inputRef}  style={{fontSize:'12px'}} />
        <p style={{padding:'0px',marginTop:'1px',marginBottom: '-3px',fontFamily:'sans-serif',fontSize:'14px'}}>{product_code}</p>
        <p style={{padding:'0px',marginTop:'-2px',marginBottom: '-1px',fontWeight: 'bold',fontFamily:'sans-serif'}}>{'9'+parseFloat(prodInfo.prod_whole_sale_rate).toFixed(0)+'1'}</p>
        <p style={{margin:'0px',padding:'0px',fontFamily:'sans-serif',fontSize:'15px'}}>TK {format(parseFloat(prodInfo.prod_sale_rate).toFixed(2))}</p>
      </Paper> 


      {/* <p style={{margin:'0px',padding:'0px',transform: 'rotate(90deg)', marginLeft:' 124px',
    marginTop:'-24px'}}>Fair Touch</p> */}

  
  </>
  
}
      





   

     
      </div>
       )
      })
const reportRef = useRef();

    
      return(
          <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '12px'}}>Product BarCode Generator</h4>
<Grid container spacing={2}>
        <Grid item xs={12} sm={3}  > 
            <TextField  type="text" autoComplete='off'   className={classes.fullWidth}  value={product_code} 
            label="Product Code" name="product_code" variant="outlined" size="small" onChange={(e)=>product_code_set(e.target.value)} />
        </Grid>

        <Grid item xs={12} sm={3} style={{display:'none'}} > 
            <TextField  type="number" autoComplete='off'   className={classes.fullWidth}  value={bar_code_qty} 
            label="Bar Code Quantity" name="bar_code_qty" variant="outlined" size="small" onChange={(e)=>bar_code_qty_set(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={3}  > 
        <Button style={{marginTop: '10px',fontSize:'9px'}}
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            onClick={()=>history.push(`/administration/products-manage`)        }
        >
        Back To Product Page
      </Button>
        </Grid>
       
        </Grid>
        </Paper>
        
   
        {
        print?(
          <Grid container >
          <Grid item xs={12} sm={12} >
            <Paper style={{borderRadius:'0px',marginTop: '-7px'}}>
            <ReactToPrint
                        trigger={() => <PrintIcon  style={{cursor:'pointer',marginLeft: '30px',marginTop: '3px',marginBottom: '-8px'}} />}
                        content={() => reportRef.current}
                      />
            </Paper>
         
          </Grid>
      </Grid>
        ):''
      }
            <ReportDom ref={reportRef} /> 



          </div>
     )
    }


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    inputField:{
      width:'100%',
      marginTop:'5px'
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
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));


const mapStateToPops = (state)=>{
      return {
        currentRoute:state.currentRouteReducer,
        authInfo:state.authInfoReducer
      }
}
export default connect(mapStateToPops,{currentRouteSet})(PurchaseRecord); 