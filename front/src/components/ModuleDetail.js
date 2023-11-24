import React,{Fragment,useState,useEffect} from 'react';
import {connect} from 'react-redux';
import {currentRouteSet} from '../actions/actions';
import {pathSpliter} from '../lib/functions';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import cyan from '@material-ui/core/colors/cyan';
import StyleIcon from '@material-ui/icons/Style';
import NoteIcon from '@material-ui/icons/Note';
import {accessChecker} from '../lib/functions';

const color = cyan[500];

const useStyles = makeStyles((theme) => ({
      box:{
        color: 'white',
        height: '130px',
        textAlign: 'center',
        borderRadius: '5px',
        textDecoration: 'none',
        background: color,
        margin: '10px',
        marginTop: '0px'
      },
      salesBox:{
        backgroundColor:'#5F8407'
      },
      purchaseBox:{
        backgroundColor:'#5a652c'
      },
      productionBox:{
        backgroundColor:'#00899a'
      },
      serviceBox:{
        backgroundColor:'#50A510'
      },
      stockBox:{
        backgroundColor:'#247b3c'
      },
      accountsBox:{
        backgroundColor:'#0F7E77'
      },
      reportsBox:{
        backgroundColor:'#00616d'
      },
      hrPayrollBox:{
        backgroundColor:'#009C8B'
      },
      administrationBox:{
        backgroundColor:'#00691D'
      },
      boxTitle:{
        color: '#484848'
      },
      '@global': {
        '.MuiBox-root':{
          paddingBottom:'0px !important',
          paddingTop: '20px'
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

const ModuleDetail = ({location,currentRoute,currentRouteSet,authInfo})=>{
    const classes = useStyles()
    useEffect(()=>{
        currentRouteSet(pathSpliter(location.pathname,1))
    },[])
    return(<Fragment>



        {
            currentRoute=='administration'?(
    <Grid container spacing={1}>

{
        accessChecker('product_manage') > -1?(
          <Grid item xs={12} sm={2} className={[classes.box,classes.administrationBox]}>
          <Link to="/administration/products-manage" >
              <Box   p={4} >
                  <PlaylistAddIcon style={{textAlign:'center'}} /><br/> 
                  <p className={classes.boxTitle}>Products Manage</p>

              </Box> 
            </Link>
          </Grid>

            ):''
   }


{
        accessChecker('material_entry') > -1?(
          <Grid item xs={12} sm={2} className={[classes.box,classes.administrationBox]}>
          <Link to="/administration/material-entry" >
              <Box   p={4} >
                  <PlaylistAddIcon style={{textAlign:'center'}} /><br/> 
                  <p className={classes.boxTitle}>Material Manage</p>

              </Box> 
            </Link>
          </Grid>

            ):''
   }

{
        accessChecker('product_name_entry') > -1?(
<Grid item xs={12} sm={2} className={[classes.box,classes.administrationBox]}>
    <Link to="/administration/prod-names-manage" >
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p className={classes.boxTitle}>Product Name Entry</p>

        </Box>
      </Link>
    </Grid>

            ):''
   }

{
        accessChecker('material_name') > -1?(
<Grid item xs={12} sm={2} className={[classes.box,classes.administrationBox]}>
    <Link to="/administration/material-name-entry" >
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p className={classes.boxTitle}>Material Name Entry</p>

        </Box>
      </Link>
    </Grid>

            ):''
   }

{
        accessChecker('product_category') > -1?(
<Grid item xs={12} sm={2} className={[classes.box,classes.administrationBox]} >
    <Link to="/administration/prod-category-manage" >
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p className={classes.boxTitle}>Product Categories Manage </p>

        </Box>
      </Link>
    </Grid>

            ):''
   }
 
    
    {/* <Grid item xs={12} sm={2} className={classes.box} >
    <Link to="/administration/prod-brands-manage" >
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            
        </Box>
        <p className={classes.boxTitle}>Product Brands Manage </p>
      </Link>
    </Grid> */}


    {/* <Grid item xs={12} sm={2} className={classes.box} >
    <Link to="/administration/prod-colors-manage" >
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            
        </Box>
        <p className={classes.boxTitle}>Product Colors Manage </p>
      </Link>
    </Grid> */}


{
        accessChecker('product_unit') > -1?(

<Grid item xs={12} sm={2} className={[classes.box,classes.administrationBox]} >
    <Link to="/administration/prod-units-manage" >
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p className={classes.boxTitle}>Product Units Manage </p>

        </Box>
      </Link>
    </Grid>
            ):''
   }
    
   
    {
        accessChecker('area_manage') > -1?(

<Grid item xs={12} sm={2} className={[classes.box,classes.administrationBox]} >
    <Link to="/administration/areas-manage" >
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p className={classes.boxTitle}>Areas Manage</p>

        </Box>
      </Link>
    </Grid>
            ):''
   }
    
  
  
    
  
    {
        accessChecker('user_manage') > -1 || authInfo.role =='super_admin' ?( 
          <Grid item xs={12} sm={2} className={[classes.box,classes.administrationBox]}>
          <Link to="/administration/users-manage" >
          <Box   p={4} >
              <PeopleAltIcon style={{textAlign:'center'}} /><br/>
              <p className={classes.boxTitle}>Users Manage</p>

          </Box>
        </Link>
      </Grid>

            ):''
   }
   

   {
        accessChecker('branch_manage') > -1?(
          <Grid item xs={12} sm={2} className={[classes.box,classes.administrationBox]} >
          <Link to="/administration/branches-manage" >
              <Box   p={4} >
                  <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
                  <p className={classes.boxTitle}> Branches Manage </p>

              </Box>
            </Link>
          </Grid>

            ):''
   }


{
        accessChecker('company_profile') > -1?(
<Grid item xs={12} sm={2} className={[classes.box,classes.administrationBox]} >
    <Link to="/administration/institution-profile" >
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p className={classes.boxTitle}>Company Profile</p>

        </Box>
      </Link>
    </Grid>

            ):''
   }
   
    {/* <Grid item xs={12} sm={2} className={classes.box} >
    <Link to="/administration/warehouses-manage" >
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            
        </Box>
        <p className={classes.boxTitle}> Warehouses Manage </p>
      </Link>
    </Grid> */}


  </Grid>
            ):''
        }
   {
   currentRoute=='accounts'?(
                <Grid container spacing={1}>


{
        accessChecker('customer_transaction_m') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
    <Link to="/accounts/customer-payments-manage">
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Customer Transaction Entry</p>
        </Box>
      </Link>
    </Grid>

            ):''
   }


{
        accessChecker('supplier_payment') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
          <Link to="/accounts/supplier-payments-manage">
              <Box   p={4} >
                  <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Supplier Transaction Entry</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }





{
        accessChecker('bank_transaction') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
    <Link to="/accounts/bank-transactions-manage">
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Bank Transaction Entry</p>
        </Box>
      </Link>
    </Grid>

            ):''
   }
    
    {
        accessChecker('cash_transaction') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
        <Link to="/accounts/cash-transactions-manage" >
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
           <p  className={classes.boxTitle}> Others Transaction Entry</p>
        </Box>
      </Link>
    </Grid>

            ):''
   }


{
        accessChecker('transaction_accounts') > -1?(

          <Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
          <Link to="/accounts/transaction-accounts-manage">
              <Box   p={4} >
                  <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Others Transaction Accounts Entry</p>
              </Box>
            </Link>
          </Grid>
            ):''
   }

{
        accessChecker('cash_transaction_d_w') > -1?(

          <Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
          <Link to="/accounts/cash-deposit-withdraw">
              <Box   p={4} >
                  <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Cash Transaction  Entry</p>
              </Box>
            </Link>
          </Grid>
            ):''
   }

{
        accessChecker('bank_accounts') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
    <Link to="/accounts/bank-accounts-manage">
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Bank  Accounts Entry</p>
        </Box>
      </Link>
    </Grid>

            ):''
   }


{
        accessChecker('customer_transaction_invoice') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
        <Link to="/accounts/customer-transactions" >
        <Box   p={4} >
            <NoteIcon style={{textAlign:'center'}} /><br/>
           <p  className={classes.boxTitle}> Customer Transaction Invoice</p>
        </Box>
      </Link>
    </Grid>

            ):''
   }


  





   
  




{
        accessChecker('cash_transaction_report_m') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
    <Link to="/accounts/cash-transaction-report">
        <Box   p={4} >
            <NoteIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Others  Transaction Report</p>
        </Box>
      </Link>
    </Grid>

            ):''
   }


 {
        accessChecker('r_customer_transaction') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
    <Link to="/accounts/customer-transation-history">
        <Box   p={4} >
            <NoteIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Customer  Transaction Report</p>
        </Box>
      </Link>
    </Grid>

             ):''
   } 

{
        accessChecker('r_supplier_transaction') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
    <Link to="/accounts/supplier-transation-history">
        <Box   p={4} >
            <NoteIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Supplier  Transaction Report</p>
        </Box>
      </Link>
    </Grid>

             ):''
   } 


{
        accessChecker('bank_transaction_report_m') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
    <Link to="/accounts/bank-transaction-report">
        <Box   p={4} >
            <NoteIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Bank  Transaction Report</p>
        </Box>
      </Link>
    </Grid>

            ):''
   }


