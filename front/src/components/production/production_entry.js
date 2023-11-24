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

import { Redirect,generatePath  } from 'react-router'
import {useHistory} from 'react-router-dom'


import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {APP_URL,API_URL} from '../../config.json';

import {BrowserRouter as Router,Route,Link} from 'react-router-dom'


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Select from 'react-select';

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
    const [materialStock, materialStockSet] = useState(0);
    const history = useHistory();



    let [purchaseData,setPurchaseData] = useState({
              invoice_no:'',
              emp_id:0,
              created_isodt:currentDateTime,
              material_cost:0,
              labour_cost:0,
              others_cost:0,
              total_cost:0,
              production_id:0
            })
    let [shifts,shiftsSet] = useState([{label:'Day Shift',value:'day_shift'},
    {label:'Night Shift',value:'night_shift'}])
    let [selectedShift,selectedShiftSet] = useState(null)
    let [formAction,formActionSet] = useState('create');
    let [employees,employeesSet] = useState([]);
    let [usedCart,usedCartSet] = useState([]);
    let [productCart,productCartSet] = useState([]);
    let [subTotalProd,subTotalProdSet] = useState(0);
    let [material_cost,material_cost_set] = useState(0);
    let [labour_cost,labour_cost_set] = useState(0);
    let [others_cost,others_cost_set] = useState(0);
    let [totalCost,totalCostSet] = useState(0);

  

    let [cartTotal,cartTotalSet] = useState(0);
    let [cartProductTotal,cartProductTotalSet] = useState(0);
   
    let [selectedEmployee,selectedEmployeeSet] = useState(null)
    let [selectedSupplier,selectedSupplierSet] = useState(null)
    let [selectedMaterial,selectedMaterialSet] = useState(null)
    let [selectedProduct,selectedProductSet] = useState(null)

    let [materials,setMaterials] = useState([])
    let [products,setProducts] = useState([])

    let employeeRef = React.useRef(null)
    let purchaseDateRef = React.useRef(null)
    let supplierRef = React.useRef(null)
    let purchaseRateRef = React.useRef(null)
    let purchaseRateProdRef = React.useRef(null)
    let materialRef = React.useRef(null)
    let productRef = React.useRef(null)
    let quantityRef = React.useRef(null)
    let quantityProdRef = React.useRef(null)
    let totalRef = React.useRef(null)
    let purchaseToCartRef = React.useRef(null)
    let productToCartRef = React.useRef(null)
    let productRateRef = React.useRef(null)
    let saveProductionRef = React.useRef(null)


    let materialCostRef = React.useRef(null)
    let labourCostRef = React.useRef(null)
    let othersCostRef = React.useRef(null)
    let totalCostRef = React.useRef(null)
    let saveRef = React.useRef(null)

    


    const handleFromInput = (e)=>{
      const {name,value} = e.target;
      setPurchaseData({...purchaseData,[name]:value}) 
    }
    
    const materialHandle = (e)=>{
      const {name,value} = e.target;
      setMaterial({...material,[name]:value}) 
    }

    const productHandle = (e)=>{
      const {name,value} = e.target;
      setProduct({...product,[name]:value}) 
    }

    const handleTotalInput = (e)=>{
      const {name,value} = e.target;
      setPurchaseData({...purchaseData,[name]:value}) 
    }

  
   

    useEffect(()=>{
      let totalBill = (parseFloat(purchaseData.material_cost)+parseFloat(purchaseData.labour_cost)+
      parseFloat(purchaseData.others_cost))
      totalCostSet(totalBill)
    },[handleTotalInput]);

   

    useEffect(()=>{
      let total = material.material_purchase_rate * material.material_qty;
      cartTotalSet(total);
    },[materialHandle])

    useEffect(()=>{
      let total = product.prod_purchase_rate * product.prod_qty;
      cartProductTotalSet(total);
    },[productHandle])

    let [material,setMaterial] = useState({
      material_id : 0,
      material_name:'',
      material_purchase_rate: 0,
      material_qty: '',
      material_total: 0,
      });

      let [product,setProduct] = useState({
        prod_id : 0,
        prod_name:'',
        prod_purchase_rate: 0,
        prod_qty: '',
        prod_total: 0,
        });
  

     
    const purchaseToCart = (()=>{
          if(selectedMaterial==null){
            swal({title:'Select  material',icon:'warning'});return false;
          }
          if(material.material_purchase_rate < 0.1){
            swal({title:'Purchase rate is invalid.',icon:'warning'});return false;
          }
          // if(material.material_qty < 0.1){
          //   swal({title:'Quantity is invalid.',icon:'warning'});return false;
          // }
    
          material.material_total = cartTotal;
          let checkExit =   usedCart.findIndex((ele)=>{
              if(ele.material_id==selectedMaterial.material_id){ 
                return true 
              }else{
                return false
              }
                  
          });
          if(checkExit>-1){
            swal({title:"This material already Exist.",icon:'warning'})
            return false;
          }

          if(material.material_qty > materialStock){
            swal({title:"Stock Unavailable",icon:'warning'})
            return false;
          }
          usedCartSet([...usedCart,material]);
          setMaterial({...material,material_purchase_rate:'',material_id:0,material_name:'',material_qty:''}) 

          selectedMaterialSet(null);
          materialStockSet(0)
          materialRef.current.focus();
    })


    const productToCart = (()=>{
      if(selectedProduct==null){
        swal({title:'Select  product',icon:'warning'});return false;
      }
      if(product.prod_purchase_rate < 1){
        swal({title:'Purchase rate is invalid.',icon:'warning'});return false;
      }
      // if(product.prod_qty < 1){
      //   swal({title:'Quantity is invalid.',icon:'warning'});return false;
      // }

      product.prod_total = cartProductTotal;
      let checkExit =   productCart.findIndex((ele)=>{
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
      productCartSet([...productCart,product]);
      setProduct({...product,prod_purchase_rate:'',prod_id:0,prod_name:'',prod_qty:'',prod_total:''}) 

      selectedProductSet(null);
      productRef.current.focus();
})

    useEffect(()=>{
      let total =  usedCart.reduce((prev,curr)=>{
        return prev+parseFloat(curr.material_purchase_rate*curr.material_qty);
    },0)
    material_cost_set(total)
    },[usedCart]) 

    

    useEffect(()=>{
      let total =  productCart.reduce((prev,curr)=>{
        return prev+parseFloat(curr.prod_purchase_rate*curr.prod_qty);
    },0)
    subTotalProdSet(total)
    },[productCart]) 
   



    useEffect(()=>{
      setPurchaseData({...purchaseData,material_cost:material_cost})

    },[material_cost])

    useEffect( ()=>{
      currentRouteSet(pathSpliter(location.pathname,1));
     
      getEmployees();
      getIndividualMaterials()
   
      if(pathSpliter(location.pathname,3) != undefined){
        formActionSet('update')
         axios.post(`${API_URL}/api/get-production-with-details`,{productionId:parseFloat(pathSpliter(location.pathname,3))},{headers:{'auth-token':authInfo.token}}).then(res=>{
          
          let production = res.data[0];
          let materialCart = res.data[0].materials;
          let productCart = res.data[0].products;

            selectedEmployeeSet({
              employee_id: production.employee_id,
              employee_name: production.employee_name
            });

            let shiftName = ``
            if(production.shift=='day_shift'){
              shiftName = `Day Shift`
            }
            if(production.shift=='night_shift'){
              shiftName = `Night Shift`
            }

            selectedShiftSet({
              label:shiftName,
              value:production.shift,
            })
  
       
 
            setPurchaseData({...purchaseData,
              invoice_no:production.production_invoice,
              labour_cost:production.labour_cost,
              material_cost:production.material_cost,
              others_cost:production.others_cost,
              total_cost:production.total_cost,
              production_id:production.production_id,
              production_note: production.production_note,
              material_used_note: production.material_used_note,
              shift_id:production.shift,
              emp_id:production.production_by
              })

              material_cost_set(production.material_cost)
              labour_cost_set(production.labour_cost)
              others_cost_set(production.others_cost)
              totalCostSet(production.total_cost)




              handleDateChangeSet(production.created_isodt)


              // usedCartSet([...usedCart,material]);
              productCartSet([...productCart,product]);
             




           let usedCartGet =  materialCart.map((ele)=>{ 
              let material = {
                material_id:ele.material_id,
                material_name:ele.material_name,
                material_purchase_rate:ele.material_rate,
                material_qty:ele.material_qty,
                material_total:ele.material_total
              }
              return material;
            });

            usedCartSet(usedCartGet)


            let productCartGet =  productCart.map((ele)=>{ 
              let product = {
                prod_id:ele.prod_id,
                prod_name:ele.prod_name,
                prod_purchase_rate:ele.prod_rate,
                prod_qty:ele.prod_qty,
                prod_total:ele.prod_total
              }
              return product;
            });

            productCartSet(productCartGet)




        })

       
      }else{
        getPurchaseInvoice();
      }

      getIndividualProducts()
    },[]) 



    let saveProduction = async ()=>{

      
        if(usedCart.length==0){
          swal({title:'Sorry... Your Used Material cart is Empty.',icon:'warning'}) 
          return false;
        }

        if(productCart.length==0){
          swal({title:'Sorry... Your production product cart is Empty.',icon:'warning'}) 
          return false;
        }
        if(selectedEmployee==null){
          swal({title:'Select Employee',icon:'warning'}) 
          return false;
        }
        if(selectedShift==null){
          swal({title:'Select Shift',icon:'warning'}) 
          return false;
        }


        
       let purchase =  {...purchaseData,
        total_cost:totalCost,
        created_isodt:selectedDate,
        

        }

      
      
       
      
        saveActionSet(true)
        let url = `/save-production`;
        if(pathSpliter(location.pathname,3) != undefined){
            url =  `/update-production`;
        }
    

        await axios.post(`${API_URL}/api${url}`,{purchase,usedCart,productCart},{headers:{'auth-token':authInfo.token}}).then(res=>{
         
       
          if(!res.data.error){
            let smg = 'Production  ';
            if(pathSpliter(location.pathname,3) != undefined){
              smg = 'Production updated '
            }
            swal({
              title:`${smg} successfully. Do you want to view invoice?`,
              icon:'success',
              buttons:true
            }).then((confirm)=>{
              if(confirm){
                history.push(`/production/production-invoice/${res.data.message.productionId}`) 
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
          await axios.get(`${API_URL}/api/get-production-invoice`,{headers:{'auth-token':authInfo.token}}).then(res=>{
                setPurchaseData({...purchaseData,invoice_no:res.data.message})
          })
    }

    
    const getIndividualMaterials = async()=>{
          await axios.post(`${API_URL}/api/get-materials`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            setMaterials(res.data.message);
          })
    }

    
    const getIndividualProducts = async()=>{
      await axios.post(`${API_URL}/api/get-individual-products`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
        setProducts(res.data.message);
      })
}


    const getEmployees = async ()=>{
      await axios.post(`${API_URL}/api/get-employees`,{'select-type': "active"},{headers:{'auth-token':authInfo.token}}).then(res=>{
        employeesSet(res.data.message)
    })
    }

    useEffect(()=>{
      if(selectedMaterial != null && selectedMaterial.material_id != null){
        axios.post(`${API_URL}/api/get-material-current-stock`,{materialId: selectedMaterial.material_id},{headers:{'auth-token':authInfo.token}}).then(res=>{
          materialStockSet(res.data.stock)
      })
      }else{
        materialStockSet(0)
      }
    },[selectedMaterial])



   
    const  usedCartRemove = (row,index)=>{
      let hardCopy =  [...usedCart];
          hardCopy.splice(index, 1);
          usedCartSet(hardCopy)
    }

    const  productCartRemove = (row,index)=>{
      let hardCopy =  [...productCart];
          hardCopy.splice(index, 1);
          productCartSet(hardCopy)
    }




    

      return(
          <div className={classes.root}>
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '2px'}}>Production Entry</h4>
<Grid container spacing={3} > 
          <Grid item  xs={12} sm={2}>
            <TextField label="invoice no" variant="outlined"  size="small"  className={classes.fullWidth} value={purchaseData.invoice_no} onChange={handleFromInput} name="invoice_no" disabled />
          </Grid> 

       

          
                <Grid item  xs={0}  sm={7}>

                </Grid>
          <Grid item  xs={12}  sm={3} style={{marginBottom: '-9px'}} > 
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
            label="Material Purchse date  time"
            format="yyyy/MM/dd hh:mm a"
               />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        </Paper>
<Grid container spacing={3} >
        <Grid item xs={12} sm={9} >
          <Paper className={classes.paper}>
        
          <Grid container spacing={3} >
          
          <Grid item xs={12} sm={6} className={classes.plusLinkDiv} style={{border:' 10px solid #e0f7fa',
    padding: '10px',borderRadius: '20px'}}>
                <Link className={classes.plusLink} to="/production/material-entry" >+</Link>  
                <p style={{fontWeight: 'bold',margin: '0',padding: '0',marginBottom: '5px',
    marginTop: '-10px',textAlign:'left'}}>Used Material Entry</p>
              <Autocomplete 
              autoHighlight
              openOnFocus={true}
              value={selectedMaterial}
              style={{width:'100%',height:'20px'}}
              options={materials}
              size="small"
              onChange={(e,obj)=>{

                selectedMaterialSet(obj)
                if(obj==null)return false
                setMaterial({...material,material_purchase_rate:parseFloat(obj.material_purchase_rate).toFixed(2),material_id:obj.material_id,material_name:obj.material_name}) 
                  quantityRef.current.focus()
                
              }}
              getOptionLabel={(option) => option.material_name}
              renderInput={(params) => <TextField 
                
                inputRef={materialRef}
                onKeyDown={event => {
                  if (event.key === "Enter") {
                      purchaseRateRef.current.focus()
                  }
                }} 
                {...params} 
                label="choose a material" 
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
                            }} disabled  type="number" label="Purchase Avarage Rate"  size="small" value={material.material_purchase_rate} onChange={materialHandle} name="material_purchase_rate" variant="outlined" className={classes.inputField} />
                      </Grid>
                      <Grid item sm={1} >
                      </Grid>
                      <Grid item xs={12} sm={5} >
                      <TextField label="quantity"  type="number"
                        inputRef={quantityRef}
                        onKeyDown={event => {
                          if (event.key === "Enter") {
                            purchaseToCartRef.current.focus()
                          }
                        }}
                        value={material.material_qty}
                      variant="outlined"  size="small"   onChange={materialHandle} name="material_qty" className={classes.inputField} />
                      </Grid>

                      

                </Grid>

                

                <Grid container >
                      
                     
                      <Grid item xs={12} sm={4} >
                      <TextField label="total" type="number" disabled value={cartTotal}  onChange={materialHandle} name="material_total"  size="small"  variant="outlined" className={classes.inputField} />
                      </Grid>

                      <Grid item xs={12} sm={3} style={{display: 'grid',fontWeight: 'bold',alignContent: 'center',fontSize:'13px'}} >
                      Stock :   {parseFloat(materialStock).toFixed(2)} {selectedMaterial!=null?selectedMaterial.prod_unit_name:'unit name'}
                  </Grid>

                  <Grid item xs={12} sm={5} style={{display: 'grid',fontWeight: 'bold',alignContent: 'center'}} >
                  <Button 
                      buttonRef={purchaseToCartRef}
                      onClick={purchaseToCart}

                      style={{marginTop: '5px',marginLeft: 'auto',fontSize:'14px'}} 
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
                <Grid item xs={12} sm={6} className={classes.plusLinkDiv} style={{border:' 10px solid #e0f7fa',
    padding: '10px',borderRadius: '20px'}}>
                <Link className={classes.plusLink} to="/administration/products-manage" >+</Link>  
                <p style={{fontWeight: 'bold',margin: '0',padding: '0',marginBottom: '5px',
    marginTop: '-10px',textAlign:'left'}}>Production Product Entry</p>
              <Autocomplete 
              autoHighlight
              openOnFocus={true}
              value={selectedProduct}
              style={{width:'100%',height:'20px'}}
              options={products}
              size="small"
              onChange={(e,obj)=>{

                selectedProductSet(obj)
                if(obj==null)return false
                setProduct({...product,prod_purchase_rate:parseFloat(obj.prod_purchase_rate).toFixed(2),
                  prod_id:obj.prod_id,prod_name:obj.prod_name}) 
                  quantityProdRef.current.focus()
                
              }}
              getOptionLabel={(option) => option.prod_name}
              renderInput={(params) => <TextField 
                
                inputRef={productRef}
                onKeyDown={event => {
                  if (event.key === "Enter") {
                      purchaseRateProdRef.current.focus()
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
                            inputRef={purchaseRateProdRef}
                            onKeyDown={event => {
                              if (event.key === "Enter") {
                                quantityProdRef.current.focus()
                              }
                            }}  type="number" label="Production Finish rate"  size="small" value={product.prod_purchase_rate} onChange={productHandle} name="prod_purchase_rate" variant="outlined" className={classes.inputField} />
                      </Grid>
                      <Grid item sm={1} >
                      </Grid>
                      <Grid item xs={12} sm={5} >
                      <TextField label="quantity"  type="number"
                        inputRef={quantityProdRef}
                        onKeyDown={event => {
                          if (event.key === "Enter") {
                            productToCartRef.current.focus()
                          }
                        }}
                        value={product.prod_qty}
                      variant="outlined"  size="small"   onChange={productHandle} name="prod_qty" className={classes.inputField} />
                      </Grid>
                </Grid>


                <Grid container >
                      
                     
                      <Grid item xs={12} sm={6} >
                      <TextField label="total" type="number" disabled value={cartProductTotal}  onChange={productHandle} name="product_total"  size="small"  variant="outlined" className={classes.inputField} />
                      </Grid>
                      <Button 
                      buttonRef={productToCartRef}
                      onClick={productToCart}

                      style={{marginTop: '5px',marginLeft: 'auto',fontSize:'12px'}} 
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
            
            <Grid item xs={6}  style={{marginTop:'5px',border:' 10px solid #e0f7fa',
    padding: '1px',borderRadius: '20px'}} >
                  <Paper className={classes.paper}  >
                  <h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '3px'}}>Used Materials </h4>
                  <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow >
            <TableCell align="left">SL</TableCell>
            <TableCell align="left">Material</TableCell>
            <TableCell align="center"> Rate</TableCell>
            <TableCell align="center">Qty</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { 
           usedCart.map((row,index) => ( 
            <TableRow key={row.material_id}>
              <TableCell  align="left">{parseFloat(index)+1}</TableCell>
              <TableCell align="left">{row.material_name}</TableCell> 
              <TableCell align="center">{format(parseFloat(row.material_purchase_rate).toFixed(2))}</TableCell> 
              <TableCell align="center">{row.material_qty}</TableCell>
              <TableCell align="right">{format(parseFloat(row.material_total).toFixed(2))}</TableCell>
               <TableCell align="right" >
              <RemoveCircleIcon style={{cursor:'pointer',color:'#FF0202',marginLeft:'2px'}} onClick={()=>{usedCartRemove(row,index)}}></ RemoveCircleIcon></TableCell>
            </TableRow>
          ))}

        {usedCart.length!=0?
        <TableRow colSpan={4}>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell style={{fontWeight:'bold'}} align="right">Total : {format(parseFloat(material_cost).toFixed(2))}</TableCell>
         <TableCell></TableCell>
        </TableRow>
        :''}


        </TableBody>
      </Table>
    </TableContainer>


    <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table">
      {usedCart.length!=0?
          <TableRow >
             <TableCell style={{width: '325px'}}><TextareaAutosize onChange={handleTotalInput} name="material_used_note" value={purchaseData.material_used_note} style={{float:'left',marginTop:'20px',width: '325px'}} aria-label="Material Used Note..." rowsMin={3} placeholder="Material Used Note..." />
             </TableCell>

             <TableCell colSpan={2}></TableCell>

           
          
          </TableRow>
          :''}
      </Table>
    </TableContainer>


                  </Paper>
            </Grid>


            {/*  */}

 
            <Grid item xs={6}  style={{marginTop:'5px',border:' 10px solid #e0f7fa',
    padding: '1px',borderRadius: '20px'}} >
                  <Paper className={classes.paper} >
                  <h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '3px'}}>Production Products</h4>
                  <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left">SL</TableCell>
            <TableCell align="left">Product</TableCell>
            <TableCell align="center">Rate</TableCell>
            <TableCell align="center">Qty</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { 
           productCart.map((row,index) => ( 
            <TableRow key={row.prod_id}>
              <TableCell  align="left">{parseFloat(index)+1}</TableCell>
              <TableCell align="left">{row.prod_name}</TableCell> 
              <TableCell align="center">{format(parseFloat(row.prod_purchase_rate).toFixed(2))}</TableCell> 
              <TableCell align="center">{row.prod_qty}</TableCell>
              <TableCell align="right">{format(parseFloat(row.prod_total).toFixed(2))}</TableCell>
               <TableCell align="right" >
              <RemoveCircleIcon style={{cursor:'pointer',color:'#FF0202',marginLeft:'2px'}} onClick={()=>{productCartRemove(row,index)}}></ RemoveCircleIcon></TableCell>
            </TableRow>
          ))}

        {productCart.length!=0?
        <TableRow colSpan={4}>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell style={{fontWeight:'bold'}} align="right">Total : {format(parseFloat(subTotalProd).toFixed(2))}</TableCell>
         <TableCell></TableCell>
        </TableRow>
        :''}


        </TableBody>
      </Table>
    </TableContainer>


    <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table">
      {productCart.length!=0?
          <TableRow >
             <TableCell style={{width: '325px'}}><TextareaAutosize onChange={handleTotalInput} name="production_note" value={purchaseData.production_note} style={{float:'left',marginTop:'20px',width: '325px'}} aria-label="Product Production  Note..." rowsMin={3} placeholder="Product Production  Note..." />
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

        <Grid item xs={12} sm={3} >
        
          <Paper className={classes.paper}>
          <h4 style={{textAlign:'left',margin:0,padding:0,marginTop: '-10px',
    marginBottom: '3px'}}>Production & Amount Details</h4>


          <Grid container style={{paddingRight:'1px'}}>

          <Grid item  xs={12}  sm={12}  style={{marginBottom:'25px',marginTop:'4px'}}> 
          <Autocomplete 
          size="small"

          autoHighlight
              openOnFocus={true}
              style={{width:'100%',height:'20px'}}
              options={employees}
              value={selectedEmployee}
              getOptionLabel={(option) => option.employee_name}
              onChange={(event,selectedObj)=>{
                purchaseData.emp_id = selectedObj!=null?selectedObj.employee_id:0
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
                label="Production / Incharge By " 
                variant="outlined"
               
                />} 
                
          />

          </Grid>

                <Grid item  xs={12}   sm={12} > 
                      <Select
                      value={selectedShift}
                      onChange={(shift)=>{
                          if(shift == null){
                              return false;
                          }
                          selectedShiftSet(shift);
                          purchaseData.shift_id = shift.value
                      }}
                      options={shifts}

                  />
        </Grid>
                    



                     
                      
                     
                     
          </Grid>

         
          <Grid container style={{paddingRight:'1px'}}>
                    
                      <Grid item xs={12} sm={12} >
                      <TextField type="number" onChange={handleTotalInput} label="Material Cost"  size="small"  variant="outlined" className={classes.inputField} 
                      disabled
                      value={purchaseData.material_cost}
                      name="material_cost"
                      inputRef={materialCostRef} />
                      </Grid>    
                        
          </Grid>
          <Grid container style={{paddingRight:'1px'}}>
                    
                      <Grid item xs={12} sm={12} >
                      <TextField type="number" onChange={handleTotalInput} label="Labour Cost"  size="small"  variant="outlined" className={classes.inputField} 
                     
                      value={purchaseData.labour_cost}
                      name="labour_cost"
                      inputRef={labourCostRef} />
                      </Grid>    
                        
          </Grid>

          <Grid container style={{paddingRight:'1px'}}>
                    
                      <Grid item xs={12} sm={12} >
                      <TextField type="number" onChange={handleTotalInput} label="Others Cost"  size="small"  variant="outlined" className={classes.inputField} 
                      value={purchaseData.others_cost}
                      name="others_cost"
                      inputRef={othersCostRef} />
                      </Grid>    
                        
          </Grid>


          <Grid container style={{paddingRight:'1px'}}>
          <Grid item xs={12} sm={12}>
                      <TextField type="number" style={{marginRight:'5px'}}  size="small"  label="Total" disabled variant="outlined" className={classes.inputField} 
                      value={totalCost}
                      onChange={handleTotalInput}
                      name="totalCost"
                      inputRef={totalCostRef} />
                      </Grid>
                      <Grid item xs={0} sm={1}>
                      </Grid>


          </Grid>


      
        




        

          <Grid container style={{paddingRight:'1px'}}>
                      <Grid item xs={12} sm={8}>
                      <Button style={{marginTop: '5px',fontSize:'14px',float:'left'}} 
                            variant="contained"
                            color="primary"
                            size="small"
                            buttonRef={saveRef} 
                            onClick={saveProduction} 
                            className={classes.button}
                            startIcon={<SaveIcon/>}
                            disabled={saveAction?true:false}
                        >
                       Production
                      </Button>
                      </Grid>
                  
                      <Grid item xs={12} sm={4} >
                      <Button 
                      style={{marginTop: '5px',fontSize:'10px',float:'right'}} 
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={()=>window.location.reload()}
                            className={classes.button}
                            startIcon={<SaveIcon/>}
                        >
                        New
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