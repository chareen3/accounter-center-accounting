import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './invoice.css'
import commaNumber from 'comma-number';
let format = commaNumber.bindWith(',', '.')
const InvoiceBody = ({saleData})=>{
    const classes = useStyles();
    // Invoice body
  
        /// end 

        // console.log(sale)
         let [sale,saleSet] = useState([])
          let [saleDetails,saleDetailsSet] = useState([])

        useEffect(()=>{
            saleSet(saleData)

            if(saleData.details!=undefined){
                saleDetailsSet(saleData.details)
            }
            },[saleData])


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
              saleDetails.map((detail,ind) =>(
                   <tr>
                       <td  style={{textAlign:'left'}}>{ind+parseFloat(1)}</td>
                       <td style={{textAlign:'left'}}>{detail.prod_name}</td>
                       <td>{detail.sale_qty} {detail.prod_unit_name}</td>
                       <td>{format(parseFloat(detail.sale_rate).toFixed(2))} </td>
                       <td style={{textAlign:'right'}}>{format(parseFloat(detail.sale_prod_total).toFixed(2))}</td>
                   </tr>
               ))
            } 

<tr>
                       <td  style={{textAlign:'left'}}></td>
                       <td style={{textAlign:'left'}}></td>
                       <td>{saleDetails.reduce((prev,curr)=>{
                         return prev +parseFloat(curr.sale_qty)
                       },0).toFixed(2)} </td>
                       <td></td>
                       <td style={{textAlign:'right'}}></td>
                   </tr>
              

              
          </tbody>
        </table>
          </>
      )
}


const useStyles = makeStyles((theme) => ({
    
    
  }));

export default InvoiceBody;