{
        accessChecker('bank_accounts') > -1?( 
<Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
    <Link to="/accounts/bank-ledger">
        <Box   p={4} >
            <NoteIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Bank  Account Ledger</p>
        </Box>
      </Link>
    </Grid>

           ):''
    } 



{
        accessChecker('cash_ledger') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
    <Link to="/accounts/cash-ledger">
        <Box   p={4} >
            <NoteIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Cash Ledger</p>
        </Box>
      </Link>
    </Grid>

            ):''
   }





{
        accessChecker('daily_ledger') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.accountsBox]}>
    <Link to="/accounts/daily-ledger">
        <Box   p={4} >
            <NoteIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Daily Ledger</p>
        </Box>
      </Link>
    </Grid>

            ):''
   }

    
  </Grid>
            ):''
        }

        {
          currentRoute=='purchase'?(
            <Fragment>
                    <Grid container spacing={1}>
                    {
        accessChecker('purchase_entry') > -1?(
          <Grid item xs={12} sm={2}   className={[classes.box,classes.purchaseBox]}>
          <Link to="/purchase/purchase-entry" >
          <Box   p={4} >
              <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}> Purchase Entry</p>
          </Box>
        </Link>
      </Grid>

            ):''
   }




{
        accessChecker('supplier_entry') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.purchaseBox]}>
                <Link to="/purchase/suppliers-manage">
                    <Box   p={4} >
                        <PeopleAltIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}>Supplier Entry</p>
                    </Box>
                  </Link>
                </Grid>

            ):''
   }

