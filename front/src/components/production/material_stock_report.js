import React,{useState,useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet} from '../../actions/actions';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'; 
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'
import {pathSpliter,dateTimeFormat,currentDateTime,getDateTimeFromISODT} from '../../lib/functions'
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
import commaNumber from 'comma-number';

import PrintIcon from '@material-ui/icons/Print';
import  InstitutionProfile from '../commons/institution_profile'
import ReactToPrint from "react-to-print";

import _ from 'lodash';
import '../commons/commons.css'

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import swal from 'sweetalert';

const TransferRecord = ({location,currentRoute,currentRouteSet,authInfo})=>{
  const classes = useStyles();
  useEffect(()=>{
      currentRouteSet(pathSpliter(location.pathname,1));

  },[]);
  let [materials,materialsSet] = useState([]);
  let [categories,categoriesSet] = useState([]);
  let [brands,brandsSet] = useState([]);
  let [selectedMaterial,selectedMaterialSet] = useState(null);
  let [selectedCategory,selectedCategorySet] = useState(null);
  let [selectedBrand,selectedBrandSet] = useState(null);
  let [materialStockReports,materialStockReportsSet] = useState([]);
  let format = commaNumber.bindWith(',', '.')

  let [stockData,stockDataSet] = useState([]);
  let [reportLoading,reportLoadingSet] = useState(false);
  

  let [byDateTime,byDateTimeSet] = useState({
        fromDate: currentDateTime,
        toDate:currentDateTime
  });

  let supplierRef = useRef(null);
  let fromDateRef = useRef(null);
  let toDateRef = useRef(null);

  let reportRef = useRef(null);
  let [print,printSet] = useState(false);

  let [stockTypes,stockTypesSet] = useState([{'stock_type':'Current Stock'},{'stock_type':'Total Stock'},
      {'stock_type':'Material wise stock'},{'stock_type':'Category wise stock'}
      // ,{'stock_type':'Brand wise stock'}
    ]);
  let [selectedStockType,selectedStockTypeSet] = useState(null);



 let  getmaterial = async ()=>{
    await axios.post(`${API_URL}/api/get-materials`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>[
        materialsSet(res.data.message)
     ]);
  }

  let getCategories = ()=>{
    axios.post(`${API_URL}/api/get-categories`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
        categoriesSet(res.data.message)
    })
  }

  let getBrands = ()=>{
    axios.post(`${API_URL}/api/get-brands`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
        brandsSet(res.data.message)
    })
  }

  let getSearchResult = async ()=>{

      if(selectedStockType==null){
        swal({title:'Select Stock Type',icon:'warning'}); return false;
      }
      

      let payload = {
          materialId:  selectedStockType.stock_type =='Material wise stock' && selectedMaterial != null ? selectedMaterial.material_id:null,
          categoryId: selectedStockType.stock_type =='Category wise stock' && selectedCategory != null ? selectedCategory.prod_cat_id:null,
          brandId: selectedStockType.stock_type =='Brand wise stock' && selectedBrand != null? selectedBrand.prod_brand_id:null,
          fromDate: byDateTime.fromDate,
          toDate: byDateTime.toDate
      }

      let url = ``;
      if(selectedStockType.stock_type=='Current Stock'){
        url = `/get-material-current-stock-detail`
      }else{
        url = `/get-material-total-stock`
      }
      reportLoadingSet(true)
      await axios.post(`${API_URL}/api${url}`,{...payload},{headers:{'auth-token':authInfo.token}}).then(res=>{
            stockDataSet(res.data);
            printSet(true)
            reportLoadingSet(false)
      });

  }



  let ReportDom = React.forwardRef((props,ref)=>{
      return(
        <div ref={ref}>
           <InstitutionProfile />
           <div style={{clear:'both'}}></div>

           <p style={{width:'100%',textAlign:'center',fontWeight:'bold'}} className="print-source">Material Stock Report</p>

             {
     stockData.length>0 && selectedStockType != null && selectedStockType.stock_type=='Current Stock'?(
      <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
  

      <TableContainer >
        <Table className={classes.table} size="small" aria-label="a dense table" className="report-dom">
          <TableHead>
            <TableRow> 
              <TableCell align="left" style={{width:'1%'}}>SL</TableCell>
              <TableCell align="left" >Material Code</TableCell>
              <TableCell align="left" >Material Name </TableCell>
              <TableCell align="left">Category</TableCell> 
              <TableCell align="left">Purchase Avarage Rate</TableCell>
              <TableCell align="left">Current Quantity</TableCell>
              <TableCell align="right">Stock Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              
              {
                stockData.map((row,sl)=>(
                    <TableRow  key=""> 
                  <TableCell>{sl+parseFloat(1)}.</TableCell>
                  <TableCell  align="left">{row.material_code}</TableCell>
                  <TableCell  align="left">{row.material_name}</TableCell>
                  <TableCell  align="left">{row.prod_cat_name}</TableCell>
                  <TableCell  align="left">{format(parseFloat(row.material_purchase_rate).toFixed(2))}</TableCell>
                  <TableCell  align="left">{format(parseFloat(row.current_stock).toFixed(2))} {row.prod_unit_name}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.stock_value).toFixed(2))}</TableCell>
                   </TableRow>
                ))
              }
              <br></br>
              <TableRow>
                  <TableCell colSpan={4}></TableCell>
                  <TableCell>Total : </TableCell> 
                  <TableCell>{format( _.sumBy(stockData,'current_stock').toFixed(2) )}</TableCell>
                  <TableCell align="right">{format( _.sumBy(stockData,'stock_value').toFixed(2) )}</TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
          </Paper>
     ):''
  }

  {/* Total Stock  */}

  {
     stockData.length>0 && selectedStockType != null && selectedStockType.stock_type!='Current Stock'?(
      <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
  

      <TableContainer >
        <Table className={classes.table} size="small" aria-label="a dense table" className="report-dom">
          <TableHead> 
            <TableRow> 
              <TableCell align="left" style={{width:'1%'}}>SL</TableCell>
              <TableCell align="left" >Material Code</TableCell>
              <TableCell align="left" >Material Name </TableCell>
              <TableCell align="left">Category</TableCell> 
              <TableCell align="left">Purchase Qty</TableCell>
              <TableCell align="left">Used in Production Qty</TableCell> 

              <TableCell align="left">Damage Qty</TableCell>
            
              <TableCell align="left">Purchase Avarage Rate</TableCell>
              <TableCell align="left">Current  Qty</TableCell>
              <TableCell align="right">Stock Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              
              {
                stockData.map((row,sl)=>(
                    <TableRow  key=""> 
                  <TableCell>{sl+parseFloat(1)}.</TableCell>
                  <TableCell  align="left">{row.material_code}</TableCell>
                  <TableCell  align="left">{row.material_name}</TableCell>
                  <TableCell  align="left">{row.prod_cat_name}</TableCell>
                  <TableCell  align="left">{format(row.purchased_quantity)}</TableCell>
                  <TableCell  align="left">{format(row.material_used_quantity)}</TableCell>
                  <TableCell  align="left">{format(row.material_damage_quantity)}</TableCell>
                  <TableCell  align="left">{format(parseFloat(row.material_purchase_rate).toFixed(2))}</TableCell>
                  <TableCell  align="left">{format(parseFloat(row.current_quantity).toFixed(2))} {row.prod_unit_name}</TableCell>
                  <TableCell  align="right">{format(parseFloat(row.stock_value).toFixed(2))}</TableCell>
                   </TableRow>
                ))
              }
              <br></br>
              <TableRow>
                  <TableCell colSpan={3}></TableCell>
                  <TableCell>Total : </TableCell> 
                  <TableCell>{format( _.sumBy(stockData,'purchased_quantity').toFixed(2) )}</TableCell>
                  <TableCell>{format( _.sumBy(stockData,'material_used_quantity').toFixed(2) )}</TableCell>
                  <TableCell>{format( _.sumBy(stockData,'material_damage_quantity').toFixed(2) )}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>{format( _.sumBy(stockData,'current_quantity').toFixed(2) )}</TableCell>
                  <TableCell align="right">{format( _.sumBy(stockData,'stock_value').toFixed(2) )}</TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
          </Paper>
     ):''
  }
        </div>
      )
  })

    return(
        <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
  marginBottom: '2px'}}>Material Stock Report</h4> 

