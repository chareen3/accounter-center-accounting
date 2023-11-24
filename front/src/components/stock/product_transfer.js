import React,{Fragment,useState,useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet} from '../../actions/actions';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {pathSpliter,checkAuthBranchWare,dateTimeFormat,checkIntNum,currentDateTime,getDateTimeFromISODT} from '../../lib/functions'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {APP_URL,API_URL} from '../../config.json';
import { useHistory } from "react-router-dom";

import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import './components/stock.css';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import swal from 'sweetalert';
import { CardContent } from '@material-ui/core';



const SalesEntry = ({location,currentRoute,currentRouteSet,authInfo})=>{

    const classes = useStyles();
    const [selectedDate, handleDateChangeSet] = useState(currentDateTime);

    const history = useHistory();
   
    // States start 
       let [cart,cartSet] = useState([]);
       let [employees,employeesSet] = useState([]);
       let [branches,branchesSet] = useState([]);
       let [warehouses,warehousesSet] = useState([]);
       let [products,productsSet] = useState([]);
       

       let [selectedEmployee,selectedEmployeeSet] = useState(null);
       let [selectedProduct,selectedProductSet] = useState(null);
       let [selectedBranch,selectedBranchSet] = useState(null);
       let [selectedWarehouse,selectedWarehouseSet] = useState(null);

       

    

       let [product_rate,product_rate_set] = useState(0);
       let [product_qty,product_qty_set] = useState('');
       let [product_total,product_total_set] = useState(0);

       let [product_stock_status,product_stock_status_set] = useState('stock status');
       let [product_stock_qty,product_stock_qty_set] = useState('stock qty');
       let [product_unit,product_unit_set] = useState('unit');
       let [product_purchase_rate,product_purchase_rate_set] = useState('purchase rate');

    

       let [note,note_set] = useState('');
       let [total,total_set] = useState(0);

       let productRef =  useRef(null)
       let branchRef =  useRef(null)
       let warehouseRef =  useRef(null)
       let qtyRef =  useRef(null)
       let addToCartRef =  useRef(null)
       let dateRef =  useRef(null)
       let transferRef =  useRef(null)
     
       let [transferFormAction,transferFromActionSet] = useState('create');
       let [transferId,transferIdSet] = useState(0);

    // State End
    
    // Methods  start
       useEffect(()=>{
          currentRouteSet(pathSpliter(location.pathname,1));
            getProducts()
            getBranches()
            // getWarehouses()
            getEmployees()
          if(pathSpliter(location.pathname,3) != undefined){
            transferFromActionSet('update');
            transferIdSet(parseFloat(pathSpliter(location.pathname,3))); 
            getTransfer()
          }
       },[])

       // Calculate total 
     let  getTransfer = async ()=>{
         await axios.post(`${API_URL}/api/get-product-transfers`,{transferId:parseFloat(pathSpliter(location.pathname,3))},{headers:{'auth-token':authInfo.token}}).then(res=>{
               let transfer = res.data.message[0];
               let transferDetails = res.data.message[0].details;

               handleDateChangeSet(transfer.transfer_c_isodt);
               selectedBranchSet({branch_name:transfer.branch_name,branch_id:transfer.transfer_b_to})
               selectedWarehouseSet({warehouse_name:transfer.warehouse_name,warehouse_id:transfer.transfer_w_to})
               selectedEmployeeSet({employee_id: transfer.transfer_c_by,employee_name:transfer.employee_name})
               note_set(transfer.transfer_note)
              let newCart =  transferDetails.map((ele)=>{
                 let product = {
                  prod_id: ele.transfer_prod_id,
                  prod_name: ele.prod_name,
                  prod_qty: ele.transfer_qty,
                  prod_purchase_rate: ele.transfer_pur_rate,
                  prod_total: ele.transfer_total
                 }
                 return product;
               })   
               cartSet(newCart);
         });
       }

    useEffect(()=>{
        let total = cart.reduce((prev,curr)=>{
          return prev+parseFloat(curr.prod_total);
        },0);
        total_set(total);
    },[cart]) 

    let employeeRef = useRef(null)
    


       useEffect(()=>{
        product_total_set(product_rate*product_qty);
       },[product_qty])

       useEffect(()=>{
         if(selectedProduct!=null){
           axios.post(`${API_URL}/api/get-product-current-stock`,{product_id:selectedProduct.prod_id},{headers:{'auth-token':authInfo.token}}).then(res=>{
            product_stock_qty_set(res.data.message)
           })
         }else{
          product_stock_qty_set('Stock Qty')
         }
       },[selectedProduct])
       
    
       let getEmployees = async ()=>{
           await axios.post(`${API_URL}/api/get-employees`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
                employeesSet( res.data.message)
          })
       }

       let getBranches = async ()=>{
        await axios.post(`${API_URL}/api/get-branches`,{'select-type':'active','without-self':'yes'},{headers:{'auth-token':authInfo.token}}).then(res=>{
             branchesSet(res.data.message)
       })
       }

      //  let getWarehouses = async ()=>{
      //   await axios.post(`${API_URL}/api/get-warehouses`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
      //        warehousesSet(res.data.message)
      //  })
      //  }
       
     

       let getProducts = async ()=>{
        await axios.post(`${API_URL}/api/get-individual-products`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>[
           productsSet(res.data.message)
        ]);
       }


       let productToCart = ()=>{
           if(selectedProduct==null){
             swal({title:'Select Product',icon:'warning'}); return false;
           }
          //  if(parseFloat(product_rate)<=0 || product_rate==''){
          //   swal({title:'Sale Rate is Invalid.',icon:'warning'}); return false;
          //  }
           if(parseFloat(product_qty)<=0 || product_qty==''){
            swal({title:'Quantity is Invalid ',icon:'warning'}); return false;
           }
           if(parseFloat(product_qty)>parseFloat(product_stock_qty) || parseFloat(product_stock_qty)<=0){
            swal({title:'Stock Unavailable',icon:'warning'}); return false;
           }
           let checkProdExist = cart.findIndex((curr)=>{
               if(curr.prod_id==selectedProduct.prod_id){
                  return true;
                }
           });
           if(checkProdExist>-1){
            swal({title:'Product already exist.',icon:'warning'}); return false;
           }
           cartSet([...cart,{prod_id: selectedProduct.prod_id,
            prod_name: selectedProduct.prod_name,
            prod_qty: product_qty,
            prod_purchase_rate: selectedProduct.prod_purchase_rate,
            prod_total: product_total}]);            
            product_rate_set(0);
            product_qty_set('');
            product_total_set(0);
            selectedProductSet(null); 
            productRef.current.focus();
           
       }

       let cartFromRemove = (index)=>{
        let hardCopy =  [...cart];
        hardCopy.splice(index, 1);
        cartSet(hardCopy)
       }


       let defaultWarehouse = {
           warehouse_name:'Without Warehouse',
           warehouse_id:0
       }


    

    const [purchaseRateShow,purchaseRateShowSet] = useState(true);
    const [saveLoading,saveLoadingSet] = useState(false);

    let purchaseRateShowAction = ()=>{
        if(purchaseRateShow==true){
          purchaseRateShowSet(false)
        }else{
          purchaseRateShowSet(true)
        }
    }

    let transferAction = async ()=>{
        if(selectedBranch==null){
          swal({title:'Branch is required.',icon:'warning'});return false;
        }
        if(selectedWarehouse==null){
            selectedWarehouseSet(defaultWarehouse)
        }

        if(cart.length==0){
          swal({title:'Cart is Empty.',icon:'warning'});return false;
        }

        if(selectedEmployee==null){
            swal({title:'Employee Required.',icon:'warning'});return false;
        }

      

        
        let transfer = {
            transfer_b_to: selectedBranch.branch_id,
            transfer_w_to: selectedWarehouse == null ? 0: selectedWarehouse.warehouse_id,
            transfer_note: note,
            transfer_c_by: selectedEmployee.employee_id,
            transfer_amount: total,
            transfer_c_isodt: selectedDate,
            transfer_id : transferId
        }

        let url = `/api/transfer-add`
        if(transferFormAction=='update'){
            url = `/api/transfer-update`
        }
        saveLoadingSet(true)
         await axios.post(`${API_URL}${url}`,{cart,transfer},{headers:{'auth-token':authInfo.token}}).then(res=>{
          
          if(!res.data.error){
            swal({title:`${res.data.message.msg} successfully. Do you want to view invoice?`,icon:'success',buttons:true}).then(confirm=>{
              if(confirm){
                history.push(`/stock/transfer-invoice/${res.data.message.transferId}`)
              }else{
                window.location.reload()
              }
            })
          }
          saveLoadingSet(false)

         })
    }
    
      return(
          <div className={classes.root}> 


<Grid container spacing={3} style={{marginTop:'-20px'}}>
        <Grid item xs={12} sm={8} >
          <Paper className={classes.paper}>
          <h4 style={{textAlign:'left',margin:0,padding:0,
    marginBottom: '3px'}}>Transfer & product information</h4>
          <Grid container spacing={3} >
                <Grid item xs={12} sm={5}  >
                <Grid item xs={12} sm={12} style={{marginBottom:'10px'}}>
                <Autocomplete
             autoHighlight={true}
              size="small"
              openOnFocus={true}
              style={{width:'100%'}}
              options={branches}
              value={selectedBranch}
              onChange={(e,branch)=>{
                 if(branch==null){
                     return false;
                 }else{
                     selectedBranchSet(branch);
                 }
               }}
              getOptionLabel={(option) => option.branch_name}
              renderInput={(params) => <TextField 
                inputRef={branchRef}
                onKeyDown={(e)=>{
                  warehouseRef.current.focus()
                }}
                {...params} 
                label="Transfer To Branch" 
                variant="outlined"
                />}
          />
</Grid>

<Grid item xs={12} sm={12} style={{display:'none'}} >
                <Autocomplete
             autoHighlight={true}
              size="small"
              openOnFocus={true}
              style={{width:'100%'}}
              options={warehouses}
              value={selectedWarehouse}
              onChange={(e,warehouse)=>{
                if(warehouse==null){
                    selectedWarehouseSet(defaultWarehouse);
                }else{
                    selectedWarehouseSet(warehouse);
                }
               }}
              getOptionLabel={(option) => option.warehouse_name}
              renderInput={(params) => <TextField 
                inputRef={warehouseRef}
                onKeyDown={(e)=>{
                  productRef.current.focus()
                }}
                {...params} 
                label="Transfer To Warehouse" 
                variant="outlined"
                />}
          />
                </Grid>

<Grid item  xs={12}  sm={12} style={{marginBottom:'25px'}}> 
          <Autocomplete 
          size="small"
              onKeyDown={(e)=>{
                if(e.key=='Enter'){
                  dateRef.current.focus()
                }
              }}
              value={selectedEmployee}
              openOnFocus={true}
              autoHighlight={true}
              style={{width:'100%',height:'20px'}}
              options={employees}
              onChange={(e,employee)=>{
               selectedEmployeeSet(employee)
              }}
              getOptionLabel={(option) => option.employee_name}
              renderInput={(params) => <TextField
                {...params} 
                label="Transfer By" 
                variant="outlined"

                />}
                
          />

          </Grid>




                </Grid>

                
                <Grid item xs={12} sm={5} >

                <Autocomplete 
              openOnFocus={true}
              autoHighlight={true}
              style={{width:'100%',height:'20px'}}
              options={products}
              value={selectedProduct}
            
              size="small"
              getOptionLabel={(option) => option.prod_name}
              onChange={(e,product)=>{
                qtyRef.current.focus();
                if(product==null){ 
                  product_qty_set(0);
                  selectedProductSet(null)
                  return false
                }

                  selectedProductSet(product)
                  product_rate_set(parseFloat(product.prod_purchase_rate).toFixed(2))
               }}
              renderInput={(params) => <TextField 
                inputRef={productRef}
                onKeyDown={(e)=>{
                  if(e.key=='Enter'){
                    qtyRef.current.focus(); 
                  }
                }}
                {...params} 
                label="choose a product" 
                variant="outlined"
                
                />}
                
          />
        <br/>
               
                <Grid container >
                    
                    
                    
                      <Grid item xs={12} sm={5} >
                      <TextField type="number" label="quantity" variant="outlined" className={classes.inputField}
                      value={product_qty} onChange={(e)=>{product_qty_set(e.target.value)}} 
                      inputRef={qtyRef}
                      onKeyDown={(e)=>{
                        if(e.key=='Enter'){
                          addToCartRef.current.click();
                        }
                      }} />
                      </Grid>
                      <Grid item xs={12} sm={1} >
                      </Grid>
                      <Grid item xs={12} sm={6} >
                      <TextField label="total" variant="outlined" value={product_total} onChange={(e)=>{product_total_set(e.target.value)}} disabled={true} className={classes.inputField} />
                      </Grid>
                </Grid>


                <Grid container >
                    
                    
                      
                      <Button style={{marginTop: '5px',marginLeft: 'auto',fontSize:'10px'}} 
                            
                            buttonRef={addToCartRef}
                           
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={()=>productToCart()}
                            className={classes.button}
                            startIcon={<SaveIcon/>}
                        >
                       Add  To Cart
                      </Button>
                </Grid>

              

                
                </Grid>

                <Grid item xs={12} sm={2}> 
              <strong style={{color:selectedProduct!=null?(parseFloat(product_stock_qty)>0?'green':'red'):'green',fontSize:'12px'}} className={"stock-info-msg"}>{selectedProduct!=null ?(parseFloat(product_stock_qty)>0?'Stock Available':'Stock Unavailable'):'Stock Status'}</strong> 
                      <div className={"stock-info"}>
                           <strong style={{color: selectedProduct!=null?(parseFloat(product_stock_qty)>0?'green':'red'):'green',fontSize:'12px'}}>{product_stock_qty}</strong>
                           <p style={{color: '#005600',fontSize:'12px'}}>{selectedProduct!=null?selectedProduct.prod_unit_name:'Unit Name'}</p>
                      </div>
                      <div  className={"stock-info-purchaserate"} onClick={()=>{purchaseRateShowAction()}}> 
                         <input  type={purchaseRateShow?"password":"text"} value={selectedProduct!=null?parseFloat(selectedProduct.prod_purchase_rate).toFixed(2):'Purchase Rate'} disabled></input>
                      </div>
                </Grid>
                </Grid>
          </Paper>


          <Grid container>
            
            <Grid item xs={12}>
                  <Paper className={classes.paper} style={{marginTop:'5px'}}>
                  <h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '3px'}}>Transfer Cart</h4>
                  <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
              <TableRow>
              <TableCell>SL</TableCell>
              <TableCell align="left">Product</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell align="right" >Remove</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
        {
            cart.map((product,sl)=>(
              <TableRow key={parseFloat(sl)+1}>
              <TableCell>{parseFloat(sl)+1}</TableCell>
              <TableCell align="left">{product.prod_name}</TableCell>
              <TableCell align="right">{product.prod_qty}</TableCell>
              <TableCell align="right">{(product.prod_total).toFixed(2)}</TableCell>
              <TableCell align="right" >
              <RemoveCircleIcon style={{cursor:'pointer',color:'#FF0202',marginLeft:'2px'}} onClick={()=>{cartFromRemove(sl)}}></ RemoveCircleIcon></TableCell>
            </TableRow>
            ))
          }

