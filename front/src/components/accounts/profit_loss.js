import React,{useState,useEffect, useRef} from 'react';
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
import PrintIcon from '@material-ui/icons/Print';
import Select from 'react-select';


import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import swal from 'sweetalert';
import  InstitutionProfile from '../commons/institution_profile'
import ReactToPrint from "react-to-print";
import commaNumber from 'comma-number';
let format = commaNumber.bindWith(',', '.')
const CustomerTransactionHistory = ({location,currentRoute,currentRouteSet,authInfo})=>{
  const classes = useStyles();
  useEffect(()=>{
      currentRouteSet(pathSpliter(location.pathname,1));
  },[]);
  let [customers,customersSet] = useState([]);
  let [selectedCustomer,selectedCustomerSet] = useState(null);
  let [report,reportSet] = useState([]);
  let [othersReport,othersReportSet] = useState(null);
  let [print,printSet] = useState(false);
  let [reportLoading,reportLoadingSet] = useState(false);

  let [totalSoldAmount,totalSoldAmountSet] = useState(0);
  let [totalPurchaseAmount,totalPurchaseAmountSet] = useState(0);
  let [totalSaleProfitLoss,totalSaleProfitLossSet] = useState(0);
  let [totalSaleDiscount,totalSaleDiscountSet] = useState(0);

  let [products,productsSet] = useState([]);
  let [selectedProduct,selectedProductSet] = useState(null);
  let [productWiseProfit,productWiseProfitSet] = useState([]);
  let [productProfit,productProfitSet] = useState(0);

  



  let [byDateTime,byDateTimeSet] = useState({
        fromDate: currentDateStartTime(),
        toDate:currentDateEndTime()
  })

  let customerRef = useRef(null);
  let fromDateRef = useRef(null);
  let reportRef = useRef(null);


  let [types,typesSet] = useState([{label:'All',value:'all'},{label:'Customer Wise',value:'customer'},
  {label:'Product Wise',value:'product'},{label:'Product Wise Summary',value:'product_summary'}]);
  let [selectedType,selectedTypeSet] = useState({label:'All',value:'all'});

  useEffect(()=>{ 
    getCusomers();
    getProducts()
  },[]);

  let getProducts = async ()=>{
    await axios.post(`${API_URL}/api/get-individual-products`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>[
       productsSet(res.data.message)
    ]);
   }

  

  let getCusomers = async ()=>{
    await axios.post(`${API_URL}/api/get-customers`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          customersSet(res.data.message)
    })
  }

 
 

  let getSearchResult = async ()=>{

   

      let payload = {
          customerId: selectedCustomer != null? selectedCustomer.customer_id:null,
          prodId: selectedProduct != null? selectedProduct.prod_id:null,
          fromDate: byDateTime.fromDate,
          toDate: byDateTime.toDate
      }

     
      if(selectedType.value != 'product_summary'){

     
      await axios.post(`${API_URL}/api/get-sales-profit-loss`,{...payload},{headers:{'auth-token':authInfo.token}}).then(res=>{
        reportSet(res.data)

        let soldAmount = _.sumBy(res.data, ({ details }) => _.sumBy(details, 'sale_prod_total'));
        totalSoldAmountSet(soldAmount);
        
        let purchaseAmount = _.sumBy(res.data, ({ details }) => _.sumBy(details, 'purchasedAmount'));
        totalPurchaseAmountSet(purchaseAmount);

        let prodProfitLoss = _.sumBy(res.data, ({ details }) => _.sumBy(details, 'productProfitLoss'));
        totalSaleProfitLossSet(prodProfitLoss);

        let discount = _.sumBy(res.data, 'sale_discount_amount');
        totalSaleDiscountSet(discount);

        


        printSet(true)
       });

      }else{
        await axios.post(`${API_URL}/api/get-product-profit-loss`,{...payload},{headers:{'auth-token':authInfo.token}}).then(res=>{
          productWiseProfitSet(res.data)

         let prodProfitAmount =  res.data.reduce((prev,curr)=>{
               return prev+parseFloat(curr.prod_profit_amount)
          },0);

          productProfitSet(prodProfitAmount)

         })
         printSet(true)

      }

       reportLoadingSet(true)
       await axios.post(`${API_URL}/api/get-others-profit-loss`,{...payload},{headers:{'auth-token':authInfo.token}}).then(res=>{
        othersReportSet(res.data)
        reportLoadingSet(false)
       })

  }


  let ReportDom = React.forwardRef((props,ref)=>{
      return(<div ref={ref}>
        <InstitutionProfile />

        <div style={{clear:'both'}}></div>
<Paper style={{width:'100%',paddingLeft:'10px',paddingRight:'10px'}} className="print-source">
<p style={{width:'100%',textAlign:'center',fontWeight:'bold'}}>Profit  Loss Report</p>

  <p style={{float:'left',width:'30%',textAlign:'left',margin:0,padding:0,fontSize:'16px'}}>
    {selectedCustomer != null ?`Customer : ${selectedCustomer!=null?selectedCustomer.customer_name:''}`:''}
    </p>

<p style={{float:'right',width:'40%',textAlign:'right',margin:0,padding:0}}> Statement From { moment(byDateTime.dateTimeFrom).format(dateTimeFormat)  } <br/> TO { moment(byDateTime.dateTimeTo).format(dateTimeFormat) }
</p>
</Paper> 


               {

selectedType.value != 'product_summary' ?(

     report.length>0?(
      <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
  

      <TableContainer >
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow> 
              <TableCell align="left" style={{width:'1%'}}> Code</TableCell>
              <TableCell align="right" style={{width:'10%'}}>Product Name</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Sold Rate</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Sold Quantity</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Sold </TableCell>
              <TableCell align="right" style={{width:'15%'}}>Purchase Rate</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Purchased</TableCell>
              <TableCell align="right" style={{width:'15%'}}>Product Profit/Loss</TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>
            {
               report.map((sale,index)=>(
                   <>
                    <TableRow  key={index}> 
                    <TableCell colSpan={8}>
                        Sales Invoice No : {sale.sale_invoice} | 
                        Sales Date & Time : {moment(sale.sale_created_isodt).format('DD MMM Y h:m a')} | 
                        Customer Name : {sale.customer_name} | 
                        Customer Code : {sale.customer_code} | 
                        Discount : {sale.sale_discount_amount} 

                    </TableCell> 
                    </TableRow>

                    {
                sale.details.map((product,sl)=>(
                    <TableRow  key={sl}> 
                
                  <TableCell  align="left">{product.prod_code}</TableCell>
                  <TableCell  align="right">{product.prod_name}</TableCell>
                  <TableCell  align="right">{product.sale_rate}</TableCell>
                  <TableCell  align="right">{product.sale_qty} {product.prod_unit_name}</TableCell>
                  <TableCell  align="right">{format(parseFloat(product.sale_prod_total).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(product.sale_prod_purchase_rate).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(product.purchasedAmount).toFixed(2))}</TableCell>
                  <TableCell  align="right">{format(parseFloat(product.productProfitLoss).toFixed(2))}</TableCell>
                   </TableRow>
                ))
              }


{
                    <TableRow  key={index+1} style={{background:'#E3EAE7'}}> 
                <TableCell  colSpan={3} style={{textAlign:'right'}}>Sub Total : </TableCell>
                  <TableCell  align="right" colSpan={2}>   {format(parseFloat(_.sumBy(sale.details,'sale_prod_total')).toFixed(2))}</TableCell>
                  <TableCell  align="right" colSpan={2}> {format(parseFloat(_.sumBy(sale.details,'purchasedAmount')).toFixed(2))}</TableCell>
                  <TableCell  align="right" colSpan={2}> {format(parseFloat(_.sumBy(sale.details,'productProfitLoss')).toFixed(2))}</TableCell>
                  
                

                   </TableRow>
              
              }

                   </>
               ))
            }


<TableRow  key={0} style={{background:'#BDD5CA'}}> 
                <TableCell  colSpan={3} style={{textAlign:'right'}}> Total : </TableCell>
                  <TableCell  align="right" colSpan={2}> Total Sold :  {format(parseFloat(totalSoldAmount).toFixed(2))}</TableCell>
                  <TableCell  align="right" colSpan={2}> Total Purchased : {format(parseFloat(totalPurchaseAmount).toFixed(2))}</TableCell>
                  <TableCell  align="right" colSpan={2}> Total Profit/Loss : {format(parseFloat(totalSaleProfitLoss).toFixed(2))}</TableCell>
                  
                

                   </TableRow>

                  

                    <TableRow  >   
                    <TableCell colSpan={7}  align="right">Income from Cash Transaction (+)</TableCell>

                      <TableCell align="right">{othersReport != null ? format(parseFloat(othersReport.cashTranProfit).toFixed(2)) :0}</TableCell>
                    </TableRow>
            

                    <TableRow  >   
                    <TableCell colSpan={7}  align="right">Income from Services (+)</TableCell>

                      <TableCell align="right">{othersReport != null ? format(parseFloat(othersReport.serviceIncomeAmount).toFixed(2)) :0}</TableCell>
                    </TableRow>


                    <TableRow>

<TableCell  colSpan={7} align="right">Expense for Services Item (-)</TableCell>
<TableCell align="right"> { othersReport != null ? format(parseFloat(othersReport.serviceExpenseAmount).toFixed(2)) :0 }</TableCell>
  </TableRow>




                    <TableRow>

                  <TableCell  colSpan={7} align="right">Sales Return (-)</TableCell>
                  <TableCell align="right"> { othersReport != null ? format(parseFloat(othersReport.salesReturnAmount).toFixed(2)) :0 }</TableCell>
                    </TableRow>
                  
                    <TableRow  >  

                    <TableCell  colSpan={7}  align="right">Sales Discount (-) </TableCell>
                    <TableCell align="right">{format(parseFloat(totalSaleDiscount).toFixed(2))}</TableCell>

                    </TableRow>
                    <TableRow  >  

                    <TableCell colSpan={7} align="right">Product Total Damage (-) </TableCell> 
                    <TableCell align="right">{othersReport != null ? format(parseFloat(othersReport.productDamageAmount).toFixed(2)) :0}</TableCell>
                    
                

                    </TableRow>
                    <TableRow>
                    <TableCell colSpan={7} align="right">Material Total Damage (-) </TableCell> 
                    <TableCell align="right">{othersReport != null ? format(parseFloat(othersReport.materialDamageAmount).toFixed(2)) :0}</TableCell>
                    </TableRow>
                    <TableRow  >  
                    <TableCell colSpan={7} align="right">Expense (-) </TableCell>
                    <TableCell align="right">{othersReport != null ? format(parseFloat(othersReport.cashTranLoss).toFixed(2)) :0}</TableCell>


                    </TableRow>

                    <TableRow>
                    <TableCell colSpan={7} align="right">Employee Payment (-) </TableCell>
                    <TableCell align="right">{othersReport != null ? format(parseFloat(othersReport.employeeSalaryPay).toFixed(2)) :0}</TableCell>

                    </TableRow>
                    <TableRow  >  
                
                  
                  <TableCell colSpan={7} align="right">Total Profit / Loss   </TableCell>
                  <TableCell align="right">{othersReport != null ? format(parseFloat((totalSaleProfitLoss+parseFloat(othersReport.cashTranProfit) + parseFloat(othersReport.serviceIncomeAmount))-
                                    parseFloat(othersReport.productDamageAmount+parseFloat(othersReport.cashTranLoss)+
                                    parseFloat(othersReport.employeeSalaryPay)+parseFloat(totalSaleDiscount)+parseFloat(othersReport.salesReturnAmount)+parseFloat(othersReport.materialDamageAmount) + parseFloat(othersReport.serviceExpenseAmount))).toFixed(2)) :0}</TableCell>

                   </TableRow>
              
          
         
        
              
             
         
         
                  
            
    
       
         
    
    
          </TableBody>
        </Table>
      </TableContainer>
          </Paper>
     ):''

) :(<>


    <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >
      <TableContainer>
         <Table>
           <TableHead>
               <TableRow>
                 <TableCell>Product Name</TableCell>
                 <TableCell>Product Code</TableCell>
                 <TableCell>Sold Qty</TableCell>
                 <TableCell>Sold Amount</TableCell>
                 <TableCell>Purchased Amount</TableCell>
                 <TableCell>Profit Amount</TableCell>
               </TableRow>
           </TableHead>
             <TableBody>
               {productWiseProfit.map((prod)=>(
                   <TableRow>
                     <TableCell style={{width:'20%'}}>{prod.prod_name}</TableCell>
                     <TableCell>{prod.prod_code}</TableCell>
                     <TableCell>{prod.prod_sold_qty}</TableCell>
                     <TableCell>{format(parseFloat(prod.prod_sold_amount).toFixed(2))}</TableCell>
                     <TableCell>{format(parseFloat(prod.prod_purchased_amount).toFixed(2))}</TableCell>
                     <TableCell style={{textAlign:'right'}}>{format(parseFloat(prod.prod_profit_amount).toFixed(2))}</TableCell>
                </TableRow>
               ))}

               <TableRow style={{background:'#eaeaea'}}>
                 <TableCell colSpan={2} style={{textAlign:'right'}}>Total : </TableCell>
                 <TableCell>{productWiseProfit.reduce((prev,curr)=>{ return  prev+parseFloat(curr.prod_sold_qty)},0)}</TableCell>
                 <TableCell>{format(productWiseProfit.reduce((prev,curr)=>{ return  prev+parseFloat(curr.prod_sold_amount)},0).toFixed(2))}</TableCell>
                 <TableCell>{format(productWiseProfit.reduce((prev,curr)=>{ return  prev+parseFloat(curr.prod_purchased_amount)},0).toFixed(2))}</TableCell>
                 <TableCell style={{textAlign:'right'}}>{ format(parseFloat(productProfit).toFixed(2)) }</TableCell>
               </TableRow>





               <TableRow  >   
                    <TableCell colSpan={5}  align="right">Received from Cash Transaction (+)</TableCell>

                      <TableCell align="right">{othersReport != null ? format(parseFloat(othersReport.cashTranProfit).toFixed(2)) :0}</TableCell>
                    </TableRow>
            

                    <TableRow  >   
                    <TableCell colSpan={5}  align="right">Income from Services (+)</TableCell>

                      <TableCell align="right">{othersReport != null ? format(parseFloat(othersReport.serviceIncomeAmount).toFixed(2)) :0}</TableCell>
                    </TableRow>


                    <TableRow>

<TableCell  colSpan={5} align="right">Expense for Services Item (-)</TableCell>
<TableCell align="right"> { othersReport != null ? format(parseFloat(othersReport.serviceExpenseAmount).toFixed(2)) :0 }</TableCell>
  </TableRow>




                    <TableRow>

                  <TableCell  colSpan={5} align="right">Sales Return (-)</TableCell>
                  <TableCell align="right"> { othersReport != null ? format(parseFloat(othersReport.salesReturnAmount).toFixed(2)) :0 }</TableCell>
                    </TableRow>
                  
                    <TableRow  >  

                    <TableCell  colSpan={5}  align="right">Sales Discount (-) </TableCell>
                    <TableCell align="right">{format(parseFloat(totalSaleDiscount).toFixed(2))}</TableCell>

                    </TableRow>
                    <TableRow  >  

                    <TableCell colSpan={5} align="right">Product Total Damage (-) </TableCell> 
                    <TableCell align="right">{othersReport != null ? format(parseFloat(othersReport.productDamageAmount).toFixed(2)) :0}</TableCell>
                    
                

                    </TableRow>
                    <TableRow>
                    <TableCell colSpan={5} align="right">Material Total Damage (-) </TableCell> 
                    <TableCell align="right">{othersReport != null ? format(parseFloat(othersReport.materialDamageAmount).toFixed(2)) :0}</TableCell>
                    </TableRow>
                    <TableRow  >  
                    <TableCell colSpan={5} align="right">Expense (-) </TableCell>
                    <TableCell align="right">{othersReport != null ? format(parseFloat(othersReport.cashTranLoss).toFixed(2)) :0}</TableCell>


                    </TableRow>

                    <TableRow>
                    <TableCell colSpan={5} align="right">Employee Payment (-) </TableCell>
                    <TableCell align="right">{othersReport != null ? format(parseFloat(othersReport.employeeSalaryPay).toFixed(2)) :0}</TableCell>

                    </TableRow>
                    <TableRow  >  
                
                  
                  <TableCell colSpan={5} align="right">Total Profit / Loss   </TableCell>
                  <TableCell align="right">{othersReport != null ? format(parseFloat((productProfit+parseFloat(othersReport.cashTranProfit) + parseFloat(othersReport.serviceIncomeAmount))-
                                    parseFloat(othersReport.productDamageAmount+parseFloat(othersReport.cashTranLoss)+
                                    parseFloat(othersReport.employeeSalaryPay)+parseFloat(totalSaleDiscount)+parseFloat(othersReport.salesReturnAmount)+parseFloat(othersReport.materialDamageAmount) + parseFloat(othersReport.serviceExpenseAmount))).toFixed(2)) :0}</TableCell>

                   </TableRow>
              
              
             </TableBody>
         </Table>
      </TableContainer>
    </Paper>

</>)
  }
      </div>)
  })

    return(
        <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
  marginBottom: '2px'}}>Profit Loss Report</h4> 
  
  

