const currentRouteReducer =  (state=null,action)=>{
       switch(action.type){
            case 'current_route':
             return action.payload;
            default:
                return state;
       }
}

const authInfoReducer =  (state=null,action)=>{
       switch(action.type){
            case 'auh_info_set':
             return action.payload;
            default:
                return state;
       }
}
//  Category Reducer
const createdCategoryReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_category_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedCategoryReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_category_set':
               return action.payload;
              default:
                  return state;
         }
}
const disableRestoreCategoryReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_category_set':
               return action.payload;
              default:
                  return state;
         }
}
//  Brand Reducer
const createBrandReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_brand_set':
               return action.payload;
              default:
                  return state;
         }
}
const updateBrandReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_brand_set':
               return action.payload;
              default:
                  return state;
         }
}
const brandDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'brand_disable_restore_set':
               return action.payload;
              default:
                  return state;
         }
}
// Color Reducer
const createdColorReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_color_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedColorReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_color_set':
               return action.payload;
              default:
                  return state;
         }
}
const colorDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_color_set':
               return action.payload;
              default:
                  return state;
         }
}

// Unit set

const createdUnitReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_unit_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedUnitReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_unit_set':
               return action.payload;
              default:
                  return state;
         }
}
const unitDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_unit_set':
               return action.payload;
              default:
                  return state;
         }
}
// Branch set

const createdBranchReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_branch_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedBranchReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_branch_set':
               return action.payload;
              default:
                  return state;
         }
}
const branchDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_branch_set':
               return action.payload;
              default:
                  return state;
         }
}
// Warehouse set

const createdWarehouseReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_warehouse_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedWarehouseReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_warehouse_set':
               return action.payload;
              default:
                  return state;
         }
}
const warehouseDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_warehouse_set':
               return action.payload;
              default:
                  return state;
         }
}

// Area set

const createdAreaReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_area_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedAreaReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_area_set':
               return action.payload;
              default:
                  return state;
         }
}
const areaDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_area_set':
               return action.payload;
              default:
                  return state;
         }
}

// Product Name set

const createdProdNameReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_prod_name_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedProdNameReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_prod_name_set':
               return action.payload;
              default:
                  return state;
         }
}
const prodNameDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_prod_name_set':
               return action.payload;
              default:
                  return state;
         }
}


// Material
const createdMaterialNameReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_material_name_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedMaterialNameReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_material_name_set':
               return action.payload;
              default:
                  return state;
         }
}
const materialDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_material_name_set':
               return action.payload;
              default:
                  return state;
         }
}
// Customer set

const createdCustomerReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_customer_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedCustomerReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_customer_set':
               return action.payload;
              default:
                  return state;
         }
}
const customerDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_customer_set':
               return action.payload;
              default:
                  return state;
         }
}
// Supplier set

const createdSupplierReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_supplier_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedSupplierReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_supplier_set':
               return action.payload;
              default:
                  return state;
         }
}
const supplierDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_supplier_set':
               return action.payload;
              default:
                  return state;
         }
}
// Designation set 

const createdDesignationReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_designation_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedDesignationReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_designation_set':
               return action.payload;
              default:
                  return state;
         }
}
const designationDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_designation_set':
               return action.payload;
              default:
                  return state;
         }
}
// Department set 

const createdDepartmentReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_department_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedDepartmentReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_department_set':
               return action.payload;
              default:
                  return state;
         }
}
const departmentDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_department_set':
               return action.payload;
              default:
                  return state;
         }
}


// Employee set 

const createdEmployeeReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_employee_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedEmployeeReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_employee_set':
               return action.payload;
              default:
                  return state;
         }
}
const employeeDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_employee_set':
               return action.payload;
              default:
                  return state;
         }
}
// Month set 

const createdMonthReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_month_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedMonthReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_month_set':
               return action.payload;
              default:
                  return state;
         }
}
const monthDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_month_set':
               return action.payload;
              default:
                  return state;
         }
}
//  Product set
const createdProductSetReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_product_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedProductReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_product_set':
               return action.payload;
              default:
                  return state;
         }
}
const productCodeReducer = (state=null,action)=>{
       switch(action.type){
              case 'product_code_set':
               return action.payload;
              default:
                  return state;
         }
}
const productDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_product_set':
               return action.payload;
              default:
                  return state;
         }
}

// Material

const createdMaterialReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_material_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedMaterialReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_material_set':
               return action.payload;
              default:
                  return state;
         }
}
const materialCodeReducer = (state=null,action)=>{
       switch(action.type){
              case 'material_code_set':
               return action.payload;
              default:
                  return state;
         }
}
const disableRestoreMaterialReducer = (state=null,action)=>{ 
       switch(action.type){
              case 'disable_restore_material_set':
               return action.payload;
              default:
                  return state;
         }
}

//
const customerCodeReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_product_set':
               return action.payload;
              default:
                  return state;
         }
} 
const employeeCodeReducer = (state=null,action)=>{
       switch(action.type){
              case 'employee_code_set':
               return action.payload;
              default:
                  return state;
         }
} 


// Transaction account set 

const createdTranAccReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_tran_acc_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedTranAccReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_tran_acc_set':
               return action.payload;
              default:
                  return state;
         }
}
const tranAccDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_tran_acc_set':
               return action.payload;
              default:
                  return state;
         }
}
const tranAccCodeReducer = (state=null,action)=>{
       switch(action.type){
              case 'tran_acc_code_set':
               return action.payload;
              default:
                  return state;
         }
}