<Grid container spacing={3} > 
     
        <Grid item  xs={12}   sm={3} > 
        <Autocomplete 
        size="small"
        autoHighlight
            openOnFocus={true}
            style={{width:'100%',height:'20px'}}
            options={stockTypes}
            value={selectedStockType}
            getOptionLabel={(option) => option.stock_type}
            onChange={(event,selectedObj)=>{
                selectedStockTypeSet(selectedObj); 

                if(selectedObj==null) return false;

                // Start

                if(selectedObj.stock_type == 'Material wise stock' ){
                    getmaterial();
                    selectedCategorySet(null)
                    selectedBrandSet(null)
                }
                if(selectedObj.stock_type == 'Category wise stock' ){
                    getCategories();
                    selectedMaterialSet(null)
                    selectedBrandSet(null)
                }
                
                if(selectedObj.stock_type == 'Brand wise stock' ){
                    getBrands();
                    selectedMaterialSet(null)
                    selectedCategorySet(null)
                }

                stockDataSet([])

                // End
            }}
            renderInput={(params) => <TextField 
              {...params} 
              label="Stock Type " 
              variant="outlined"
              />} 
        />
        </Grid>
        {
            selectedStockType != null && selectedStockType.stock_type == 'Material wise stock' ?(
                <Grid item  xs={12}   sm={3} > 
        <Autocomplete 
        size="small"
        autoHighlight
            openOnFocus={true}
            style={{width:'100%',height:'20px'}}
            options={materials}
            value={selectedMaterial}
            getOptionLabel={(option) => option.material_name}
            onChange={(event,selectedObj)=>{
                selectedMaterialSet(selectedObj); 
                stockDataSet([])

            }}
            renderInput={(params) => <TextField 
              {...params} 
              label="Material Name" 
              variant="outlined"
              />} 
        />
        </Grid>
            ):''
        }
        
        {
            selectedStockType != null && selectedStockType.stock_type == 'Category wise stock' ?(
                <Grid item  xs={12}   sm={3} > 
        <Autocomplete 
        size="small"
        autoHighlight
            openOnFocus={true}
            style={{width:'100%',height:'20px'}}
            options={categories}
            value={selectedCategory}
            getOptionLabel={(option) => option.prod_cat_name}
            onChange={(event,selectedObj)=>{
                selectedCategorySet(selectedObj); 
                stockDataSet([])
            }}
            renderInput={(params) => <TextField 
              {...params} 
              label="Category Name" 
              variant="outlined"
              />} 
        />
        </Grid>
            ):''
        }
        
        {
            selectedStockType != null && selectedStockType.stock_type == 'Brand wise stock'?(
                <Grid item  xs={12}   sm={3} style={{display:'none'}}> 
        <Autocomplete 
        size="small"
        autoHighlight
            openOnFocus={true}
            style={{width:'100%',height:'20px'}}
            options={brands}
            value={selectedBrand}
            getOptionLabel={(option) => option.prod_brand_name}
            onChange={(event,selectedObj)=>{
                selectedBrandSet(selectedObj); 
                stockDataSet([])
            }}
            renderInput={(params) => <TextField 
              {...params} 
              label="Brand Name" 
              variant="outlined"
              />} 
        />
        </Grid>
            ):''
        }
        

        <Grid item  xs={12}   sm={1} >
      <Button style={{marginTop: '5px',marginLeft: 'auto',fontSize:'14px'}} 
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          startIcon={<SearchIcon/>}
                          onClick={getSearchResult}
                          disabled={reportLoading?true:false}
                      >
                     Search 
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
export default connect(mapStateToPops,{currentRouteSet})(TransferRecord);