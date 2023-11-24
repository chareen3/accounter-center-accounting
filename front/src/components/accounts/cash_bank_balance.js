import React,{Fragment,useState,useEffect} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet} from '../../actions/actions';
import {pathSpliter} from '../../lib/functions';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import MoneyIcon from '@material-ui/icons/Money';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import axios from 'axios';
import {API_URL} from '../../config.json';

import _ from 'lodash';

import commaNumber from 'comma-number';
let format = commaNumber.bindWith(',', '.')
const useStyles = makeStyles((theme) => ({
      box:{
        color: 'white',
        height: '130px',
        textAlign: 'center',
        borderRadius: '5px',
        textDecoration: 'none',
        background: '#0F7E77',
        margin: '25px',
        marginTop: '0px'
      },
      boxTitle:{
        color:' #ffffff',
            fontSize: '25px',
            fontWeight: 'bold' ,
            padding:'0px',
            margin:'0px'
      },
      '@global': {
        
        '.MuiBox-root':{
          paddingBottom:'0px !important',
          paddingTop: '0px'
        },
        '.MuiBox-root p':{
          color:'white'
        },
        '.MuiBox-root svg':{
          color:'white',
          fontWidth:'bold'
        }
      }

}));
const CashBankBalance = ({location,currentRoute,currentRouteSet,authInfo})=>{
    const classes = useStyles()
    let [totalCashBalance,totalCashBalanceSet] = useState(0)
    let [cashHeads,cashHeadsSet] = useState(null)
    let [totalBankBalance,totalBankBalanceSet] = useState(0)
    let [banksBalance,banksBalanceSet] = useState([])
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1))
        getCashTransationSummary()
        getBankTransationSummary()
    },[])

    let getCashTransationSummary = async ()=>{
            await axios.post(`${API_URL}/api/get-cash-transaction-summary`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
                totalCashBalanceSet(res.data[0].cash_balance)
                cashHeadsSet(res.data[0])
            })
    }

    let getBankTransationSummary = async ()=>{
        await axios.post(`${API_URL}/api/get-bank-transaction-summary`,null,{headers:{'auth-token':authInfo.token}}).then(res=>{
            banksBalanceSet(res.data)
           let total =  res.data.reduce((prev,curr)=>{
                    return prev + curr.balance
            },0).toFixed(2);
            totalBankBalanceSet(total)
        })
}
    return(<Fragment>
    
    <Grid container spacing={1}>
    
    <Grid item xs={12} sm={3} className={classes.box} style={{marginLeft: '50px'}}>
            <MoneyIcon style={{textAlign:'center',fontSize:'40px'}} /><br/> 
        <p className={classes.boxTitle}>Cash Balance</p>
        <p className={classes.boxTitle}>TK  {format(parseFloat(totalCashBalance).toFixed(2))}</p>
    </Grid>
        
    <Grid item xs={12} sm={3} className={classes.box}>
            <AccountBalanceIcon style={{textAlign:'center',fontSize:'40px'}} /><br/> 
        <p className={classes.boxTitle}>Bank Balance</p>
        <p className={classes.boxTitle}>TK  {format(parseFloat(totalBankBalance).toFixed(2))}</p>
    </Grid>
    <Grid item xs={12} sm={4} className={classes.box} style={{float:'right'}}>
            <MoneyIcon style={{textAlign:'center',fontSize:'40px'}} /><br/>
            
        <p className={classes.boxTitle}>Total Balance</p>
        <p className={classes.boxTitle}>TK  {format(parseFloat(parseFloat(totalBankBalance)+parseFloat(totalCashBalance)).toFixed(2))}</p>
    </Grid>
    </Grid>
    <p style={{color:'#3e8d54',fontWeight:'bold',fontSize:'25px',margin:'0',padding:'0',marginTop:'1px',marginLeft: '48px'}}>Bank Balance  Summary</p>

    <Grid container style={{marginTop:'5px',marginLeft: '23px'}}>
        
        {
            banksBalance.length>0?(
              <>
                {
                    banksBalance.map((bank)=>(
                        <Grid item xs={12} sm={3} className={classes.box} style={{background:'linear-gradient(to left, rgb(0 113 106) 0%, rgb(30 78 44) 100%)'}}>
                        <AccountBalanceIcon style={{textAlign:'center',fontSize:'40px',marginTop:'14px'}} /><br/> 
                        <p style={{fontSize:'12px',color:'white',margin:'0',padding:'0'}}>{bank.bank_name} - {bank.bank_acc_name} - {bank.bank_acc_number}</p>
                        <p style={{fontSize:'17px',color:'white',margin:'0',padding:'0',fontWeight:'bold',marginTop:'14px'}}>TK  {format(parseFloat(bank.balance).toFixed(2))}</p>
                       </Grid>
                    ))
                }
              </>
            ):''
        }
    
    </Grid>
    
    <p style={{color:'#3e8d54',fontWeight:'bold',fontSize:'25px',margin:'0',padding:'0',marginTop:'1px',marginLeft: '48px'}}>Cash Credit  & Debit Balance Summary</p>
     
     <Grid container>
          <Grid item xs={12} sm={5} style={{background:'#0F7E77',padding:'10px',color:'white',fontWeight:'bold',borderRadius:'5px',    margin: '45px',marginTop:'1px'}}>
                <table>
                   <thead>
                       <tr>
                        <th style={{width:'100%',textAlign: 'center'}}>Credit  Transactions</th>
                        <th style={{width:'100%'}}></th>
                        </tr>
                        <tr>
                        <th style={{width:'100%',textAlign: 'left'}}>Transactions Head</th>
                        <th style={{width:'100%'}}>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Cash Deposit Amount : </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.cash_deposit_amount).toFixed(2)):0}</td>
                        </tr>


                        <tr>
                            <td >Sales Invoice Paid Total  </td>
                            <td >{cashHeads != null ? format(parseFloat(cashHeads.received_sale_amount).toFixed(2)) : 0}</td>
                        </tr>

                        <tr>
                            <td >Service Invoice Paid Total  </td>
                            <td >{cashHeads != null ? format(parseFloat(cashHeads.received_service_amount).toFixed(2)) : 0}</td>
                        </tr>
                        <tr>
                            <td>Total Receive  from Customer </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.received_customer_partial).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Total Receive from Cash Transaction </td>
                            <td>{cashHeads != null ? format(parseFloat(cashHeads.received_tran_amount).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Withdraw From Bank  </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.bank_withdraw_amount).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Receive from supplier </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.received_supplier_amount).toFixed(2)):0}</td>
                        </tr>

                       

                        </tbody>
                        <tfoot>
                            <th style={{width:'100%',textAlign: ''}}> Total Credit Amount :  </th>
                            <th style={{width:'100%',textAlign: 'right'}}> {cashHeads != null ?format(parseFloat(cashHeads.in_amount).toFixed(2)):0} </th>
                        </tfoot>
                    
                </table>
          </Grid>
         
          <Grid item xs={12} sm={5} style={{background:'#0F7E77',padding:'10px',color:'white',fontWeight:'bold',borderRadius:'5px',    margin: '45px',marginTop:'1px'}}>
          <table>
                    
                      <thead>
                     

                      <tr>
                        <th style={{width:'100%',textAlign: 'center'}}>Debit  Transactions</th>
                        <th style={{width:'100%'}}></th>
                        </tr>

                        <tr>
                        <th style={{width:'100%',textAlign: 'left'}}>Transactions Head</th>
                        <th style={{width:'100%'}}> Amount</th>
                        </tr>

                      
                     
                      </thead>
                        <tbody>

                        <tr>
                            <td>Cash Withdraw Amount : </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.cash_withdraw_amount).toFixed(2)):0}</td>
                        </tr>

                        <tr>
                            <td>Product Purchased Paid Amount </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.payment_purchase_amount).toFixed(2)):0}</td>
                        </tr>

                      

                        
                        <tr>
                            <td>Service Item Expense Amount </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.service_expense_amount).toFixed(2)):0}</td>
                        </tr>

                       

                        <tr>
                            <td>Material Purchased Paid Amount </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.material_purchase_amount).toFixed(2)):0}</td>
                        </tr>

                        <tr>
                            <td>Total payment  to Supplier </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.payment_supplier_amount).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Total payment from Cash Transaction </td>
                            <td>{cashHeads != null ? format(parseFloat(cashHeads.payment_tran_amount).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Deposit to Bank  </td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.bank_deposit_amount).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Payment To Customer</td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.payment_customer_partial).toFixed(2)):0}</td>
                        </tr>
                        <tr>
                            <td>Employee Salary Payment</td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.employe_salary_payment).toFixed(2)):0}</td>
                        </tr>

                        <tr>
                            <td>Sales Return</td>
                            <td>{cashHeads != null ?format(parseFloat(cashHeads.sale_return_amount).toFixed(2)):0}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                            <th style={{width:'100%',textAlign: ''}}> Total Debit Amount  : </th>
                            <th style={{width:'100%',textAlign: 'right'}}> {cashHeads != null ?format(parseFloat(cashHeads.out_amount).toFixed(2)):0} </th>
                        </tfoot>
                   
                </table>
          </Grid>
     </Grid>

     <Grid container>
          <Grid item xs={12} sm={12} style={{background: '#289D93',margin: '45px', marginTop: '0px',
    borderRadius: '5px',
    color: 'white'}}>
            <h2 style={{margin: '0',padding: '0',textAlign: 'center'}}>Total Cash  : {cashHeads != null ?format(parseFloat(cashHeads.cash_balance).toFixed(2)):0} </h2>
          </Grid>
     </Grid>
        
  </Fragment>
    )
}
const mapStateToProps = (state)=>{
      return{
        currentRoute:state.currentRouteReducer,
        authInfo:state.authInfoReducer
      }
}
export default connect(mapStateToProps,{currentRouteSet})(CashBankBalance)