{
        accessChecker('purchase_return') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.purchaseBox]}>
                <Link to="/purchase/purchase-return">
                    <Box   p={4} >
                        <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}>Purchase Return Entry</p>
                    </Box>
                  </Link>
                </Grid>

            ):''
   }

{
        accessChecker('purchase_record') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.purchaseBox]}>
          <Link to="/purchase/purchase-record">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Purchase Record</p>
              </Box>
            </Link>
          </Grid>
            ):''
   }
               
               {
        accessChecker('purchase_invoice') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.purchaseBox]}>
                <Link to="/purchase/purchase-invoice">
                    <Box   p={4} >
                        <NoteIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}>Product Purchase Invoice</p>
                    </Box>
                  </Link>
                </Grid>

            ):''
   }





{
        accessChecker('purchase_return_list') > -1?(
          <Grid item xs={12} sm={2} className={[classes.box,classes.purchaseBox]}>
          <Link to="/purchase/purchase-return-list">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Purchase Return List</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
                
                {
        accessChecker('supplier_due_list') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.purchaseBox]}>
                <Link to="/purchase/supplier-due-list">
                    <Box   p={4} >
                        <NoteIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}>Supplier Due Report</p>
                    </Box>
                  </Link>
                </Grid>

            ):''
   }

{
        accessChecker('supplier_list') > -1?(

<Grid item xs={12} sm={2}  className={[classes.box,classes.purchaseBox]}>
                <Link to="/purchase/supplier-list">
                    <Box   p={4} >
                        <NoteIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}>Supplier  List</p>
                    </Box>
                  </Link>
                </Grid>
            ):''
   }

