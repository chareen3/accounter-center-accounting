import React,{ useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import swal from 'sweetalert';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MUIDataTable from "mui-datatables";
import {APP_URL,API_URL} from '../../config.json';
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Modal } from 'react-responsive-modal';
import "react-responsive-modal/styles.css";
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'

import '../global.css'
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import socketIOClient from "socket.io-client";
import {pathSpliter,checkAuthBranchWare,dateTimeFormat,checkIntNum} from '../../lib/functions'
import {currentRouteSet,updatedProductSet,disableRestoreProductSet,createdProductSet} from '../../actions/actions';
import moment from 'moment';



const ProductsManage = ({location,currentRouteSet,authInfo,createdProdName,updatedProdName,prodNameDisableRestoreAction,createdCategory,updatedCategory,
  createBrand,updateBrand,createdColor,updatedColor,createdUnit,updatedUnit,
  createdProduct,updatedProduct,productCodeGet,productDisableRestoreAction,updatedProductSet,disableRestoreProductSet,createdProductSet})=>{
    const classes = useStyles();
    const [catM, catMSet] = React.useState(false);
    const [prodM, prodMSet] = React.useState(false);
    const [unitM, unitMSet] = React.useState(false);

    const [catAction, catActionSet] = React.useState(false);
    const [prodNameAction, prodNameActionSet] = React.useState(false);
    const [unitAction, unitActionSet] = React.useState(false);

    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [productUpdateIndex,productUpdateIndexSet] = useState('0')
    let [productCode,productCodeSet] = useState('')

    let [prod_id,prod_id_set] = useState(0)
    let [prod_sale_rate,prod_sale_rate_set] = useState(0)
    let [prod_purchase_rate,prod_purchase_rate_set] = useState(0)
    let [prod_re_order_lebel,prod_re_order_lebel_set] = useState(0)
    let [prod_whole_sale_rate,prod_whole_sale_rate_set] = useState(0)
    
    
    let [products,productsSet] = useState([])
    let [categories,categoriesSet] = useState([])
    let [brands,brandsSet] = useState([])
    let [colors,colorsSet] = useState([])
    let [units,unitsSet] = useState([])
    let [prodNames,prodNamesSet] = useState([])
    
    let [selectedCategory,selectedCategorySet] = useState(null)
    let [selectedBrand,selectedBrandSet] = useState(null)
    let [selectedColor,selectedColorSet] = useState(null)
    let [selectedUnit,selectedUnitSet] = useState(null)
    let [selectedProdName,selectedProdNameSet] = useState(null)
    let [action,actionSet] = useState('create')
    let [prod_cat_name,prod_cat_name_set] = useState('')
    let [prod_name,prod_name_set] = useState('')
    let [prod_unit_name,prod_unit_name_set] = useState('')
    let [prod_is_service,prod_is_service_set] = useState(false)

    

    let codeRef = React.useRef(null)
    let catRef = React.useRef(null)
    let brandRef = React.useRef(null)
    let colorRef = React.useRef(null)
    let unitRef = React.useRef(null)
    let prodNameRef = React.useRef(null)
    let purchaseRateRef = React.useRef(null)
    let saleRateRef = React.useRef(null)
    let wholeRateRef = React.useRef(null)
    let reOrderLevelRef = React.useRef(null)
    let prodIsServiceRef = React.useRef(null)
    let saveFormActionRef = React.useRef(null)
    
    updatedProductSet(null)
    disableRestoreProductSet(null) 
    createdProductSet(null)

    const [successMsg, setSuccessMsg] = useState({
      open: false,
      vertical: 'top',
      horizontal: 'center',
      msg:''
    });

    const { vertical, horizontal, open,msg } = successMsg;
    const handleClose = () => {
      setSuccessMsg({ ...successMsg, open: false });
    };

    useEffect(()=>{
   
        getProdCode();
        currentRouteSet(pathSpliter(location.pathname,1));
        getCategories();
        // getBrands();
        // getColors();
        getUnits();
        getProdNames();

        const socket = socketIOClient(API_URL);  
        socket.emit('products',{'auth-token':authInfo.token})
        loadingListSet(true)
        socket.on("products", (res) => {
          if(!res.error){
            loadingListSet(false)
              productsSet(res.data)
          }
        });

    },[]);

    let saveUnitAction = async ()=>{
      if(prod_unit_name.trim()==''){
        swal({
          title:' Unit Name is required',
          icon:'warning'
        })
      }else{
        unitActionSet(true)
        await axios.post(`${API_URL}/api/unit-cu`,{prod_unit_name:prod_unit_name.trim(),action:'create'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          unitActionSet(false)

          if(res.data.error){
            swal({
              title:res.data.message,
              icon:'warning'
            });
            return false;
          }

          unitMSet(false)
          prod_unit_name_set('')
       })
      }
      
      }

    let saveProdAction = async ()=>{
      if(prod_name.trim()==''){
        swal({
          title:'Product  name is required',
          icon:'warning'
        })
      }else{
        prodNameActionSet(true)
        await axios.post(`${API_URL}/api/prod-name-cu`,{prod_name:prod_name.trim(),action:'create'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          prodNameActionSet(false)
          if(res.data.error){
            swal({
              title:res.data.message,
              icon:'warning'
            });
            return false;
          }

          prodMSet(false)
          prod_name_set('')
       })
      }
      
      }

    let saveCateAction = async ()=>{
      if(prod_cat_name.trim()==''){
        swal({
          title:'Product category name is required',
          icon:'warning'
        })
      }else{
        catActionSet(true)
        await axios.post(`${API_URL}/api/category-cu`,{prod_cat_name:prod_cat_name.trim(),action:'create'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          catActionSet(false)
          if(res.data.error){
            swal({
              title:res.data.message,
              icon:'warning'
            });
            return false;
          }

          catMSet(false)
          prod_cat_name_set('')
       })
      }
      
      }
    

    const getCategories = async ()=>{
     await axios.post(`${API_URL}/api/get-categories`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
       categoriesSet(res.data.message)
     })
    }
    // const getBrands = async ()=>{
    //  await axios.post(`${API_URL}/api/get-brands`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
    //    brandsSet(res.data.message)
    //  })
    // }
    // const getColors = async ()=>{
    //   await axios.post(`${API_URL}/api/get-colors`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
    //     colorsSet(res.data.message)
    //   })
    //  }
     const getUnits = async ()=>{
      await axios.post(`${API_URL}/api/get-units`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
        unitsSet(res.data.message)
      })
     }
     const getProdCode = async ()=>{
      await axios.get(`${API_URL}/api/get-product-code`,{headers:{'auth-token':authInfo.token}}).then(res=>{
          productCodeSet(res.data.message);
      })
     }
     
     /// Category  Real time start
     useEffect(()=>{
       console.log(createdCategory)
      if(createdCategory){
        if(checkAuthBranchWare(createdCategory.user_branch_id)){
          categoriesSet(createdCategory.createdRow.concat(categories));
        }
       }
    },[createdCategory]);

    useEffect(()=>{
      if(updatedCategory){
        if(checkAuthBranchWare(updatedCategory.user_branch_id)){
          categories[updatedCategory.index] = updatedCategory.updatedRow[0]
        }
       }
    },[updatedCategory]);
    /// Category  Real time end
    // Brand Real time start
    useEffect(()=>{
      if(createBrand){
        if(checkAuthBranchWare(createBrand.user_branch_id)){          
          brandsSet(createBrand.createdRow.concat(brands));
        }
       }
    },[createBrand])

    useEffect(()=>{
      if(updateBrand){
        if(checkAuthBranchWare(updateBrand.user_branch_id)){          
          brands[updateBrand.index] = updateBrand.updatedRow[0]
        }
       }
    },[updateBrand])
    // Brand Real time end

    // Color Real ime start
    useEffect(()=>{
      if(createdColor){
        if(checkAuthBranchWare(createdColor.user_branch_id)){          
          colorsSet(createdColor.createdRow.concat(colors));
        }
       }
    },[createdColor])

    useEffect(()=>{
      if(updatedColor){
        if(checkAuthBranchWare(updatedColor.user_branch_id)){          
          colors[updatedColor.index] = updatedColor.updatedRow[0]
        }
       }
    },[updatedColor]) 
    // Color Real ime end 

    // Unit real time start 
    useEffect(()=>{
      if(createdUnit){
        if(checkAuthBranchWare(createdUnit.user_branch_id)){          
          unitsSet(createdUnit.createdRow.concat(units));
        }
       }
    },[createdUnit])

    useEffect(()=>{
      if(updatedUnit){
        if(checkAuthBranchWare(updatedUnit.user_branch_id)){          
          units[updatedUnit.index] = updatedUnit.updatedRow[0]
        }
       }
    },[updatedUnit])
    // Unit real time end
    // Product name real time start
    useEffect(()=>{
      if(createdProdName){
        if(checkAuthBranchWare(createdProdName.user_branch_id)){          
          prodNamesSet(createdProdName.createdRow.concat(prodNames));
        }
       }
    },[createdProdName])

    useEffect(()=>{
      if(updatedProdName){
        if(checkAuthBranchWare(updatedProdName.user_branch_id)){          
          prodNames[updatedProdName.index] = updatedProdName.updatedRow[0]
        }
       }
    },[updatedProdName])
    // Product name real time end
    useEffect(()=>{
      if(createdProdName){
        if(checkAuthBranchWare(createdProdName.user_branch_id)){          
          prodNamesSet(createdProdName.createdRow.concat(prodNames));
          setSuccessMsg({...successMsg,msg:`${createdProdName.msg}`,open:true });
          actionSet('create')
        }
       }
    },[createdProdName])

    useEffect(()=>{
      if(updatedProdName){
        if(checkAuthBranchWare(updatedProdName.user_branch_id)){          
          prodNames[updatedProdName.index] = updatedProdName.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedProdName.msg}`,open:true });
          actionSet('create')
        }
       }
    },[updatedProdName])

    useEffect(()=>{
      if(prodNameDisableRestoreAction){
        if(checkAuthBranchWare(prodNameDisableRestoreAction.user_branch_id)){
        prodNames[prodNameDisableRestoreAction.index] = prodNameDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${prodNameDisableRestoreAction.msg}`,open:true });
        }
       }
    },[prodNameDisableRestoreAction]);
    // Product  real time end
    useEffect(()=>{
      if(createdProduct){
        if(checkAuthBranchWare(createdProduct.user_branch_id)){          
          productsSet(createdProduct.createdRow.concat(products));
          setSuccessMsg({...successMsg,msg:`${createdProduct.msg}`,open:true });
         
        }
       }
    },[createdProduct])

    useEffect(()=>{
      if(updatedProduct){
        if(checkAuthBranchWare(updatedProduct.user_branch_id)){          
          products[updatedProduct.index] = updatedProduct.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedProduct.msg}`,open:true });
          getProdCode()
        }
       }
    },[updatedProduct])

    useEffect(()=>{
      if(productCodeGet){
        if(action=='create'){         
          getProdCode()
        }
       }
    },[productCodeGet]);

    useEffect(()=>{
      if(productDisableRestoreAction){
        if(checkAuthBranchWare(productDisableRestoreAction.user_branch_id)){
        products[productDisableRestoreAction.index] = productDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${productDisableRestoreAction.msg}`,open:true });
        }
       }
    },[productDisableRestoreAction]);

   
    const saveFormAction = async ()=>{
        if(selectedCategory == null){ 
            swal({
              title:'Select a product category',
              icon:'warning'
            })
          }else if(selectedUnit == null){
            swal({
              title:'Select a product unit',
              icon:'warning'
            })
          }else if(selectedProdName == null){
            swal({
              title:'Select a product name',
              icon:'warning'
            })
          }else{
             

            let payLoad = {
              prod_id,
              prod_code: productCode,
              productUpdateIndex:productUpdateIndex,
              prod_cat_id : selectedCategory != null ? selectedCategory.prod_cat_id : null,
              prod_name_id  : selectedProdName != null ? selectedProdName.prod_name_id : null,
              prod_unit_id  : selectedUnit != null ? selectedUnit.prod_unit_id : null,
              prod_is_service,
              action,
              prod_sale_rate:prod_sale_rate=='' ?0:prod_sale_rate,
              prod_purchase_rate:prod_purchase_rate==''?0:prod_purchase_rate,
              prod_whole_sale_rate:prod_whole_sale_rate ==''?0:prod_whole_sale_rate,
              prod_re_order_lebel:prod_re_order_lebel ==''?0:prod_re_order_lebel
            }

            
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/product-cu`,payLoad,{headers:{'auth-token':authInfo.token}}).then(res=>{
            loadingSaveSet(false)
            if(res.data.warning != undefined && res.data.warning==true){
              swal({
                title:res.data.message,
                icon:'warning'
              })
              return false;
            }
            selectedCategorySet(null)
            // selectedBrandSet(null)
            // selectedColorSet(null)
            selectedUnitSet(null) 
            selectedProdNameSet(null) 

            prod_is_service_set(false)

            prod_purchase_rate_set('')
            prod_sale_rate_set('')
            prod_whole_sale_rate_set('')
            prod_re_order_lebel_set('')
            actionSet('create')

            productCodeSet('')

            
            })
          }
    }

    const productEdit = (row,index)=>{
      let prod = products[index]
      selectedCategorySet({prod_cat_id:prod.prod_cat_id,prod_cat_name:prod.prod_cat_name})
      // selectedBrandSet({prod_brand_id:prod.prod_brand_id,prod_brand_name:prod.prod_brand_name})
      selectedUnitSet({prod_unit_id:prod.prod_unit_id,prod_unit_name:prod.prod_unit_name}) 
      selectedProdNameSet({prod_name_id:prod.prod_name_id,prod_name:prod.prod_name}) 
      productCodeSet(prod.prod_code)
      productUpdateIndexSet(index)

      prod_is_service_set(prod.prod_is_service=='false'?false:true)

      prod_purchase_rate_set(prod.prod_purchase_rate)
      prod_sale_rate_set(prod.prod_sale_rate)
      prod_whole_sale_rate_set(prod.prod_whole_sale_rate)
      prod_re_order_lebel_set(prod.prod_re_order_lebel)
      prod_id_set(prod.prod_id)
      actionSet('update')


    }
    const productDisableRestore = async (prodId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/product-disable-restore`,{prod_id:prodId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }

    const getProdNames = async ()=>{
          await axios.post(`${API_URL}/api/get-prod-names`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
            prodNamesSet(res.data.message)
          })
    }
    
    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
       {
    authInfo.role !='user'?(
    <>

<Link to={{pathname:`/administration/product-barcode/${props.rowData[0]}`}}> 
<HorizontalSplitIcon style={{cursor:'pointer',color: '#222',fontSize: '28px'}}/>

   </Link>
   

        <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>productEdit(props.rowData,props.rowIndex)}/>
          {props.rowData[1]=='active'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>productDisableRestore(props.rowData[0],'disable',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>productDisableRestore(props.rowData[0],'restore',props.rowIndex)}/>
          )}         
   </>):''
 }
         
        </div>)
      
      }
    
    const columns = [
        {name: "prod_id",options: { display: 'excluded' }},
        {name: "prod_status",options: { display: 'excluded' }},
        {name:"SL",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
          return ( <p>{parseFloat(tableMeta.rowIndex)+1}</p> ); 
        }
        },headerStyle: {
          textAlign:'left'
        }},
        {name: "prod_code",label: "Product code",options: {filter: true,sort: true}},
        {name: "prod_cat_name",label: "Category name",options: {filter: true,sort: true}},
        {name: "prod_name",label: "Product name",options: {filter: true,sort: true}},
        {name: "prod_unit_name",label: "Unit name",options: {filter: true,sort: true}},
        {name: "prod_purchase_rate",label: "Purchase Avarage Rate",options: {filter: true,sort: true,
          
          customBodyRender:(value,tableMeta)=>{
            return ( <p>{parseFloat(tableMeta.rowData[7]).toFixed(2)}</p> ); 
          }
        }},
        {name: "prod_sale_rate",label: "Sale rate",options: {filter: true,sort: true}},
        {name: "prod_whole_sale_rate",label: "Whole Sale rate",options: {filter: true,sort: true}},
         {name: "prod_is_service",label: "Service",options: {filter: true,sort: true}},
        {name:"actions",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
            return ( <ActionOptions   value={value} rowIndex={tableMeta.rowIndex}  rowData={tableMeta.rowData} 
               /> ); 
        }
        },headerStyle: {
          textAlign:'right'
        }}
       ];
              
       const options = {
         filterType: 'checkbox',
         selectableRows: 'none',
         display: "excluded"
        }

    return (
        <div className={classes.root}>
             {/* Success message */}
              <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                  {successMsg.msg}
                </Alert>
              </Snackbar>  
              {/* End of message */}
            <Paper className={classes.paper} style={{marginTop:'-15px'}}>
            <h2 className={classes.pageEntryLabel}> Product  Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off' disabled  className={classes.fullWidth}  value={productCode} 
            label="product code" name="prod_code" style={{color:'#222'}}  variant="outlined" size="small"  onChange={(e)=>productCodeSet(e.target.value)} 
            inputRef={codeRef}
            onKeyDown={event => {
                if (event.key === "Enter") {
                    catRef.current.focus()
                }
              }}
            />
            </Grid> 
                <Grid item xs={12} sm={3}   className={classes.plusLinkDiv}>
                {
    authInfo.role !='user'?(
    <>
        <a className={classes.plusLink} style={{cursor:'pointer'}} onClick={(e)=>catMSet(true)} >+</a>  
        
   </>):''
 }
                <Autocomplete
                
                style={{ width: '100%' }}
                options={categories} 
                size="small"
                classes={{
                    option: classes.option,
                }}
                openOnFocus={true}
                getOptionLabel={(option) => option.prod_cat_name}
               
                value={selectedCategory}
                onChange={(event,selectedObj)=>{
                  selectedCategorySet(selectedObj)
                }}
                renderInput={(params) => (
                    <TextField
                    inputRef={catRef}
                  
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            prodNameRef.current.focus()

                        }
                      }}
                    {...params}
                    label="Choose a category"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {categories.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment} */}
                          </React.Fragment>
                        ),
                    }}
                    />
                )}
                />

                
            </Grid>
            
            {/* Brands */}

