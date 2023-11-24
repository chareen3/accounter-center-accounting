import React,{useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet} from '../../actions/actions';
import {pathSpliter} from '../../lib/functions';
import ServiceInvoice from './components/service_invoice';
import {API_URL} from '../../config.json';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';

let ViewServiceInvoice = ({location,currentRouteSet,authInfo})=>{

  let [invoices,invoicesSet] = useState([]);
  let [selectedInvoice,selectedInvoiceSet] = useState(null);
  let [serviceId,serviceIdSet] = useState(null);
  let [institution,institutionSet] = useState(null);

  useEffect(()=>{
    currentRouteSet(pathSpliter(location.pathname,1));
    getServiceInvoices();
    getInstitution();
},[]);

let getServiceInvoices = async ()=>{
    await axios.get(`${API_URL}/api/service-invoices`,{headers:{'auth-token':authInfo.token}}).then(res=>{
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
                     getOptionLabel={(option) => option.service_invoice}
                     onChange={(e,invoice)=>{

                      selectedInvoiceSet(invoice)
                        if(invoice != null){
                            serviceIdSet(invoice.service_id)
                        }

                       
                    
                     }}
                     renderInput={(params) => <TextField 
             
                 {...params} 
                 label="Choose Service Invoice" 
                 variant="outlined"
                 
                 />} />


    </Grid>
            </Grid>
            </Grid>
        
        {
             
              <ServiceInvoice serviceId={serviceId} institution={institution}/>
            
        }
            
      
    </>
)
 
}


  const mapStateToPops = (state)=>{
    return {
      currentRoute:state.currentRouteReducer,
      authInfo:state.authInfoReducer
    }
}

export default connect(mapStateToPops,{currentRouteSet})(ViewServiceInvoice);