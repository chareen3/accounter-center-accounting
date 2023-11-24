
const currentRouteSet = (current)=>{
      return {
          type:'current_route',
          payload:current
      }
}
const authInfoSet = (authInfo)=>{
    return {
        type:'auh_info_set',
        payload:authInfo
    }
}
// Category set
const createdCategorySet = (createdCategory)=>{
    return {
        type:'created_category_set',
        payload:createdCategory
    }
}

const updatedCategorySet = (updatedCategory)=>{
    return {
        type:'updated_category_set',
        payload:updatedCategory
    }
}
const disableRestoreSet = (category)=>{
    return {
        type:'disable_restore_category_set',
        payload:category
    }
}

// Brand Set
const createdBrandSet = (brand)=>{
    return {
        type:'created_brand_set',
        payload:brand
    }
}
const updatedBrandSet = (brand)=>{
    return {
        type:'updated_brand_set',
        payload:brand
    }
}
const brandDisableRestoreSet = (brand)=>{
    return {
        type:'brand_disable_restore_set',
        payload:brand
    }
}
// Color set 
const createdColorSet = (color)=>{
    return {
        type:'created_color_set',
        payload:color
    }
}
const updatedColorSet = (color)=>{
    return {
        type:'updated_color_set',
        payload:color
    }
}
const disableRestoreColorSet = (color)=>{
    return {
        type:'disable_restore_color_set',
        payload:color
    }
}
// Unit set 
const createdUnitSet = (unit)=>{
    return {
        type:'created_unit_set',
        payload:unit
    }
}
const updatedUnitSet = (unit)=>{
    return {
        type:'updated_unit_set',
        payload:unit
    }
}
const disableRestoreUnitSet = (unit)=>{
    return {
        type:'disable_restore_unit_set',
        payload:unit
    }
}
// Branch set 
const createdBranchSet = (branch)=>{
    return {
        type:'created_branch_set',
        payload:branch
    }
}
const updatedBranchSet = (branch)=>{
    return {
        type:'updated_branch_set',
        payload:branch
    }
}
const disableRestoreBranchSet = (branch)=>{
    return {
        type:'disable_restore_branch_set',
        payload:branch
    }
}
// Warehouse set 
const createdWarehouseSet = (warehouse)=>{
    return {
        type:'created_warehouse_set',
        payload:warehouse
    }
}
const updatedWarehouseSet = (warehouse)=>{
    return {
        type:'updated_warehouse_set',
        payload:warehouse
    }
}
const disableRestoreWarehouseSet = (warehouse)=>{
    return {
        type:'disable_restore_warehouse_set',
        payload:warehouse
    }
}
// Warehouse set 
const createdAreaSet = (area)=>{
    return {
        type:'created_area_set',
        payload:area
    }
}
const updatedAreaSet = (area)=>{
    return {
        type:'updated_area_set',
        payload:area
    }
}
const disableRestoreAreaSet = (area)=>{
    return {
        type:'disable_restore_area_set',
        payload:area
    }
}

// Product Name set 
const createdProdNameSet = (prodName)=>{
    return {
        type:'created_prod_name_set',
        payload:prodName
    }
}
const updatedProdNameSet = (prodName)=>{
    return {
        type:'updated_prod_name_set',
        payload:prodName
    }
}
const disableRestoreProdNameSet = (prodName)=>{
    return {
        type:'disable_restore_prod_name_set',
        payload:prodName
    }
}


// Materil Name set 
const createdMaterialNameSet = (materialName)=>{
    return {
        type:'created_material_name_set',
        payload:materialName
    }
}
const updatedMaterialNameSet = (materialName)=>{
    return {
        type:'updated_material_name_set',
        payload:materialName
    }
}
const disableRestoreMaterialNameSet = (materialName)=>{
    return {
        type:'disable_restore_material_name_set',
        payload:materialName
    }
}
// Product set
const createdProductSet = (prod)=>{
    return {
        type:'created_product_set',
        payload:prod
    }
}
const updatedProductSet = (prod)=>{
    return {
        type:'updated_product_set',
        payload:prod
    }
}
const productCodeSet = (code)=>{
    return {
        type:'product_code_set',
        payload:code
    }
}
const disableRestoreProductSet = (prod)=>{
    return {
        type:'disable_restore_product_set',
        payload:prod
    }
}


// Material for

const createdMaterialSet = (material)=>{
    return {
        type:'created_material_set',
        payload:material
    }
}
const updatedMaterialSet = (material)=>{
    return {
        type:'updated_material_set',
        payload:material
    }
}
const materialCodeSet = (code)=>{
    return {
        type:'material_code_set',
        payload:code
    }
}
const disableRestoreMaterialSet = (material)=>{
    return {
        type:'disable_restore_material_set',
        payload:material
    }
}

