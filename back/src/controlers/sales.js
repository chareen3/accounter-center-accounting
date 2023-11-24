            const router = require('express').Router();
            const _p      = require('../utils/promise_error');
            const  {Database}   = require('../utils/Database');
            const  {SalesModel}   = require('../models/SalesModel');
            const {getCurrentISODT} = require('../utils/functions')
            var    db = new Database();
            let    salesMd = new SalesModel();


            getSalesInvoice = async ()=>{
            let invoicePromise = salesMd.getSalesInvoice()
                    let invoice = await Promise.all([invoicePromise])
                    return invoice[0];
            }

            getServiceInvoice = async ()=>{
              let invoicePromise = salesMd.getServiceInvoice()
                      let invoice = await Promise.all([invoicePromise])
                      return invoice[0];
              }

            getCustomerCode = async ()=>{
            let codePromise = salesMd.getCustomerCode()
                    let cutomerCode = await Promise.all([codePromise])
                    return cutomerCode[0];
            }

            router.get('/api/get-service-invoice',async(req,res,next)=>{
              let invoicePromise = salesMd.getServiceInvoice()
              let invoice = await Promise.all([invoicePromise])
              res.json({error:false,message:invoice[0]});
      });

            router.get('/api/get-sales-invoice',async(req,res,next)=>{
                    let invoicePromise = salesMd.getSalesInvoice()
                    let invoice = await Promise.all([invoicePromise])
                    res.json({error:false,message:invoice[0]});
            });

            router.get('/api/get-quotation-invoice',async(req,res,next)=>{
              let invoicePromise = salesMd.getQuotationInvoice()
              let invoice = await Promise.all([invoicePromise])
              res.json({error:false,message:invoice[0]});
      });


      router.post('/api/save-quotation',async(req,res,next)=>{
        let sale = req.body.sale;
        let cart = req.body.cart;
              // new customer add
              let sale_customer_id = sale.customer_id;
                  if(sale.customer_id=='0'){

                  let codePromise = salesMd.getCustomerCode()
                  let cutomerCode = await Promise.all([codePromise])
              
                    let newCustomerData = {
                    customer_code: cutomerCode[0],
                    customer_address: sale.customer_address,
                    customer_mobile_no: sale.customer_mobile_no,
                    customer_name: sale.customer_name,
                    customer_type: 'general',
                    customer_created_isodt:getCurrentISODT(),
                    customer_branch_id:req.user.user_branch_id,
                    customer_created_by:req.user.user_id,
                    customer_status:'active'
                    }
                  let [scustomerErr,customerEnty] =  await _p(db.insert('tbl_customers',newCustomerData)).then((row)=>{
                        return row
                  })
                  sale_customer_id = customerEnty.insertId;
                  }
              // end new customer

              let invoicePromise =  salesMd.getQuotationInvoice()
              let invoice = await Promise.all([invoicePromise])

                let salePayload =  {
                  sale_invoice: invoice[0],
                  sale_emp_id: sale.sale_emp_id,
                  sale_cus_type : sale.sale_cus_type,
                  sale_pay_method : sale.sale_pay_method,
                  sale_bank_id : sale.sale_bank_id,
                  sale_created_isodt: sale.created_isodt,
                  sale_customer_id: sale_customer_id,
                  sale_subtotal_amount: sale.sub_total,
                  sale_transport_cost: sale.sale_transport_cost,
                  sale_vat_amount: sale.vat,
                  sale_vat_percent: sale.vat_percent,
                  sale_previous_due: sale.previous_due,
                  sale_discount_amount: sale.discount,
                  sale_discount_percent: sale.discount_percent,
                  sale_total_amount: sale.total_amount,
                  sale_paid_amount: sale.paid,
                  sale_due_amount: sale.due,
                  sale_note: sale.note,
                  sale_created_by:req.user.user_id,
                  sale_branch_id:req.user.user_branch_id,
                  sale_status:'a'
                }


              let [soldDataErr,soldData] = await _p(db.insert('tbl_quotation_master',salePayload).then((result)=>{
                  return result;
              }));
              if(soldDataErr && !soldData){
              return next(soldDataErr);
              }
              else{
                cart.forEach(async (element )=> {
                  let savePayload = {
                    sale_id: soldData.insertId,
                    sale_prod_id: element.prod_id,
                    sale_rate: element.prod_sale_rate,
                    sale_prod_purchase_rate: element.prod_purchase_rate,
                    sale_qty: element.prod_qty,
                    sale_prod_total: element.prod_total,
                    sale_d_status:'a',
                    sale_d_branch_id:req.user.user_branch_id,
                  }
                  
                  let [qryErr,data] = await _p(db.insert('tbl_quotation_details',savePayload).then((result)=>{
                    return result;
                }));


                
              
              
              });/// Loop end
                res.json({error:false,message:{quotationId:soldData.insertId,msg:'Quotation '}});
              }
        });

            router.post('/api/save-sale',async(req,res,next)=>{
            let sale = req.body.sale;
            let cart = req.body.cart;
                  // new customer add
                  let sale_customer_id = sale.customer_id;
                      if(sale.customer_id=='0'){

                      let codePromise = salesMd.getCustomerCode()
                      let cutomerCode = await Promise.all([codePromise])
                  
                        let newCustomerData = {
                        customer_code: cutomerCode[0],
                        customer_address: sale.customer_address,
                        customer_mobile_no: sale.customer_mobile_no,
                        customer_name: sale.customer_name,
                        customer_type: 'general',
                        customer_created_isodt:getCurrentISODT(),
                        customer_branch_id:req.user.user_branch_id,
                        customer_created_by:req.user.user_id,
                        customer_status:'active'
                        }
                      let [scustomerErr,customerEnty] =  await _p(db.insert('tbl_customers',newCustomerData)).then((row)=>{
                            return row
                      })
                      sale_customer_id = customerEnty.insertId;
                      }
                  // end new customer

                  let invoicePromise =  salesMd.getSalesInvoice()
                  let invoice = await Promise.all([invoicePromise])
    
                    let salePayload =  {
                      sale_invoice: invoice[0],
                      sale_emp_id: sale.sale_emp_id,
                      sale_cus_type : sale.sale_cus_type,
                      sale_pay_method : sale.sale_pay_method,
                      sale_bank_id : sale.sale_bank_id,
                      sale_created_isodt: sale.created_isodt,
                      sale_customer_id: sale_customer_id,
                      sale_subtotal_amount: sale.sub_total,
                      sale_transport_cost: sale.sale_transport_cost,
                      sale_vat_amount: sale.vat,
                      sale_vat_percent: sale.vat_percent,
                      sale_previous_due: sale.previous_due,
                      sale_discount_amount: sale.discount,
                      sale_discount_percent: sale.discount_percent,
                      sale_total_amount: sale.total_amount,
                      sale_paid_amount: sale.paid,
                      sale_due_amount: sale.due,
                      sale_note: sale.note,
                      sale_created_by:req.user.user_id,
                      sale_branch_id:req.user.user_branch_id,
                      sale_status:'a'
                    }


                  let [soldDataErr,soldData] = await _p(db.insert('tbl_sales_master',salePayload).then((result)=>{
                      return result;
                  }));
                  if(soldDataErr && !soldData){
                  return next(soldDataErr);
                  }
                  else{
                    cart.forEach(async (element )=> {
                      // Get Current purchase avarage rate
                      let [currProdRateErr,currProdAvgRate] =  await _p(db.selectSingleRow(`select prod_avarage_rate from tbl_product_purchase_rate where product_id=? and branch_id=?  `,[element.prod_id,req.user.user_branch_id]).then((res)=>{
                        return res;
                      }));

                      let savePayload = {
                        sale_id: soldData.insertId,
                        sale_prod_id: element.prod_id,
                        sale_rate: element.prod_sale_rate,
                        sale_prod_purchase_rate: currProdAvgRate.prod_avarage_rate,
                        sale_qty: element.prod_qty,
                        sale_prod_total: element.prod_total,
                        sale_d_status:'a',
                        sale_d_branch_id:req.user.user_branch_id,
                        sale_date_time: sale.created_isodt,
                      }
                      
                      let [qryErr,data] = await _p(db.insert('tbl_sales_details',savePayload).then((result)=>{
                        return result;
                    }));


                    
                  
                    let [errStockCheck,stockData] =  await _p(db.countRows(`select * from tbl_product_current_stock where prod_id=? and branch_id=?  `,[element.prod_id,req.user.user_branch_id]).then((res)=>{
                          return res;
                    }));
                    if( stockData>0){
                    let[a,b] =  await _p(db.query(`update tbl_product_current_stock set sale_qty=sale_qty+? where prod_id=? and branch_id=?  `,[element.prod_qty,element.prod_id,req.user.user_branch_id]).then((res=>{
                        return res;
                      })))
                    }else{
                      let savePayload = {
                        prod_id: element.prod_id,
                        sale_qty: element.sale_qty,
                        branch_id: req.user.user_branch_id,
                      }
                      let  [qryErr,data] = await _p(db.insert('tbl_product_current_stock',savePayload).then((result)=>{
                        return result;
                    }));
                    }
                  
                  });/// Loop end
                    res.json({error:false,message:{saleId:soldData.insertId,msg:'Sale '}});
                  }
            });


            router.post('/api/save-service',async(req,res,next)=>{
              let service = req.body.service;
              let cart = req.body.cart;
                    // new customer add
                    let service_customer_id = service.customer_id;
                        if(service.customer_id=='0'){
  
                        let codePromise = salesMd.getCustomerCode() 
                        let cutomerCode = await Promise.all([codePromise])
                    
                          let newCustomerData = {
                          customer_code: cutomerCode[0],
                          customer_address: sale.customer_address,
                          customer_mobile_no: sale.customer_mobile_no,
                          customer_name: sale.customer_name,
                          customer_type: 'general',
                          customer_created_isodt:getCurrentISODT(),
                          customer_branch_id:req.user.user_branch_id,
                          customer_created_by:req.user.user_id,
                          customer_status:'active'
                          }
                        let [scustomerErr,customerEnty] =  await _p(db.insert('tbl_customers',newCustomerData)).then((row)=>{
                              return row
                        })
                        service_customer_id = customerEnty.insertId;
                        }
                    // end new customer
  
                    let invoicePromise =  salesMd.getServiceInvoice()
                    let invoice = await Promise.all([invoicePromise])
      
                      let servicePayload =  {
                        service_invoice: invoice[0],
                        service_emp_id: service.service_emp_id,
                        service_cus_type : service.service_cus_type,
                        service_pay_method : service.service_pay_method,
                        service_bank_id : service.service_bank_id,
                        service_created_isodt: service.created_isodt,
                        service_customer_id: service_customer_id,
                        service_subtotal_amount: service.sub_total,
                        service_transport_cost: service.service_transport_cost,
                        service_vat_amount: service.vat,
                        service_vat_percent: service.vat_percent,
                        service_previous_due: service.previous_due,
                        service_discount_amount: service.discount,
                        service_discount_percent: service.discount_percent,
                        service_total_amount: service.total_amount,
                        service_paid_amount: service.paid,
                        service_due_amount: service.due,
                        service_note: service.note,
                        service_created_by:req.user.user_id,
                        service_branch_id:req.user.user_branch_id,
                        service_status:'a'
                      }
  
  
                    let [serviceDataErr,serviceData] = await _p(db.insert('tbl_service_master',servicePayload).then((result)=>{
                        return result;
                    }));
                    if(serviceDataErr && !serviceData){
                    return next(serviceDataErr);
                    }
                    else{
                      cart.forEach(async (element )=> {
                     
  
                        let savePayload = {
                          service_id: serviceData.insertId,
                          service_prod_id: element.prod_id,
                          service_rate: element.prod_service_rate,
                          service_qty: element.prod_qty,
                          service_prod_total: element.prod_total,
                          service_d_status:'a',
                          service_d_branch_id:req.user.user_branch_id,
                        }
                        
                        let [qryErr,data] = await _p(db.insert('tbl_service_details',savePayload).then((result)=>{
                          return result;
                      }));
  
  
                      
                  
                    
                    });/// Loop end
                      res.json({error:false,message:{serviceId:serviceData.insertId,msg:'Service '}});
                    }
              });


            router.post('/api/update-quotation',async(req,res,next)=>{
              let sale = req.body.sale;
              let cart = req.body.cart;
                      // new customer add
                      let sale_customer_id = sale.customer_id;
                          if(sale.customer_id=='0'){
  
                          let codePromise = salesMd.getCustomerCode()
                          let cutomerCode = await Promise.all([codePromise])
                      
                            let newCustomerData = {
                            customer_code: cutomerCode[0],
                            customer_address: sale.customer_address,
                            customer_mobile_no: sale.customer_mobile_no,
                            customer_name: sale.customer_name,
                            customer_type: 'general',
                            customer_created_isodt:getCurrentISODT(),
                            customer_branch_id:req.user.user_branch_id,
                            customer_created_by:req.user.user_id,
                            customer_status:'active'
                            }
                          let [scustomerErr,customerEnty] =  await _p(db.insert('tbl_customers',newCustomerData)).then((row)=>{
                                return row
                          })
                          sale_customer_id = customerEnty.insertId;
                          }
                      // end new customer
  
  
                        let salePayload =  {
                          sale_emp_id: sale.sale_emp_id,
                          sale_customer_id: sale_customer_id,
                          sale_cus_type : sale.sale_cus_type,
                          sale_pay_method : sale.sale_pay_method,
                          sale_bank_id : sale.sale_bank_id,
                          sale_created_isodt: sale.created_isodt,
                          sale_transport_cost: sale.sale_transport_cost,
                          sale_subtotal_amount: sale.sub_total,
                          sale_vat_amount: sale.vat,
                          sale_vat_percent: sale.vat_percent,
                          sale_previous_due: sale.previous_due,
                          sale_discount_amount: sale.discount,
                          sale_discount_percent: sale.discount_percent,
                          sale_total_amount: sale.total_amount,
                          sale_paid_amount: sale.paid,
                          sale_due_amount: sale.due,
                          sale_note: sale.note,
                          sale_branch_id:req.user.user_branch_id,
                        }
                      let smUpdateCond = {
                          sale_id: sale.sale_id
                      }
  
                      let [soldDataErr,soldData] = await _p(db.update('tbl_quotation_master',salePayload,smUpdateCond).then((result)=>{
                          return result;
                      }));
                      if(soldDataErr && !soldData){
                      return next(soldDataErr);
                      }
                      else{ 
                        
                    
  
  
                        
                        await _p(db.delete(`tbl_quotation_details`,{sale_id:sale.sale_id}))
  
                      
                        cart.forEach(async (element )=> {
                          let savePayload = {
                            sale_id: sale.sale_id,
                            sale_prod_id: element.prod_id,
                            sale_rate: element.prod_sale_rate,
                            sale_prod_purchase_rate: element.prod_purchase_rate,
                            sale_qty: element.prod_qty,
                            sale_prod_total: element.prod_total,
                            sale_d_status:'a',
                            sale_d_branch_id:req.user.user_branch_id,
                          }
                          
                          let [qryErr,data] = await _p(db.insert('tbl_quotation_details',savePayload).then((result)=>{
                            return result;
                        }));
  
                       
                      
                      });/// Loop end
                        res.json({error:false,message:{quotationId:sale.sale_id,msg:'Quotation '}});
                      }
              });





              router.post('/api/update-service',async(req,res,next)=>{
                let service = req.body.service;
                let cart = req.body.cart;
                        // new customer add
                        let service_customer_id = service.customer_id;
                            if(service.customer_id=='0'){
    
                            let codePromise = salesMd.getCustomerCode()
                            let cutomerCode = await Promise.all([codePromise])
                        
                              let newCustomerData = {
                              customer_code: cutomerCode[0],
                              customer_address: service.customer_address,
                              customer_mobile_no: service.customer_mobile_no,
                              customer_name: service.customer_name,
                              customer_type: 'general',
                              customer_created_isodt:getCurrentISODT(),
                              customer_branch_id:req.user.user_branch_id,
                              customer_created_by:req.user.user_id,
                              customer_status:'active'
                              }
                            let [scustomerErr,customerEnty] =  await _p(db.insert('tbl_customers',newCustomerData)).then((row)=>{
                                  return row
                            })
                            service_customer_id = customerEnty.insertId;
                            }
                        // end new customer
    
    
                          let servicePayload =  {
                            service_emp_id: service.service_emp_id,
                            service_customer_id: service_customer_id,
                            service_cus_type : service.service_cus_type,
                            service_pay_method : service.service_pay_method,
                            service_bank_id : service.service_bank_id,
                            service_created_isodt: service.created_isodt,
                            service_transport_cost: service.service_transport_cost,
                            service_subtotal_amount: service.sub_total,
                            service_vat_amount: service.vat,
                            service_vat_percent: service.vat_percent,
                            service_previous_due: service.previous_due,
                            service_discount_amount: service.discount,
                            service_discount_percent: service.discount_percent,
                            service_total_amount: service.total_amount,
                            service_paid_amount: service.paid,
                            service_due_amount: service.due,
                            service_note: service.note,
                            service_branch_id:req.user.user_branch_id,
                          }
                        let smUpdateCond = {
                          service_id: service.service_id
                        }
    
                        let [serviceDataErr,serviceData] = await _p(db.update('tbl_service_master',servicePayload,smUpdateCond).then((result)=>{
                            return result;
                        }));
                        if(serviceDataErr && !serviceData){
                        return next(serviceDataErr);
                        }
                        else{ 
                          
                     
    
    
                          
                          await _p(db.delete(`tbl_service_details`,{service_id:service.service_id}))
    
                        
                          cart.forEach(async (element )=> {
                           
    
                            let savePayload = {
                              service_id: service.service_id,
                              service_prod_id: element.prod_id,
                              service_rate: element.prod_service_rate,
                              service_qty: element.prod_qty,
                              service_prod_total: element.prod_total,
                              service_d_status:'a',
                              service_d_branch_id:req.user.user_branch_id,
                            }
                            
                            let [qryErr,data] = await _p(db.insert('tbl_service_details',savePayload).then((result)=>{
                              return result;
                          }));
    
                        
                        
                        });/// Loop end
                          res.json({error:false,message:{serviceId:service.service_id,msg:'Service '}});
                        }
                });

            router.post('/api/update-sale',async(req,res,next)=>{
            let sale = req.body.sale;
            let cart = req.body.cart;
                    // new customer add
                    let sale_customer_id = sale.customer_id;
                        if(sale.customer_id=='0'){

                        let codePromise = salesMd.getCustomerCode()
                        let cutomerCode = await Promise.all([codePromise])
                    
                          let newCustomerData = {
                          customer_code: cutomerCode[0],
                          customer_address: sale.customer_address,
                          customer_mobile_no: sale.customer_mobile_no,
                          customer_name: sale.customer_name,
                          customer_type: 'general',
                          customer_created_isodt:getCurrentISODT(),
                          customer_branch_id:req.user.user_branch_id,
                          customer_created_by:req.user.user_id,
                          customer_status:'active'
                          }
                        let [scustomerErr,customerEnty] =  await _p(db.insert('tbl_customers',newCustomerData)).then((row)=>{
                              return row
                        })
                        sale_customer_id = customerEnty.insertId;
                        }
                    // end new customer


                      let salePayload =  {
                        sale_emp_id: sale.sale_emp_id,
                        sale_customer_id: sale_customer_id,
                        sale_cus_type : sale.sale_cus_type,
                        sale_pay_method : sale.sale_pay_method,
                        sale_bank_id : sale.sale_bank_id,
                        sale_created_isodt: sale.created_isodt,
                        sale_transport_cost: sale.sale_transport_cost,
                        sale_subtotal_amount: sale.sub_total,
                        sale_vat_amount: sale.vat,
                        sale_vat_percent: sale.vat_percent,
                        sale_previous_due: sale.previous_due,
                        sale_discount_amount: sale.discount,
                        sale_discount_percent: sale.discount_percent,
                        sale_total_amount: sale.total_amount,
                        sale_paid_amount: sale.paid,
                        sale_due_amount: sale.due,
                        sale_note: sale.note,
                        sale_branch_id:req.user.user_branch_id,
                      }
                    let smUpdateCond = {
                        sale_id: sale.sale_id
                    }

                    let [soldDataErr,soldData] = await _p(db.update('tbl_sales_master',salePayload,smUpdateCond).then((result)=>{
                        return result;
                    }));
                    if(soldDataErr && !soldData){
                    return next(soldDataErr);
                    }
                    else{ 
                      
                    let [oldSalesErr,oldSales] =  await _p(db.query('select * from tbl_sales_details where sale_id=? ',sale.sale_id)).then(res=>{
                        return res;
                      });

                    oldSales.map(async(oldProduct)=>{
                      await _p(db.query(`update tbl_product_current_stock set sale_qty=sale_qty-? where prod_id=? and branch_id=?  `,[oldProduct.sale_qty,oldProduct.sale_prod_id,oldProduct.sale_d_branch_id]).then((res=>{
                          return res;
                        })))

                      })


                      
                      await _p(db.delete(`tbl_sales_details`,{sale_id:sale.sale_id}))

                    
                      cart.forEach(async (element )=> {
                         // Get Current purchase avarage rate
                      let [currProdRateErr,currProdAvgRate] =  await _p(db.selectSingleRow(`select prod_avarage_rate from tbl_product_purchase_rate where product_id=? and branch_id=?  `,[element.prod_id,req.user.user_branch_id]).then((res)=>{
                        return res;
                      }));

                        let savePayload = {
                          sale_id: sale.sale_id,
                          sale_prod_id: element.prod_id,
                          sale_rate: element.prod_sale_rate,
                          sale_prod_purchase_rate: currProdAvgRate.prod_avarage_rate,
                          sale_qty: element.prod_qty,
                          sale_prod_total: element.prod_total,
                          sale_d_status:'a',
                          sale_d_branch_id:req.user.user_branch_id,
                          sale_date_time: sale.created_isodt,
                        }
                        
                        let [qryErr,data] = await _p(db.insert('tbl_sales_details',savePayload).then((result)=>{
                          return result;
                      }));

                      let [errStockCheck,stockData] =  await _p(db.countRows(`select * from tbl_product_current_stock where prod_id=? and branch_id=?  `,[element.prod_id,req.user.user_branch_id]).then((res)=>{
                            return res;
                      }));
                      if( stockData>0){
                      let[a,b] =  await _p(db.query(`update tbl_product_current_stock set sale_qty=sale_qty+? where prod_id=? and branch_id=?  `,[element.prod_qty,element.prod_id,req.user.user_branch_id]).then((res=>{
                          return res;
                        })))
                      }else{
                        let savePayload = {
                          prod_id: element.prod_id,
                          sale_qty: element.sale_qty,
                          branch_id: req.user.user_branch_id,
                        }
                        let  [qryErr,data] = await _p(db.insert('tbl_product_current_stock',savePayload).then((result)=>{
                          return result;
                      }));
                      }
                    
                    });/// Loop end
                      res.json({error:false,message:{saleId:sale.sale_id,msg:'Sale '}});
                    }
            });

            router.get('/api/quotation-invoices',async (req,res,next)=>{
              let cluases = ``
           
              let [saleErr,sale] = await _p(db.query(`select sm.sale_id ,sm.sale_invoice
              from tbl_quotation_master as sm
              where sm.sale_status='a' and sm.sale_branch_id=? 
              ${cluases}
              order by sm.sale_id desc`,[req.user.user_branch_id])).then(sale=>{
                return sale;
              })
  
              res.json(sale);
              })

            router.get('/api/sales-invoices',async (req,res,next)=>{
            let cluases = ``
            let [saleErr,sale] = await _p(db.query(`select sm.sale_id ,sm.sale_invoice
            from tbl_sales_master as sm
            where sm.sale_status='a' and sm.sale_branch_id=?
            ${cluases}
            order by sm.sale_id desc`,[req.user.user_branch_id])).then(sale=>{
              return sale;
            })

            res.json(sale);
            })

            router.get('/api/service-invoices',async (req,res,next)=>{
              let cluases = ``
              let [serviceErr,service] = await _p(db.query(`select sm.service_id,sm.service_invoice
              from tbl_service_master as sm
              where sm.service_status='a' and sm.service_branch_id=?
              ${cluases}
              order by sm.service_id  desc`,[req.user.user_branch_id])).then(service=>{
                return service;
              })
  
              res.json(service);
              })

            router.post('/api/get-sales-return-list',async (req,res,next)=>{
              let payLoad = req.body;
              let cluases = ``
                  if(payLoad.customerId != undefined && payLoad.customerId != null && payLoad.customerId != ''){
                    cluases += ` and sr.sale_cus_id = ${payLoad.customerId} `
                  }


                  if(payLoad.productId != undefined && payLoad.productId != null && payLoad.productId != ''){
                    cluases += ` and srd.return_prod_id = ${payLoad.productId} `
                  }
  
                  if(payLoad.fromDate != undefined && payLoad.toDate != undefined &&  payLoad.fromDate != null && payLoad.toDate != ''){
                    cluases += ` and sr.sale_return_created_isodt between '${payLoad.fromDate}' and '${payLoad.toDate}' `
                  }
  
               let [returnDetailErr,returnDetail] =  await _p(db.query(`select srd.return_qty,
                srd.return_prod_rate,
                srd.return_amount,
                sr.sale_invoice,
                sr.sale_return_note,
                sr.sale_return_created_isodt,
                prod.prod_code,pn.prod_name,
                c.customer_name,
                c.customer_code
  
                from tbl_sales_return_details  srd
                left join tbl_products prod on srd.return_prod_id = prod.prod_id
                left join tbl_products_names pn on prod.prod_name_id = pn.prod_name_id
                left join tbl_sales_return sr on sr.sale_return_id  = srd.sale_return_id
                left join tbl_customers c on c.customer_id = sr.sale_cus_id
                where sr.sale_return_branch_id = ? 
                ${cluases}
                order by srd.sale_return_d_id  desc
                `,[req.user.user_branch_id]).then(result=>{
                  return result;
                }))
  
                if(returnDetailErr && !returnDetail){
                  return next(returnDetailErr)
                }
                res.json(returnDetail)
              })
              router.post(`/api/get-quotations`,async (req,res,next)=>{
                let payload = req.body.reqPayload;
    
                let cluases = ``;
                if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
                  cluases += ` and sm.sale_created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}' `;
                }
    
                if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Customer' && payload.customerId!=null && payload.customerId != '0'){
                  cluases += ` and sm.sale_customer_id=${payload.customerId}`;
                }
    
                if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Customer' && payload.customerId=='0'){
                  cluases += ` and sm.sale_cus_type = 'general' `;
                }
    
    
                if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Employee'){
                  cluases += ` and sm.sale_emp_id=${payload.employeeId}`;
                }
                if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By User'){
                  cluases += ` and sm.sale_created_by=${payload.userId}`;
                }
    
    
    
                let [saleErr,sale] = await _p(db.query(`select sm.*,cus.customer_name,cus.customer_address,
                cus.customer_mobile_no,emp.employee_name,u.user_full_name,concat(bacc.bank_name,' - ',bacc.bank_acc_number) as bank_display_name
                from tbl_quotation_master as sm
                left join tbl_bank_accounts bacc on bacc.bank_acc_id = sm.sale_bank_id 
                left join tbl_employees as emp on sm.sale_emp_id =  emp.employee_id 
                left join tbl_customers as cus on sm.sale_customer_id =  cus.customer_id 
                left join tbl_users as u on  sm.sale_created_by = u.user_id
                where sm.sale_status='a' and sm.sale_branch_id=?  ${cluases} order by sm.sale_id desc`,[req.user.user_branch_id])).then(sale=>{
                  return sale;
                })
    
                res.json({error:false,
                  message: sale         
                });
                })

            router.post(`/api/get-sales`,async (req,res,next)=>{
            let payload = req.body.reqPayload;

            let cluases = ``;
            if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
              cluases += ` and sm.sale_created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}' `;
            }

            if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Customer' && payload.customerId!=null && payload.customerId != '0'){
              cluases += ` and sm.sale_customer_id=${payload.customerId}`;
            }

            let areaCluases = ` `

            if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Area' && payload.areaId!=null && payload.areaId != '0'){
              areaCluases += ` and cus.customer_area_id =  ${payload.areaId}   `;
            }


            if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Customer' && payload.customerId=='0'){
              cluases += ` and sm.sale_cus_type = 'general' `;
            }


            if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Employee'){
              cluases += ` and sm.sale_emp_id=${payload.employeeId}`;
            }
            if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By User'){
              cluases += ` and sm.sale_created_by=${payload.userId}`;
            }



            let [saleErr,sale] = await _p(db.query(`select sm.*,cus.customer_name,
            cus.customer_address,
            cus.customer_institution_name,
            cus.customer_mobile_no,emp.employee_name,u.user_full_name,concat(bacc.bank_name,' - ',bacc.bank_acc_number) as bank_display_name
            from tbl_sales_master as sm
            left join tbl_bank_accounts bacc on bacc.bank_acc_id = sm.sale_bank_id 
            left join tbl_employees as emp on sm.sale_emp_id =  emp.employee_id 
            left join tbl_customers as cus on sm.sale_customer_id =  cus.customer_id 
            left join tbl_users as u on  sm.sale_created_by = u.user_id
            where sm.sale_status='a' and sm.sale_branch_id=? ${areaCluases} ${cluases} order by sm.sale_id desc`,[req.user.user_branch_id])).then(sale=>{
              return sale;
            })

            res.json({error:false,
              message: sale         
            });
            });
 

            router.post(`/api/get-service`,async (req,res,next)=>{
              let payload = req.body.reqPayload;
  
              let cluases = ``;
              if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
                cluases += ` and sm.service_created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}' `;
              }
  
              if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Customer' && payload.customerId!=null && payload.customerId != '0'){
                cluases += ` and sm.service_customer_id=${payload.customerId}`;
              }
  
              if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Customer' && payload.customerId=='0'){
                cluases += ` and sm.service_cus_type = 'general' `;
              }
  
  
              if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Employee'){
                cluases += ` and sm.service_emp_id=${payload.employeeId}`;
              }
              if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By User'){
                cluases += ` and sm.service_created_by=${payload.userId}`;
              }
  
  
  
              let [serviceErr,service] = await _p(db.query(`select sm.*,cus.customer_name,
              cus.customer_address,
              cus.customer_institution_name,
              cus.customer_mobile_no,emp.employee_name,u.user_full_name,concat(bacc.bank_name,' - ',bacc.bank_acc_number) as bank_display_name
              from tbl_service_master as sm
              left join tbl_bank_accounts bacc on bacc.bank_acc_id = sm.service_bank_id 
              left join tbl_employees as emp on sm.service_emp_id =  emp.employee_id 
              left join tbl_customers as cus on sm.service_customer_id =  cus.customer_id 
              left join tbl_users as u on  sm.service_created_by = u.user_id
              where sm.service_status='a' and sm.service_branch_id=?  ${cluases} order by sm.service_id desc`,[req.user.user_branch_id])).then(service=>{
                return service;
              })
  
              res.json({error:false,
                message: service         
              });
              });


            router.post(`/api/get-sales-with-details`,async (req,res,next)=>{
            let payload = req.body.reqPayload;

            let cluases = ``;
            if(payload.saleId != undefined ){
            cluases += ` and sm.sale_id = ${payload.saleId} `;
            }

            let orderBy = ` order by sm.sale_id desc `

           

              if(payload.from == 'invoice' ){
                orderBy = ` order by sm.sale_id desc limit 1 `;
                }



            if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
            cluases += ` and sm.sale_created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}'`;
            }


            if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Customer'){
            cluases += ` and sm.sale_customer_id=${payload.customerId}`;
            }
            if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Employee'){
            cluases += ` and sm.sale_emp_id=${payload.employeeId}`;
            }
            if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By User'){
            cluases += ` and sm.sale_created_by=${payload.userId}`;
            }
            let [saleErr,sale] = await _p(db.query(`select sm.*,cus.customer_credit_limit,
            cus.customer_name,cus.customer_mobile_no,cus.customer_code,
            cus.customer_institution_name,
            cus.customer_address,cus.customer_mobile_no,cus.customer_id,emp.employee_name,u.user_full_name,
            concat(bacc.bank_acc_number) as bank_display_name
            from tbl_sales_master as sm
            left join tbl_employees as emp on sm.sale_emp_id =  emp.employee_id 
            left join tbl_bank_accounts as bacc on sm.sale_bank_id =  bacc.bank_acc_id 
            left join tbl_customers as cus on sm.sale_customer_id =  cus.customer_id 
            left join tbl_users as u on  sm.sale_created_by = u.user_id
            where sm.sale_status='a' and sm.sale_branch_id=?  ${cluases} 
            ${orderBy} `,[req.user.user_branch_id])).then(sale=>{
            return sale;
            })
            if(!saleErr){
            var saleWithDetails =  sale.map(async (ele)=>{
            var [detailsErr,details] = await _p(db.query(`select sd.*,pn.prod_name,pu.prod_unit_name
            from tbl_sales_details as sd 
            left join  tbl_products p on  p.prod_id=sd.sale_prod_id 
            left join  tbl_products_names pn on pn.prod_name_id = p.prod_name_id 
            left join tbl_product_units pu on pu.prod_unit_id = p.prod_unit_id 
            where sd.sale_id=?`,[ele.sale_id])).then(rows=>{
                return rows;
            })
            ele.details = details;
            return ele;
            });


            }


            res.json({error:false,
            message: await  Promise.all(saleWithDetails)
            })
            });



            router.post(`/api/get-service-with-details`,async (req,res,next)=>{
              let payload = req.body.reqPayload;
  
              let cluases = ``;
              if(payload.serviceId != undefined ){
              cluases += ` and sm.service_id = ${payload.serviceId} `;
              }
  
              let orderBy = ` order by sm.service_id desc `
  
             
  
                if(payload.from == 'invoice' ){
                  orderBy = ` order by sm.service_id desc limit 1 `;
                  }
  
  
  
              if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
              cluases += ` and sm.service_created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}'`;
              }
  
  
              if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Customer'){
              cluases += ` and sm.service_customer_id=${payload.customerId}`;
              }
              if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Employee'){
              cluases += ` and sm.service_emp_id=${payload.employeeId}`;
              }
              if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By User'){
              cluases += ` and sm.service_created_by=${payload.userId}`;
              }
              let [serviceErr,service] = await _p(db.query(`select sm.*,cus.customer_credit_limit,
              cus.customer_name,cus.customer_mobile_no,cus.customer_code,
              cus.customer_institution_name,
              cus.customer_address,cus.customer_mobile_no,cus.customer_id,emp.employee_name,u.user_full_name,
              concat(bacc.bank_acc_number) as bank_display_name
              from tbl_service_master as sm
              left join tbl_employees as emp on sm.service_emp_id =  emp.employee_id 
              left join tbl_bank_accounts as bacc on sm.service_bank_id =  bacc.bank_acc_id 
              left join tbl_customers as cus on sm.service_customer_id =  cus.customer_id 
              left join tbl_users as u on  sm.service_created_by = u.user_id
              where sm.service_status='a' and sm.service_branch_id=?  ${cluases} 
              ${orderBy} `,[req.user.user_branch_id])).then(service=>{
              return service;
              })
              if(!serviceErr){
              var serviceWithDetails =  service.map(async (ele)=>{
              var [detailsErr,details] = await _p(db.query(`select sd.*,pn.prod_name,pu.prod_unit_name
              from tbl_service_details as sd 
              left join  tbl_products p on  p.prod_id=sd.service_prod_id 
              left join  tbl_products_names pn on pn.prod_name_id = p.prod_name_id 
              left join tbl_product_units pu on pu.prod_unit_id = p.prod_unit_id 
              where sd.service_id=?`,[ele.service_id])).then(rows=>{
                  return rows;
              })
              ele.details = details;
              return ele;
              });
  
  
              }
  
  
              res.json({error:false,
              message: await  Promise.all(serviceWithDetails)
              })
              })


            router.post(`/api/get-quotation-with-details`,async (req,res,next)=>{
              let payload = req.body.reqPayload;
              let cluases = ``;
              if(payload.saleId != undefined ){
               cluases += ` and sm.sale_id = ${payload.saleId} `;
              }
              

              let orderBy = ` order by sm.sale_id desc `

              if(payload.from == 'invoice' ){
                orderBy = ` order by sm.sale_id desc limit 1 `;
                }
  
              
              if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
              cluases += ` and sm.sale_created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}'`;
              }
  
  
              if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Customer'){
              cluases += ` and sm.sale_customer_id=${payload.customerId}`;
              }
              if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By Employee'){
              cluases += ` and sm.sale_emp_id=${payload.employeeId}`;
              }
              if(payload.selectedSearchType != undefined && payload.selectedSearchType=='By User'){
              cluases += ` and sm.sale_created_by=${payload.userId}`;
              }
              let [saleErr,sale] = await _p(db.query(`select sm.*,cus.customer_name,cus.customer_mobile_no,cus.customer_code,
              cus.customer_address,cus.customer_institution_name,cus.customer_mobile_no,cus.customer_id,emp.employee_name,u.user_full_name,
              concat(bacc.bank_name,' - ',bacc.bank_acc_number) as bank_display_name
              from tbl_quotation_master as sm
              left join tbl_employees as emp on sm.sale_emp_id =  emp.employee_id 
              left join tbl_bank_accounts as bacc on sm.sale_bank_id =  bacc.bank_acc_id 
              left join tbl_customers as cus on sm.sale_customer_id =  cus.customer_id 
              left join tbl_users as u on  sm.sale_created_by = u.user_id
              where sm.sale_status='a' and sm.sale_branch_id=? ${cluases}
              ${orderBy}  `,[req.user.user_branch_id])).then(sale=>{
              return sale;
              })
              if(!saleErr){
              var saleWithDetails =  sale.map(async (ele)=>{
              var [detailsErr,details] = await _p(db.query(`select sd.*,pn.prod_name
              from tbl_quotation_details as sd 
              left join  tbl_products p on  p.prod_id=sd.sale_prod_id 
              left join  tbl_products_names pn on pn.prod_name_id = p.prod_name_id 
              where sd.sale_id=?`,[ele.sale_id])).then(rows=>{
                  return rows;
              })
              ele.details = details;
              return ele;
              });
  
  
              }
  
  
              res.json({error:false,
              message: await  Promise.all(saleWithDetails)
              })
              })

              router.post('/api/get-sales-return-details',async(req,res,next)=>{
                let payload = req.body.reqPayload;
                      
                let cluases = ``;
                if(payload.saleId != undefined && payload.saleId!=''){
                  cluases += ` and sd.sale_id='${payload.saleId}'`;
                }
                
                let [saleDetailsErr,saleDetails] = await _p(db.query(`select sd.*,prod.prod_code,pn.prod_name,
                pc.prod_cat_name,pc.prod_cat_id,sm.sale_invoice,cus.customer_name,cus.customer_institution_name,sm.sale_created_isodt,
                ifnull(sum(srd.return_qty), 0.00) as returned_quantity,
                ifnull(sum(srd.return_amount), 0.00) as returned_amount,
                sr.sale_return_note
                from tbl_sales_details sd 
                left join tbl_products prod on sd.sale_prod_id = prod.prod_id
                left join tbl_products_names pn on prod.prod_name_id = pn.prod_name_id
                left join tbl_product_categories pc on prod.prod_cat_id = pc.prod_cat_id
                left join tbl_sales_master sm on sd.sale_id = sm.sale_id
                left join tbl_sales_return sr on sr.sale_invoice=sm.sale_invoice
                left join tbl_sales_return_details srd on srd.sale_return_id=sr.sale_return_id 
                and srd.return_prod_id = sd.sale_prod_id
                left join tbl_customers cus on sm.sale_customer_id = cus.customer_id
                where sd.sale_d_status='a'  ${cluases} group by sd.sale_prod_id   `).then((res)=>{
                  return res;
                }));
                if(saleDetailsErr && !saleDetails){
                  return next(saleDetailsErr)
                }else{
                  res.json({error:false,message:saleDetails});
                }
                });

          
                router.post('/api/get-quotation-details',async(req,res,next)=>{
                  let payload = req.body.reqPayload;
                    
                  let cluases = ``;
                  if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
                  cluases += ` and sm.sale_created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}'`;
                  }
      
                  if(payload.productId != undefined && payload.productId!=''){
                  cluases += ` and prod.prod_id='${payload.productId}'`;
                  }
      
                  if(payload.categoryId != undefined && payload.categoryId!=''){
                  cluases += ` and pc.prod_cat_id='${payload.categoryId}'`;
                  }
      
                  if(payload.saleId != undefined && payload.saleId!=''){
                  cluases += ` and sm.sale_id='${payload.saleId}'`;
                  }
      
                  let [saleDetailsErr,saleDetails] = await _p(db.query(`select sd.*,prod.prod_code,pn.prod_name,pc.prod_cat_name,pc.prod_cat_id,sm.sale_invoice,cus.customer_name,sm.sale_created_isodt
                  from tbl_quotation_details sd 
                  left join tbl_products prod on sd.sale_prod_id = prod.prod_id
                  left join tbl_products_names pn on prod.prod_name_id = pn.prod_name_id
                  left join tbl_product_categories pc on prod.prod_cat_id = pc.prod_cat_id
                  left join tbl_quotation_master sm on sd.sale_id = sm.sale_id
                  left join tbl_customers cus on sm.sale_customer_id = cus.customer_id
                  where sd.sale_d_status='a' ${cluases} `).then((res)=>{
                  return res;
                  }));
                  if(saleDetailsErr && !saleDetails){
                  return next(saleDetailsErr)
                  }else{
                  res.json({error:false,message:saleDetails});
                  }
                  })

            router.post('/api/get-sales-details',async(req,res,next)=>{
            let payload = req.body.reqPayload;
              
            let cluases = ``;
            if((payload.dateTimeFrom != undefined && payload.dateTimeFrom!='') &&  (payload.dateTimeTo != undefined && payload.dateTimeTo!='')){
            cluases += ` and sm.sale_created_isodt between '${payload.dateTimeFrom}' and '${payload.dateTimeTo}'`;
            }

            if(payload.productId != undefined && payload.productId!=''){
            cluases += ` and prod.prod_id='${payload.productId}'`;
            }

            if(payload.categoryId != undefined && payload.categoryId!=''){
            cluases += ` and pc.prod_cat_id='${payload.categoryId}'`;
            }

            if(payload.saleId != undefined && payload.saleId!=''){
            cluases += ` and sm.sale_id='${payload.saleId}'`;
            }

            let [saleDetailsErr,saleDetails] = await _p(db.query(`select sd.*,prod.prod_code,pn.prod_name,pc.prod_cat_name,pc.prod_cat_id,sm.sale_invoice,cus.customer_name,sm.sale_created_isodt
            from tbl_sales_details sd 
            left join tbl_products prod on sd.sale_prod_id = prod.prod_id
            left join tbl_products_names pn on prod.prod_name_id = pn.prod_name_id
            left join tbl_product_categories pc on prod.prod_cat_id = pc.prod_cat_id
            left join tbl_sales_master sm on sd.sale_id = sm.sale_id
            left join tbl_customers cus on sm.sale_customer_id = cus.customer_id
            where sd.sale_d_status='a' ${cluases} `).then((res)=>{
            return res;
            }));
            if(saleDetailsErr && !saleDetails){
            return next(saleDetailsErr)
            }else{
            res.json({error:false,message:saleDetails});
            }
            })

            router.post(`/api/sale-delete`,async(req,res,next)=>{
            let cond = {sale_id: req.body.saleId}
            let [saleDataErr,saleData] = await _p(db.update('tbl_sales_master',{sale_status:'d'},cond).then((result)=>{
              return result;
            }));

            if(saleDataErr && !saleData){
            return next(saleDataErr);
            }else{

              let [oldSalesErr,oldSales] =  await _p(db.query('select * from tbl_sales_details where sale_id=? ',req.body.saleId)).then(res=>{
                return res;
              });



            let cond = {sale_id:req.body.saleId}
            let [saleDataErr,purchaseData] = await _p(db.update('tbl_sales_details',{sale_d_status:'d'},cond).then((result)=>{
              return result;
            }));



           

           oldSales.map(async(oldProduct)=>{
              await _p(db.query(`update tbl_product_current_stock set sale_qty=sale_qty-? where prod_id=? and branch_id=?  `,[oldProduct.sale_qty,oldProduct.sale_prod_id,oldProduct.sale_d_branch_id]).then((res=>{
                return res;
              })))

            })
 
            }
            res.json({error:false,message:'Sale Deleted successfully.'})
            })


            router.post(`/api/service-delete`,async(req,res,next)=>{
              let cond = {service_id: req.body.serviceId}
              let [serviceDataErr,serviceData] = await _p(db.update('tbl_service_master',{service_status:'d'},cond).then((result)=>{
                return result;
              }));
  
              if(serviceDataErr && !serviceData){
              return next(serviceDataErr);
              }else{

              let cond = {service_id:req.body.serviceId}
              let [serviceDataErr,purchaseData] = await _p(db.update('tbl_service_details',{service_d_status:'d'},cond).then((result)=>{
                return result;
              }));

              }
              res.json({error:false,message:'Service Deleted successfully.'})
              })

            router.post(`/api/quotation-delete`,async(req,res,next)=>{
              let cond = {sale_id: req.body.saleId}
              let [saleDataErr,saleData] = await _p(db.update('tbl_quotation_master',{sale_status:'d'},cond).then((result)=>{
                return result;
              }));
              if(saleDataErr && !saleData){
              return next(saleDataErr);
              }else{
              let cond = {sale_id:req.body.saleId}
              let [saleDataErr,purchaseData] = await _p(db.update('tbl_quotation_details',{sale_status:'d'},cond).then((result)=>{
                return result;
              }));
  
              }
              res.json({error:false,message:'Quotation Deleted successfully.'})
              })


            router.post('/api/sales-return',async(req,res,next)=>{
              let cart = req.body.returnCart;
              let selectedInvoice = req.body.selectedInvoice;
              
              let returnData = {
                  'sale_invoice':selectedInvoice.sale_invoice,
                  'sale_cus_id': selectedInvoice.sale_customer_id,
                  'sale_return_amount':selectedInvoice.sale_return_amount,
                  'sale_return_note':selectedInvoice.sale_return_note,
                  'sale_return_status':'a',
                  'sale_return_created_by':req.user.user_id,
                  'sale_return_created_isodt':selectedInvoice.created_isodt,
                  'sale_return_branch_id':req.user.user_branch_id,
              }


            let [saleReturnErr,saleReturn] =   await _p(db.insert('tbl_sales_return',returnData).then((result)=>{
                return result;
            }));
            if(saleReturnErr && !saleReturn){
              return next(saleReturnErr)
            }else{
              cart.forEach(async (product)=>{
                let returnDetailData = {
                  sale_return_id:saleReturn.insertId,
                  return_prod_id: product.sale_prod_id,
                  return_qty: product.return_qty,
                  return_prod_rate: product.sale_rate,
                  return_amount: product.return_amount,
                  return_status	:'a',
                  return_branch_id: req.user.user_branch_id,
                }
                let [saleReturnErrD,saleReturnD] =   await _p(db.insert('tbl_sales_return_details',returnDetailData).then((result)=>{
                  return result;
              }));

              // Current Stock sale  return   add
              let[stockUpdateErr,stockUpdate] =  await _p(db.query(`update tbl_product_current_stock set sale_return_qty=sale_return_qty+? where prod_id=? and branch_id=?  `,[product.return_qty,product.sale_prod_id,req.user.user_branch_id]).then((res=>{
                return res;
              })));
              if(stockUpdateErr && !stockUpdate){
                return next(stockUpdateErr)
              }
              // End 

              })
            }
            if(saleReturn){
              res.json({error:false,message:'Return successfully.'})
            }
              
            })


            module.exports = router; 