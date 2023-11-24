import React,{useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet} from '../../../actions/actions';
import {pathSpliter} from '../../../lib/functions';
import PurchaseInvoice from './load_material_purchase_invoice';

import {API_URL} from '../../../config.json';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';

const PurchaseInvoiceQuick = ({location,currentRouteSet,authInfo})=>{
    let [invoices,invoicesSet] = useState([]);
    let [selectedInvoice,selectedInvoiceSet] = useState(null);
    let [purchaseId,purchaseIdSet] = useState(null);
    let [institution,institutionSet] = useState(null);

    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        getPurchaseInvoices();
        getInstitution();
    },[]);

    let getPurchaseInvoices = async ()=>{
        await axios.get(`${API_URL}/api/get-material-purchase-invoices`,{headers:{'auth-token':authInfo.token}}).then(res=>{
            invoicesSet(res.data);
        })
    }

    let getInstitution = async ()=>{
        await  axios.get(`${API_URL}/api/get-institution`,{headers:{'auth-token':authInfo.token}}).then(res=>{
            institutionSet(res.data)
     })
    }

      return(
          <>
            <Grid container>
  
  <Grid item xs={12} sm={12}>
        <Grid xs={12} sm={12} style={{width:'250px',marginBottom:'20px',margin: '0px auto'}}>
        <Autocomplete 
          

           openOnFocus={true}
           autoHighlight={true}
           style={{width:'100%',height:'20px'}}
           options={invoices}
           value={selectedInvoice}
           size="small"
           getOptionLabel={(option) => option.m_purchase_invoice}
           onChange={(e,invoice)=>{
            selectedInvoiceSet(invoice)
              if(invoice != null){
                  purchaseIdSet(invoice.m_purchase_id )
              }
           }}
           renderInput={(params) => <TextField 
   
       {...params} 
       label="Material Purchase Invoice" 
       variant="outlined"
       
       />} />


</Grid>
  </Grid>
  </Grid>
              <PurchaseInvoice purchaseId={purchaseId} institution={institution}/>
          </>
      )
}
  const mapStateToPops = (state)=>{
    return {
      currentRoute:state.currentRouteReducer,
      authInfo:state.authInfoReducer
    }
}

export default connect(mapStateToPops,{currentRouteSet})(PurchaseInvoiceQuick);