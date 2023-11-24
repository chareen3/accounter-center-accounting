import React,{useState,useEffect, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import swal from 'sweetalert';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MUIDataTable from "mui-datatables";
import {APP_URL,API_URL} from '../../config.json';
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {pathSpliter,checkAuthBranchWare,dateTimeFormat,currentDateTime} from '../../lib/functions'
import {currentRouteSet} from '../../actions/actions';
import moment from 'moment';

import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker
  } from '@material-ui/pickers';
const ProductDamage = ({location,currentRouteSet,authInfo})=>{
    const classes = useStyles();

    const [selectedDate, handleDateChangeSet] = useState(currentDateTime);

    let [loadingSave,loadingSaveSet] = useState(false)
    let [loadingList,loadingListSet] = useState(false)
    let [products,productsSet] = useState([])
    let [selectedProduct,selectedProductSet] = useState(null)
    let [damageCode,damageCodeSet] = useState('');
    let [damages,damagesSet] = useState([]);

    let [damageQty,damageQtySet] = useState('')
    let [damageRate,damageRateSet] = useState(0)
    let [damageTotal,damageTotalSet] = useState(0)
    let [damageNote,damageNoteSet] = useState('')
    let [damageAction,damageActionSet] = useState('create')
    let [damageId,damageIdSet] = useState(0)

    let productRef = useRef(null)
    let rateRef = useRef(null)
    let qtyRef = useRef(null)
    let totalRef = useRef(null)
    let noteRef = useRef(null)
    let dateRef = useRef(null)
    let saveRef = useRef(null)
   

    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        getProducts()
        getDamageCode()
        getDamages()
    },[]);


   let getProducts = async ()=>{
        await axios.post(`${API_URL}/api/get-individual-products`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
              productsSet(res.data.message)
        })
    }

    let getDamages = async ()=>{
      await axios.post(`${API_URL}/api/get-damages`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            damagesSet(res.data)
      })
    }

    let getDamageCode = async ()=>{
        
        await axios.get(`${API_URL}/api/get-damage-code`,{headers:{'auth-token':authInfo.token}}).then(res=>{
            damageCodeSet(res.data)
      })
    }

    const saveFormAction = async ()=>{
        if(selectedProduct==null){
            swal({title:'select product',icon:'warning'});return false;
        }
        if(damageQty<=0){
            swal({title:'Invalid Quantity.',icon:'warning'});return false;
        }
        let payload = {
            damage_id: damageId,
            damage_prod_id: selectedProduct.prod_id,
            damage_rate: damageRate,
            damage_qty: damageQty,
            damage_total: damageTotal,
            damage_note: damageNote,
            damage_c_isodt: selectedDate,
            damageAction : damageAction
        }

            loadingSaveSet(true) 

            await axios.post(`${API_URL}/api/save-damage`,{payload},{headers:{'auth-token':authInfo.token}}).then(res=>{
                loadingSaveSet(false)
                if(!res.data.error){
                  getDamageCode()
                  getDamages() 
                  swal({title:res.data.message,icon:'success'})
                  selectedProductSet(null)
                  damageQtySet('')
                  damageRateSet(0)
                  damageTotalSet(0)
                  damageNoteSet('')
                  damageActionSet('create')
                  damageIdSet(0)
                  handleDateChangeSet(currentDateTime)

                }
          })
        
          
    }

    const damageEdit = (row,index)=>{
          damageCodeSet(damages[index].damage_code);
          selectedProductSet({prod_id:damages[index].damage_prod_id,prod_name:damages[index].prod_name});
          damageRateSet(parseFloat(damages[index].damage_rate).toFixed(2))
          damageQtySet(damages[index].damage_qty)
          damageTotalSet(damages[index].damage_total)
          damageNoteSet(damages[index].damage_note)
          handleDateChangeSet(damages[index].damage_c_isodt)
          damageIdSet(damages[index].damage_id)
          damageActionSet('update')
    }

    const damageDelete = async (index)=>{ 
      swal({
        title:'Are you sure delete this?',
        icon:'warning',
        buttons:true
      }).then(async res=>{
        if(res){
          let damageId = damages[index].damage_id;
      await axios.post(`${API_URL}/api/delete-damage`,{damageId},{headers:{'auth-token':authInfo.token}}).then(res=>{
        if(!res.data.error){
          getDamages()
          swal({title:res.data.message,icon:'success'})
        }
        })
        }else{
          return false;
        }
      })
      
    }
  
    const ActionOptions = (props)=>{
        return(<div style={{textAlign:'right'}}>
           {
    authInfo.role !='user'?(
    <>
         <EditIcon style={{cursor:'pointer',fontSize: '28px',color: 'rgb(15, 126, 119)'}} onClick={()=>damageEdit(props.rowData,props.rowIndex)} />
          <DeleteIcon style={{cursor:'pointer',color: '#ff0202',fontSize: '28px'}} onClick={()=>damageDelete(props.rowIndex)}/>        
   </>):''
 }
         
        </div>)
      
      }
    
    const columns = [
        {name: "damage_id",options: { display: 'excluded' }},
        {name: "damage_code",label: "Damage Code",options: {filter: true,sort: true}},
        {name: "damage_c_isodt",label: "created date & time",options: 
        {filter: true,sort: true,
          customBodyRender:(value,tableMeta)=>{
            return(<p>{moment(tableMeta.rowData[2]).format(dateTimeFormat)}</p>) 
          }
        }},
        {name: "prod_name",label: "Product Name",options: {filter: true,sort: true}},
        {name: "damage_rate",label: "Rate",options: {filter: true,sort: true}},
        {name: "damage_qty",label: "Quantity",options: {filter: true,sort: true}},
        {name: "damage_total",label: "Total",options: {filter: true,sort: true}},
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
         
            <Paper className={classes.paper} style={{marginTop:'-15px'}}>
            <h2 className={classes.pageEntryLabel}>Damage Product Entry</h2>
             
            <Grid container spacing={2}>
            <Grid item xs={12} sm={2} > 
            <TextField  autoComplete='off'  className={classes.fullWidth}  value={damageCode} 
            label="Product Damage  Code" disabled name="product_damage_code" variant="outlined" size="small"  />
            </Grid>
            <Grid item xs={12} sm={3}>
            <Autocomplete 
              openOnFocus={true}
              autoHighlight={true}
              style={{width:'100%',height:'20px'}}
              options={products}
              value={selectedProduct}
              inputRef={productRef}
              onKeyDown={(e)=>{
                if(e.key=='Enter'){
                 qtyRef.current.focus();
                }
              }}
              onChange={(e,product)=>{
                    if(product==null){
                        selectedProductSet(null)
                        return false
                    }
                    selectedProductSet(product)
                    damageRateSet(parseFloat(product.prod_purchase_rate).toFixed(2))
                    
               }}
              size="small"
              getOptionLabel={(option) => option.prod_name}
             
              renderInput={(params) => <TextField 
              
                {...params} 
                label="Damage  product" 
                variant="outlined"
                
                />}
                
          />
            </Grid>
            <Grid item xs={12} sm={2} > 
            <TextField type="number" autoComplete='off' disabled  className={classes.fullWidth}  value={damageRate} 
            label="Damage  Rate" name="damage_rate" variant="outlined" size="small" 
            />
            </Grid>
            <Grid item xs={12} sm={2} > 
            <TextField type="number" autoComplete='off'  className={classes.fullWidth}  value={damageQty} 
            label="Damage  Qty" name="damage_qty" variant="outlined" size="small" 
            inputRef={qtyRef}
            onKeyDown={(e)=>{
              if(e.key=='Enter'){
               noteRef.current.focus();
              }
            }}
            
            onChange={(e)=>{
                damageQtySet(e.target.value)
                if(e.target.value>0){
                    damageTotalSet(parseFloat(e.target.value)*damageRate)
                }
            }}
            
            />
            </Grid>

            <Grid item xs={12} sm={2} > 
            <TextField type="number" disabled autoComplete='off'  className={classes.fullWidth}  value={damageTotal} 
            label="Damage  Total" name="damage_total" variant="outlined" size="small" 
            inputRef={totalRef}
            onKeyDown={(e)=>{
              if(e.key=='Enter'){
               noteRef.current.focus();
              }
            }} />
            </Grid>
            <Grid item xs={12} sm={3} style={{marginRight:'10px'}}>
            
            <TextareaAutosize value={damageNote}  name="damage_note" 
            ref={noteRef}
             onKeyDown={(e)=>{
               if(e.key=='Enter'){
                dateRef.current.focus();
               }
             }}

             onChange={(e)=>damageNoteSet(e.target.value)}
             
             style={{float:'left',marginTop:'20px',width: '325px',height: '40px',
             marginTop: '1px',width: '200px'}} aria-label="Damage Note..." rowsMin={3} placeholder="Damage Note..." />

            </Grid>
            <Grid item xs={12} sm={3}>
            <MuiPickersUtilsProvider  utils={DateFnsUtils}>
            <KeyboardDateTimePicker
            style={{ width: '100%',marginTop: '' }}
            value={selectedDate}
            inputRef={dateRef}
            onKeyDown={(e)=>{
              if(e.key=='Enter'){
               saveRef.current.click();
              }
            }}
            onChange={handleDateChangeSet}
            name="damage_date_time"
            label="Damage Date & Time"
            format="yyyy/MM/dd hh:mm a"
               />
            </MuiPickersUtilsProvider>
          </Grid>

           </Grid>
           <Grid item xs={12}>
          <Button style={{marginTop: '25px'}}
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<SaveIcon/>}
            buttonRef={saveRef}
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
      title={"Damage Product  List"}
      data={damages}
      columns={columns}
      options={options}
      adjustForCheckbox={false} 
      displaySelectAll={false}
      />
      </Paper>
      )
      
     }
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
      }
  }));
  
  const mapStateToPops = (state)=>{
        return {
          currentRoute:state.currentRouteReducer,
          authInfo:state.authInfoReducer,
        }
  }
  export default connect(mapStateToPops,{currentRouteSet})(ProductDamage);