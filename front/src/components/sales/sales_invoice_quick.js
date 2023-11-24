import React,{useEffect,useState} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet} from '../../actions/actions';
import {pathSpliter} from '../../lib/functions';
import SalesInvoice from './components/sales_invoice';
import axios from 'axios';
import {API_URL} from '../../config.json';
const SalesInvoiceQuick = ({location,currentRouteSet,authInfo})=>{
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
              <SalesInvoice saleId={parseFloat(pathSpliter(location.pathname,3))} institution={institution} />
          </>
      )
}
  const mapStateToPops = (state)=>{
    return {
      currentRoute:state.currentRouteReducer,
      authInfo:state.authInfoReducer
    }
}

export default connect(mapStateToPops,{currentRouteSet})(SalesInvoiceQuick);