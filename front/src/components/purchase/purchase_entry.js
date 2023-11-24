import React,{useState,useEffect} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet} from '../../actions/actions';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {pathSpliter,checkAuthBranchWare,dateTimeFormat,checkIntNum,currentDateTime,getDateTimeFromISODT} from '../../lib/functions'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import swal from 'sweetalert';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'

import { Redirect,generatePath  } from 'react-router'
import {useHistory} from 'react-router-dom'


import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {APP_URL,API_URL} from '../../config.json';



import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import socketIOClient from "socket.io-client";

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import commaNumber from 'comma-number';
let format = commaNumber.bindWith(',', '.')

const PurchaseEntry = ({location,currentRoute,currentRouteSet,authInfo})=>{

    const classes = useStyles();
    const [selectedDate, handleDateChangeSet] = useState(currentDateTime);
    const [saveAction, saveActionSet] = useState(false);
    const history = useHistory();

    let [selectedSupplierPayMethod,selectedSupplierPayMethodSet] = useState({pay_method_id:'cash',pay_method:'Cash'},{pay_method_id:'bank',pay_method:'Bank'})
    let [selectedSupplierPayAcc,selectedSupplierPayAccSet] = useState(null)
    let [supplierPayAccs,supplierPayAccsSet] = useState([])

    let supplierPayMethods = [{pay_method_id:'cash',pay_method:'cash'},{pay_method_id:'bank',pay_method:'bank'}]

    let [purchaseData,setPurchaseData] = useState({
              invoice_no:'',
              pur_emp_id:0,
              pur_created_isodt:currentDateTime,
              pur_supplier_id:0,
              pur_subtotal_amount:0,
              pur_vat_amount:0,
              pur_vat_percent:0,
              pur_discount_amount:0,
              pur_discount_percent:0,
              pur_total_amount:0,
              pur_paid_amount:0,
              pur_due_amount:0,
              pur_transport_cost:0,
              supplier_address:'',
              supplier_mobile_no:'',
              supplier_name:'',
              pur_note:'',
              pur_previous_due:0,
              pur_supplier_type:''
            })
      

    let [formAction,formActionSet] = useState('create');
    let [employees,employeesSet] = useState([]);
    let [suppliers,suppliersSet] = useState([]);
    let [products,productsSet] = useState([]);
    let [purchaseCart,purchaseCartSet] = useState([]);
    let [subTotal,subTotalSet] = useState(0);

    let [purTotalAmo,purTotalAmoSet] = useState(0);
    let [purPaidAmo,purPaidAmoSet] = useState(0);
    let [purDueAmo,purDueAmoSet] = useState(0);

    let [cartTotal,cartTotalSet] = useState(0);
    
    let [pur_vat_percent,pur_vat_percent_set] = useState(0);
    let [pur_vat_amount,pur_vat_amount_set] = useState(0);
    let [pur_discount_percent,pur_discount_percent_set] = useState(0);
    let [pur_discount_amount,pur_discount_amount_set] = useState(0);
    
    let [selectedEmployee,selectedEmployeeSet] = useState(null)
    let [selectedSupplier,selectedSupplierSet] = useState(null)
    let [selectedProduct,selectedProductSet] = useState(null)
    let [individualProducts,setIndividualProducts] = useState([])
    let employeeRef = React.useRef(null)
    let purchaseDateRef = React.useRef(null)
    let supplierRef = React.useRef(null)
    let purchaseRateRef = React.useRef(null)
    let productRef = React.useRef(null)
    let saleRateRef = React.useRef(null)
    let quantityRef = React.useRef(null)
    let totalRef = React.useRef(null)
    let purchaseToCartRef = React.useRef(null)
    let savePurchaseRef = React.useRef(null)
    let subTotalRef = React.useRef(null)
    let vatRef = React.useRef(null)
    let discountRef = React.useRef(null)
    let transportRef = React.useRef(null)
    let purTotalRef = React.useRef(null)
    let paidRef = React.useRef(null)
    let dueRef = React.useRef(null)
    let previousDueRef = React.useRef(null)

    const handleFromInput = (e)=>{
      const {name,value} = e.target;
      setPurchaseData({...purchaseData,[name]:value}) 
    }
    
    const productHandle = (e)=>{
      const {name,value} = e.target;
      setProduct({...product,[name]:value}) 
    }

    const handleTotalInput = (e)=>{
      const {name,value} = e.target;
      setPurchaseData({...purchaseData,[name]:value}) 
    }

    const handlePaidInput = (e)=>{
      const {name,value} = e.target;
      purPaidAmoSet(value)
    }

    const handleDueInput = (e)=>{
      const {name,value} = e.target;
      purDueAmoSet(value)
    }

    useEffect(()=>{
      let totalBill = (parseFloat(subTotal)+parseFloat(pur_vat_amount)+parseFloat(purchaseData.pur_transport_cost))-(parseFloat(pur_discount_amount))
      purTotalAmoSet(totalBill)
    },[handleTotalInput]);

    useEffect(()=>{
      if(selectedSupplier!=null && selectedSupplier.supplier_id==0){
        purPaidAmoSet(purTotalAmo);
        purDueAmoSet(0);
      }else{
        let dueAmount = purTotalAmo-purPaidAmo;
        purDueAmoSet(dueAmount);
      }
    },[handlePaidInput,handleDueInput,purTotalAmo]);

    useEffect(()=>{
      let total = product.prod_purchase_rate * product.prod_qty;
      cartTotalSet(total);
    },[productHandle])

    let [product,setProduct] = useState({
      prod_id: 0,
      prod_name:'',
      prod_purchase_rate: 0,
      prod_sale_rate: 0,
      prod_qty: '',
      prod_total: 0,
      });

     
    const purchaseToCart = (()=>{
          if(selectedProduct==null){
            swal({title:'Select  product',icon:'warning'});return false;
          }
          if(product.prod_purchase_rate < 0.1){
            swal({title:'Purchase rate is invalid.',icon:'warning'});return false;
          }
          if(product.prod_qty < 1){
            swal({title:'Quantity is invalid.',icon:'warning'});return false;
          }
          if(product.prod_sale_rate < 0){
            swal({title:'sale rate is invalid.',icon:'warning'});return false;
          }

          product.prod_total = cartTotal;
          let checkExit =   purchaseCart.findIndex((ele)=>{
              if(ele.prod_id==selectedProduct.prod_id){ 
                return true 
              }else{
                return false
              }
                  
          });
          if(checkExit>-1){
            swal({title:"This product already Exist.",icon:'warning'})
            return false;
          }
          purchaseCartSet([...purchaseCart,product]);
          setProduct({...product,prod_purchase_rate:'',
            prod_sale_rate:0,prod_id:0,prod_name:'',prod_qty:''}) 

          selectedProductSet(null);
          productRef.current.focus();
    })

    useEffect(()=>{
      let total =  purchaseCart.reduce((prev,curr)=>{
        return prev+parseFloat(curr.prod_purchase_rate*curr.prod_qty);
    },0)
    subTotalSet(total)
    },[purchaseCart]) 

    useEffect(()=>{
      setPurchaseData({...purchaseData,pur_subtotal_amount:subTotal})

    },[subTotal])

    useEffect( ()=>{
      currentRouteSet(pathSpliter(location.pathname,1));
      getPurchaseInvoice();
      getEmployees();
      getSuppliers();
      getIndividualProducts()
      const socket = socketIOClient(API_URL);
      // real time
      socket.on("purchaseInvoice",(data)=>{
        setPurchaseData({...purchaseData,invoice_no:data})
      })

      if(pathSpliter(location.pathname,3) != undefined){
        formActionSet('update')
         axios.post(`${API_URL}/api/get-purchase-with-details`,{reqPayload:{purchaseId:parseFloat(pathSpliter(location.pathname,3))}},{headers:{'auth-token':authInfo.token}}).then(res=>{
            let purchase = res.data.message[0];
            let purchaseDetails = res.data.message[0].details;

            selectedEmployeeSet({
              employee_id: purchase.pur_emp_id,
              employee_name: purchase.employee_name
            });

            selectedSupplierSet({
              supplier_id: purchase.pur_supplier_id,
              supplier_name: purchase.pur_supplier_type =='general'?'General Supplier':purchase.supplier_name,
              supplier_type: purchase.pur_supplier_type,
              display_text: purchase.supplier_name
            })



            setPurchaseData({...purchaseData,invoice_no:purchase.pur_invoice_no,supplier_name:purchase.supplier_name,display_text:purchase.supplier_name,
              supplier_mobile_no:purchase.supplier_mobile_no,supplier_address:purchase.supplier_address,
              pur_transport_cost:purchase.pur_transport_cost,
              pur_supplier_type : purchase.pur_supplier_type,
              pur_supplier_id : purchase.pur_supplier_id
              
              })
              handleDateChangeSet(purchase.pur_created_isodt)
              pur_vat_amount_set(purchase.pur_vat_amount)
              pur_vat_percent_set(purchase.pur_vat_percent)
              pur_discount_amount_set(purchase.pur_discount_amount)
              pur_discount_percent_set(purchase.pur_discount_percent)
              purTotalAmoSet(purchase.pur_total_amount)
              purPaidAmoSet(purchase.pur_paid_amount)
              purDueAmoSet(purchase.pur_due_amount)



              selectedSupplierPayMethodSet({pay_method_id:purchase.pur_pay_method,pay_method:purchase.pur_pay_method})
              selectedSupplierPayAccSet({bank_display_name:purchase.bank_display_name,bank_acc_id:purchase.pur_bank_id})

           let purchaseCartGet =  purchaseDetails.map((ele)=>{ 
              let product = {
                prod_id:ele.pur_prod_id,
                prod_name:ele.prod_name,
                prod_purchase_rate:ele.pur_rate,
                prod_sale_rate:ele.sale_rate,
                prod_qty:ele.pur_qty,
                prod_total:ele.pur_total_amount
              }
              return product;
            });

            purchaseCartSet(purchaseCartGet)




        })

       
      }
      getTranAccs()
    },[]) 


    const getTranAccs = async ()=>{
      await axios.post(`${API_URL}/api/get-bank-accounts`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
        supplierPayAccsSet(res.data.message)
      })
     } 


    let savePurchase = async ()=>{

       if(selectedSupplier==null){
            swal({title:'Supplier is Required.',icon:'warning'}) 
            return false;
        }

        if(purchaseCart.length==0){
          swal({title:'Sorry... your cart is Empty.',icon:'warning'}) 
          return false;
        }




        if(purPaidAmo > 0 && selectedSupplierPayMethod == null){
          swal({
            title:'Select Payment   Method',
            icon:'warning'
          });
          return false;
        }

        if(purPaidAmo > 0 &&  selectedSupplierPayMethod != null && selectedSupplierPayMethod.pay_method_id=='bank' && selectedSupplierPayAcc == null ){
          swal({
            title:'Select  Payment  Account ',
            icon:'warning'
          });
          return false;
        }

        if(parseFloat(purPaidAmo) <= 0 && selectedSupplierPayMethod !=null && selectedSupplierPayMethod.pay_method_id =='bank'){
          swal({
            title:'Paymentable Amount is 0 ',
            icon:'warning'
          });
          return false;
        }


        
       let purId = pathSpliter(location.pathname,3) != undefined?parseFloat( pathSpliter(location.pathname,3)):0;
       let purchase =  {...purchaseData,pur_vat_amount:pur_vat_amount,pur_vat_percent:pur_vat_percent,
        pur_discount_amount:pur_discount_amount,pur_discount_percent:pur_discount_percent,
        pur_due_amount:purDueAmo,pur_paid_amount:purPaidAmo,
        pur_total_amount:purTotalAmo,pur_emp_id:selectedEmployee!=null?selectedEmployee.employee_id:0,
        pur_created_isodt:selectedDate,pur_id:purId,
        pur_supplier_id:selectedSupplier.supplier_id ,
        pur_supplier_type :  selectedSupplier.supplier_type == undefined ? 'general':selectedSupplier.supplier_type,
        pur_pay_method : selectedSupplierPayMethod !=null? selectedSupplierPayMethod.pay_method_id:'cash',
        pur_bank_id :   selectedSupplierPayMethod==null || selectedSupplierPayMethod.pay_method_id =='cash' ? 0 :selectedSupplierPayAcc.bank_acc_id

        }

      
        saveActionSet(true)
        let url = `/save-purchase`;
        if(pathSpliter(location.pathname,3) != undefined){
            url =  `/update-purchase`;
        }

        await axios.post(`${API_URL}/api${url}`,{purchase,purchaseCart},{headers:{'auth-token':authInfo.token}}).then(res=>{
          if(!res.data.error){
            let smg = 'Purchase ';
            if(pathSpliter(location.pathname,3) != undefined){
              smg = 'Purchase updated '
            }
            swal({
              title:`${smg} successfully. Do you want to view invoice?`,
              icon:'success',
              buttons:true
            }).then((confirm)=>{
              if(confirm){
                history.push(`/purchase/purchase-invoice/${res.data.message.purchaseId}`) 
                saveActionSet(false)
              }else{
                window.location.reload();
              }
            })
          }
          else{
            swal({title:'Your Network problem....',icon:'warning'})
          }
        })

      
    }


    /// Methods 
    const getPurchaseInvoice = async ()=>{ 
          await axios.get(`${API_URL}/api/get-purchase-invoce`,{headers:{'auth-token':authInfo.token}}).then(res=>{
                setPurchaseData({...purchaseData,invoice_no:res.data.message})
          })
    }

    const getSuppliers = async ()=>{
          await axios.post(`${API_URL}/api/get-suppliers`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
            res.data.message.unshift({supplier_id:0,supplier_address:'',supplier_mobile_no:'',supplier_name:'General Supplier',display_text:'General Supplier'});
            suppliersSet(res.data.message);
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



   
    const  purchaseCartRemove = (row,index)=>{
      let hardCopy =  [...purchaseCart];
          hardCopy.splice(index, 1);
          purchaseCartSet(hardCopy)
    }


    let handleDiscountInput = (e)=>{
        if(e.target.name=='pur_discount_amount'){ 
          pur_discount_amount_set(e.target.value)
          let discountPercent = (100 * parseFloat(e.target.value))/parseFloat(subTotal)
          pur_discount_percent_set(discountPercent.toFixed(2))
        }else{
          pur_discount_percent_set(e.target.value)
          let discountAmount = (parseFloat(subTotal)*parseFloat(e.target.value))/100;
          pur_discount_amount_set(discountAmount.toFixed(2))
        }
    }


    let handleVatInput = (e)=>{
      if(e.target.name=='pur_vat_amount'){  
        pur_vat_amount_set(e.target.value)
        let vatPercent = (100 * parseFloat(e.target.value))/parseFloat(subTotal)
        pur_vat_percent_set(vatPercent.toFixed(2))
      }else{
        pur_vat_percent_set(e.target.value)
        let vatAmount = (parseFloat(subTotal)*parseFloat(e.target.value))/100;
        pur_vat_amount_set(vatAmount.toFixed(2))
      }
    }
    

      return(
          <div className={classes.root}>
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '2px'}}>Purchase Entry</h4>
<Grid container spacing={3} > 
          <Grid item  xs={12} sm={2}>
            <TextField label="invoice no" variant="outlined"  size="small"  className={classes.fullWidth} value={purchaseData.invoice_no} onChange={handleFromInput} name="invoice_no" disabled />
          </Grid> 

          <Grid item  xs={12}  sm={2}> 
          <Autocomplete 
          size="small"

          autoHighlight
              openOnFocus={true}
              style={{width:'100%',height:'20px'}}
              options={employees}
              value={selectedEmployee}
              getOptionLabel={(option) => option.employee_name}
              onChange={(event,selectedObj)=>{
                purchaseData.pur_emp_id = selectedObj!=null?selectedObj.employee_id:0
                selectedEmployeeSet(selectedObj)
              }}
              renderInput={(params) => <TextField 
              
                inputRef={employeeRef}
                onKeyDown={event => {
                  if (event.key === "Enter") {
                      purchaseDateRef.current.focus()
                  }
                }} 
                
                {...params} 
                label="Purchase by" 
                variant="outlined"
               
                />} 
                
          />

          </Grid>

          
                <Grid item  xs={0}  sm={6}>

                </Grid>
          <Grid item  xs={12}  sm={2} style={{marginBottom: '-9px'}} > 
            <MuiPickersUtilsProvider  utils={DateFnsUtils} > 
          
            <KeyboardDateTimePicker
            inputRef={purchaseDateRef}
            onKeyDown={(e)=>{
              if(e.key==='Enter'){
                supplierRef.current.focus()
              }
            }}
            style={{ width: '100%',marginTop: '' }}
            value={selectedDate}
            onChange={handleDateChangeSet}
            label="Purchse date  time"
            format="yyyy/MM/dd hh:mm a"
               />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        </Paper>
<Grid container spacing={3} >
        <Grid item xs={12} sm={8} >
          <Paper className={classes.paper}>
          <h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '3px'}}>Supplier & product information</h4>
          <Grid container spacing={3} >
                <Grid item xs={12} sm={6} className={classes.plusLinkDiv}>
                <Link className={classes.plusLink} to="/purchase/suppliers-manage" >+</Link>                 <Autocomplete 
                autoHighlight
                size="small"
              openOnFocus={true}
              value={selectedSupplier}
              style={{width:'100%'}}
              options={suppliers} 
              onChange={async (event,selectedObj)=>{
                if(selectedObj==null) return false
                purchaseData.pur_supplier_id = selectedObj.supplier_id
                purchaseData.supplier_name = selectedObj.supplier_name
                purchaseData.supplier_address = selectedObj.supplier_address
                purchaseData.supplier_mobile_no = selectedObj.supplier_mobile_no
                


                
                await axios.post(`${API_URL}/api/get-supplier-due`,{supplierId:selectedObj.supplier_id},{headers:{'auth-token':authInfo.token}}).then(res=>{
                  if(purchaseData.pur_supplier_id == 0){
                    setPurchaseData({...purchaseData,pur_previous_due:0,pur_supplier_type:'general'}) 
                    return false;
                  }

                  setPurchaseData({...purchaseData,pur_previous_due:res.data[0].dueAmount,pur_supplier_type:'general'}) 
                })

                selectedSupplierSet(selectedObj)
              }}
              getOptionLabel={(option) => option.display_text}
              renderInput={(params) => <TextField 

                inputRef={supplierRef} 
                onKeyDown={event => {
                  if (event.key === "Enter") {
                      productRef.current.focus()
                  }
                }} 
                {...params} 
                label="Choose a Supplier " 
                variant="outlined"
                
                />}
          />
                   <TextField label="supplier name" style={{display:purchaseData.pur_supplier_type == 'general' ?'' : 'none'}} size="small" variant="outlined" name="supplier_name" className={classes.inputField} value={purchaseData.supplier_name} onChange={handleTotalInput}  disabled={purchaseData.pur_supplier_id!=0?true:false}    />


                <TextField label="supplier mobile" size="small" variant="outlined" name="supplier_mobile_no" className={classes.inputField} value={purchaseData.supplier_mobile_no} onChange={handleTotalInput}  disabled={purchaseData.pur_supplier_id!=0?true:false}    />
                <TextField label="supplier address"  size="small"  variant="outlined" name="supplier_address" className={classes.inputField} value={purchaseData.supplier_address} onChange={handleTotalInput}  disabled={purchaseData.pur_supplier_id!=0?true:false}/> 
                </Grid>
                <Grid item xs={12} sm={6} className={classes.plusLinkDiv}>
                <Link className={classes.plusLink} to="/administration/products-manage" >+</Link>  

                
              <Autocomplete 
              
              autoHighlight
              openOnFocus={true}
              value={selectedProduct}
              style={{width:'100%',height:'20px'}}
              options={individualProducts}
              size="small"
              onChange={(e,obj)=>{

                selectedProductSet(obj)
                if(obj==null)return false
                setProduct({...product,prod_purchase_rate:parseFloat(obj.prod_purchase_rate).toFixed(2),
                  prod_sale_rate:obj.prod_sale_rate,prod_id:obj.prod_id,prod_name:obj.prod_name}) 
                  quantityRef.current.focus()
                
              }}
              getOptionLabel={(option) => option.prod_name}
              renderInput={(params) => <TextField 
                
                inputRef={productRef}
                onKeyDown={event => {
                  if (event.key === "Enter") {
                      purchaseRateRef.current.focus()
                  }
                }} 
                {...params} 
                label="choose a product" 
                variant="outlined"
                
                />}
                
          />
        <br/>
                <Grid container >
                      <Grid item xs={12} sm={6}>
                      <TextField style={{marginRight:'5px'}}  
                            inputRef={purchaseRateRef}
                            onKeyDown={event => {
                              if (event.key === "Enter") {
                                  quantityRef.current.focus()
                              }
                            }}  type="number" label="purchase rate"  size="small" value={product.prod_purchase_rate} onChange={productHandle} name="prod_purchase_rate" variant="outlined" className={classes.inputField} />
                      </Grid>
                      <Grid item sm={1} >
                      </Grid>
                      <Grid item xs={12} sm={5} >
                      <TextField label="quantity"  type="number"
                        inputRef={quantityRef}
                        onKeyDown={event => {
                          if (event.key === "Enter") {
                            purchaseToCartRef.current.click()
                          }
                        }}
                        value={product.prod_qty}
                      variant="outlined"  size="small"   onChange={productHandle} name="prod_qty" className={classes.inputField} />
                      </Grid>
                </Grid>


                <Grid container >
                      {/* <Grid item xs={12} sm={6}>
                      <TextField style={{marginRight:'5px'}} 
                      type="number"
                      inputRef={saleRateRef}
                      value={product.prod_sale_rate}
                      onKeyDown={event => {
                        if (event.key === "Enter") {
                          purchaseToCartRef.current.click()
                        }
                      }}
                      label="sale rate"  size="small"  onChange={productHandle} name="prod_sale_rate"  variant="outlined" className={classes.inputField} />
                      </Grid> */}
                      {/* <Grid item sm={1} > 
                      </Grid> */}
                      <Grid item xs={12} sm={6} >
                      <TextField label="total" type="number" disabled value={cartTotal}  onChange={productHandle} name="prod_total"  size="small"  variant="outlined" className={classes.inputField} />
                      </Grid>
                      <Button 
                      buttonRef={purchaseToCartRef}
                      onClick={purchaseToCart}

                      style={{marginTop: '5px',marginLeft: 'auto',fontSize:'10px'}} 
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            startIcon={<SaveIcon/>}
                        >
                       Add  To Cart 
                      </Button>
                </Grid> 
                </Grid>
                </Grid>
          </Paper> 
          <Grid container>
            
            <Grid item xs={12}>
                  <Paper className={classes.paper} style={{marginTop:'5px'}}>
                  <h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '3px'}}>Purchase Cart</h4>
                  <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left">SL</TableCell>
            <TableCell align="left">Product</TableCell>
            <TableCell align="center">Purchase Rate</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { 
           purchaseCart.map((row,index) => ( 
            <TableRow key={row.prod_id}>
              <TableCell  align="left">{parseFloat(index)+1}</TableCell>
              <TableCell align="left">{row.prod_name}</TableCell> 
              <TableCell align="center">{format(parseFloat(row.prod_purchase_rate).toFixed(2))}</TableCell> 
              <TableCell align="center">{row.prod_qty}</TableCell>
              <TableCell align="right">{format(parseFloat(row.prod_total).toFixed(2))}</TableCell>
               <TableCell align="right" >
              <RemoveCircleIcon style={{cursor:'pointer',color:'#FF0202',marginLeft:'2px'}} onClick={()=>{purchaseCartRemove(row,index)}}></ RemoveCircleIcon></TableCell>
            </TableRow>
          ))}

        {purchaseCart.length!=0?
        <TableRow colSpan={4}>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell style={{fontWeight:'bold'}} align="right">Total : {format(parseFloat(subTotal).toFixed(2))}</TableCell>
         <TableCell></TableCell>
        </TableRow>
        :''}


        </TableBody>
      </Table>
    </TableContainer>


    <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table">
      {purchaseCart.length!=0?
          <TableRow >
             <TableCell style={{width: '325px'}}><TextareaAutosize onChange={handleTotalInput} name="pur_note" style={{float:'left',marginTop:'20px',width: '325px'}} aria-label="Purchase Note..." rowsMin={3} placeholder="purchase Note..." />
             </TableCell>

             <TableCell colSpan={2}></TableCell>

           
          
          </TableRow>
          :''}
      </Table>
    </TableContainer>


                  </Paper>
            </Grid>
          
          </Grid>
        
        </Grid>

        <Grid item xs={12} sm={4} >
        
          <Paper className={classes.paper}>
          <h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '3px'}}>Amount Details</h4>
          <Grid container style={{paddingRight:'1px'}}>
                      <Grid item xs={12} sm={5}>
                      <TextField type="number" style={{marginRight:'5px'}} label="Subtotal"  
                       size="small"  disabled 
                      value={purchaseData.pur_subtotal_amount}
                      inputRef={subTotalRef} 
                      onChange={handleTotalInput}
                      variant="outlined" className={classes.inputField} 
                      onKeyDown={(e)=>e.key==='Enter'?vatRef.current.focus():false}
                      />
                      </Grid>
                      <Grid item xs={0} sm={1}>
                      </Grid>


                      <Grid item xs={12} sm={6}>
                      <TextField type="number" style={{marginRight:'5px'}}  size="small"  label="Current Due" disabled variant="outlined" className={classes.inputField} 
                      value={purchaseData.pur_previous_due} 
                      onChange={handleTotalInput}
                      name="pur_previous_due"
                      disabled
                     />
                      </Grid>


                     
                      
                     
                     
          </Grid>

          <Grid container>
                      <Grid item xs={12} sm={5} >
                      <TextField type="number" label="Vat (TK)" variant="outlined"  size="small"   className={classes.inputField} 
                      value={pur_vat_amount}
                      inputRef={vatRef} 
                      name="pur_vat_amount"
                      onChange={handleVatInput}
                      onKeyDown={(e)=>e.key==='Enter'?discountRef.current.focus():false} />
                      </Grid>
                      <Grid item xs={0} sm={1}>
                      </Grid>

                      <Grid item xs={12} sm={6} >
                      <TextField type="number" label="vat (%)" variant="outlined"  size="small"   className={classes.inputField} 
                      value={pur_vat_percent}
                      inputRef={vatRef} 
                      name="pur_vat_percent"
                      onChange={handleVatInput}
                      onKeyDown={(e)=>e.key==='Enter'?discountRef.current.focus():false} />
                      </Grid>

          </Grid>
          <Grid container style={{paddingRight:'1px'}}>
                      <Grid item xs={12} sm={5}>
                      <TextField type="number" style={{marginRight:'5px'}}  size="small"  label="Discount(TK)" variant="outlined" className={classes.inputField} 
                      onKeyDown={(e)=>e.key==='Enter'?transportRef.current.focus():false}
                      value={pur_discount_amount}
                      onChange={handleDiscountInput}
                      name="pur_discount_amount"
                      inputRef={discountRef} /> 
                      </Grid>
                      <Grid item xs={0} sm={1}>
                      </Grid>
                      <Grid item xs={12} sm={6} >
                      <TextField type="number" onChange={handleDiscountInput} label="Discount (%)"  size="small"  variant="outlined" className={classes.inputField} 
                      onKeyDown={(e)=>e.key==='Enter'?paidRef.current.focus():false}
                      value={pur_discount_percent}
                      name="pur_discount_percentage"
                      inputRef={transportRef} />
                      </Grid>    
          </Grid>
          <Grid container style={{paddingRight:'1px'}}>
                      <Grid item xs={12} sm={5}>
                      <TextField type="number" style={{marginRight:'5px'}}  size="small"  label="Total" disabled variant="outlined" className={classes.inputField} 
                      value={purTotalAmo}
                      onChange={handleTotalInput}
                      name="purTotalAmo"
                      onKeyDown={(e)=>e.key==='Enter'?previousDueRef.current.focus():false}
                      inputRef={purTotalRef} />
                      </Grid>
                      <Grid item xs={0} sm={1}>
                      </Grid>

                      <Grid item xs={12} sm={6} >
                      <TextField type="number" onChange={handleTotalInput} label="Transport Cost"  size="small"  variant="outlined" className={classes.inputField} 
                      onKeyDown={(e)=>e.key==='Enter'?paidRef.current.focus():false}
                      value={purchaseData.pur_transport_cost}
                      name="pur_transport_cost"
                      inputRef={transportRef} />
                      </Grid>    
                        
          </Grid>


          <Grid container style={{paddingRight:'1px'}}>
          <Grid item xs={12} sm={5} >
                      <TextField type="number" label="Paid" variant="outlined"  size="small"  className={classes.inputField} 
                      value={purPaidAmo}
                      onChange={handlePaidInput}
                      name="purPaidAmo"
                      disabled={selectedSupplier!==null && selectedSupplier.supplier_id==0?true:false}
                      onKeyDown={(e)=>e.key==='Enter'?dueRef.current.focus():false}
                      inputRef={paidRef} />
                      </Grid> 

                      <Grid item xs={0} sm={1}>
                      </Grid>
                      <Grid item xs={12} sm={6} >
                      <TextField type="number" label="Due" variant="outlined"  size="small"  className={classes.inputField} 
                       value={purDueAmo}  
                       disabled
                       onChange={handleDueInput} 
                       onKeyDown={(e)=>e.key==='Enter'?savePurchaseRef.current.click():false}
                       name="purDueAmo"
                       inputRef={dueRef} /> 
                      </Grid>    


          </Grid>


      
          <Grid container>
{
                      purPaidAmo > 0 ?(
                        <Grid item xs={12} sm={5}  className={classes.plusLinkDiv} style={{marginTop:'15px',marginBottom:'10px'}}>
                        <Autocomplete
                        style={{ width: '100%' }}
                        options={supplierPayMethods}
                        size="small"
                        classes={{
                            option: classes.option
                        }}
                        autoHighlight={true}
                        openOnFocus={true}
                        getOptionLabel={(option) => option.pay_method}
                        value={selectedSupplierPayMethod}  
                        onChange={(event,selectedObj)=>{
                 
                          selectedSupplierPayMethodSet(selectedObj) 

                          if(selectedObj != null && selectedObj.pay_method_id =='cash'){
                            selectedSupplierPayAccSet(null)
                          }
                          
                        }}
                        loading={supplierPayMethods.length==0?true:false}
                        renderInput={(params) => (
                            <TextField
                            //inputRef={customerPayMethodRef}
                            // onKeyDown={event => {
                            //     if (event.key === "Enter") {
                            //       customerPayAccRef.current.focus() 
                            //     }
                            //   }}
                            {...params}
                            label="Payment Method"
                            variant="outlined"
                            inputProps={{
                                ...params.inputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {/* {customerPayMethods.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment} */}
                                  </React.Fragment>
                                ),
                            }}
                            />
                        )}
                        /> 
                    </Grid>
                      ):''
                    }

