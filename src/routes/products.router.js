import { Router } from "express";
import { productManager } from '../dao/managersMongo/ProductManager.js'

export const productRouter = Router()

productRouter.get('/', async(req, res)=>{
    try {
        var limit = +req.query.limit
        var page = +req.query.page
        var query = req.query.query
        var sort = req.query.sort
        if(!limit) limit = 10
        if(query) query = JSON.parse(query)
        if(sort) sort = JSON.parse(sort)

        const products = await productManager.getProducts(limit,page,query,sort)
        res.status(200).send({
            status: 'success',
            payload: products
        })

    } catch (error) {
        res.status(400).send({status: 'error', message: error.message})
    }
})

productRouter.get('/:pid', async(req, res)=>{
    try {
        const product = await productManager.getProductById(+req.params.pid)
        product ?
        res.status(200).send({
            status: 'success',
            payload: product
        })
        :
        res.status(404).send({
            status: 'Product not found.',
        })
    } catch (error) {
        res.status(400).send({status: 'error', message: error.message})
    }
})

productRouter.post('/', async(req, res)=>{
    try {
        const {title, description, code, price, stock, category, thumbnail} = req.body
        var products = await productManager.getProducts()
        let id
        if(products.length === 0){
            id = 1
        }else{
            id = products[products.length-1].id + 1
        }
        if(title, description, code, price, stock, category, thumbnail){
            await productManager.addProduct(id, title, description, code, +price, +stock, category, thumbnail)
            res.status(200).send({
                status: `New product added with id: ${id}`,
            })
        }else{
            res.send("Please, fill all the fields.")
        }
        
    } catch (error) {
        res.status(400).send({status: 'error', message: error.message})
    }
})

productRouter.put('/:pid', async(req, res)=>{
    try {
        const updProd = req.body
        productManager.updateProduct(req.params.pid, Object.keys(updProd), Object.values(updProd))
        res.status(200).send({
            status: `Product updated (id: ${req.params.pid}). Values updated: ${JSON.stringify(updProd)}`,
        })
    } catch (error) {
        res.status(400).send({status: 'error', message: error.message})
    }
    
})

productRouter.delete('/:pid', async (req, res)=>{
    try {
        await productManager.deleteProduct(req.params.pid)
        res.status(200).send({
            status: `Product deleted (id: ${req.params.pid})`,
        })
    } catch (error) {
        res.status(400).send({status: 'error', message: error.message})
    }
    
})