{
        accessChecker('supplier_ledger') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.purchaseBox]}>
                <Link to="/purchase/supplier-ledger">
                    <Box   p={4} >
                        <NoteIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}>Supplier Ledger</p>
                    </Box>
                  </Link>
                </Grid>

            ):''
   }
                
                {
        accessChecker('supplier_transaction') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.purchaseBox]}>
          <Link to="/purchase/supplier-transaction-history">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Supplier Transaction History</p>
              </Box>
            </Link>
          </Grid>
 
            ):''
   }
                
               

              </Grid>
            </Fragment>
          ):''
        }

        {
          currentRoute == 'production'?(
            <Grid container spacing={1}>
                {
        accessChecker('production_entry') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.productionBox]}>
          <Link to="/production/production-entry" >
          <Box   p={4} >
              <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}> Production Entry</p>
          </Box>
        </Link>
    </Grid>

            ):''
   }
     {
        accessChecker('material_purchase') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.productionBox]}>
                      <Link to="/production/material-purchase-entry" >
                      <Box   p={4} >
                          <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}> Material Purchase Entry</p>
                      </Box>
                    </Link>
                </Grid>

            ):''
   }

{
        accessChecker('supplier_entry') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.productionBox]}>
          <Link to="/production/suppliers-manage" >
          <Box   p={4} >
              <PeopleAltIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}> Supplier  Entry</p>
          </Box>
        </Link>
    </Grid>
            ):''
   }
                  
                
                  {
        accessChecker('material_entry') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.productionBox]}>
          <Link to="/production/material-entry" >
          <Box   p={4} >
              <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}> Material  Entry</p>
          </Box>
        </Link>
    </Grid>
            ):''
   }


{
        accessChecker('material_damage_entry') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.productionBox]}>
                      <Link to="/production/material-damage-entry" >
                      <Box   p={4} >
                          <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}> Material   Damage Entry</p>
                      </Box>
                    </Link>
                </Grid>

            ):''
   }
              
              {
        accessChecker('material_names') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.productionBox]}>
          <Link to="/production/material-name-entry" >
          <Box   p={4} >
              <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}> Material  Names Manage</p>
          </Box>
        </Link>
    </Grid>

            ):''
   }
               
         

{
        accessChecker('production_invoice') > -1?(
          <Grid item xs={12} sm={2} className={[classes.box,classes.productionBox]}>
          <Link to="/production/production-invoice" >
          <Box   p={4} >
              <NoteIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}> Production Invoice</p>
          </Box>
        </Link>
    </Grid>

            ):''
   }

               
{
        accessChecker('material_purchase_invoice') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.productionBox]}>
          <Link to="/production/material-purchase-invoice" >
          <Box   p={4} >
              <NoteIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}> Material Purchase Invoice</p>
          </Box>
        </Link>
    </Grid>

            ):''
   }
               
               {
        accessChecker('production_record') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.productionBox]}>
          <Link to="/production/production-record" >
          <Box   p={4} >
              <NoteIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}> Production Record</p>
          </Box>
        </Link>
    </Grid>

            ):''
   }
                {
        accessChecker('material_purchase_record') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.productionBox]}>
          <Link to="/production/material-purchase-record" >
          <Box   p={4} >
              <NoteIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}> Material Purchase Record</p>
          </Box>
        </Link>
    </Grid>

            ):''
   }

{
        accessChecker('material_damage_list') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.productionBox]}>
                      <Link to="/production/material-damage-list" >
                      <Box   p={4} >
                          <NoteIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}> Material Damage List</p>
                      </Box>
                    </Link>
                </Grid>

            ):''
   }

{
        accessChecker('material_list') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.productionBox]}>
                      <Link to="/production/material-list" >
                      <Box   p={4} >
                          <NoteIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}> Material  List</p>
                      </Box>
                    </Link>
                </Grid>

            ):''
   }

{
        accessChecker('material_stock') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.productionBox]}>
                      <Link to="/production/material-stock" >
                      <Box   p={4} >
                          <NoteIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}> Material  Stock</p>
                      </Box>
                    </Link>
                </Grid>

            ):''
   }          


