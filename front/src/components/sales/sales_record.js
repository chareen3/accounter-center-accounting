import React,{useState,useEffect,useRef} from 'react';
import {connect} from 'react-redux';

import {currentRouteSet} from '../../actions/actions';
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
import ReactToPrint from "react-to-print";
import PrintIcon from '@material-ui/icons/Print';
import InstitutionProfile from '../commons/institution_profile'
import '../commons/commons.css'

import BookIcon from '@material-ui/icons/Book';

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import swal from 'sweetalert';
import commaNumber from 'comma-number';
let format = commaNumber.bindWith(',', '.')
const SalesRecord = ({location,currentRoute,currentRouteSet,authInfo})=>{
    const classes = useStyles();
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
    },[]);
    let [employees,employeesSet] = useState([]);
    let [customers,customersSet] = useState([]);
    let [areas,areasSet] = useState([]);
    let [categories,categoriesSet] = useState([]);
    let [users,usersSet] = useState([]);
    let [reportLoading,reportLoadingSet] = useState(false);
    
    let [selectedSearchType,selectedSearchTypeSet] = useState({searchType:'All'})
    let [selectedEmployee,selectedEmployeeSet] = useState(null)
    let [selectedCustomer,selectedCustomerSet] = useState(null)
    let [selectedProduct,selectedProductSet] = useState(null)
    let [selectedCategory,selectedCategorySet] = useState(null)
    let [selectedArea,selectedAreaSet] = useState(null)
    let [selectedUser,selectedUserSet] = useState(null)
    let [selectedRecordType,selectedRecordTypeSet] = useState({recordType:'Without Details'})

    let [individualProducts,setIndividualProducts] = useState([])
    let employeeRef = React.useRef(null)
    let [searchResult,searchResultSet] = useState([]);
    let [searchResultDetails,searchResultDetailsSet] = useState([]);
    let [saleProductDetail,saleProductDetailSet] = useState([]);
    let [saleProdCatDetail,saleProdCatDetailSet] = useState([]);
    let [print,printSet] = useState(false);
    
    let [recordTypes,recordTypesSet] = useState([{recordType:'Without Details'},{recordType:'With Details'}])
   
    const getCustomers = async ()=>{
          await axios.post(`${API_URL}/api/get-customers`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
            res.data.message.unshift({customer_id:0,customer_address:'',customer_mobile_no:'',customer_name:'General Customer',display_text:'General Customer'});
            customersSet(res.data.message);
          })
    }

    const getIndividualProducts = async()=>{
          await axios.post(`${API_URL}/api/get-individual-products`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
            setIndividualProducts(res.data.message);
          })
    }

    const getEmployees = async ()=>{
      await axios.post(`${API_URL}/api/get-employees`,{'select-type': "active"},{headers:{'auth-token':authInfo.token}}).then(res=>{
        employeesSet(res.data.message)
    })
    }

    const getAreas = async ()=>{
      await axios.post(`${API_URL}/api/get-areas`,{'select-type': "active"},{headers:{'auth-token':authInfo.token}}).then(res=>{
        areasSet(res.data.message)
    })
    }

    

    const getCategories = async ()=>{
        await axios.post(`${API_URL}/api/get-categories`,{'select-type': "active"},{headers:{'auth-token':authInfo.token}}).then(res=>{
          categoriesSet(res.data.message)
      })
      }

      const getUsers = async ()=>{
        await axios.post(`${API_URL}/api/get-users`,{'select-type': "active"},{headers:{'auth-token':authInfo.token}}).then(res=>{
          usersSet(res.data.message)
      })
      }

    let [byDateTime,byDateTimeSet] = useState({
          dateTimeFrom: currentDateStartTime(),
          dateTimeTo:currentDateEndTime()
    })


    let saleDelete = async (saleId)=>{
        swal({
           title:'Are you sure delete this?',
           icon:'warning',
           buttons:true
        }).then(async (confirm)=>{
          if(confirm){
            await axios.post(`${API_URL}/api/sale-delete`,{saleId},{headers:{'auth-token':authInfo.token}}).then(res=>{
              if(!res.data.error){
               swal({
                 title:res.data.message,
                 icon:'success'
              })
              getSearchResult()
              } 
         })
          }else{
            return false
          }
          
        })
        
    }

    useEffect(()=>{ 

        if(selectedSearchType != null && selectedSearchType.searchType=='By Customer'){
          getCustomers();
        }

        if(selectedSearchType != null && selectedSearchType.searchType=='By Product'){
            getIndividualProducts();
        }

        if(selectedSearchType != null && selectedSearchType.searchType=='By Employee'){
            getEmployees();
        }

        if(selectedSearchType != null && selectedSearchType.searchType=='By Category'){
            getCategories();
        } 

        if(selectedSearchType != null && selectedSearchType.searchType=='By User'){
            getUsers();
        }

        if(selectedSearchType != null && selectedSearchType.searchType=='By Area'){
          getAreas();
      }
        
    },[selectedSearchType]);



    let [searchTypes,searchTypesSet] = useState([{searchType:'All'},
    {searchType:'By Customer'},{searchType:'By Employee'},
    {searchType:'By Category'},
    {searchType:'By Area'},
    {searchType:'By User'}]);

    
    let getSearchResult = async ()=>{

     
        let url = '';

            if(selectedRecordType != null && selectedRecordType.recordType == 'Without Details' ){
                url = `${API_URL}/api/get-sales`
            }
            if(selectedRecordType != null && selectedRecordType.recordType == 'With Details' ){ 
                url = `${API_URL}/api/get-sales-with-details`
            }
            if(selectedSearchType!=null && (selectedSearchType.searchType=='By Product' || selectedSearchType.searchType=='By Category')){
              url = `${API_URL}/api/get-sales-details`
            }


            
        let reqPayload = {
            selectedSearchType: selectedSearchType != null?selectedSearchType.searchType:null,
            areaId: selectedArea != null? selectedArea.area_id:null,
            customerId: selectedCustomer != null? selectedCustomer.customer_id:null,
            employeeId: selectedEmployee != null? selectedEmployee.employee_id:null,
            productId: selectedProduct != null ?selectedProduct.prod_id:null,
            categoryId: selectedCategory != null ? selectedCategory.prod_cat_id: null,
            userId: selectedUser != null ? selectedUser.user_id : null,
            dateTimeFrom: byDateTime.dateTimeFrom,
            dateTimeTo: byDateTime.dateTimeTo
        }

        
        reportLoadingSet(true)
        await axios.post(`${url}`,{reqPayload},{headers:{'auth-token':authInfo.token}}).then(res=>{
             printSet(true)
             reportLoadingSet(false)
            if(selectedRecordType.recordType=='Without Details'){
              searchResultSet(res.data.message);
            }
            if(selectedRecordType.recordType=='With Details'){
              searchResultDetailsSet(res.data.message);
            }
            if(selectedSearchType != null && selectedSearchType.searchType=='By Product'){
              saleProductDetailSet(res.data.message);

            }

            if(selectedSearchType != null && selectedSearchType.searchType=='By Category'){
               //

              let records =  res.data.message;

              records = _.chain(records)
                  .groupBy('prod_cat_id') 
                  .map(sale => {
                    return {
                      category_name: sale[0].prod_cat_name,
                      products: _.chain(sale)
                        .groupBy('sale_prod_id')
                        .map(product => {
                          return {
                            prod_name: product[0].prod_name,
                            prod_code: product[0].prod_code,
                            quantity: _.sumBy(product, item => Number(item.sale_qty))
                          }
                        })
                        .value()
                    }
                  })
                  .value();
              saleProdCatDetailSet(records)

               ///
            }
        })



    }


    let ReportDom = React.forwardRef( (props,ref) =>{
        return(
          <div ref={ref}>
            
            <InstitutionProfile />
<div style={{clear:'both'}}></div>
<Paper style={{width:'100%',paddingLeft:'10px',paddingRight:'10px'}} className="print-source">
<p style={{width:'100%',textAlign:'center',fontWeight:'bold'}}>Sales Record </p>

  <p style={{float:'left',width:'30%',textAlign:'left',margin:0,padding:0,fontSize:'16px'}}>
    {selectedSearchType != null && selectedSearchType.searchType == 'By Employee'?`Employee : ${selectedEmployee!=null?selectedEmployee.employee_name:''}`:''}
    {selectedSearchType != null && selectedSearchType.searchType == 'By Customer'?`Customer : ${selectedCustomer!=null?selectedCustomer.customer_name:''}`:''}<br/>
    {selectedSearchType != null && selectedSearchType.searchType == 'By Area'?`Area : ${selectedArea!=null?selectedArea.area_name:''}`:''}<br/>
    {selectedSearchType != null && selectedSearchType.searchType == 'By Customer'?`Customer Institution  : ${selectedCustomer!=null?selectedCustomer.customer_institution_name:''}`:''}
    {selectedSearchType != null && selectedSearchType.searchType == 'By Category'?`Category : ${selectedCategory!=null?selectedCategory.prod_cat_name:''}`:''}
    {selectedSearchType != null && selectedSearchType.searchType == 'By Product'?`Product : ${selectedProduct!=null?selectedProduct.prod_name:''}`:''}
    {selectedSearchType != null && selectedSearchType.searchType == 'By User'?`User : ${selectedUser!=null?selectedUser.user_name:''}`:''}
    </p>

<p style={{float:'right',width:'40%',textAlign:'right',margin:0,padding:0}}> Statement From { moment(byDateTime.dateTimeFrom).format(dateTimeFormat)  } <br/> TO { moment(byDateTime.dateTimeTo).format(dateTimeFormat) }
</p>
</Paper> 

        {
  (selectedSearchType != null &&  selectedSearchType.searchType ==  'By Product' && saleProductDetail.length>0 )?(
    <Paper className={classes.paper} style={{marginTop:'1px',marginBottom:'1px'}} >
    
    {/* sale product details */} 
    <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table" className="report-dom">
        <TableHead>
          <TableRow> 
            <TableCell align="left">SL</TableCell>
            <TableCell align="left">Invoice No</TableCell>
            <TableCell align="left">Date & Time</TableCell>
            <TableCell align="left">Customer</TableCell>
            <TableCell align="right">Product Name</TableCell>
            <TableCell align="right">sale Rate</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right" className="print-no">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {
              saleProductDetail.map((ele,index)=>(
                <TableRow  key={index}> 
                <TableCell  align="left">{index+parseFloat(1)}</TableCell>
                <TableCell align="left">{ele.sale_invoice}</TableCell> 
                <TableCell align="left">{moment(ele.sale_created_isodt).format(dateTimeFormat)}</TableCell>
                <TableCell align="left">{ele.customer_name}</TableCell>
                <TableCell align="right">{(ele.prod_name)}</TableCell>
                <TableCell align="right">{format((ele.sale_rate).toFixed(2))}</TableCell>
                <TableCell align="right">{(ele.sale_qty).toFixed(2)}</TableCell>
                 <TableCell align="right" className="print-no"> 
                 <Link to={{pathname:`/sales/sales-invoice/${ele.sale_id}`}}> <ReceiptIcon style={{cursor:'pointer',color:'black',marginLeft:'2px'}} > </ReceiptIcon></Link>
               {
                 authInfo.role !='user'?(
                   <>
                <Link to={{pathname:`/sales/sales-update/${ele.sale_id}`}}> 
                <EditIcon style={{cursor:'pointer',color:'green',marginLeft:'2px'}} > </EditIcon></Link>
                <DeleteIcon style={{cursor:'pointer',color:'#FF0202',marginLeft:'2px'}} > </DeleteIcon>
                   </>
                 ):''
               }
             
                </TableCell>
              </TableRow>
              ))
            }
            
          

      
        <TableRow colSpan={4}>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>Total Quantity : </TableCell>
        
          <TableCell align="right"> { saleProductDetail.reduce((prev,curr)=>{
                return prev+parseFloat(curr.sale_qty);
          },0).toFixed(2) }</TableCell>
         
          <TableCell></TableCell>
        </TableRow>
       


        </TableBody>
      </Table>
    </TableContainer>
        </Paper>
  ):''
}


{
  (selectedRecordType !=null && selectedSearchType != null &&  selectedSearchType.searchType !=  'By Product' && selectedSearchType.searchType !=  'By Category' && searchResult.length>0 &&  selectedRecordType.recordType=='Without Details')?(
    <Paper className={classes.paper} style={{marginTop:'1px',marginBottom:'1px'}} >
    
    {/* sale Record  without details */} 
    <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table" className="report-dom">
        <TableHead>
          <TableRow> 
            <TableCell align="left"  style={{width:'1%'}}>SL</TableCell>
            <TableCell align="left"  style={{width:'10%'}}>Invoice No</TableCell>
            <TableCell align="left"  style={{width:'10%'}}>Date</TableCell>
            <TableCell align="left"  style={{width:'5%'}}>Customer</TableCell>
            <TableCell align="left"  style={{width:'5%'}}>Employee</TableCell>
            <TableCell align="left"  style={{width:'5%'}} >CreatedBy</TableCell>
            <TableCell align="right" style={{width:'10%'}}>Sub Total</TableCell>
            <TableCell align="center" style={{width:'5%'}}>Vat</TableCell>
            <TableCell align="center" style={{width:'5%'}}>Discount</TableCell>
            <TableCell align="right" style={{width:'10%'}}>Total</TableCell>
            <TableCell align="right" style={{width:'10%'}}>Paid</TableCell>
            <TableCell align="right" style={{width:'10%'}}>Due</TableCell>
            <TableCell align="right"  className="print-no">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {
              searchResult.map((ele,index)=>(
                <TableRow  key={index}> 
                <TableCell  align="left">{index+parseFloat(1)}</TableCell>
                <TableCell align="left">{ele.sale_invoice}</TableCell> 
                <TableCell align="left">{moment(ele.sale_created_isodt).format('DD MMM Y')}</TableCell>
                <TableCell align="left">{ele.customer_name}</TableCell> 
                <TableCell align="left">{ele.employee_name}</TableCell>
                <TableCell align="left">{ele.user_full_name}</TableCell>
                <TableCell align="right">{ format(parseFloat(ele.sale_subtotal_amount).toFixed(2))}</TableCell>
                <TableCell align="right">{format(parseFloat(ele.sale_vat_amount).toFixed(2))} </TableCell>
                <TableCell align="right">{format(parseFloat(ele.sale_discount_amount).toFixed(2))}</TableCell>
                <TableCell align="right">{format(parseFloat(ele.sale_total_amount).toFixed(2))}</TableCell>
                <TableCell align="right">{format(parseFloat(ele.sale_paid_amount).toFixed(2))}</TableCell>
                <TableCell align="right">{format(parseFloat(ele.sale_due_amount).toFixed(2))}</TableCell>
                 <TableCell align="right" className="print-no">
  
                
                 <Link to={{pathname:`/sales/sales-invoice/${ele.sale_id}`}}> 
                 <ReceiptIcon style={{cursor:'pointer',color:'black',marginLeft:'2px'}} > 
                 </ReceiptIcon></Link>

                 <Link to={{pathname:`/sales/chalan-invoice/${ele.sale_id}`}}> 
                 <BookIcon style={{cursor:'pointer',color:'black',marginLeft:'2px'}} > 
                 </BookIcon></Link>


                {
                  authInfo.role !='user'?(
                    <>
                     <Link to={{pathname:`/sales/sales-update/${ele.sale_id}`}}>  
                     <EditIcon style={{cursor:'pointer',color:'green',marginLeft:'2px'}}  > </EditIcon></Link>
                <DeleteIcon onClick={()=>{saleDelete(ele.sale_id)}} style={{cursor:'pointer',color:'#FF0202',marginLeft:'2px'}} > </DeleteIcon>
                    </>
                  ):''
                }
               
                </TableCell>
              </TableRow>
              ))
            }
            
          

      
        <TableRow colSpan={4}>
          <TableCell colSpan={5}></TableCell>
       
          <TableCell>Total : </TableCell>
          <TableCell align="right">{ format( searchResult.reduce((prev,curr)=>{
                return prev+parseFloat(curr.sale_subtotal_amount);
          },0).toFixed(2)) }</TableCell>
          <TableCell align="right">{ format( searchResult.reduce((prev,curr)=>{
                return prev+parseFloat(curr.sale_vat_amount);
          },0).toFixed(2)) }</TableCell>
          <TableCell align="right">{ format( searchResult.reduce((prev,curr)=>{
                return prev+parseFloat(curr.sale_discount_amount);
          },0).toFixed(2)) }</TableCell>
     
          <TableCell align="right">{ format(searchResult.reduce((prev,curr)=>{
                return prev+parseFloat(curr.sale_total_amount);
          },0).toFixed(2)) }</TableCell>
          <TableCell align="right">{ format(searchResult.reduce((prev,curr)=>{
                return prev+parseFloat(curr.sale_paid_amount);
          },0).toFixed(2)) }</TableCell>
          <TableCell align="right">{ format(searchResult.reduce((prev,curr)=>{
                return prev+parseFloat(curr.sale_due_amount);
          },0).toFixed(2)) }</TableCell>
          <TableCell></TableCell>
        </TableRow>
       


        </TableBody>
      </Table>
    </TableContainer>
        </Paper>
  ):''
}
        




          {/* Category wise Details */}
      {
        ( selectedSearchType != null && selectedSearchType.searchType ==  'By Category' && saleProdCatDetail.length>0)?(
          <Paper className={classes.paper} style={{marginTop:'1px',marginBottom:'1px'}} >
    
    <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table" className="report-dom">
        <TableHead>
          <TableRow>
            <TableCell align="left">Product Code</TableCell>
            <TableCell align="left">Product Name</TableCell>
            <TableCell align="right">Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {
              saleProdCatDetail.map((ele,index)=>(
                <>
                <TableRow  key={index} style={{margin:'0px',padding:'0px'}} > 
                <p style={{textAlign:'center',fontWeight:'bold'}}>{ele.category_name}</p>
                </TableRow>

                {
                ele.products.map((prod,prodIndex)=>(
                  <>
                  <TableRow  key={prodIndex}> 
                  <TableCell align="left">{prod.prod_code}</TableCell>
                  <TableCell align="left">{prod.prod_name}</TableCell>
                  <TableCell align="right">{prod.quantity}</TableCell>
                </TableRow>
                  </>))

                }
                </>))
            }

            
        </TableBody>
      </Table>
    </TableContainer>
        </Paper>
        ):'' 
      }

        {/* With Details */}
      {
        (selectedRecordType != null && selectedSearchType != null && selectedSearchType.searchType !=  'By Product' && selectedSearchType.searchType !=  'By Category' && searchResultDetails.length>0 && selectedRecordType.recordType=='With Details')?(
          <Paper className={classes.paper} style={{marginTop:'1px',marginBottom:'1px'}} >
    
    <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table" className="report-dom">
        <TableHead>
          <TableRow>
            <TableCell align="left">SL</TableCell>
            <TableCell align="left">Invoice No</TableCell>
            <TableCell align="left">Date & Time</TableCell>
            <TableCell align="left">Customer</TableCell>
            <TableCell align="left">Product Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Total</TableCell> 
            <TableCell align="right" className="print-no">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {
              searchResultDetails.map((ele,index)=>(
                <>
                <TableRow  key={index}> 
                <TableCell  align="left">{index+parseFloat(1)}</TableCell>
                <TableCell align="left">{ele.sale_invoice}</TableCell> 
                <TableCell align="left">{moment(ele.sale_created_isodt).format(dateTimeFormat)}</TableCell>
                <TableCell align="left">{ele.customer_name}</TableCell>
                <TableCell align="left">{ele.details[0].prod_name}</TableCell>
                <TableCell align="right">{format(ele.details[0].sale_rate)}</TableCell>
                <TableCell align="right">{ele.details[0].sale_qty}</TableCell>
                <TableCell align="right">{format((ele.details[0].sale_prod_total).toFixed(2))}</TableCell>

                 <TableCell align="right" className="print-no">
                 <Link to={{pathname:`/sales/sales-invoice/${ele.sale_id}`}}>   <ReceiptIcon style={{cursor:'pointer',color:'black',marginLeft:'2px'}} > </ReceiptIcon></Link>
             
             {
                authInfo.role !='user'?(<>
                 <Link to={{pathname:`/sales/sales-update/${ele.sale_id}`}}> 
             <EditIcon style={{cursor:'pointer',color:'green',marginLeft:'2px'}} > </EditIcon>
             </Link> 
                <DeleteIcon onClick={()=>{saleDelete(ele.sale_id)}} style={{cursor:'pointer',color:'#FF0202',marginLeft:'2px'}} > </DeleteIcon>
                </>):''
             }
            
                </TableCell>
              </TableRow>

                  
                {
                  ele.details.slice(1).map((detail,dIndex)=>(
                    <TableRow key={dIndex}> 
                      <TableCell  align="left"></TableCell>
                      <TableCell  align="left"></TableCell>
                      <TableCell  align="left"></TableCell>
                      <TableCell  align="left"></TableCell>
                    <TableCell  align="left">{detail.prod_name}</TableCell>
                    <TableCell  align="right">{format(detail.sale_rate)}</TableCell>
                    <TableCell  align="right">{detail.sale_qty}</TableCell>
                    <TableCell  align="right">{format((detail.sale_prod_total).toFixed(2))}</TableCell>
                    </TableRow>
                  ))

                }



                    <TableRow> 
                      <TableCell  align="left"></TableCell>
                      <TableCell  align="left"></TableCell>
                      <TableCell  align="left"></TableCell>
                      <TableCell  align="left"></TableCell>
                    <TableCell  align="left"></TableCell>
                    <TableCell  align="left"></TableCell>
                  <TableCell  align="right">Total Quantity : {ele.details.reduce((prev,curr)=>{
                           return prev+parseFloat(curr.sale_qty)
                  },0).toFixed(2)}</TableCell>
                    <TableCell  align="right">
                      Total : {format((ele.sale_total_amount).toFixed(2))}<br/>
                   Paid :  {format((ele.sale_paid_amount).toFixed(2))}<br/>
                   Due :  {format((ele.sale_due_amount).toFixed(2))}
                  </TableCell>
                    <TableCell  align="right"></TableCell>
                    </TableRow>
                   </>
                
      ))
            }

            {
                <TableRow> 
                <TableCell  align="left"></TableCell>
                <TableCell  align="left"></TableCell>
                <TableCell  align="left"></TableCell>
                <TableCell  align="left"></TableCell>
              <TableCell  align="left"></TableCell>
              <TableCell  align="left"></TableCell>
              <TableCell  align="left"></TableCell>
            <TableCell  align="right">Total Amount : {format(searchResultDetails.reduce((prev,curr)=>{
                     return prev+parseFloat(curr.sale_total_amount)
            },0).toFixed(2))}<br/> 
            Total Paid :{format(searchResultDetails.reduce((prev,curr)=>{
                     return prev+parseFloat(curr.sale_paid_amount)
            },0).toFixed(2))} <br/> 
            Total Due : {format(searchResultDetails.reduce((prev,curr)=>{
                     return prev+parseFloat(curr.sale_due_amount)
            },0).toFixed(2))} </TableCell>

              <TableCell  align="right"></TableCell>
              <TableCell  align="right"></TableCell>
              </TableRow>
            }
        </TableBody>
      </Table>
    </TableContainer>
        </Paper>
        ):''
      }
          </div>
        )
    })




    const reportRef = useRef();

   

      return(
          <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '2px'}}>Sales Record</h4>
