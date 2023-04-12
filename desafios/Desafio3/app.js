import express from 'express';
import productManager from './ProductManager.js';

var app = express()
const products = productManager.getProducts()

app.use(express.urlencoded({extended:true}))

app.get('/', (req, res)=>{
    res.send("Hola a todos! Inicio de la app.")
})

app.get('/products', (req, res)=>{
    let limite = +req.query.limit
    if(!limite || limite > products.length || limite < 0){
        res.send(products)
    }else{
        const newArray = []
        for(let i=0; i<limite; i++){
            newArray.push(products[i])
        }
        res.send(newArray)
    }
})

app.get('/products/:pid', (req, res)=>{
    if(+req.params.pid > products.length || +req.params.pid < 1){
        res.send("Producto no encontrado.")
    }else{
        res.send(productManager.getProductById(req.params.pid))
    }
})

app.listen(8080, ()=>{
    console.log("Server Up.")
})