{cart.length!=0?
        <TableRow colSpan={4}>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell >Total : {parseFloat(total).toFixed(2)}</TableCell>
         <TableCell></TableCell>
        </TableRow>
        :''}
        </TableBody>
      </Table>
    </TableContainer>



   
                  </Paper>
            </Grid>
          
          </Grid>
        
        </Grid>

        <Grid item xs={12} sm={4} >
        
        <Paper className={classes.paper}>
        
        <Grid container style={{paddingRight:'1px'}}>
        

          

          <Grid item  xs={12}  sm={12} style={{marginBottom:'1px'}} > 
            <MuiPickersUtilsProvider  utils={DateFnsUtils}> 
            <KeyboardDateTimePicker
            style={{ width: '100%',marginTop: '' }}
            value={selectedDate}
            inputRef={dateRef}
            onKeyDown={(e)=>{
              if(e.key=='Enter'){
                transferRef.current.click()
              }
            }}
            onChange={handleDateChangeSet}
            name="sale_date"
            label="Transfer date  time"
            format="yyyy/MM/dd hh:mm a"
               /> 
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={12} sm={12} style={{marginBottom:'10px'}}>
          <TextareaAutosize onChange={(e)=>{note_set(e.target.value)}} value={note}  name="note" style={{float:'left',marginTop:'20px',width: '100%'}} aria-label="Transfer Note..." rowsMin={3} placeholder="Transfer Note..." />
             

          </Grid>
        
                    <Grid item xs={12} sm={12}>
                    <TextField type="number" style={{marginRight:'5px'}} label="Transfer Total Amount"  
                       size="small"   value={parseFloat(total).toFixed(2)} name="total_amount" disabled onChange={(e)=>total_set(e.target.value)} 
                      variant="outlined" className={classes.inputField} 
                      />
                    </Grid>
                   
        </Grid>
       

      

        <Grid container style={{paddingRight:'1px'}}>
                    <Grid item xs={12} sm={6}>
                    <Button style={{marginTop: '5px',fontSize:'18px',float:'left'}} 
                          variant="contained"
                          color="primary"
                          size="small"
                          buttonRef={transferRef}
                          onClick={()=>{transferAction()}}
                          className={classes.button}
                          disabled={saveLoading?true:false}
                          startIcon={<SaveIcon/>}
                      >
                     Transfer
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
                     New Transfer
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
export default connect(mapStateToPops,{currentRouteSet})(SalesEntry);