import React,{Suspense, useState, Fragment, useEffect} from 'react';
import {connect} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {BrowserRouter as Router,Route,Redirect} from 'react-router-dom'
import Header from './components/Header'
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import {Typography} from '@material-ui/core'
import  {APP_URL} from './config.json';

import {pathSpliter,authInfoSeter,accessChecker} from './lib/functions'
import {currentRouteSet,authInfoSet} from './actions/actions'; 
import CustomerTransactionHistory from './components/customer/customer_transaction-history';
import salesReturnList from './components/sales/sales_return_list'; 
import ProductList from './components/administration/product_list';
import SupplierTransactionHistory from './components/supplier/supplier_transaction_history';
import productLedger from './components/stock/product_ledger';
import MaterialNameEntry from './components/production/material_name_entry';
import MaterialEntry from './components/production/material_entry';

import Dashboard from './components/Dashboard';

import ModuleDetail from './components/ModuleDetail';
import UsersManage from './components/administration/UsersManage';
import ProductsManage from './components/administration/ProductsManage';
import SalesEntry from './components/sales/SalesEntry';
import SignIn from './components/signin';

import ProdCategoriesManage from './components/administration/prod_categories_manage';
import CustomersManage from './components/administration/customers_manage';
import CustomerLedger from './components/customer/customer_ledger';
import SupplierLedger from './components/supplier/supplier_ledger';

import ProdBrandsManage from './components/administration/prod_brands_manage';
import ProdColorsManage from './components/administration/prod_colors_manage';
import prodUnitsManage from './components/administration/prod_units_manage';
import BranchesManage from './components/administration/branches_manage';
import warehousesManage from './components/administration/warehouses_manage';
import AreasManage from './components/administration/areas_manage';
import ProdNameManage from './components/administration/prod_names_manage';
import SuppliersManage from './components/administration/suppliers_manage';
import DesignationsManage from './components/administration/designations_manage';
import DepartmentsManage from './components/administration/departments_manage';
import MonthsManage from './components/administration/months_manage';
import EmployeesManage from './components/administration/employees_manage';
import TransactionAccountsManage from './components/administration/transaction_accounts_manage';
import BankAccountsManage from './components/administration/bank_accounts_manage';
import cashTransactionManage from './components/administration/cash_transactions_manage';
import BankTransactionManage from './components/administration/bank_transactions_manage';
import CustomerPayments from './components/administration/customer_payments_manage';
import SupplierPayments from './components/administration/supplier_payments_manage';
import SalesRecord from './components/sales/sales_record';
import ServiceRecord from './components/sales/service_record';
import SalesReturn from './components/sales/sales_return';
import PurchaseRecord from './components/purchase/purchase_record';
import ServiceExpenseRecord from './components/sales/service_item_record';
import PurchaseReturn from './components/purchase/purchase_return';
import PurchaseEntry from './components/purchase/purchase_entry';
import servicePurchaseEntry from './components/sales/service_purchase_entry';
import PurchaseInvoiceQuick from './components/purchase/purchase_invoice_quick';
import ServiceItemInvoiceQuick from './components/sales/service_item_invoice_quick';
import ServiceReport from './components/sales/service_report';
import SalesInvoiceQuick from './components/sales/sales_invoice_quick';
import ServiceInvoiceQuick from './components/sales/service_invoice_quick';
import TransferInvoiceQuick from './components/stock/transfer_invoice_quick';
import productTransfer from './components/stock/product_transfer';
import StockReport from './components/stock/stock_report';
import productTransferRecord from './components/stock/transfer_record';
import ProductReceiveRecord from './components/stock/receive_record';
import ProductDamage from './components/stock/product_damage';
import ProductDamageList from './components/stock/product_damage_list';
import InstitutionProfile from './components/administration/institution_profile';
import SalaryPayment from './components/hrpayroll/salary_payment';
import SalaryPaymentReport from './components/hrpayroll/salary_payment_report';
import UserAccess from './components/administration/user_access';
import ViewSalesInvoice from './components/sales/view_sales_invoice';
import ViewServiceInvoice from './components/sales/view_service_invoice';
import ViewPurchaseInvoice from './components/purchase/view_purchase_invoice';
import ViewServiceItemInvoice from './components/sales/view_service_item_invoice';
import CustomerList from './components/customer/customer_list';
import CustomerDueList from './components/customer/customer_due_list';
import PurchaseReturnList from './components/purchase/purchase_return_list';
import supplierDueList from './components/purchase/supplier_due_list';
import supplierList from './components/supplier/supplier_list';
import cashTransactionReport from './components/accounts/cash_transaction_report';
import BankLedger from './components/accounts/bank_ledger';
import bankTransactionReport from './components/accounts/bank_transaction_report';
import CashBankBalance from './components/accounts/cash_bank_balance';
import ProfitLoss from './components/accounts/profit_loss';
import MaterialDamageEntry from './components/production/material_damage_entry';
import MaterialPurchaseEntry from './components/production/material_purchase_entry';
import ProductionEntry from './components/production/production_entry';
import MaterialProductionRecord from './components/production/production_record';
import MaterialPurchaseRecord from './components/production/material_purchase_record';
import MaterialDamageList from './components/production/material_damage_list';
import MaterialList from './components/production/material_list';
import MaterialPurchaseInvoice from './components/production/invoices/material_purchase_invoice';
import ProductionPurchaseInvoice from './components/production/invoices/production_invoice';
import MaterialPurchaseQuickInvoice from './components/production/material_purchase_quick_invoice';
import ProductionQuickInvoice from './components/production/production_quick_invoice';
import QuotationEntry from './components/quotation/quotation_entry';
import QuotationInvoice from './components/quotation/quotation_invoice';
import QuotationQuickInvoice from './components/quotation/quotation_quick_invoice';
import QuotationRecord from './components/quotation/quotation_record';
import MaterialStockReport from './components/production/material_stock_report';
import MaterialLedgerReport from './components/production/material_ledger_report';
import CustomerTransactionInvoice from './components/sales/customer_transaction_invoice';
import CustomerTransactionView from './components/sales/view_customer_tran_invoice';
import ProductReOrderList from './components/administration/product_re_order_list';
import MaterialReOrderList from './components/administration/material_re_order_list';
import ProductBarcode from './components/administration/product_barcode';
import CashStatement from './components/accounts/cash_statement';
import BalanceSheet from './components/accounts/balance_sheet';
import CashLedger from './components/accounts/cash_ledger';
import DailyLedger from './components/accounts/daily_ledger';
import ViewChalanInvoice from './components/sales/view_chalan_invoice';
import ServiceEntry from './components/sales/service_entry';
import CashDepositWithDraw from './components/accounts/cash_deposit_withdraw';




