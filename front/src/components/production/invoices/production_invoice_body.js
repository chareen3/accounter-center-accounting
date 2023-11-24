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
          let [materials,materialsSet] = useState([])
          let [products,productsSet] = useState([])

        useEffect(()=>{
            purchaseSet(purchaseData)
            if(purchaseData.materials!=undefined && purchaseData.products!=undefined){
              materialsSet(purchaseData.materials)
              productsSet(purchaseData.products)
            }
            },[purchaseData])


      return(
          <>
        <table className={'invoice-table'}  style={{width:'49%',float:'left'}}> 
        <thead>
              
              <td>SL</td>
              <td style={{textAlign:'left'}}>Product</td>
              <td>Qty</td>
              <td>Production Rate</td>
              <td>Total</td>
           
        </thead>
        <tbody>
      

          {
            products.map((detail,ind) =>(
                 <tr>
                     <td>{ind+parseFloat(1)}</td>
                     <td style={{textAlign:'left'}}>{detail.prod_name}</td>
                     <td>{format(parseFloat(detail.prod_qty))} {detail.prod_unit_name}</td>
                     <td>{format(parseFloat(detail.prod_rate).toFixed(2))}</td>
                     <td style={{textAlign:'right'}}>{format(parseFloat(detail.prod_total).toFixed(2))}</td>
                 </tr>
             ))
          } 
            

            
        </tbody>
        </table>


        <table className={'invoice-table'} style={{width:'49%',float:'right',marginLeft:'1%'}}> 
          


          <thead>
              
              <td>SL</td>
              <td style={{textAlign:'left'}}>Material</td>
              <td>Qty</td>
              <td>Purchase Rate</td>
              <td>Total</td>
           
        </thead>
        <tbody>
      

          {
            materials.map((detail,ind) =>(
                 <tr>
                     <td>{ind+parseFloat(1)}</td>
                     <td style={{textAlign:'left'}}>{detail.material_name}</td>
                     <td>{format(parseFloat(detail.material_qty))} {detail.prod_unit_name}</td>
                     <td>{format(parseFloat(detail.material_rate).toFixed(2))}</td>
                     <td style={{textAlign:'right'}}>{format(parseFloat(detail.material_total).toFixed(2))}</td>
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