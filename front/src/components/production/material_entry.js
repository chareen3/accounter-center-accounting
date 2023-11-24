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

import '../global.css'

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import socketIOClient from "socket.io-client";
import {pathSpliter,checkAuthBranchWare,dateTimeFormat,checkIntNum} from '../../lib/functions'
import {currentRouteSet,updatedMaterialSet,disableRestoreMaterialSet,createdMaterialSet} from '../../actions/actions';
import moment from 'moment';


const MaterialsManage = ({location,currentRouteSet,authInfo,createdProdName,updatedProdName,materialNameDisableRestoreAction,createdCategory,updatedCategory,
  createBrand,updateBrand,createdColor,updatedColor,createdUnit,updatedUnit,createdMaterialName,
  createdMaterial,updatedMaterial,materialCodeGet,materialDisableRestoreAction,updatedMaterialSet,disableRestoreMaterialSet,createdMaterialSet})=>{
    const classes = useStyles();
    const [catM, catMSet] = React.useState(false);
    const [materialM, materialMSet] = React.useState(false);
    const [unitM, unitMSet] = React.useState(false);

    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [materialUpdateIndex,materialUpdateIndexSet] = useState('0')
    let [materialCode,materialCodeSet] = useState('')

    let [material_id,material_id_set] = useState(0)
    let [material_sale_rate,material_sale_rate_set] = useState(0)
    let [material_purchase_rate,material_purchase_rate_set] = useState(0)
    let [material_re_order_lebel,material_re_order_lebel_set] = useState(0)
    let [material_whole_sale_rate,material_whole_sale_rate_set] = useState(0)
    
    
    let [materials,materialsSet] = useState([])
    let [categories,categoriesSet] = useState([])
    let [brands,brandsSet] = useState([])
    let [colors,colorsSet] = useState([])
    let [units,unitsSet] = useState([])
    let [materialNames,materialNamesSet] = useState([])
    
    let [selectedCategory,selectedCategorySet] = useState(null)
    let [selectedBrand,selectedBrandSet] = useState(null)
    let [selectedColor,selectedColorSet] = useState(null)
    let [selectedUnit,selectedUnitSet] = useState(null)
    let [selectedProdName,selectedProdNameSet] = useState(null)
    let [catNameAction,catNameActionSet] = useState(false)
    let [action,actionSet] = useState('create')
    let [prod_cat_name,prod_cat_name_set] = useState('')
    let [material_name,material_name_set] = useState('')
    let [prod_unit_name,prod_unit_name_set] = useState('')
    let [materialAction,materialActionSet] = useState(false)
    let [unitAction,unitActionSet] = useState(false)

    let codeRef = React.useRef(null)
    let catRef = React.useRef(null)
    let brandRef = React.useRef(null)
    let colorRef = React.useRef(null)
    let unitRef = React.useRef(null)
    let materialNameRef = React.useRef(null)
    let purchaseRateRef = React.useRef(null)
    let saleRateRef = React.useRef(null)
    let wholeRateRef = React.useRef(null)
    let reOrderLevelRef = React.useRef(null)
    let materialIsServiceRef = React.useRef(null)
    let saveFormActionRef = React.useRef(null)
    
    updatedMaterialSet(null)
    disableRestoreMaterialSet(null) 
    createdMaterialSet(null)

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

        
       
        loadingListSet(true)

        getMaterials()
         
    },[]);

    let getMaterials = async ()=>{
        loadingListSet(false)
        await axios.post(`${API_URL}/api/get-materials`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            materialsSet(res.data.message)
         })
    }

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
      if(material_name.trim()==''){
        swal({
          title:'Material  name is required',
          icon:'warning'
        })
      }else{
        materialActionSet(true)
        await axios.post(`${API_URL}/api/material-name-cu`,{material_name:material_name.trim(),action:'create'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          materialActionSet(false)
          if(res.data.error){
            swal({
              title:res.data.message,
              icon:'warning'
            });
            return false;
          }

          materialMSet(false)
          material_name_set('')
       })
      }
      
      }

    let saveCateAction = async ()=>{
      if(prod_cat_name.trim()==''){
        swal({
          title:'Material category name is required',
          icon:'warning'
        })
      }else{
        catNameActionSet(true)
        await axios.post(`${API_URL}/api/category-cu`,{prod_cat_name:prod_cat_name.trim(),action:'create'},{headers:{'auth-token':authInfo.token}}).then(res=>{
          catNameActionSet(false)
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
      await axios.get(`${API_URL}/api/get-material-code`,{headers:{'auth-token':authInfo.token}}).then(res=>{
         materialCodeSet(res.data.message);
      })
     }
     
     /// Category  Real time start
     useEffect(()=>{
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
    // Material name real time start
    useEffect(()=>{
      if(createdMaterialName){
        if(checkAuthBranchWare(createdMaterialName.user_branch_id)){          
          materialNamesSet(createdMaterialName.createdRow.concat(materialNames));
        }
       }
    },[createdMaterialName])

    
    // Material name real time end
   

    useEffect(()=>{
      if(updatedProdName){
        if(checkAuthBranchWare(updatedProdName.user_branch_id)){          
          materialNames[updatedProdName.index] = updatedProdName.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedProdName.msg}`,open:true });
          actionSet('create')
        }
       }
    },[updatedProdName])

    useEffect(()=>{
      if(materialNameDisableRestoreAction){
        if(checkAuthBranchWare(materialNameDisableRestoreAction.user_branch_id)){
        materialNames[materialNameDisableRestoreAction.index] = materialNameDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${materialNameDisableRestoreAction.msg}`,open:true });
        }
       }
    },[materialNameDisableRestoreAction]);
    // Material  real time end
    useEffect(()=>{
      if(createdMaterial){

        if(checkAuthBranchWare(createdMaterial.user_branch_id)){          
          materialsSet(createdMaterial.createdRow.concat(materials));
          setSuccessMsg({...successMsg,msg:`${createdMaterial.msg}`,open:true });
         
        }
       }
    },[createdMaterial])

    useEffect(()=>{
      if(updatedMaterial){
        if(checkAuthBranchWare(updatedMaterial.user_branch_id)){          
          materials[updatedMaterial.index] = updatedMaterial.updatedRow[0]
          setSuccessMsg({...successMsg,msg:`${updatedMaterial.msg}`,open:true });
          getProdCode()
        }
       }
    },[updatedMaterial])

    useEffect(()=>{
      if(materialCodeGet){
        if(action=='create'){         
         materialCodeSet(materialCodeGet.createdRow)
        }
       }
    },[materialCodeGet]);

    useEffect(()=>{

      if(materialDisableRestoreAction){
        if(checkAuthBranchWare(materialDisableRestoreAction.user_branch_id)){
        materials[materialDisableRestoreAction.index] = materialDisableRestoreAction.disableRestoreRow[0];
        setSuccessMsg({...successMsg,msg:`${materialDisableRestoreAction.msg}`,open:true });
        }
       }
    },[materialDisableRestoreAction]);

   
    const saveFormAction = async ()=>{
        if(selectedCategory == null){ 
            swal({
              title:'Select a material category',
              icon:'warning'
            })
          }else if(selectedUnit == null){
            swal({
              title:'Select a material unit',
              icon:'warning'
            })
          }else if(selectedProdName == null){
            swal({
              title:'Select a material name',
              icon:'warning'
            })
          }else{
             

            let payLoad = {
              material_id,
              materialUpdateIndex:materialUpdateIndex,
              material_cat_id : selectedCategory != null ? selectedCategory.prod_cat_id : null,
              material_name_id  : selectedProdName != null ? selectedProdName.material_name_id : null,
              material_unit_id  : selectedUnit != null ? selectedUnit.prod_unit_id : null,
              action,
              material_purchase_rate:material_purchase_rate==''?0:material_purchase_rate,
              material_re_order_lebel:material_re_order_lebel ==''?0:material_re_order_lebel
            }

        


            
            loadingSaveSet(true)
            await axios.post(`${API_URL}/api/material-cu`,payLoad,{headers:{'auth-token':authInfo.token}}).then(res=>{
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

            material_purchase_rate_set('')
            material_sale_rate_set('')
            material_whole_sale_rate_set('')
            material_re_order_lebel_set('')
            actionSet('create')

            
            })
          }
    }

    const materialEdit = (row,index)=>{
      let material = materials[index] 

      selectedCategorySet({prod_cat_id:material.material_cat_id,prod_cat_name:material.prod_cat_name})
      // selectedBrandSet({material_brand_id:material.material_brand_id,material_brand_name:material.material_brand_name})
      selectedUnitSet({prod_unit_id:material.material_unit_id,prod_unit_name:material.prod_unit_name}) 
      selectedProdNameSet({material_name_id:material.material_name_id,material_name:material.material_name}) 
      materialCodeSet(material.material_code)
      materialUpdateIndexSet(index)

      material_purchase_rate_set(material.material_purchase_rate)
      material_re_order_lebel_set(material.material_re_order_lebel)
      material_id_set(material.material_id)
      actionSet('update')


    }
    const materialDisableRestore = async (materialId,actionCond,index)=>{
      await axios.post(`${API_URL}/api/material-disable-restore`,{material_id:materialId,action:actionCond,index},{headers:{'auth-token':authInfo.token}})
    }
     
    const getProdNames = async ()=>{
          await axios.post(`${API_URL}/api/get-material-names`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
            materialNamesSet(res.data.message)
          })
    }
    
    
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
       {
    authInfo.role !='user'?(
    <>
         <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>materialEdit(props.rowData,props.rowIndex)}/>
          {props.rowData[1]=='a'?(
                <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>materialDisableRestore(props.rowData[0],'d',props.rowIndex)}/>
          ):(
            <SettingsBackupRestoreIcon style={{cursor:'pointer',color: 'rgb(60, 178, 194)',fontSize: '28px',}} onClick={()=>materialDisableRestore(props.rowData[0],'a',props.rowIndex)}/>
          )}       
   </>):''
 }
        </div>)
      
      }
    
    const columns = [
        {name: "material_id",options: { display: 'excluded' }},
        {name: "material_status",options: { display: 'excluded' }},
        {name:"SL",options: {filter: false,sort: false,
          customBodyRender:(value,tableMeta)=>{
          return ( <p>{parseFloat(tableMeta.rowIndex)+1}</p> ); 
        }
        },headerStyle: {
          textAlign:'left'
        }},
        {name: "material_code",label: "Material code",options: {filter: true,sort: true}},
        {name: "prod_cat_name",label: "Category name",options: {filter: true,sort: true}},
        {name: "material_name",label: "Material name",options: {filter: true,sort: true}},
        {name: "prod_unit_name",label: "Unit name",options: {filter: true,sort: true}},

        {name: "material_purchase_rate",label: "Purchase Avarage Rate",options: {filter: true,sort: true,
          
          customBodyRender:(value,tableMeta)=>{
            return ( <p>{parseFloat(tableMeta.rowData[7]).toFixed(2)}</p> ); 
          }
        }},


        // {name: "material_is_service",label: "Service",options: {filter: true,sort: true}},
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
            <h2 className={classes.pageEntryLabel}> Material  Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={materialCode} 
            label="material code" name="material_code" style={{color:'#222'}} disabled variant="outlined" size="small"  onChange={(e)=>materialCodeSet(e.target.value)} 
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
                            materialNameRef.current.focus()

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
                    <a className={classes.plusLink} href="/administration/material-brands-manage" target="_blank">+</a> 
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
                getOptionLabel={(option) =>option.material_brand_name}
               
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
                    <a className={classes.plusLink} href="/administration/material-colors-manage" target="_blank">+</a> 
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
                getOptionLabel={(option) => (option.material_color_name?option.material_color_name:'')}
                getOptionSelected={(option, value) => {
                    return option.material_color_id === value.material_color_id;
                }}
                onChange={(event,selectedObj)=>{
                  selectedObj?(formSetValues({...formValues,material_color_id:selectedObj.material_color_id})):
                  (formSetValues({...formValues,material_color_id:null}))
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


             {/* Material Name */}
             <Grid item xs={12} sm={3}  className={classes.plusLinkDiv}>
             {
    authInfo.role !='user'?(
    <>
                      <a className={classes.plusLink} style={{cursor:'pointer'}} onClick={(e)=>materialMSet(true)} >+</a>  
       
   </>):''
 }
                <Autocomplete
                style={{ width: '100%' }}
                options={materialNames} 
                size="small"
                openOnFocus={true}
                classes={{
                    option: classes.option,
                }}
                autoHighlight
                getOptionLabel={(option) => option.material_name}
                getOptionSelected={(option, value) => {
                    return option.material_name_id === value.material_name_id;
                }}
                onChange={(event,selectedObj)=>{
                  selectedProdNameSet(selectedObj)
                }}
                value={selectedProdName}
                loading={materialNames.length==0?true:false}
                renderInput={(params) => (
                    <TextField
                    inputRef={materialNameRef}
                    onKeyDown={event => {
                      if (event.key === "Enter") {
                        unitRef.current.focus()

                      }
                    }}
                    {...params}
                    label="Choose a material name"
                    variant="outlined"
                    loading={materialNames.length==0?true:false}
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                          <React.Fragment>
                            {/* {materialNames.length==0 ? <CircularProgress color="inherit" size={20} /> : null}
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
                        reOrderLevelRef.current.focus()
                      }
                    }}  className={classes.fullWidth}  value={material_purchase_rate} 
            label="purchase rate" name="material_purchase_rate" variant="outlined" size="small" onChange={(e)=>material_purchase_rate_set(e.target.value)} />
            </Grid>
        
            <Grid item xs={12} sm={3}  > 
            <TextField  autoComplete='off'  onKeyDown={event => {
              if (event.key === "Enter") {
                saveFormActionRef.current.click()
              }
            }}  inputRef={reOrderLevelRef}  className={classes.fullWidth}  value={material_re_order_lebel} 
            label="Re-order level"  type="number" name="material_re_order_lebel" variant="outlined" size="small" onChange={(e)=>material_re_order_lebel_set(e.target.value)} />
            </Grid>
{/* 
            <Grid item xs={12} sm={3} > 
            <FormControlLabel

                    control={
                      <Checkbox
                      ref={materialIsServiceRef}
                        checked={material_is_service}
                        onChange={(event)=>{
                        }}
                        name="checkedI"
                      />
                    }
                    label="Service"
                    style={{color: '#0f7e77'}}
                  />
            </Grid> */}
            

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
      title={"Material List"}
      data={materials}
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

        {/* Material Add Modal */}
     <Modal
        open={materialM}
        onClose={() => materialMSet(false)}
        center
        style={{minWidth:'300px',minHeight:'500px'}}
 
      
      >

        <Grid item xs={12} sm={12}  > 
            <TextField  autoComplete='off' style={{marginTop:'10px'}}   className={classes.fullWidth}  value={material_name} onChange={(e)=>material_name_set(e.target.value)}
            label="Material Name"  type="text" name="material_name" variant="outlined" size="small"
            onKeyDown={(event)=>{
              if (event.key === "Enter") {
                saveProdAction()
              }
              
            }}
            />
            

            <Button style={{marginTop: '25px'}}
            variant="contained"
            color="primary"
            disabled={materialAction?true:false}
            size="small"
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
        <Grid item xs={12} sm={12} > 
            
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
            disabled={catNameAction?true:false}
            color="primary"
            size="small"
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
          materialNameDisableRestoreAction:state.materialNameDisableRestoreReducer,
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
          createdMaterial:state.createdMaterialReducer,
          updatedMaterial:state.updatedMaterialReducer,
          materialCodeGet:state.materialCodeReducer,
          materialDisableRestoreAction:state.disableRestoreMaterialReducer,
          createdMaterialName : state.createdMaterialNameReducer
          
        }
  }
  export default connect(mapStateToPops,{currentRouteSet,updatedMaterialSet,disableRestoreMaterialSet,createdMaterialSet})(MaterialsManage);