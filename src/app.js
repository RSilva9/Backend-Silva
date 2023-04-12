import express from 'express';
import multer from 'multer';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js';

var app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))

// MULTER---------------------------
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})
const uploader = multer({storage})
// MULTER---------------------------

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(8080, ()=>{
    console.log("Server Up.")
})