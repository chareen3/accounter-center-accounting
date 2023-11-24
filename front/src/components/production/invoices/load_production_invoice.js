import React,{useState,useEffect,useRef} from 'react';
import {connect} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import {API_URL} from '../../../config.json';
import InvoiceBody from './production_invoice_body'
import PrintIcon from '@material-ui/icons/Print';
import moment from 'moment';
import {currentDateTime, dateTimeFormat} from '../../../lib/functions'

import ReactToPrint from "react-to-print";
import './invoice.css'
import commaNumber from 'comma-number';
import { parse } from 'date-fns';
let format = commaNumber.bindWith(',', '.')
class PrintAbleSection extends React.Component {
      
  constructor(props) {
    super(props);  
  }
  state = {
    purchase:this.props,
    institution : this.props.institution
  }
  componentDidMount() {
    this.getPurchase()
  }


  componentDidUpdate(prevProps, prevState) {
    if (prevProps.purchaseId != this.props.purchaseId) {
        this.getPurchase()
    }

  }

   getPurchase = async()=>{
      await axios.post(`${API_URL}/api/get-production-with-details`,{productionId:this.props.purchaseId,from:'invoice'},{headers:{'auth-token':this.props.authInfo.token}}).then(res=>{
        this.setState({purchase:res.data[0]});
      })

     
  }


    convertNumberToWords =  (amountToWord)=>{
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    let amount = amountToWord == null ? '0.00' : amountToWord.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }

        let value = "";
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string + ' only';
}


  render(){
    let {purchase}  = this.state;
    return(
      <div style={{padding:'10px'}} >
        {
          purchase != undefined ? (
            <>
                  <Grid container>
                            <Grid item xs={12} sm={12}>
                                 <h3 className={"invoice-title"}>Production Invoice</h3>
                            </Grid>
                      </Grid>
                      <Grid container style={{marginBottom: '12px',fontSize:'13px'}}>
                           <Grid item xs={6} sm={6}> 
                                 <strong>Production Invoice : </strong> <span>{ purchase.production_invoice }</span><br/>
                                 <strong>Production Date & Time : </strong> <span>{ moment(purchase.created_isodt).format(dateTimeFormat)  }</span><br/>
                               

                            </Grid>
                            <Grid item xs={6} sm={6} style={{textAlign:'right'}}>  
                                 <strong>Incharge  : </strong> <span>{ purchase.employee_name }</span><br/>
                                 <strong>Shift  : </strong> <span>{ purchase.shift=='day_shift'?'Day Shift':'Night Shift'  }</span><br/>
                            </Grid>
                      </Grid>
                     
                      <InvoiceBody purchaseData={purchase} />

                      <Grid container>
                      <Grid xs={6} sm={6} style={{marginTop: '25px'}}>
                                  <table>
                                        
                                  </table>
                                  <p>Production Note : { purchase.production_note }</p>
                            </Grid>
                            <Grid xs={6} sm={6} >
                                      <table style={{width:'100%'}}>
                                        <tr>
                                          <td>Material Cost : </td>
                                          <td style={{textAlign:"right"}}> {format(parseFloat(purchase.material_cost).toFixed(2))} </td>
                                        </tr>
                                        <tr>
                                          <td>Labour Cost :</td>
                                          <td style={{textAlign:"right"}}> {format(parseFloat(purchase.labour_cost).toFixed(2))} </td>
                                        </tr>
                                        <tr>
                                          <td>Others Cost :</td>
                                          <td style={{textAlign:"right"}}> {format(parseFloat(purchase.others_cost).toFixed(2))} </td>
                                        </tr>
                                      
                                        <tr>
                                        <td style={{background: '#ccc',textAlign:"right",width:'100%'}}></td>
                                          <td style={{background: '#ccc',textAlign:"right",width:'100%'}}></td>
                                        </tr>
                                        <tr>
                                          <td>Total Cost : </td> 
                                          <td style={{textAlign:"right"}}> {format(parseFloat(purchase.total_cost).toFixed(2))} </td>
                                        </tr>
                                       
                                       
                                  </table>
                            </Grid>

                            <Grid xs={12} sm={12}>
                                  <p>In Word : {this.convertNumberToWords(purchase.total_cost)} </p>
                                  <p>Material Used Note : { purchase.material_used_note } </p>
                            </Grid>

                      </Grid>
            </>
          ):''
        }
      </div>
    )
  }
}





class ComponentToPrint extends React.Component {

   
  constructor(props) {
    super(props);  
     }
  state = {
    authInfo:this.props.authInfo,
    purchaseId:this.props.purchaseId
  }