///
const customerCodeSet = (code)=>{
    return {
        type:'customer_code_set',
        payload:code
    }
}
// 
const createdCustomerSet = (code)=>{
    return {
        type:'created_customer_set',
        payload:code
    }
}
const updatedCustomerSet = (code)=>{
    return {
        type:'updated_customer_set',
        payload:code
    }
}
const disableRestoreCustomerSet = (code)=>{
    return {
        type:'disable_restore_customer_set',
        payload:code
    }
}

// Supplier set
const createdSupplierSet = (code)=>{
    return {
        type:'created_supplier_set',
        payload:code
    }
}
const updatedSupplierSet = (code)=>{
    return {
        type:'updated_supplier_set',
        payload:code
    }
}
const disableRestoreSupplierSet = (code)=>{
    return {
        type:'disable_restore_supplier_set',
        payload:code
    }
}
// Designation set 
const createdDesignationSet = (code)=>{
    return {
        type:'created_designation_set',
        payload:code
    }
}
const updatedDesignationSet = (code)=>{
    return {
        type:'updated_designation_set',
        payload:code
    }
}
const disableRestoreDesignationSet = (code)=>{
    return {
        type:'disable_restore_designation_set',
        payload:code
    }
}
// Deparment set  
const createdDepartmentSet = (department)=>{
    return {
        type:'created_department_set',
        payload:department
    }
}
const updatedDepartmentSet = (department)=>{
    return {
        type:'updated_department_set',
        payload:department
    }
}
const disableRestoreDepartmentSet = (department)=>{
    return {
        type:'disable_restore_department_set',
        payload:department
    }
}
// Month set  
const createdMonthSet = (month)=>{
    return {
        type:'created_month_set',
        payload:month
    }
}
const updatedMonthSet = (month)=>{
    return {
        type:'updated_month_set',
        payload:month
    }
}
const disableRestoreMonthSet = (month)=>{
    return {
        type:'disable_restore_month_set',
        payload:month
    }
}
// Employee set  
const createdEmployeeSet = (employee)=>{
    return {
        type:'created_employee_set',
        payload:employee
    }
}
const updatedEmployeeSet = (employee)=>{
    return {
        type:'updated_employee_set',
        payload:employee
    }
}
const employeeDisableRestoreSet = (employee)=>{
    return {
        type:'disable_restore_employee_set',
        payload:employee
    }
}

const employeeCodeSet = (employeeCode)=>{
    return {
        type:'employee_code_set',
        payload:employeeCode
    }
}
// Transaction account set  
const createdTranAccSet = (account)=>{
    return {
        type:'created_tran_acc_set',
        payload:account
    }
}
const updatedTranAccSet = (account)=>{
    return {
        type:'updated_tran_acc_set',
        payload:account
    }
}
const tranAccDisableRestoreSet = (account)=>{
    return {
        type:'disable_restore_tran_acc_set',
        payload:account
    }
}

const tranAccCodeSet = (accountCode)=>{
    return {
        type:'tran_acc_code_set',
        payload:accountCode
    }
}
// Bank account set  
const createdBankAccSet = (account)=>{
   
    return {
        type:'created_bank_acc_set',
        payload:account
    }
}
const updatedBankAccSet = (account)=>{
    return {
        type:'updated_bank_acc_set',
        payload:account
    }
}
const bankAccDisableRestoreSet = (account)=>{
    return {
        type:'disable_restore_bank_acc_set',
        payload:account
    }
}

const bankAccCodeSet = (accountCode)=>{
    return {
        type:'bank_acc_code_set',
        payload:accountCode
    }
}
// Cash transaction set
const createdCashTranSet = (transaction)=>{
    return {
        type:'created_cash_tran_set',
        payload:transaction
    }
}
const updatedCashTranSet = (transaction)=>{
    return {
        type:'updated_cash_tran_set',
        payload:transaction
    }
}
const cashTranDisableRestoreSet = (transaction)=>{
    return {
        type:'disable_restore_cash_tran_set',
        payload:transaction
    }
}

const cashTranCodeSet = (tranCode)=>{
    return {
        type:'cash_tran_code_set',
        payload:tranCode
    }
}

// Bank transaction set
const createdBankTranSet = (transaction)=>{
    return {
        type:'created_bank_tran_set',
        payload:transaction
    }
}
const updatedBankTranSet = (transaction)=>{
    return {
        type:'updated_bank_tran_set',
        payload:transaction
    }
}
const bankTranDisableRestoreSet = (transaction)=>{
    return {
        type:'disable_restore_bank_tran_set',
        payload:transaction
    }
}

const bankTranCodeSet = (tranCode)=>{
    return {
        type:'bank_tran_code_set',
        payload:tranCode
    }
}
// Customer payment set



