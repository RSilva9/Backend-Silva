import { Router } from "express";
import productManager from '../managersJS/ProductManager.js'

const productRouter = Router()
const allProducts = productManager.getProducts()

productRouter.get('/', (req, res)=>{

    res.render('index', {})
    // let limite = +req.query.limit
    // res.send(productManager.getProducts(limite))
})

productRouter.get('/:pid', (req, res)=>{
    if(+req.params.pid > allProducts.length || +req.params.pid < 1){
        res.send("Producto no encontrado.")
    }else{
        res.send(productManager.getProductById(req.params.pid))
    }
})

productRouter.put('/:pid', (req, res)=>{
    const updProd = req.body
    productManager.updateProduct(req.params.pid, Object.keys(updProd), Object.values(updProd))
})

productRouter.post('/', (req, res)=>{
    const {title, description, code, price, stock, category, thumbnail} = req.body
    let status = true
    productManager.addProduct(title, description, code, +price, status, +stock, category, thumbnail)
})

productRouter.delete('/:pid', (req, res)=>{
    productManager.deleteProduct(+req.params.pid)
})

export default productRouter;