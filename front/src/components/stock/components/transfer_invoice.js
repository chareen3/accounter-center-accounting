import React,{useState,useEffect,useRef} from 'react';
import {connect} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import {API_URL} from '../../../config.json';
import InvoiceBody from './invoice_body'
import {dateTimeFormat} from '../../../lib/functions'
import PrintIcon from '@material-ui/icons/Print';
import moment from 'moment';
import ReactToPrint from "react-to-print";

import './invoice.css'

class PrintAbleSection extends React.Component {
      
  constructor(props) {
    super(props);  
  }
  state = {
    transfer:this.props
  }
  componentDidMount() {
    this.getTransfer()
  }

  getTransfer = async()=>{
      await axios.post(`${API_URL}/api/get-product-transfers`,{transferId:this.props.transferId},{headers:{'auth-token':this.props.authInfo.token}}).then(res=>{
        this.setState({transfer:res.data.message[0]});
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
    let {transfer}  = this.state;
    // console.log(transfer)
    return(
      <div style={{padding:'10px'}}>
         <Grid container>
                            <Grid item xs={12} sm={12}>
                                 <h3 className={"invoice-title"}>Transfer Invoice</h3>
                            </Grid>
                      </Grid>
                      <Grid container style={{marginBottom: '12px',fontSize:'13px'}}>
                           <Grid item xs={6} sm={6}> 
                           <strong>Transfer Date & Time : </strong> <span>{ moment(transfer.transfer_c_isodt).format(dateTimeFormat) }</span><br/>
                           <strong>Transfer To Branch : </strong> <span>{ transfer.branch_name }</span><br/>
                           <strong>Transfer To Warehouse : </strong> <span>{ transfer.warehouse_name }</span><br/>
                           <strong>Transfer By : </strong> <span>{ transfer.employee_name }</span><br/>
                                

                            </Grid>
                            <Grid item xs={6} sm={6} style={{textAlign:'right'}}>  
                            <strong>Transfer Note : </strong> <span>{ transfer.transfer_note }</span><br/>
                            </Grid>
                      </Grid>
                     
                      <InvoiceBody transferData={transfer} />

                      <Grid container>
                            <Grid xs={6} sm={6}>
                                
                            </Grid> 
                           <Grid xs={6} sm={6} >
                                      <table style={{width:'100%'}}>
                                     
                                        <tr>
                                          <td>Total : </td>
                                          <td style={{textAlign:"right"}}> {parseFloat(transfer.transfer_amount).toFixed(2)} </td>
                                        </tr>
                                  </table>
                            </Grid>

                            {/* <Grid xs={12} sm={12}>
                                  <p>In Word : {this.convertNumberToWords(sale.sale_total_amount)} </p>
                                  <p>Note : </p>
                            </Grid> */}

                      </Grid>
      </div>
    )
  }
}

const TransferInvoice = ({authInfo,transferId})=>{
    
    const componentRef = useRef();
    

      return(
          <>
              <Grid container>
                    <Grid item xs={12} sm={8} className={"invoice-section"}>
                      {/* Main Grid Start */}
                      <Grid container>
                            <Grid item xs={12} sm={12}>
                              <ReactToPrint 
                                  style={{cursor:'pointer'}} 
                                  trigger={() =>  <PrintIcon  style={{cursor:'pointer'}} />}
                                  content={() => componentRef.current}
                              />   
                            </Grid>
                      </Grid>
                      <PrintAbleSection ref={componentRef}  authInfo={authInfo} transferId={transferId} />
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
export default connect(mapStateToPops,{})(TransferInvoice);