// Cash D W transaction set
const createdCashDWSet = (transaction)=>{
    return {
        type:'created_cash_d_w_set',
        payload:transaction
    }
}
const updatedCashDWSet = (transaction)=>{
    return {
        type:'updated_cash_d_w_set',
        payload:transaction
    }
}
const cashDWDisableRestoreSet = (transaction)=>{
    return {
        type:'disable_restore_cash_d_w_set',
        payload:transaction
    }
}

const cashDWCodeSet = (tranCode)=>{
    return {
        type:'cash_d_w_code_set',
        payload:tranCode
    }
}

const createdCustomerPaySet = (obj)=>{
    return {
        type:'created_customer_pay_set',
        payload:obj
    }
}
const updatedCustomerPaySet = (obj)=>{
    return {
        type:'updated_customer_pay_set',
        payload:obj
    }
}
const customerPayDisableRestoreSet = (obj)=>{
    return {
        type:'disable_restore_customer_pay_set',
        payload:obj
    }
}
// Supplier payment set
const createdSupplierPaySet = (obj)=>{
    return {
        type:'created_supplier_pay_set',
        payload:obj
    }
}
const updatedSupplierPaySet = (obj)=>{
    return {
        type:'updated_supplier_pay_set',
        payload:obj
    }
}

const supplierPayDisableRestoreSet = (obj)=>{
    return {
        type:'disable_restore_supplier_pay_set',
        payload:obj
    }
}


const returnChangeSet = (e,index,detail,saleReturnCart)=>{
         
         if(e.target.name=='return_qty'){
            saleReturnCart[index].return_qty =  e.target.value;
         }else{
            saleReturnCart[index].sale_rate = e.target.value;
         }
         saleReturnCart[index].return_amount = (saleReturnCart[index].sale_rate*saleReturnCart[index].return_qty).toFixed(2)
      
        return {
            type:'return_change_set',
            payload:[...saleReturnCart,saleReturnCart[index]]
        }
}

const purchaseReturnChangeSet = (e,index,detail,purchaseReturnCart)=>{
         
    if(e.target.name=='return_qty'){
        purchaseReturnCart[index].return_qty =  e.target.value;
    }else{
        purchaseReturnCart[index].pur_rate = e.target.value;
    }
    purchaseReturnCart[index].return_amount = (purchaseReturnCart[index].pur_rate*purchaseReturnCart[index].return_qty).toFixed(2)
 
   return {
       type:'purchase_return_change_set',
       payload:[...purchaseReturnCart,purchaseReturnCart[index]]
   }
}


export {currentRouteSet,authInfoSet,createdCategorySet,updatedCategorySet,disableRestoreSet,createdBrandSet,
    updatedBrandSet,brandDisableRestoreSet,createdColorSet,updatedColorSet,disableRestoreColorSet,
    createdUnitSet,updatedUnitSet,disableRestoreUnitSet,
    createdWarehouseSet,updatedWarehouseSet,disableRestoreWarehouseSet,
    createdBranchSet,updatedBranchSet,disableRestoreBranchSet,
    createdAreaSet,updatedAreaSet,disableRestoreAreaSet,
    createdProdNameSet,updatedProdNameSet,disableRestoreProdNameSet ,
    createdMaterialNameSet,updatedMaterialNameSet,disableRestoreMaterialNameSet ,
    createdProductSet,updatedProductSet,productCodeSet,disableRestoreProductSet,customerCodeSet,
    createdMaterialSet,updatedMaterialSet,materialCodeSet,disableRestoreMaterialSet,
    createdCustomerSet,updatedCustomerSet,disableRestoreCustomerSet,
    createdSupplierSet,updatedSupplierSet,disableRestoreSupplierSet,
    createdDesignationSet,updatedDesignationSet,disableRestoreDesignationSet,
    createdDepartmentSet,updatedDepartmentSet,disableRestoreDepartmentSet,
    createdMonthSet,updatedMonthSet,disableRestoreMonthSet,
    createdEmployeeSet,updatedEmployeeSet,employeeDisableRestoreSet,employeeCodeSet,
    createdTranAccSet,updatedTranAccSet,tranAccDisableRestoreSet,tranAccCodeSet,
    createdCashTranSet,updatedCashTranSet,cashTranDisableRestoreSet,cashTranCodeSet,
    createdBankTranSet,updatedBankTranSet,bankTranDisableRestoreSet,bankTranCodeSet,
    createdCustomerPaySet,updatedCustomerPaySet,customerPayDisableRestoreSet,
    createdSupplierPaySet,updatedSupplierPaySet,supplierPayDisableRestoreSet,
    returnChangeSet,purchaseReturnChangeSet,
    createdBankAccSet,updatedBankAccSet,bankAccDisableRestoreSet,bankAccCodeSet,
    cashDWCodeSet,cashDWDisableRestoreSet,updatedCashDWSet,createdCashDWSet

}