<Grid container spacing={3} > 
          <Grid item  xs={12}  sm={2}> 
          <Autocomplete 
          size="small"
          autoHighlight
              openOnFocus={true}
              style={{width:'100%',height:'20px'}}
              options={searchTypes} 
              value={selectedSearchType}
              getOptionLabel={(option) => option.searchType}
              onChange={(event,selectedObj)=>{
                selectedSearchTypeSet(selectedObj) 
              }}
              renderInput={(params) => <TextField 
                inputRef={employeeRef}
               
                {...params} 
                label="Search Type" 
                variant="outlined"
                />} 
          />

          </Grid>

          <Grid item  xs={12}   sm={2} style={{display: selectedSearchType!=null && selectedSearchType.searchType=='By Area'?'block':'none'}}> 
          <Autocomplete 
          size="small"
          autoHighlight
              openOnFocus={true}
              style={{width:'100%',height:'20px'}} 
              options={areas}
              value={selectedArea}
              getOptionLabel={(option) => option.area_name}
              onChange={(event,selectedObj)=>{
                 selectedAreaSet(selectedObj);
              }}
              renderInput={(params) => <TextField                
                {...params} 
                label="Select Area" 
                variant="outlined"
                />} 
                
          />
          </Grid>


          <Grid item  xs={12}   sm={2} style={{display: selectedSearchType!=null && selectedSearchType.searchType=='By Customer'?'block':'none'}}> 
          <Autocomplete 
          size="small"
          autoHighlight
              openOnFocus={true}
              style={{width:'100%',height:'20px'}} 
              options={customers}
              value={selectedCustomer}
              getOptionLabel={(option) => option.display_text}
              onChange={(event,selectedObj)=>{
                 selectedCustomerSet(selectedObj);
              }}
              renderInput={(params) => <TextField                
                {...params} 
                label="Select Customer" 
                variant="outlined"
                />} 
                
          />
          </Grid>
          <Grid item  xs={12}   sm={2} style={{display: selectedSearchType!=null && selectedSearchType.searchType=='By Employee'?'block':'none'}}> 
          <Autocomplete 
          size="small"

          autoHighlight
              openOnFocus={true}
              style={{width:'100%',height:'20px'}}
              options={employees}
              value={selectedEmployee}
              getOptionLabel={(option) => option.employee_name}
              onChange={(event,selectedObj)=>{
                 selectedEmployeeSet(selectedObj)
              }}
              renderInput={(params) => <TextField 
                inputRef={employeeRef}
                onKeyDown={event => {
                  if (event.key === "Enter") {
                     // saleDateRef.current.focus()
                  }
                }} 
                {...params} 
                label="Select Employee" 
                variant="outlined"
                />} 
                
          />
          </Grid>

          <Grid item  xs={12}   sm={2} style={{display: selectedSearchType!=null && selectedSearchType.searchType=='By Category'?'block':'none'}}> 
          <Autocomplete 
          size="small"
          autoHighlight
              openOnFocus={true}
              style={{width:'100%',height:'20px'}}
              options={categories}
              value={selectedCategory}
              getOptionLabel={(option) => option.prod_cat_name}
              onChange={(event,selectedObj)=>{
                 selectedCategorySet(selectedObj)
              }}
              renderInput={(params) => <TextField 
                {...params} 
                label="Select Category" 
                variant="outlined"
                />} 
                
          />
          </Grid>

          <br></br>
          
          <Grid item  xs={12}   sm={2} style={{display: selectedSearchType!=null && selectedSearchType.searchType=='By Product'?'block':'none'}}> 
          <Autocomplete  
          size="small"
          autoHighlight
              openOnFocus={true}
              style={{width:'100%',height:'20px'}}
              options={individualProducts}
              value={selectedProduct} 
              getOptionLabel={(option) => option.prod_name}
              onChange={(event,selectedObj)=>{
                 selectedProductSet(selectedObj)
              }}
              renderInput={(params) => <TextField 
                {...params} 
                label="Select Product" 
                variant="outlined"
                />} 
                 
          />
          </Grid>

        

          <Grid item  xs={12}   sm={2} style={{display: selectedSearchType!=null && selectedSearchType.searchType=='By User'?'block':'none'}}> 
          <Autocomplete  
          size="small"
          autoHighlight
              openOnFocus={true}
              style={{width:'100%',height:'20px'}}
              options={users}
              value={selectedUser} 
              getOptionLabel={(option) => option.user_name}
              onChange={(event,selectedObj)=>{
                 selectedUserSet(selectedObj)
              }}
              renderInput={(params) => <TextField 
                {...params} 
                label="Select user" 
                variant="outlined"
                />} 
                
          />
          </Grid>
{
  selectedSearchType != null && !(selectedSearchType.searchType=='By Product' || selectedSearchType.searchType=='By Category'  || selectedSearchType.searchType=='By Area')?(
    <Grid item  xs={12}   sm={2}  > 
    <Autocomplete  
    size="small"
    autoHighlight
        openOnFocus={true}
        style={{width:'100%',height:'20px'}} 
        options={recordTypes} 
        value={selectedRecordType} 
        getOptionLabel={(option) => option.recordType}
        onChange={(event,selectedObj)=>{
          selectedRecordTypeSet(selectedObj);
        }}
        renderInput={(params) => <TextField                
          {...params} 
          label="Record Type" 
          variant="outlined"
          />} 
          
    />
    </Grid>
  ):''
}
         



          
              
          <Grid item  xs={12}  sm={2} style={{marginBottom: '-9px'}} > 
            <MuiPickersUtilsProvider  utils={DateFnsUtils} > 
          
            <KeyboardDateTimePicker
          //  inputRef={saleDateRef}
            onKeyDown={(e)=>{
              if(e.key==='Enter'){
                //supplierRef.current.focus()
              }
            }}
            style={{ width: '100%',marginTop: '' }}
            value={byDateTime.dateTimeFrom}
            onChange={(datet)=>{
              byDateTimeSet({...byDateTime,dateTimeFrom:datet})
            }}
            label="From Date &   Time"
            format="Y/MM/d hh:mm a"
            /> 
            </MuiPickersUtilsProvider>
          </Grid>


          <Grid item  xs={12}  sm={2} style={{marginBottom: '-9px'}} > 
            <MuiPickersUtilsProvider  utils={DateFnsUtils} > 
          
            <KeyboardDateTimePicker
            //inputRef={saleDateRef}
            onKeyDown={(e)=>{
              if(e.key==='Enter'){
               // supplierRef.current.focus()
              }
            }}
            style={{ width: '100%',marginTop: '' }}
            value={byDateTime.dateTimeTo}
            onChange={(datet)=>{
              byDateTimeSet({...byDateTime,dateTimeTo:datet})
            }}
            label="To Date &   Time"
            format="yyyy/MM/dd hh:mm a"
               />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item  xs={12}   sm={1} >
        <Button style={{marginTop: '5px',marginLeft: 'auto',fontSize:'10px'}} 
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<SearchIcon/>}
                            onClick={getSearchResult}
                            disabled={reportLoading?true:false}
                        >
                        Report 
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
export default connect(mapStateToPops,{currentRouteSet})(SalesRecord); 