// Bank account set 
const createdBankAccReducer = (state=null,action)=>{

       switch(action.type){
              case 'created_bank_acc_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedBankAccReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_bank_acc_set':
               return action.payload;
              default:
                  return state;
         }
}
const bankAccDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_bank_acc_set':
               return action.payload;
              default:
                  return state;
         }
}
const bankAccCodeReducer = (state=null,action)=>{
       switch(action.type){
              case 'bank_acc_code_set':
               return action.payload;
              default:
                  return state;
         }
}
// Cash transaction set 
const createdCashTranReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_cash_tran_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedCashTranReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_cash_tran_set':
               return action.payload;
              default:
                  return state;
         }
}
const cashTranDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_cash_tran_set':
               return action.payload;
              default:
                  return state;
         }
}
const cashTranCodeReducer = (state=null,action)=>{
       switch(action.type){
              case 'cash_tran_code_set':
               return action.payload;
              default:
                  return state;
         }
}

// Bank transaction set 
const createdBankTranReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_bank_tran_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedBankTranReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_bank_tran_set':
               return action.payload;
              default:
                  return state;
         }
}
const bankTranDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_bank_tran_set':
               return action.payload;
              default:
                  return state;
         }
}
const bankTranCodeReducer = (state=null,action)=>{
       switch(action.type){
              case 'bank_tran_code_set':
               return action.payload;
              default:
                  return state;
         }
}

// Customer payment set 
const createdCustomerPayReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_customer_pay_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedCustomerPayReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_customer_pay_set':
               return action.payload;
              default:
                  return state;
         }
}
const customerPayDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_customer_pay_set':
               return action.payload;
              default:
                  return state;
         }
}
// Supplier payment set 
const createdSupplierPayReducer = (state=null,action)=>{
       switch(action.type){
              case 'created_supplier_pay_set':
               return action.payload;
              default:
                  return state;
         }
}
const updatedSupplierPayReducer = (state=null,action)=>{
       switch(action.type){
              case 'updated_supplier_pay_set':
               return action.payload;
              default:
                  return state;
         }
}
const supplierPayDisableRestoreReducer = (state=null,action)=>{
       switch(action.type){
              case 'disable_restore_supplier_pay_set':
               return action.payload;
              default:
                  return state;
         }
}
const saleReturnCartReducer = (state=[],action)=>{
       switch(action.type){
              case 'sale_return_cart_set':
               return action.payload;
              default:
                  return state;
         }
}

const returnChangeReducer = (state=[],action)=>{
       switch(action.type){
              case 'return_change_set':
               return action.payload;
              default:
                  return state;
         }
}
const purchaseReturnChangeReducer = (state=[],action)=>{
       switch(action.type){
              case 'purchase_return_change_set':
               return action.payload;
              default:
                  return state;
         }
}
export {currentRouteReducer,authInfoReducer,createdCategoryReducer,updatedCategoryReducer,disableRestoreCategoryReducer,
       createBrandReducer,brandDisableRestoreReducer,updateBrandReducer,colorDisableRestoreReducer,updatedColorReducer,createdColorReducer,
       createdUnitReducer,updatedUnitReducer,unitDisableRestoreReducer,
       createdBranchReducer,updatedBranchReducer,branchDisableRestoreReducer,
       createdWarehouseReducer,updatedWarehouseReducer,warehouseDisableRestoreReducer,
       createdAreaReducer,updatedAreaReducer,areaDisableRestoreReducer,
       createdProdNameReducer,updatedProdNameReducer,prodNameDisableRestoreReducer,
       createdMaterialNameReducer,updatedMaterialNameReducer,materialDisableRestoreReducer,
       createdCustomerReducer,updatedCustomerReducer,customerDisableRestoreReducer,
       createdSupplierReducer,updatedSupplierReducer,supplierDisableRestoreReducer,
       createdDesignationReducer,updatedDesignationReducer,designationDisableRestoreReducer,
       createdProductSetReducer,updatedProductReducer,productCodeReducer,productDisableRestoreReducer,customerCodeReducer,
       createdDepartmentReducer,updatedDepartmentReducer,departmentDisableRestoreReducer,
       createdMonthReducer,updatedMonthReducer,monthDisableRestoreReducer,
       createdEmployeeReducer,updatedEmployeeReducer,employeeDisableRestoreReducer,employeeCodeReducer,
       createdTranAccReducer,updatedTranAccReducer,tranAccDisableRestoreReducer,tranAccCodeReducer,
       createdCashTranReducer,updatedCashTranReducer,cashTranDisableRestoreReducer,cashTranCodeReducer,
       createdBankTranReducer,updatedBankTranReducer,bankTranDisableRestoreReducer,bankTranCodeReducer,
       createdCustomerPayReducer,updatedCustomerPayReducer,customerPayDisableRestoreReducer,
       createdSupplierPayReducer,updatedSupplierPayReducer,supplierPayDisableRestoreReducer,
       saleReturnCartReducer,returnChangeReducer,purchaseReturnChangeReducer,
       createdBankAccReducer,updatedBankAccReducer,bankAccDisableRestoreReducer,bankAccCodeReducer,
       createdMaterialReducer,updatedMaterialReducer,materialCodeReducer,disableRestoreMaterialReducer,

}