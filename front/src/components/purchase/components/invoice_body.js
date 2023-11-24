import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './invoice.css'
import commaNumber from 'comma-number';
let format = commaNumber.bindWith(',', '.')
const InvoiceBody = ({purchaseData})=>{
    const classes = useStyles();
    // Invoice body
  
        /// end 

        // console.log(purchase)
         let [purchase,purchaseSet] = useState([])
          let [purchaseDetails,purchaseDetailsSet] = useState([])

        useEffect(()=>{
            purchaseSet(purchaseData)

            if(purchaseData.details!=undefined){
                purchaseDetailsSet(purchaseData.details)
            }
            },[purchaseData])


      return(
          <>
        <table className={'invoice-table'}> 
          <thead>
              
                <td>SL</td>
                <td style={{textAlign:'left'}}>Description</td>
                <td>Qty</td>
                <td>Rate</td>
                <td>Total</td>
             
          </thead>
          <tbody>
        

            {
              purchaseDetails.map((detail,ind) =>(
                   <tr>
                       <td>{ind+parseFloat(1)}</td>
                       <td style={{textAlign:'left'}}>{detail.prod_name}</td>
                       <td>{format(parseFloat(detail.pur_qty))} {detail.prod_unit_name}</td>
                       <td>{format(parseFloat(detail.pur_rate).toFixed(2))}</td>
                       <td style={{textAlign:'right'}}>{format(parseFloat(detail.pur_total_amount).toFixed(2))}</td>
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