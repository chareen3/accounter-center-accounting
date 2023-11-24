import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './invoice.css'
import commaNumber from 'comma-number';
let format = commaNumber.bindWith(',', '.')
const InvoiceBody = ({serviceData})=>{
    const classes = useStyles();
    // Invoice body
  
        /// end 

        // console.log(service)
         let [service,serviceSet] = useState([])
          let [serviceDetails,serviceDetailsSet] = useState([])

        useEffect(()=>{
            serviceSet(serviceData)

            if(serviceData.details!=undefined){
                serviceDetailsSet(serviceData.details)
            }
            },[serviceData])


      return(
          <>
        <table className={'invoice-table'}> 
          <thead>
              
                <td  style={{textAlign:'left'}}>SL</td>
                <td style={{textAlign:'left'}}>Description</td>
                <td>Qty</td>
                <td>Rate</td>
                <td>Total</td>
             
          </thead>
          <tbody>
        

            {
              serviceDetails.map((detail,ind) =>(
                   <tr>
                       <td  style={{textAlign:'left'}}>{ind+parseFloat(1)}</td>
                       <td style={{textAlign:'left'}}>{detail.prod_name}</td>
                       <td>{detail.service_qty} {detail.prod_unit_name}</td>
                       <td>{format(parseFloat(detail.service_rate).toFixed(2))} </td>
                       <td style={{textAlign:'right'}}>{format(parseFloat(detail.service_prod_total).toFixed(2))}</td>
                   </tr>
               ))
            } 
              

              
          </tbody>
        </table>
          </>
      )
}


const useStyles = makeStyles((theme) => ({
    
    
  }));

export default InvoiceBody;