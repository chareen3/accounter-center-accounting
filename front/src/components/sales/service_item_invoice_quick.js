import React,{useEffect,useState} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet} from '../../actions/actions';
import {pathSpliter} from '../../lib/functions';
import PurchaseInvoice from './components/service_item_invoice';
import {API_URL} from '../../config.json';
import axios from 'axios';
const PurchaseInvoiceQuick = ({location,currentRouteSet,authInfo})=>{
    


    let [institution,institutionSet] = useState(null);

    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
        getInstitution();
    },[]);

    let getInstitution = async ()=>{
      await  axios.get(`${API_URL}/api/get-institution`,{headers:{'auth-token':authInfo.token}}).then(res=>{
          institutionSet(res.data)
   })
  }
      return(
          <>
              <PurchaseInvoice purchaseId={parseFloat(pathSpliter(location.pathname,3))} institution={institution} />
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