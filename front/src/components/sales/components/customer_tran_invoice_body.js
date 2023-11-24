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

        useEffect(()=>{
            saleSet(saleData)

            if(saleData!=undefined){
              saleSet(saleData)
            }
            },[saleData])


      return(
          <>
        <table className={'invoice-table'}> 
          <thead>
              
                <td style={{textAlign:'left'}}>Description</td>
                <td style={{textTransform:'capitalize'}}>{sale.pay_type} Amount</td>
             
          </thead>
          <tbody>
        

            
                   <tr>
                       <td style={{textAlign:'left'}}>{sale.note}</td>
                       <td style={{textAlign:'right'}}>{format(parseFloat(sale.pay_amount).toFixed(2))}</td>
                   </tr>
               
            
              

              
          </tbody>
        </table>
          </>
      )
}


const useStyles = makeStyles((theme) => ({
    
    
  }));

export default InvoiceBody;