{
        accessChecker('material_ledger') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.productionBox]}>
                      <Link to="/production/material-ledger" >
                      <Box   p={4} >
                          <NoteIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}> Material  Ledger</p>
                      </Box>
                    </Link>
                </Grid>

            ):''
   }

            </Grid>
          ):''
        }

        {
          currentRoute=='service' ?(
            <>
              <Grid container spacing={1}>

              {
        accessChecker('service_entry') > -1?(

                <Grid item xs={12} sm={2}  className={[classes.box,classes.serviceBox]}>
                      <Link to="/service/service-entry" >
                      <Box   p={4} >
                          <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}>Service Entry</p>
                      </Box>
                    </Link>
                </Grid>

):''
}
{
        accessChecker('service_expense_entry') > -1?(
                <Grid item xs={12} sm={2}  className={[classes.box,classes.serviceBox]}>
                      <Link to="/service/service-purchase-entry" >
                      <Box   p={4} >
                          <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}>Service Expense Entry</p>
                      </Box>
                    </Link>
                </Grid>

):''
}
{
        accessChecker('service_record') > -1?(
                <Grid item xs={12} sm={2}  className={[classes.box,classes.serviceBox]}>
                      <Link to="/service/service-record" >
                      <Box   p={4} >
                          <NoteIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}>Service Record</p>
                      </Box>
                    </Link>
                </Grid>
                ):''
}

{
        accessChecker('service_expense_record') > -1?(
                <Grid item xs={12} sm={2}  className={[classes.box,classes.serviceBox]}>
                      <Link to="/service/service-expense-record" >
                      <Box   p={4} >
                          <NoteIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}>Service Expense Record</p>
                      </Box>
                    </Link>
                </Grid>

):''
}


{
        accessChecker('service_invoice') > -1?(
                <Grid item xs={12} sm={2}  className={[classes.box,classes.serviceBox]}>
                      <Link to="/service/service-invoice" >
                      <Box   p={4} >
                          <NoteIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}>Service Invoices</p>
                      </Box>
                    </Link>
                </Grid>

):''
}


{
        accessChecker('service_expense_invoice') > -1?(
                <Grid item xs={12} sm={2}  className={[classes.box,classes.serviceBox]}>
                      <Link to="/service/service-item-invoice" >
                      <Box   p={4} >
                          <NoteIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}>Service Expense Invoices</p>
                      </Box>
                    </Link>
                </Grid>
):''
}
{
        accessChecker('service_report') > -1?(
                <Grid item xs={12} sm={2}  className={[classes.box,classes.serviceBox]}>
                      <Link to="/service/services-report" >
                      <Box   p={4} >
                          <NoteIcon style={{textAlign:'center'}} /><br/>
                        <p  className={classes.boxTitle}>Service Report</p>
                      </Box>
                    </Link>
                </Grid>

):''
}
                </Grid>
            </>
          ):''
        }
        {/* Sales's Modules */}
        { 
   currentRoute=='sales'?(
                <Grid container spacing={1}>
 
                  
    {
        accessChecker('sales_entry') > -1?(

          <Grid item xs={12} sm={2}  className={[classes.box,classes.salesBox]}>
          <Link to="/sales/sales-entry" >
          <Box   p={4} >
              <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
             <p  className={classes.boxTitle}> Sales Entry</p>
          </Box>
        </Link>
      </Grid>
            ):''
   }



   

   {
        accessChecker('customer_entry') > -1?(

          <Grid item xs={12} sm={2}  className={[classes.box,classes.salesBox]}>
          <Link to="/sales/customers-manage" >
          <Box   p={4} >
              <PeopleAltIcon style={{textAlign:'center'}} /><br/>
             <p  className={classes.boxTitle}> Customer Entry</p>
          </Box>
        </Link>
      </Grid>
            ):''
   }

{
        accessChecker('sales_return') > -1?(

          <Grid item xs={12} sm={2}  className={[classes.box,classes.salesBox]}>
          <Link to="/sales/sales-return">
              <Box   p={4} >
                  <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Sales Return Entry</p>
              </Box>
            </Link>
          </Grid>
            ):''
   }

{
        accessChecker('quotation_entry') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.salesBox]}>

          <Link to="/sales/quotation-entry">
              <Box   p={4} >
                  <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Quotation Entry</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }



{
        accessChecker('sales_record') > -1?(

          <Grid item xs={12} sm={2} className={[classes.box,classes.salesBox]}>
          <Link to="/sales/sales-record">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Sales Record</p>
              </Box>
            </Link>
          </Grid>
            ):''
   }


     {
        accessChecker('sales_return_record') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.salesBox]}>
          <Link to="/sales/sales-return-list">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Sales Return Record</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
    
    {
        accessChecker('sales_invoice') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.salesBox]}>
          <Link to="/sales/sales-invoice">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Sales Invoice</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
   
 
   
   {
        accessChecker('customer_ledger') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.salesBox]}>
          <Link to="/sales/customer-ledger">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Customer Ledger</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
    

   
   

   {
        accessChecker('customer_list') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.salesBox]}>
          <Link to="/sales/customer-list">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Customer  List</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
   
   {
        accessChecker('customer_due_list') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.salesBox]}>
          <Link to="/sales/customer-due-list">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Customer Due Report</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }

