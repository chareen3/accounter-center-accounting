import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './invoice.css'

const InvoiceBody = ({transferData})=>{
    const classes = useStyles();
    // Invoice body
  
        /// end 

         let [transfer,transferSet] = useState([])
          let [transferDetails,transferDetailsSet] = useState([])

        useEffect(()=>{
          transferSet(transferData)


            if(transferData.details!=undefined){
              transferDetailsSet(transferData.details)
            }
            },[transferData])


      return(
          <>
        <table className={'invoice-table'}> 
          <thead>
              
                <td  style={{textAlign:'left'}}>SL</td>
                <td style={{textAlign:'left'}}>Product</td>
                <td>Qty</td>
                <td>Total</td>
             
          </thead>
          <tbody>
        

            {
              transferDetails.map((detail,ind) =>(
                   <tr>
                       <td  style={{textAlign:'left'}}>{ind+parseFloat(1)}</td>
                       <td style={{textAlign:'left'}}>{detail.prod_name}</td>
                       <td>{detail.transfer_qty}</td>
                       <td style={{textAlign:'right'}}>{parseFloat(detail.transfer_total).toFixed(2)}</td>
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