  render() {
      let institution =   this.props.institution;
    let a4css = `
    .a4 {
      font-size: 14px;
      
  }
  .a4 body, table{
      font-size: 14px;
  }
    `

    let hafa4css = `
    .hafa4 { 
      width:500px !important;
  }
  .hafa4 body, table{
      font-size: 14px;
  }
    `

    let poscss = `
    .pos body{
      font-size: 10px;
  }
  .pos body, table{
      font-size: 10px;
  }
    `


   
    return (
      <div className='print-source' ref={this.props.ref}>
           {/* Print  DOCUMENT */}

                 {/* {   A4 Print */
                    institution != null &&  institution.pro_print_type == 'a4'?(
                      <html lang="en">
                    <head>
                       <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                        <title>Purchase Invoice</title>
                        <style >
                           {a4css}
                        </style>
                    </head>
                    <body className="a4" style={{padding:'5px'}}>
                   <div className="invoice-head">
                       <div className="invoice-logo">
                            <image alt={institution.pro_name} src={`${API_URL}/${institution.pro_logo}`} style={{width:'100px',height:'100px'}} />
                       </div>
                       <div className="invoice-desc">
                            <h2 style={{textAlign:'center'}}>{institution.pro_name}</h2>
                            <p style={{textAlign:'center'}}>{institution.pro_desc}</p>
                       </div>
                   </div>
                     

                    <PrintAbleSection   authInfo={this.state.authInfo} purchaseId={this.props.purchaseId} />
                      <div style={{position:'fixed',bottom:'0px',width:'100%',padding:'5px'}}>
                      <div className="invoice-footer" >
                                <p style={{float:'left',borderTop:'1px solid #222',width:'150px',textAlign:'center'}}>Incharge  </p>
                           
                                 <p style={{float:'right',marginRight:'10px',borderTop:'1px solid #222',width:'150px',textAlign:'center'}}>Authorized By</p>
                      </div>
                      <div className="invoice-footer-bottom" >
                            <p style={{float:'left'}}>
                                Print Date & Time :  {moment(currentDateTime).format(dateTimeFormat)} 
                           </p>
                           <p style={{float:'right',marginRight:'10px'}}>
                                Developed By : Soft Task - Contact No = 01749-508007
                           </p>
                      </div>
                      </div>
                    </body>
                    </html>
                     ):''
                 }
                    


                  {/* {  1/2 - A4   Print */
                    institution != null &&  institution.pro_print_type == '1/2a4'?(
                      <html lang="en">
                    <head>
                       <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                        <title>Purchase Invoice</title>
                        <style > 
                           {hafa4css}
                        </style>
                    </head>
                    <body className="hafa4" style={{padding:'5px'}}>
                   <div className="invoice-head" style={{width:'500px'}}>
                       <div className="invoice-logo" style={{width:'10%',float:'left'}}>
                            <image alt={institution.pro_name} src={`${API_URL}/${institution.pro_logo}`} style={{width:'100px',height:'100px'}} />
                       </div>
                       <div className="invoice-desc" style={{width:'80%',float:'right'}}>
                            <h2>{institution.pro_name}</h2>
                            <p>{institution.pro_desc}</p>
                       </div>
                   </div>
                     

                    <PrintAbleSection   authInfo={this.state.authInfo} purchaseId={this.props.purchaseId} />
                      <div style={{position:'fixed',bottom:'0px',width:'500px',padding:'5px'}}>
                      <div className="invoice-footer" >
                                <p style={{float:'left',borderTop:'1px solid #222',width:'150px',textAlign:'center'}}>Received By</p>
                           
                                 <p style={{float:'right',marginRight:'10px',borderTop:'1px solid #222',width:'150px',textAlign:'center'}}>Authorized By</p>
                      </div>
                      <div className="invoice-footer-bottom" style={{width:'500px'}} >
                            <p style={{float:'left'}}>
                                Print Date & Time :  {moment(currentDateTime).format(dateTimeFormat)} 
                           </p>
                           <p style={{float:'left',marginRight:'10px'}}>
                                Developed By : Soft Task - Contact No = 01749-508007
                           </p>
                      </div>
                      </div>
                    </body>
                    </html>
                     ):''
                 }


                  {/* {   A4 Print */
                    institution != null &&  institution.pro_print_type == 'pos'?(
                      <html lang="en">
                    <head>
                       <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                        <title>Purchase Invoice</title>
                        <style >
                           {poscss}
                        </style>
                    </head>

                    
                    <body className="pos" style={{padding:'5px'}}>
                   <div className="invoice-head">
                       <div className="invoice-logo">
                            <image alt={institution.pro_name} src={`${API_URL}/${institution.pro_logo}`} style={{width:'100px',height:'100px'}} />
                       </div>
                       <div className="invoice-desc">
                            <h2>{institution.pro_name}</h2>
                            <p>{institution.pro_desc}</p>
                       </div>
                   </div>
                     

                    <PrintAbleSection   authInfo={this.state.authInfo} purchaseId={this.props.purchaseId} />
                      <div style={{position:'fixed',bottom:'0px',width:'100%',padding:'5px'}}>
                      <div className="invoice-footer" >
                                <p style={{float:'left',borderTop:'1px solid #222',width:'150px',textAlign:'center'}}>Received By</p>
                           
                                 <p style={{float:'right',marginRight:'10px',borderTop:'1px solid #222',width:'150px',textAlign:'center'}}>Authorized By</p>
                      </div>
                      <div className="invoice-footer-bottom" >
                            <p style={{float:'left'}}>
                                Print Date & Time :  {moment(currentDateTime).format(dateTimeFormat)} 
                           </p>
                           <p style={{float:'right',marginRight:'10px'}}>
                                Developed By : Soft Task - Contact No = 01749-508007
                           </p>
                      </div>
                      </div>
                    </body>
                    </html>
                     ):''
                 }
                    
           
      </div>
    );
  }
}


const PurchaseInvoice = ({authInfo,purchaseId,institution})=>{
    
      let componentRef = useRef()
      return(
          <>
              <Grid container>
                    <Grid item xs={12} sm={8} className={"invoice-section"}>
                      {/* Main Grid Start */}
                      <ReactToPrint
                        trigger={() => <PrintIcon  style={{cursor:'pointer'}} />}
                        content={() => componentRef}
                      />

                      <ComponentToPrint ref={el => (componentRef = el)} authInfo={authInfo} purchaseId={purchaseId} institution={institution} />

                      <PrintAbleSection  authInfo={authInfo} purchaseId={purchaseId} institution={institution} />
                      {/* Main Grid End */}
                    </Grid>
              </Grid>
              

          </>
      )
}



  const mapStateToPops = (state)=>{
    return {
      authInfo:state.authInfoReducer
    }
}
export default connect(mapStateToPops,{})(PurchaseInvoice);