{
        accessChecker('customer_transaction') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.salesBox]}>

          <Link to="/sales/customer-transation-history">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Customer Transaction History</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
    
  

{
        accessChecker('quotation_record') > -1?(
          <Grid item xs={12} sm={2} className={[classes.box,classes.salesBox]}>

          <Link to="/sales/quotation-record">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Quotation Record</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }


{
        accessChecker('quotation_invoice') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.salesBox]}>

          <Link to="/sales/quotation-invoice">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Quotation Invoice</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
  </Grid>
            ):''
        }

        {
          currentRoute=='stock'?(
            <Grid container spacing={1}>


{
        accessChecker('product_transfer') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
          <Link to="/stock/product-transfer" >
          <Box   p={4} >
              <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Product Transfer Entry</p>
          </Box>
        </Link>
      </Grid>

            ):''
   }

           
{
        accessChecker('product_damage') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
          <Link to="/stock/product-damage" >
          <Box   p={4} >
              <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Product  Damage Entry</p>
          </Box>
        </Link>
      </Grid>

            ):''
   }

{
        accessChecker('material_damage') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
          <Link to="/stock/material-damage" >
          <Box   p={4} >
              <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Material  Damage Entry</p>
          </Box>
        </Link>
      </Grid>

            ):''
   }

               {
        accessChecker('product_stock') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
                <Link to="/stock/product-stock-report" >
                <Box   p={4} >
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Product Stock</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }
           {
        accessChecker('material_stock_m') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
                <Link to="/stock/material-stock" >
                <Box   p={4} >
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Material Stock</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }
       
       {
        accessChecker('product_ledger') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
                <Link to="/stock/product-ledger" >
                <Box   p={4} >
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Product Ledger </p>
                </Box>
              </Link>
            </Grid>

            ):''
   }    
             {
        accessChecker('material_ledger') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
                <Link to="/stock/material-ledger" >
                <Box   p={4} >
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Material Ledger </p>
                </Box>
              </Link>
            </Grid>

            ):''
   }    

     
          {
        accessChecker('product_transfer_list') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
          <Link to="/stock/transfer-record" >
          <Box   p={4} >
              <NoteIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Product Transfer Record</p>
          </Box>
        </Link>
      </Grid>

            ):''
   }
           
           {
        accessChecker('product_receive_list') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
                <Link to="/stock/receive-record" >
                <Box   p={4} >
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Product Receive Record</p>
                </Box>
              </Link>
            </Grid>


            ):''
   }
            
            
            {
        accessChecker('product_damage_list') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
                <Link to="/stock/product-damage-list" >
                <Box   p={4} >
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Product  Damage Record</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }


      
{
        accessChecker('material_damage_list') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
                <Link to="/stock/material-damage-list" >
                <Box   p={4} >
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Material  Damage Record</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }
            
            {
        accessChecker('product_list') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
                <Link to="/stock/product-list" >
                <Box   p={4} >
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Product Price List </p>
                </Box>
              </Link>
            </Grid>

            ):''
   }
    


    {
        accessChecker('product_re_order_list') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
                <Link to="/stock/product-re-order-list" >
                <Box   p={4} >
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Product Re-Order List</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }  


{
        accessChecker('material_re_order_list') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.stockBox]}>
                <Link to="/stock/material-re-order-list" >
                <Box   p={4} >
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Material Re-Order List </p>
                </Box>
              </Link>
            </Grid>

            ):''
   }  




    </Grid>
          ):''
        }