<Grid container spacing={3} > 
     
      

        <Grid item  xs={12}   sm={2} > 
                <Select
                value={selectedType}
                onChange={(type)=>{
                    if(type == null){
                        return false;
                    }
                    selectedTypeSet(type);
                    selectedCustomerSet(null)
                    selectedProductSet(null)
                }}
                options={types}

            />
        </Grid>

        {
            selectedType != null && selectedType.value =='customer' ? (
                <Grid item  xs={12}   sm={2} > 
                <Autocomplete 
                size="small"
        
                autoHighlight
                    openOnFocus={true}
                    style={{width:'100%',height:'20px'}}
                    options={customers}
                    value={selectedCustomer}
                    getOptionLabel={(option) => option.customer_name}
                    onChange={(event,selectedObj)=>{
                       selectedCustomerSet(selectedObj)
                    }}
                    inputRef={customerRef}
        
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            fromDateRef.current.focus()
                        }
                      }}
        
                    renderInput={(params) => <TextField 
                       
                      {...params} 
                      label="Customer " 
                      variant="outlined"
                      />} 
                />
                </Grid>
            ):''
        }




{
   selectedType != null && selectedType.value =='product' ||   selectedType.value =='product_summary'? (
     
     <Grid  xs={12}   sm={2} >

<Autocomplete 
    openOnFocus={true}
    autoHighlight={true}
    style={{width:'100%',height:'20px',marginTop:'10px'}}
    options={products}
    value={selectedProduct}
    loading={true}
    size="small"
    getOptionLabel={(option) => option.prod_name}
    onChange={(e,product)=>{
        selectedProductSet(product)
     }}
    renderInput={(params) => <TextField 
      
      {...params} 
      label="choose a product" 
      variant="outlined"
      
      />}
      
/>
     </Grid>
 

   ) :''
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
          value={byDateTime.fromDate}
          onChange={(datet)=>{
            byDateTimeSet({...byDateTime,fromDate:datet})
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
          value={byDateTime.toDate}
          onChange={(datet)=>{
            byDateTimeSet({...byDateTime,toDate:datet})

          }}
          label="To Date &   Time"
          format="yyyy/MM/dd hh:mm a"
             />
          </MuiPickersUtilsProvider>
        </Grid>
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
export default connect(mapStateToPops,{currentRouteSet})(CustomerTransactionHistory);