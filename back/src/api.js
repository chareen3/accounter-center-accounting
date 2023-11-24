const express = require('express');
const app     = express();
const bp      = require('body-parser');
const fileUpload = require('express-fileupload');
const path    = require('path')

// Socket Requirements
const http    = require('http');
const socketio= require('socket.io');
const server  = http.createServer(app);
const io      = socketio(server); 
app.io = io;
// Controlers

const _p      = require('../src/utils/promise_error');
const  {Database}   = require('../src/utils/Database');
let    db = new Database();

const signup  = require('./controlers/signup');
const signin   = require('./controlers/signin');
const administration   = require('./controlers/administration');
const customer   = require('./controlers/customer');

const purchase   = require('./controlers/purchase');
const supplier   = require('./controlers/supplier');
const acount   = require('./controlers/account');
const stock   = require('./controlers/stock');
const product   = require('./controlers/product');
const sales   = require('./controlers/sales');
const hrpayroll   = require('./controlers/hrpayroll');
const production   = require('./controlers/production');

// Middlewares
const auth    = require('./middlewares/auth');
const cros    = require('./middlewares/cros');
const errh    = require('./middlewares/error_handler');
const  {checkAuth}  = require('./checksuthforsoket')
app.use(cros);
app.use(bp.json());
app.use('/api',auth);
app.use(fileUpload());

app.use('',express.static(`uploads`));

app.use(purchase);
app.use(signin);
app.use(signup);
app.use(administration);
app.use(stock);
app.use(hrpayroll);
app.use(customer);
app.use(supplier);
app.use(acount);
app.use(product);
app.use(sales);
app.use(production);


io.on('connection',socket=>{
    socket.on('products',async (smg)=>{
        let check = checkAuth(smg['auth-token']);
        if(check){
            let cluases = " ";
    if(smg['select-type']=='active'){
        cluases += "  p.prod_status='active' and "
    }
    let [productsError,products] =  await _p(db.query(`select p.*,ifnull(pr.prod_avarage_rate,0)as prod_purchase_rate,
    c.prod_cat_name,b.prod_brand_name,
    color.prod_color_name,pn.prod_name,u.prod_unit_name from 
    tbl_products p  left join tbl_product_categories c on p.prod_cat_id = c.prod_cat_id
    left join tbl_product_brands b on p.prod_brand_id = b.prod_brand_id
    left join tbl_product_colors color on p.prod_color_id = color.prod_color_id
    left join tbl_products_names pn on p.prod_name_id = pn.prod_name_id
    left join tbl_product_units u on p.prod_unit_id = u.prod_unit_id
    left join tbl_product_purchase_rate pr on p.prod_id = pr.product_id 
    and pr.branch_id =?
    where   ${cluases}    find_in_set(?,p.prod_branch_ids)    
    order by prod_status `,[check.user_branch_id,check.user_branch_id])).then(result=>{
        return result;
    });
    if(productsError && !products){
        io.to(socket.id).emit('products', {error:true,data:productsError});
    }else{
        io.to(socket.id).emit('products', {error:false,data:products});
    }
            
        }
        
    })
 })


app.use(errh);

const _PORT = process.env.PORT || 5000;
server.listen(_PORT,()=>{
    console.log(`Api is Running on port... ${_PORT}`)
});