{  
          currentRoute=='reports'?(
            <Fragment>
              <Grid container spacing={1}>
              {
        accessChecker('r_cash_bank_balance') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/cash_bank_balance">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Cash Bank Balance</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }




           
           {
        accessChecker('r_profit_loss') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/profit-loss">
                <Box   p={4} >
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Profit & Loss</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }

{
        accessChecker('r_product_stock') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/product-stock-report">
                <Box   p={4} > 
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Product Stock Report</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }           
            
{
        accessChecker('r_material_stock') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/material-stock">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Material Stock Report</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
 



 {
        accessChecker('daily_ledger') > -1?( 
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/daily-ledger">
                <Box   p={4} > 
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Daily Ledger</p>
                </Box>
              </Link>
            </Grid>

            ):''
   } 





 {
        accessChecker('cash_ledger') > -1?( 
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/cash-ledger">
                <Box   p={4} > 
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Cash Ledger</p>
                </Box>
              </Link>
            </Grid>

            ):''
   } 








 {
        accessChecker('bank_account_ledger') > -1?( 
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/bank-ledger">
                <Box   p={4} > 
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Bank Account Ledger</p>
                </Box>
              </Link>
            </Grid>

            ):''
   } 



{
        accessChecker('r_customer_ledger') > -1?(

          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/customer-ledger">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Customer Ledger</p>
              </Box>
            </Link>
          </Grid>
            ):''
   }

           
{
        accessChecker('r_supplier_ledger') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/supplier-ledger">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Supplier Ledger</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }

{
        accessChecker('r_material_ledger') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/material-ledger">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Material Ledger</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }


{
        accessChecker('r_product_ledger') > -1?(

          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/product-ledger">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Product Ledger</p>
              </Box>
            </Link>
          </Grid>
            ):''
   }

{
        accessChecker('r_supplier_due_list') > -1?(

          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/supplier-due-list">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Supplier Due Report</p>
              </Box>
            </Link>
          </Grid>
            ):''
   }

{
        accessChecker('r_customer_due_list') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/customer-due-list">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Customer Due Report</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }

{
        accessChecker('r_cash_statement') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/cash_statement">
              <Box   p={4} >
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Cash Statement</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
           
{
        accessChecker('r_sales_invoice') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/sales-invoice">
                <Box   p={4} > 
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Sales Invoice</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }

{
        accessChecker('customer_transaction_invoice') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/customer-transactions">
                <Box   p={4} > 
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Customer Transaction Invoice</p>
                </Box>
              </Link>
            </Grid>
            ):''
   }

             {
        accessChecker('r_quotation_invoice') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/quotation-invoice">
                <Box   p={4} > 
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Quotation Invoice</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }

            
{
        accessChecker('r_purchase_invoice') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/purchase-invoice">
                <Box   p={4} > 
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Product Purchase Invoice</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }

          
{
        accessChecker('r_production_invoice') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/production-invoice">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Production Invoice</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
            

            {
        accessChecker('r_material_purchase_invoice') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/material-purchase-invoice">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Material Purchase Invoice</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }

{
        accessChecker('r_customer_transaction') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/customer-transation-history">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Customer Transaction History</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }

{
        accessChecker('r_supplier_transaction') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/supplier-transaction-history">
                <Box   p={4} > 
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Supplier Transaction History</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }

            
{
        accessChecker('r_cash_transaction') > -1?(

          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/cash-transaction-report">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Cash Transaction Report</p>
              </Box>
            </Link>
          </Grid>
            ):''
   }



           
{
        accessChecker('r_bank_transaction') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/bank-transaction-report">
                <Box   p={4} > 
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Bank Transaction Report</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }


            
            {
        accessChecker('r_salary_payment') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/salary-payment-report">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Salary Payment Report</p>
              </Box>
            </Link>
          </Grid>


            ):''
   }
            
            {
        accessChecker('r_sales_record') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/sales-record">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Sales Record</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
           
           {
        accessChecker('r_quotation_record') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/quotation-record">
                <Box   p={4} > 
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Quotation Record</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }
            
            {
        accessChecker('r_purchase_record') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/purchase-record">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Product Purchase Record</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }

{
        accessChecker('r_production_record') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/production-record">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Production Record</p>
              </Box>
            </Link>
          </Grid>


            ):''
   }

{
        accessChecker('r_material_pur_record') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/material-purchase-record">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Material Purchase Record</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
           
           {
        accessChecker('r_prod_transfer_record') > -1?(

          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/transfer-record">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Product Transfer Record</p>
              </Box>
            </Link>
          </Grid>
            ):''
   }
          
          {
        accessChecker('r_prod_receive_record') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/receive-record">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Product Receive Record</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
           
           {
        accessChecker('r_sales_return_list') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/sales-return-list">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Sales Return Record</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
          
          {
        accessChecker('r_purchase_return_list') > -1?(

          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/purchase-return-list">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Purchase Return List</p>
              </Box>
            </Link>
          </Grid>
            ):''
   }
           {
        accessChecker('r_customer_list') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/customer-list">
                <Box   p={4} > 
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Customer List</p>
                </Box>
              </Link>
            </Grid>


            ):''
   }
 {
        accessChecker('r_supplier_list') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/supplier-list">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Supplier List</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
            
            {
        accessChecker('r_material_damage_list') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
            <Link to="/reports/material-damage-list">
                <Box   p={4} > 
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                    <p  className={classes.boxTitle}>Material Damage List</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }

            
{
        accessChecker('r_material_list') > -1?(
          <Grid item xs={12} sm={2} className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/material-list">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Material List</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
            {
        accessChecker('r_product_damage_list') > -1?(

          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/product-damage-list">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Product Damage List</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
 {
        accessChecker('r_product_list') > -1?(
 
          <Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
          <Link to="/reports/product-list">
              <Box   p={4} > 
                  <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Product List</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
          


          {
        accessChecker('product_re_order_list') > -1?(
<Grid item xs={12} sm={2} className={[classes.box,classes.reportsBox]}>
                <Link to="/reports/product-re-order-list" >
                <Box   p={4} >
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Product Re-Order List</p>
                </Box>
              </Link>
            </Grid>

            ):''
   }  


{
        accessChecker('material_re_order_list') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.reportsBox]}>
                <Link to="/reports/material-re-order-list" >
                <Box   p={4} >
                    <NoteIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Material Re-Order List </p>
                </Box>
              </Link>
            </Grid>

            ):''
   }  



    
  </Grid>
            </Fragment>
          ):''
        }

        {
          currentRoute=='hrpayroll'?(
            <Fragment>
              <Grid container spacing={1}>
          
    
    {
        accessChecker('salary') > -1?(

<Grid item xs={12} sm={2}  className={[classes.box,classes.hrPayrollBox]}>
    <Link to="/hrpayroll/salary-payment">
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Salary Payment Entry</p>
        </Box>
      </Link>
    </Grid>
            ):''
   }


    

    {
        accessChecker('employee_manage') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.hrPayrollBox]}>
          <Link to="/hrpayroll/employees-manage" >
          <Box   p={4} >
              <PeopleAltIcon style={{textAlign:'center'}} /><br/>
             <p  className={classes.boxTitle}>Employee Manage</p>
          </Box>
        </Link>
      </Grid>

            ):''
   }

{
        accessChecker('designation_manage') > -1?(
          <Grid item xs={12} sm={2}  className={[classes.box,classes.hrPayrollBox]}>
          <Link to="/hrpayroll/designations-manage">
              <Box   p={4} >
                  <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
                  <p  className={classes.boxTitle}>Designation Manage</p>
              </Box>
            </Link>
          </Grid>

            ):''
   }
   {
        accessChecker('department_manage') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.hrPayrollBox]}>
    <Link to="/hrpayroll/departments-manage">
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Department Manage</p>
        </Box>
      </Link>
    </Grid>

            ):''
   }
     {
        accessChecker('month_manage') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.hrPayrollBox]}>
    <Link to="/hrpayroll/months-manage">
        <Box   p={4} >
            <PlaylistAddIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Month Manage</p>
        </Box>
      </Link>
    </Grid>

            ):''
   }

{
        accessChecker('salary_report') > -1?(
<Grid item xs={12} sm={2}  className={[classes.box,classes.hrPayrollBox]}>
    <Link to="/hrpayroll/salary-payment-report">
        <Box   p={4} >
            <NoteIcon style={{textAlign:'center'}} /><br/>
            <p  className={classes.boxTitle}>Salary Payment Report</p>
        </Box>
      </Link>
    </Grid>

            ):''
   }
    
  </Grid>
            </Fragment>
          ):''
        }
  </Fragment>
    )
}
const mapStateToProps = (state)=>{
      return{
        currentRoute:state.currentRouteReducer,
        authInfo:state.authInfoReducer
      }
}
export default connect(mapStateToProps,{currentRouteSet})(ModuleDetail)