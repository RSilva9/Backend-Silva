import { Router } from "express";
import { productManager } from '../dao/managersMongo/ProductManager.js'

const productRouter = Router()

productRouter.get('/', async(req, res)=>{
    try{
        const products = await productManager.getProducts()
        const limit = +req.query.limit
        var finalArray = []
        if(limit){
            finalArray = products.slice(0, limit)
            res.render('realTimeProducts', {finalArray})
        }else{
            finalArray = products
            res.render('realTimeProducts', {finalArray})
        }      
    }catch(error){
        res.status(400).send({status: 'error', message: error.message})
    }
})

productRouter.get('/:pid', async(req, res)=>{
    try {
        const product = await productManager.getProductById(+req.params.pid)
        if(product){
            const finalArray = [product]
            res.render('realTimeProducts', {finalArray})
        }else{
            res.send("Producto no encontrado.")
        }
        
    } catch (error) {
        res.status(400).send({status: 'error', message: error.message})
    }
})

productRouter.post('/', async(req, res)=>{
    try {
        const {title, description, code, price, stock, category, thumbnail} = req.body
        const products = await productManager.getProducts()
        let id
        if(products.length === 0){
            id = 1
        }else{
            id = products[products.length-1].id + 1
        }
        if(title, description, code, price, stock, category, thumbnail){
            await productManager.addProduct(id, title, description, code, +price, +stock, category, thumbnail)
            res.redirect('/')
        }else{
            res.send("Debe completar todos los campos")
        }
        
    } catch (error) {
        res.status(400).send({status: 'error', message: error.message})
    }
})

productRouter.put('/:pid', async(req, res)=>{
    res.redirect('/')
})

// productRouter.delete('/:pid', (req, res)=>{
//     productManager.deleteProduct(+req.params.pid)
// })

export default productRouter;