const drawerWidth = 180;
const useStyles = makeStyles((theme)=>({
  rootApp:{
    backgroundColor:'linear-gradient(to bottom, #33ccff 0%, #ff99cc 100%);'
  },
  navTopSection:{
    height:'7px',
    width:'100%',
    background: '#9CE1E7'
  },
  navTopSection:{
    height:'7px',
    background: '#9CE1E7'
  },
root: {
display: 'flex',
},
toolbarspace:{
display: 'flex',
alignItems: 'center',
justifyContent: 'flex-end',
padding: theme.spacing(0, 1),
...theme.mixins.toolbar,
},
content: {
flexGrow: 1,
padding: theme.spacing(3),
}
}))


const App = ({authInfo,currentRouteSet,currentRoute,authInfoSet})=>{
    useEffect(()=>{
      currentRouteSet(pathSpliter(window.location.pathname,1))
      authInfoSet(authInfoSeter);
    },[]);


    let classes = useStyles(); 
    
  return (
        <Router> 
        {
          authInfo!=null?
          (
          <Fragment>
           
         <div className={classes.navTopSection}></div>
         <div className={classes.rootApp} >
         <div className={classes.root}>
         <Header/> 

         <main className={classes.content} >
          <div className={classes.toolbarspace}/> 
             <Route exact path="/" component={Dashboard} />
             <Route exact path="/dashboard" component={Dashboard} />
             <Route exact path="/sales"  component={ModuleDetail} />
             <Route exact path="/service"  component={ModuleDetail} />
             <Route exact path="/sales/sales-invoice"  component={ViewSalesInvoice} />
             <Route exact path="/service/service-invoice"  component={ViewServiceInvoice} />
             <Route exact path="/reports/sales-invoice"  component={ViewSalesInvoice} />
             <Route exact path="/sales/chalan-invoice/:id"  component={ViewChalanInvoice} />
             <Route exact path="/sales/customer-transation-history"  component={CustomerTransactionHistory} />
             <Route exact path="/reports/customer-transation-history"  component={CustomerTransactionHistory} />
             <Route exact path="/sales/sales-return-list"   component={salesReturnList} />
             <Route exact path="/reports/sales-return-list"   component={salesReturnList} />
             <Route exact path="/accounts/customer-transaction/:id"   component={CustomerTransactionInvoice} />
             <Route exact path="/accounts/customer-transactions"   component={CustomerTransactionView} />
             <Route exact path="/service/service-entry"   component={ServiceEntry} /> 
             <Route exact path="/service/service-update/:id"  component={ServiceEntry} />

             <Route exact path="/stock"  component={ModuleDetail} />
             
             <Route exact path="/stock/product-stock-report"  component={StockReport} />
             <Route exact path="/reports/product-stock-report"  component={StockReport} />
             <Route exact path="/administration/user-access/:id"  component={UserAccess} />

             <Route exact path="/reports/cash_bank_balance"  component={CashBankBalance} />
             <Route exact path="/reports/profit-loss"  component={ProfitLoss} />


             {/* Production Routers */}

             <Route exact path="/production"  component={ModuleDetail} />
             <Route exact path="/production/material-entry"  component={MaterialEntry} />
             <Route exact path="/administration/material-entry"  component={MaterialEntry} />
             <Route exact path="/production/material-name-entry"  component={MaterialNameEntry} />
             <Route exact path="/administration/material-name-entry"  component={MaterialNameEntry} />
             <Route exact path="/production/material-damage-entry"  component={MaterialDamageEntry} />
             <Route exact path="/stock/material-damage-entry"  component={MaterialDamageEntry} />
             <Route exact path="/production/material-purchase-entry"  component={MaterialPurchaseEntry} />
             <Route exact path="/production/production-record"  component={MaterialProductionRecord} />
             <Route exact path="/reports/production-record"  component={MaterialProductionRecord} />
             <Route exact path="/production/material-purchase-update/:id"  component={MaterialPurchaseEntry} />
             <Route exact path="/production/production-entry-update/:id"  component={ProductionEntry} />
             <Route exact path="/production/production-entry"  component={ProductionEntry} />
             <Route exact path="/production/material-purchase-record"  component={MaterialPurchaseRecord} />
             <Route exact path="/reports/material-purchase-record"  component={MaterialPurchaseRecord} />
             <Route exact path="/production/material-damage-list"  component={MaterialDamageList} />
             <Route exact path="/reports/material-damage-list"  component={MaterialDamageList} />
             <Route exact path="/stock/material-damage-list"  component={MaterialDamageList} />
             <Route exact path="/production/material-list"  component={MaterialList} />
             <Route exact path="/reports/material-list"  component={MaterialList} />
             <Route exact path="/production/material-purchase-invoice"  component={MaterialPurchaseInvoice} />
             <Route exact path="/production/material-purchase-invoice/:id"  component={MaterialPurchaseQuickInvoice} />
             <Route exact path="/reports/material-purchase-invoice"  component={MaterialPurchaseInvoice} />
             <Route exact path="/production/production-invoice"  component={ProductionPurchaseInvoice} />
             <Route exact path="/reports/production-invoice"  component={ProductionPurchaseInvoice} />
             <Route exact path="/production/production-invoice/:id"  component={ProductionQuickInvoice} />
             <Route exact path="/production/material-stock"  component={MaterialStockReport} />
             <Route exact path="/stock/material-ledger"  component={MaterialLedgerReport} />
             <Route exact path="/reports/material-stock"  component={MaterialStockReport} />
             <Route exact path="/stock/material-stock"  component={MaterialStockReport} />
             <Route exact path="/production/material-ledger"  component={MaterialLedgerReport} />
             <Route exact path="/reports/material-ledger"  component={MaterialLedgerReport} />
             <Route exact path="/reports/customer-transactions"  component={CustomerTransactionView} />
             <Route exact path="/reports/cash_statement"  component={CashStatement} />
             <Route exact path="/reports/balance_sheet"  component={BalanceSheet} />
              

             {/* End  */}

             {/* Purchase Routes  */}
             <Route exact path="/purchase"  component={ModuleDetail} />
             <Route exact path="/purchase/purchase-entry"  component={PurchaseEntry} />
             <Route exact path="/service/service-purchase-entry"  component={servicePurchaseEntry} />
             <Route exact path="/service/service-purchase-update/:id"  component={servicePurchaseEntry} />
             <Route exact path="/purchase/purchase-update/:id"  component={PurchaseEntry} />
             <Route exact path="/purchase/purchase-invoice/:id"  component={PurchaseInvoiceQuick} />
             <Route exact path="/service/service-item-invoice/:id"  component={ServiceItemInvoiceQuick} />
             <Route exact path="/purchase/purchase-invoice"  component={ViewPurchaseInvoice} />
             <Route exact path="/service/service-item-invoice"  component={ViewServiceItemInvoice} />
             <Route exact path="/reports/purchase-invoice"  component={ViewPurchaseInvoice} />
             
             <Route exact path="/purchase/purchase-record"  component={PurchaseRecord} />
             <Route exact path="/service/service-expense-record"  component={ServiceExpenseRecord} />
             <Route exact path="/service/services-report"  component={ServiceReport} />
             <Route exact path="/reports/purchase-record"  component={PurchaseRecord} />
             <Route exact path="/purchase/purchase-return"  component={PurchaseReturn} />
             <Route exact path="/stock/product-damage"  component={ProductDamage} />

             <Route exact path="/hrpayroll/salary-payment"  component={SalaryPayment} />
             <Route exact path="/hrpayroll/salary-payment-report"  component={SalaryPaymentReport} />
             <Route exact path="/reports/salary-payment-report"  component={SalaryPaymentReport} />
             <Route exact path="/sales/customer-ledger"  component={CustomerLedger} />
             <Route exact path="/reports/customer-ledger"  component={CustomerLedger} />
             <Route exact path="/purchase/supplier-ledger"  component={SupplierLedger} />
             <Route exact path="/reports/supplier-ledger"  component={SupplierLedger} />
             <Route exact path="/purchase/purchase-return-list"  component={PurchaseReturnList} />
             <Route exact path="/reports/purchase-return-list"  component={PurchaseReturnList} />
             
             <Route exact path="/purchase/supplier-due-list"  component={supplierDueList} />
             <Route exact path="/reports/supplier-due-list"  component={supplierDueList} />
             <Route exact path="/purchase/supplier-list"  component={supplierList} />
             <Route exact path="/reports/supplier-list"  component={supplierList} />
             <Route exact path="/purchase/supplier-transaction-history"  component={SupplierTransactionHistory} />
             <Route exact path="/reports/supplier-transaction-history"  component={SupplierTransactionHistory} />
             <Route exact path="/accounts/cash-transaction-report"  component={cashTransactionReport} />
             <Route exact path="/reports/cash-transaction-report"  component={cashTransactionReport} />
             <Route exact path="/accounts/bank-transaction-report"  component={bankTransactionReport} />
             <Route exact path="/reports/cash-ledger"  component={CashLedger} />
             <Route exact path="/accounts/cash-ledger"  component={CashLedger} />
             <Route exact path="/accounts/daily-ledger"  component={DailyLedger} />
             <Route exact path="/reports/daily-ledger"  component={DailyLedger} />
             <Route exact path="/accounts/cash-deposit-withdraw"  component={CashDepositWithDraw} />
             
             
             <Route exact path="/reports/bank-transaction-report"  component={bankTransactionReport} />
             


             <Route exact path="/accounts"  component={ModuleDetail} />
             <Route exact path="/hrpayroll"  component={ModuleDetail} />
             <Route exact path="/reports"  component={ModuleDetail} />
             <Route exact path="/administration"  component={ModuleDetail} />
             <Route exact path="/sales/sales-entry"  component={SalesEntry} />
             <Route exact path="/sales/sales-invoice/:id"  component={SalesInvoiceQuick} />
             <Route exact path="/service/service-invoice/:id"  component={ServiceInvoiceQuick} />
             <Route exact path="/sales/sales-update/:id"  component={SalesEntry} />
             <Route exact path="/sales/sales-record"  component={SalesRecord} />
             <Route exact path="/service/service-record"  component={ServiceRecord} />
             <Route exact path="/reports/sales-record"  component={SalesRecord} />
             <Route exact path="/sales/sales-return"  component={SalesReturn} />
             <Route exact path="/sales/customer-list"  component={CustomerList} />
             <Route exact path="/reports/customer-list"  component={CustomerList} />
             <Route exact path="/sales/customer-due-list"  component={CustomerDueList} />
             <Route exact path="/reports/customer-due-list"  component={CustomerDueList} />

             {/*  */}
             <Route exact path="/sales/quotation-entry"  component={QuotationEntry} />
             <Route exact path="/sales/quotation-update/:id"  component={QuotationEntry} />
             <Route exact path="/sales/quotation-invoice"  component={QuotationInvoice} />
             <Route exact path="/reports/quotation-invoice"  component={QuotationInvoice} />
             <Route exact path="/sales/quotation-invoice/:id"  component={QuotationQuickInvoice} />
             <Route exact path="/sales/quotation-record"  component={QuotationRecord} />
             <Route exact path="/reports/quotation-record"  component={QuotationRecord} />
             
             {/*  */}
             <Route exact path="/stock/product-list"  component={ProductList} />
             <Route exact path="/stock/product-re-order-list"  component={ProductReOrderList} />
             <Route exact path="/reports/product-re-order-list"  component={ProductReOrderList} />
             <Route exact path="/reports/material-re-order-list"  component={MaterialReOrderList} />
             <Route exact path="/stock/material-re-order-list"  component={MaterialReOrderList} />
             <Route exact path="/reports/product-list"  component={ProductList} /> 
             <Route exact path="/administration/product-barcode/:id"  component={ProductBarcode}  />
             <Route exact path="/administration/prod-category-manage"  component={ProdCategoriesManage} />
             <Route exact path="/administration/institution-profile"  component={InstitutionProfile} />
             <Route exact path="/sales/customers-manage"  component={CustomersManage} />
             <Route exact path="/service/customers-manage"  component={CustomersManage} />
             <Route exact path="/service/suppliers-manage"  component={SuppliersManage} />
             <Route exact path="/purchase/suppliers-manage"  component={SuppliersManage} />
             <Route exact path="/production/suppliers-manage"  component={SuppliersManage} />
             <Route exact path="/administration/prod-units-manage"  component={prodUnitsManage} />
             <Route exact path="/administration/areas-manage"  component={AreasManage} />
             <Route exact path="/administration/prod-brands-manage"  component={ProdBrandsManage} />
             <Route exact path="/administration/prod-colors-manage"  component={ProdColorsManage} />
             <Route exact path="/administration/branches-manage"  component={BranchesManage} />
             <Route exact path="/administration/prod-names-manage"  component={ProdNameManage} />
             <Route exact path="/stock/product-transfer"  component={productTransfer} />
             <Route exact path="/stock/product-ledger"  component={productLedger} />
             <Route exact path="/reports/product-ledger"  component={productLedger} />
             <Route exact path="/stock/product-transfer/:id"  component={productTransfer} />
             <Route exact path="/stock/transfer-invoice/:id"  component={TransferInvoiceQuick} />
             <Route exact path="/stock/transfer-record"  component={productTransferRecord} />
             <Route exact path="/reports/transfer-record"  component={productTransferRecord} />
             <Route exact path="/stock/receive-record"  component={ProductReceiveRecord} />
             <Route exact path="/reports/receive-record"  component={ProductReceiveRecord} />
             <Route exact path="/stock/product-damage-list"  component={ProductDamageList} />
             <Route exact path="/reports/product-damage-list"  component={ProductDamageList} />

             <Route exact path="/administration/warehouses-manage"  component={warehousesManage} />
             <Route exact  path="/administration/users-manage"  component={UsersManage} />
             <Route exact  path="/administration/products-manage"  component={ProductsManage} />
             <Route exact  path="/hrpayroll/designations-manage"  component={DesignationsManage} />
             <Route exact  path="/hrpayroll/employees-manage"  component={EmployeesManage}/> 
             <Route exact  path="/hrpayroll/departments-manage"  component={DepartmentsManage} />
             <Route exact  path="/hrpayroll/months-manage"  component={MonthsManage} />
             <Route exact  path="/accounts/transaction-accounts-manage"  component={TransactionAccountsManage} />
             <Route exact  path="/accounts/bank-accounts-manage"  component={BankAccountsManage} />
             <Route exact  path="/accounts/cash-transactions-manage"  component={cashTransactionManage} />
             <Route exact  path="/accounts/bank-transactions-manage"  component={BankTransactionManage} />
             <Route exact  path="/accounts/customer-payments-manage"  component={CustomerPayments} />
             <Route exact  path="/accounts/supplier-payments-manage"  component={SupplierPayments} />
             <Route exact  path="/accounts/bank-ledger"  component={BankLedger} />
             <Route exact path="/accounts/customer-transation-history"  component={CustomerTransactionHistory} />
             <Route exact path="/accounts/supplier-transation-history"  component={SupplierTransactionHistory} />
             <Route exact path="/stock/material-damage"  component={MaterialDamageEntry} />

             <Route exact  path="/reports/bank-ledger"  component={BankLedger} />


             

          </main> 
          </div>
         </div>
         </Fragment>
            
          ):(   
          <div>
                <Route exact path="/" component={SignIn} />


                </div>
          )
            
            
           
        }
       
        </Router>
  );
}
const mapStateToPops = (state)=>{
  return {
    currentRoute:state.currentRouteReducer,
    authInfo:state.authInfoReducer
  }
}
export default connect(mapStateToPops,{currentRouteSet,authInfoSet})(App);