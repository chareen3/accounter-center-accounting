import React,{useEffect} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet} from '../../actions/actions';
import {pathSpliter} from '../../lib/functions';
import TransferInvoice from './components/transfer_invoice';

const TransferInvoiceQuick = ({location,currentRouteSet})=>{
    
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1));
    },[]); 
      return(
          <>
              <TransferInvoice transferId={parseFloat(pathSpliter(location.pathname,3))} />
          </>
      )
}
  const mapStateToPops = (state)=>{
    return {
      currentRoute:state.currentRouteReducer,
      authInfo:state.authInfoReducer
    }
}

export default connect(mapStateToPops,{currentRouteSet})(TransferInvoiceQuick);