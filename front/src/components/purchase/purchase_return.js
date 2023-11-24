import React,{useState,useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet,purchaseReturnChangeSet} from '../../actions/actions';
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
import _ from 'lodash';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import SaveIcon from '@material-ui/icons/Save';

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import swal from 'sweetalert';

const SalesReturn = ({location,currentRoute,currentRouteSet,authInfo,purchaseReturnChangeSet})=>{
    const classes = useStyles();
    const [selectedDate, handleDateChangeSet] = useState(currentDateTime);
    
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        getSuppliers();
    },[]);


    let [suppliers,suppliersSet] = useState([]);
    let [selectedSupplier,selectedSupplierSet] = useState(null)
    let [invoices,invoicesSet] = useState([])
    let [selectedInvoice,selectedInvoiceSet] = useState(null);
    let [invoiceDetail,invoiceDetailSet] = useState([]);
    let [saveAction,saveActionSet] = useState(false);
    
    let supplierRef = useRef(null)
    let invoiceRef = useRef(null)
    let getReturnRef = useRef(null)
   

   

    const getSuppliers = async ()=>{
          await axios.post(`${API_URL}/api/get-suppliers`,{'select-type':'active'},{headers:{'auth-token':authInfo.token}}).then(res=>{
            res.data.message.unshift({supplier_id:0,supplier_address:'',supplier_mobile_no:'',supplier_name:'General Supplier',display_text:'General Supplier'});
            suppliersSet(res.data.message);
          })
    }
   
    let getSupplierWiseInvoices = async (selectedObj)=>{
      let reqPayload = {
        supplierId: selectedObj != null? selectedObj.supplier_id:null,
        selectedSearchType:'By Supplier'
    }
    await axios.post(`${API_URL}/api/get-purchase`,{reqPayload},{headers:{'auth-token':authInfo.token}}).then(res=>{
      invoicesSet(res.data.message)
    })
    }

    let getPurchaseReturnDetail = async ()=>{
        if(selectedSupplier == null){
            swal({title:'select supplier',icon:'warning'}); return false;
        }
        if(selectedInvoice==null){
            swal({title:'select invoice',icon:'warning'}); return false;
        }
      await axios.post(`${API_URL}/api/get-purchase-return-details`,{reqPayload:{purId :selectedInvoice.pur_id}},{headers:{'auth-token':authInfo.token}}).then(res=>{
       
        invoiceDetailSet(res.data.message) 
     })
    }
    

  
 

    let saveSaleReturn = async ()=>{
    
    let returnCart =   invoiceDetail.filter((ele)=>{
        if(ele.return_qty>0 && ele.return_amount>0){
          return ele;
        }
      });


      selectedInvoice.pur_return_amount =  invoiceDetail.reduce((prev,cur)=>{
        return prev+(cur.return_amount ? parseFloat(cur.return_amount) : 0.00)
      },0).toFixed(2)

      if(selectedInvoice.pur_return_amount<=0){
        swal({title:'Return cart Invalid',icon:'warning'}); return false
      }


      selectedInvoice.pur_return_created_isodt = selectedDate

      if(returnCart.length==0){
        swal({title:'Return cart Invalid',icon:'warning'}); return false
      }else{
        saveActionSet(true)
        await axios.post(`${API_URL}/api/purchase-return`,{returnCart:returnCart,selectedInvoice:selectedInvoice},{headers:{'auth-token':authInfo.token}}).then(res=>{
             if(!res.data.message.error){
              invoiceDetailSet([]);
              swal({title:res.data.message,icon:'success'})
              selectedInvoice.pur_return_note  =''
             
             }
             saveActionSet(false)
        })
      }
      
    }


    
      return(
          <div className={classes.root}> 
<Paper className={classes.paper} style={{marginTop:'-25px',marginBottom:'5px'}}>
<h4 style={{textAlign: 'left',margin: '-9px 0px 0px',
    padding: '0px',fontSize: '17px'}}>Purchase Return</h4>
<Grid container spacing={3} > 
         
          <Grid item  xs={12}   sm={3} > 
          <Autocomplete 
          size="small"
          autoHighlight

              openOnFocus={true}
              style={{width:'100%',height:'20px'}} 
              options={suppliers}
              value={selectedSupplier}
              getOptionLabel={(option) => option.display_text}
              onChange={(event,selectedObj)=>{
                 selectedSupplierSet(selectedObj);
                 selectedInvoiceSet(null)
                 getSupplierWiseInvoices(selectedObj)
              }}
              renderInput={(params) => <TextField     
                inputRef={supplierRef}   
                onKeyDown={(e)=>{
                  if(e.key == 'Enter'){
                    invoiceRef.current.focus()
                  }
                  
                }}        
                {...params} 
                label="Select Supplier" 
                variant="outlined"
                />} 
                
          />
          </Grid>

          <Grid item  xs={12}   sm={3} > 
          <Autocomplete 
          size="small"
          autoHighlight
              openOnFocus={true}
              style={{width:'100%',height:'20px'}} 
              options={invoices}
              value={selectedInvoice}
              getOptionLabel={(option) => option.pur_invoice_no}
              onChange={(event,selectedObj)=>{
                 selectedInvoiceSet(selectedObj);
              }}
              renderInput={(params) => <TextField     
                inputRef={invoiceRef}           
                onKeyDown={(e)=>{
                  getReturnRef.current.click()
                }}
                {...params} 
                label="Purchase Invoice" 
                variant="outlined"
                />} 
                
          />
          </Grid>

          <Grid item  xs={12}   sm={1} > 
        <Button style={{marginTop: '5px',marginLeft: 'auto',fontSize:'14px'}} 
                            buttonRef={getReturnRef}
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<SearchIcon/>}
                            onClick={()=>{
                              getPurchaseReturnDetail()
                            }}
                            
                        >
                       Search 
                      </Button>
        </Grid>

        </Grid> 
        </Paper>




        {invoiceDetail.length>0?(
  
    <Paper className={classes.paper} style={{marginTop:'8px',marginBottom:'5px'}} >

    <Grid container spacing={3} > 
          <Grid item  sm={4} style={{textAlign: 'left'}}>
                Invoice No : {selectedInvoice != null ?selectedInvoice.pur_invoice_no:''}<br/>
                Supplier Name : {selectedInvoice != null ?selectedInvoice.supplier_name:''}<br/>
                Supplier Address : {selectedInvoice != null ? selectedInvoice.supplier_address:''}<br/>
          </Grid>


          <Grid item  sm={4} >
          </Grid>
          <Grid item  sm={4} style={{textAlign: 'left'}}>
          Supplier Mobile No : {selectedInvoice!= null? selectedInvoice.supplier_mobile_no:''}<br/>
                <MuiPickersUtilsProvider  utils={DateFnsUtils}>
          
          <KeyboardDateTimePicker
          style={{ width: '100%',marginTop: '' }}
          value={selectedDate}
         
          onChange={handleDateChangeSet}
          name="return_date"
          label="Return date  time"
          format="yyyy/MM/dd hh:mm a"
             />
          </MuiPickersUtilsProvider>
          </Grid>
         
          
    </Grid>


    
    {/* sale product details */} 
    <TableContainer style={{overflow: 'hidden'}}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow> 
            <TableCell style={{textAlign:'left',width:'2%'}}>SL</TableCell>
            <TableCell style={{textAlign:'left',width:'10%'}}>Product</TableCell>
            <TableCell style={{textAlign:'right',width:'3%'}}>Qty</TableCell>
            <TableCell style={{textAlign:'right',width:'10%'}}>Amount</TableCell>
            <TableCell style={{textAlign:'right',width:'15%'}}>Already returned qty	</TableCell>
            <TableCell style={{textAlign:'right',width:'15%'}}>Already returned amount	</TableCell>
            <TableCell style={{textAlign:'right',width:'17%'}}>Return Qty	</TableCell>
            <TableCell style={{textAlign:'right',width:'17%'}}>Return Rate		</TableCell>
            <TableCell style={{textAlign:'right',width:'10%'}}>Return Amount	</TableCell>
          </TableRow>
        </TableHead>
        <TableBody> 
          { 
            invoiceDetail.map((detail,sl)=>(
              <TableRow > 
              <TableCell style={{textAlign:'left',width:'2%'}}>{sl+parseFloat(1)}</TableCell>
            <TableCell style={{textAlign:'left',width:'10%'}}>{detail.prod_name}</TableCell> 
              <TableCell style={{textAlign:'right',width:'3%'}}>{detail.pur_qty}</TableCell>
              <TableCell style={{textAlign:'right',width:'10%'}}>{detail.pur_total_amount}</TableCell>
              <TableCell style={{textAlign:'right',width:'15%'}}>{detail.returned_quantity}</TableCell>
              <TableCell style={{textAlign:'right',width:'15%'}}>{detail.returned_amount}</TableCell>
              <TableCell style={{textAlign:'right',width:'17%'}}> 
              <TextField type="number" style={{width:'125px'}} label="Return Qty"  
                           size="small"   name="return_qty" 
                           onChange={(e)=>{
                             if((detail.returned_quantity+parseFloat(e.target.value))>parseFloat(detail.pur_qty)){
                             
                                swal({title:'Invalid Quantity.',icon:'warning'});
                                e.target.value = 0
                                return false;
                             }
                             purchaseReturnChangeSet(e,sl,detail,invoiceDetail)}}
                           value={detail.return_qty}
                          variant="outlined" className={classes.inputField} 
                          />

              </TableCell>
              <TableCell style={{textAlign:'right',width:'17%'}}> 
              <TextField disabled type="number" style={{width:'125px'}} label="Return Amount"  
                           size="small"   name="pur_rate" 
                           value={detail.pur_rate} 
                           onChange={(e)=>{purchaseReturnChangeSet(e,sl,detail,invoiceDetail)}} 
                          variant="outlined" className={classes.inputField} 
                          /> 
              </TableCell>
            <TableCell style={{textAlign:'right',width:'10%'}}>{detail.return_amount}</TableCell>
              
            </TableRow>
            ))
          }

          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>Total : </TableCell>
            <TableCell></TableCell>
        <TableCell style={{textAlign:'right'}}>{invoiceDetail.reduce((prev,cur)=>{
               return prev+(cur.return_amount ? parseFloat(cur.return_amount) : 0.00)
        },0).toFixed(2)}</TableCell>
          </TableRow>
      

        <TableRow>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>
          <TextareaAutosize   name="note" style={{float:'left',marginTop:'20px',width: '325px'}} aria-label="Purchase return Note..." rowsMin={3} placeholder="Purchase Return Note..." 
            value={selectedInvoice!=null?selectedInvoice.pur_return_note:''}

            onChange={(e)=>{
             selectedInvoice.pur_return_note =  e.target.value;
             selectedInvoiceSet(selectedInvoice)
            }}
          />
          </TableCell>

          <TableCell>
          <Button style={{marginTop: '5px',marginLeft: '44px',fontSize:'14px'}} 
                                                     
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={()=>saveSaleReturn()}
                            className={classes.button}
                            disabled={saveAction?true:false}
                            startIcon={<SaveIcon/>}
                        >
                       Save
                      </Button>
          </TableCell>
        </TableRow>
       


        </TableBody>
      </Table>
    </TableContainer>
        </Paper>

        ):''

}
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
        authInfo:state.authInfoReducer,
        returnChangeUpdate: state.purchaseReturnChangeReducer
      }
}
export default connect(mapStateToPops,{currentRouteSet,purchaseReturnChangeSet})(SalesReturn); 