<Grid item xs={12} sm={1}>

  </Grid>
{purPaidAmo > 0 ?(
    selectedSupplierPayMethod != null && selectedSupplierPayMethod.pay_method =='bank'?(
      <Grid item xs={12} sm={6}   className={classes.plusLinkDiv} style={{display:(selectedSupplierPayMethod!=null && selectedSupplierPayMethod.pay_method_id=='bank')?'block':'none',marginTop:'15px',marginBottom:'10px'}}>
      <Autocomplete
      style={{ width: '100%' }} 
      options={supplierPayAccs} 
      size="small"
      classes={{
          option: classes.option
      }}
      autoHighlight={true}
      openOnFocus={true}
      getOptionLabel={(option) =>option.bank_display_name}
      value={selectedSupplierPayAcc}  
      onChange={(event,selectedObj)=>{
        selectedSupplierPayAccSet(selectedObj)  
       
      }}
      loading={supplierPayAccs.length==0?true:false}
      renderInput={(params) => (
          <TextField
          //inputRef={customerPayAccRef}
          // onKeyDown={event => {
          //     if (event.key === "Enter") {
          //         customerPayMethodRef.current.focus() 
          //     }
          //   }}
          {...params}
          label="Bank account"
          variant="outlined"
          inputProps={{
              ...params.inputProps,
              endAdornment: (
                <React.Fragment>
                  {/* {customerPayAccs.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment} */}
                </React.Fragment>
              )
          }}
          />
      )}
      /> 
  </Grid>
    ):''
):''
  
}


     
</Grid>



        

          <Grid container style={{paddingRight:'1px'}}>
                      <Grid item xs={12} sm={6}>
                      <Button style={{marginTop: '5px',fontSize:'18px',float:'left'}} 
                            variant="contained"
                            color="primary"
                            size="small"
                            buttonRef={savePurchaseRef} 
                            onClick={savePurchase} 
                            className={classes.button}
                            startIcon={<SaveIcon/>}
                            disabled={saveAction?true:false}
                        >
                       Purchase
                      </Button>
                      </Grid>
                  
                      <Grid item xs={12} sm={6} >
                      <Button 
                      style={{marginTop: '5px',fontSize:'10px',float:'right'}} 
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={()=>window.location.reload()}
                            className={classes.button}
                            startIcon={<SaveIcon/>}
                        >
                       New Purchase
                      </Button>
                      </Grid>    
          </Grid>


          </Paper>
        </Grid>

        
      </Grid>
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
export default connect(mapStateToPops,{currentRouteSet})(PurchaseEntry);