{/*             
            <Grid item xs={12} sm={3} style={{display:'none'}} className={classes.plusLinkDiv}>
                    <a className={classes.plusLink} href="/administration/prod-brands-manage" target="_blank">+</a> 
                <Autocomplete
                style={{ width: '100%' }}
                options={brands} 
                size="small"
                classes={{
                    option: classes.option,
                }}
                value={selectedBrand}
                openOnFocus={true}
                autoHighlight
                getOptionLabel={(option) =>option.prod_brand_name}
               
                onChange={(event,selectedObj)=>{
                     selectedBrandSet(selectedObj)
                }}
                loading={brands.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={brandRef}
                    onKeyDown={event => {
                      if (event.key === "Enter") {
                          colorRef.current.focus()
                      }
                    }}
                    {...params}
                    label="Choose a brand"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {brands.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                    }}
                    />
                )}
                />
            </Grid> */}


            {/* Colors */}
            {/* <Grid item xs={12} sm={3} style={{display:'none'}} className={classes.plusLinkDiv}>
                    <a className={classes.plusLink} href="/administration/prod-colors-manage" target="_blank">+</a> 
                <Autocomplete
                style={{ width: '100%' }}
                options={colors} 
                size="small"
                openOnFocus={true}
                classes={{
                    option: classes.option,
                }}
                value={selectedColor}
                autoHighlight
                getOptionLabel={(option) => (option.prod_color_name?option.prod_color_name:'')}
                getOptionSelected={(option, value) => {
                    return option.prod_color_id === value.prod_color_id;
                }}
                onChange={(event,selectedObj)=>{
                  selectedObj?(formSetValues({...formValues,prod_color_id:selectedObj.prod_color_id})):
                  (formSetValues({...formValues,prod_color_id:null}))
                  selectedColorSet(selectedObj)
                }}
                loading={colors.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={colorRef}
                    onKeyDown={event => {
                      if (event.key === "Enter") {
                          unitRef.current.focus()
                      }
                    }}
                    {...params}
                    label="Choose a color"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {colors.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                    }}
                    />
                )}
                />
            </Grid> */}


             {/* Product Name */}
             <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
             {
    authInfo.role !='user'?(
    <>
                       <a className={classes.plusLink} style={{cursor:'pointer'}} onClick={(e)=>prodMSet(true)} >+</a>  
      
   </>):''
 }
                <Autocomplete
                style={{ width: '100%' }}
                options={prodNames} 
                size="small"
                openOnFocus={true}
                classes={{
                    option: classes.option,
                }}
                autoHighlight
                getOptionLabel={(option) => option.prod_name}
                getOptionSelected={(option, value) => {
                    return option.prod_name_id === value.prod_name_id;
                }}
                onChange={(event,selectedObj)=>{
                  selectedProdNameSet(selectedObj)
                }}
                value={selectedProdName}
                loading={prodNames.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={prodNameRef}
                    onKeyDown={event => {
                      if (event.key === "Enter") {
                        unitRef.current.focus()

                      }
                    }}
                    {...params}
                    label="Choose a product name"
                    variant="outlined"
                    loading={prodNames.length==0?true:false}
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {prodNames.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment} */}
                          </React.Fragment>
                        )
                    }}
                    />
                )}
                />
            </Grid>

              {/* Units */}
              <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
              {
    authInfo.role !='user'?(
    <>
                       <a className={classes.plusLink} style={{cursor:'pointer'}} onClick={(e)=>unitMSet(true)} >+</a>  
       
   </>):''
 }
                <Autocomplete
                style={{ width: '100%' }}
                options={units} 
                size="small"
                openOnFocus={true}
                classes={{
                    option: classes.option,
                }}
                value={selectedUnit}
                autoHighlight
                getOptionLabel={(option) => option.prod_unit_name}
             
                onChange={(event,selectedObj)=>{
                  selectedUnitSet(selectedObj)
                }}
                renderInput={(params) => (
                    <TextField
                    inputRef={unitRef}
                    onKeyDown={event => {
                      if (event.key === "Enter") {
                          purchaseRateRef.current.focus()
                      }
                    }}
                    {...params}
                    label="Choose a unit"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {units.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment} */}
                          </React.Fragment>
                        )
                    }}
                    />
                )}
                />
            </Grid>

            
            <Grid item xs={12} sm={3} style={{display:'none'}}> 
            <TextField type="number"  autoComplete='off'  inputRef={purchaseRateRef}   onKeyDown={event => {
                      if (event.key === "Enter") {
                          saleRateRef.current.focus()
                      }
                    }}  className={classes.fullWidth}  value={prod_purchase_rate} 
            label="purchase rate" name="prod_purchase_rate" variant="outlined" size="small" onChange={(e)=>prod_purchase_rate_set(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  type="number" autoComplete='off' inputRef={saleRateRef}    onKeyDown={event => {
                      if (event.key === "Enter") {
                          wholeRateRef.current.focus()
                      }
                    }}  className={classes.fullWidth}  value={prod_sale_rate} 
            label="sale rate" name="prod_sale_rate" variant="outlined" size="small" onChange={(e)=>prod_sale_rate_set(e.target.value)} />
            </Grid>
            
            <Grid item xs={12} sm={3}  > 
            <TextField  type="number" autoComplete='off' inputRef={wholeRateRef}    onKeyDown={event => {
                      if (event.key === "Enter") {
                        reOrderLevelRef.current.focus()
                      }
                    }}   className={classes.fullWidth}  value={prod_whole_sale_rate} 
            label="whole sale rate"  type="number" name="prod_whole_sale_rate" variant="outlined" size="small" onChange={(e)=>prod_whole_sale_rate_set(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  onKeyDown={event => {
              if (event.key === "Enter") {
                saveFormActionRef.current.click()
              }
            }}  inputRef={reOrderLevelRef}  className={classes.fullWidth}  value={prod_re_order_lebel} 
            label="Re-order level"  type="number" name="prod_re_order_lebel" variant="outlined" size="small" onChange={(e)=>prod_re_order_lebel_set(e.target.value)} />
            </Grid>

            <Grid item xs={12} sm={3} > 
            <FormControlLabel

                    control={
                      <Checkbox
                      ref={prodIsServiceRef}
                        checked={prod_is_service}
                        onChange={(event)=>{
                          prod_is_service_set(event.target.checked);
                        }}
                        name="checkedI"
                      />
                    }
                    label="Service Type?"
                    style={{color: '#0f7e77'}}
                  />
            </Grid> 
            

           </Grid>
           <Grid item xs={12}>
          <Button style={{marginTop: '25px'}}
            buttonRef={saveFormActionRef}
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<SaveIcon/>}
            disabled={loadingSave}
            onClick={saveFormAction}
        >
        Save
      </Button>
  </Grid>
            </Paper>
            {
      loadingList==true?(<b>Loading...</b>):(
        <Paper className={classes.paper} style={{marginTop:'20px'}}>
        <MUIDataTable
      title={"Product List"}
      data={products}
      columns={columns}
      options={options}
      adjustForCheckbox={false} 
      displaySelectAll={false}
      />
      </Paper>
      )
      
     }

       {/* Unit Add Modal */}
       <Modal
        open={unitM}
        onClose={() => unitMSet(false)}
        center
        style={{minWidth:'300px',minHeight:'500px'}}
 
      
      >
        <Grid item xs={12} sm={12}  > 
            <TextField  autoComplete='off' style={{marginTop:'10px'}}   className={classes.fullWidth}  value={prod_unit_name} onChange={(e)=>prod_unit_name_set(e.target.value)}
            label="Unit Name"  type="text" name="prod_unit_name" variant="outlined" size="small"
            onKeyDown={(event)=>{
              if (event.key === "Enter") {
                saveUnitAction()
              }
              
            }}
            />
            

            <Button style={{marginTop: '25px'}}
            variant="contained"
            color="primary"
            size="small"
            disabled={unitAction?true:false}
            className={classes.button}
            startIcon={<SaveIcon/>}
            onClick={saveUnitAction}
        >
        Save
      </Button>
        </Grid>
      </Modal>

        {/* Product Add Modal */}
     <Modal
        open={prodM}
        onClose={() => prodMSet(false)}
        center
        style={{minWidth:'300px',minHeight:'500px'}}
 
      
      >
        <Grid item xs={12} sm={12}  > 
            <TextField  autoComplete='off' style={{marginTop:'10px'}}   className={classes.fullWidth}  value={prod_name} onChange={(e)=>prod_name_set(e.target.value)}
            label="Product Name"  type="text" name="prod_name" variant="outlined" size="small"
            onKeyDown={(event)=>{
              if (event.key === "Enter") {
                saveProdAction()
              }
              
            }}
            />
            

            <Button style={{marginTop: '25px'}}
            variant="contained"
            color="primary"
            size="small"
            disabled={prodNameAction?true:false}
            className={classes.button}
            startIcon={<SaveIcon/>}
            onClick={saveProdAction}
        >
        Save
      </Button>
        </Grid>
      </Modal>

     {/* Category Add Modal */}
     <Modal
        open={catM}
        onClose={() => catMSet(false)}
        center
        style={{minWidth:'300px',minHeight:'500px'}}
 
      
      >
        <Grid item xs={12} sm={12}  > 
            <TextField  autoComplete='off' style={{marginTop:'10px'}}   className={classes.fullWidth}  value={prod_cat_name} onChange={(e)=>prod_cat_name_set(e.target.value)}
            label="Category Name"  type="text" name="prod_cat_name" variant="outlined" size="small"
            onKeyDown={(event)=>{
              if (event.key === "Enter") {
                saveCateAction()
              }
              
            }}
            />
            

            <Button style={{marginTop: '25px'}}
            variant="contained"
            color="primary"
            size="small"
            disabled={catAction?true:false}
            className={classes.button}
            startIcon={<SaveIcon/>}
            onClick={saveCateAction}
        >
        Save
      </Button>
        </Grid>
      </Modal>
        </div>
    )
}



const useStyles = makeStyles((theme) => ({
 
    button: {
      margin: theme.spacing(1),
    },
  root: {},
  '& .MuiTextField-root': {
    margin: theme.spacing(1),
    width: '25ch',
   },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    pageEntryLabel:{
        color: '#7754cc',
        margin: '0px',
        padding: '0px',
        marginTop: '-11px',
        textAlign: 'left',
        marginLeft: '0px',
        marginBottom: '5px',
        textAlign:'left'
    },
    fullWidth:{
        width:'100%'
    },
    option: {
        fontSize: 15,
        '& > span': {
          marginRight: 10,
          fontSize: 18,
        },
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
      }
  }));
  
  const mapStateToPops = (state)=>{
        return {
          currentRoute:state.currentRouteReducer,
          authInfo:state.authInfoReducer,
          createdProdName:state.createdProdNameReducer,
          updatedProdName:state.updatedProdNameReducer,
          prodNameDisableRestoreAction:state.prodNameDisableRestoreReducer,
          createdCategory:state.createdCategoryReducer,
          updatedCategory:state.updatedCategoryReducer,
          createBrand:state.createBrandReducer,
          updateBrand:state.updateBrandReducer,
          createdColor:state.createdColorReducer,
          updatedColor:state.updatedColorReducer,
          createdUnit:state.createdUnitReducer,
          updatedUnit:state.updatedUnitReducer,
          createdProdName:state.createdProdNameReducer,
          updatedProdName:state.updatedProdNameReducer,
          createdProduct:state.createdProductSetReducer,
          updatedProduct:state.updatedProductReducer,
          productCodeGet:state.productCodeReducer,
          productDisableRestoreAction:state.productDisableRestoreReducer
          
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,updatedProductSet,disableRestoreProductSet,createdProductSet})(ProductsManage);