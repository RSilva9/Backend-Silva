import { Router } from "express";
import { cartManager } from "../dao/managersMongo/CartManager.js";
import { productManager } from "../dao/managersMongo/ProductManager.js";
import { cartModel } from "../dao/models/carts.model.js";

export const cartRouter = Router()

cartRouter.get('/:cid', async(req, res)=>{
    const cid = req.params.cid
    const cart = await cartManager.getCartById(cid)

    res.status(200).send({
        status: 'success',
        payload: cart
    })
})

cartRouter.delete('/:cid/products/:pid', async(req, res)=>{
    const cid = req.params.cid
    const pid = req.params.pid

    const cart = await cartManager.getCartById(cid)
    const product = await productManager.getProductById(pid)
    cart.products.pop({product: product._id})
    await cartModel.updateOne({id: cid}, cart)

    res.status(200).send({
        status: `Product (_id: ${product._id}) removed from cart.`
    })
})

cartRouter.delete('/:cid', async(req, res)=>{
    const cid = req.params.cid

    const cart = await cartManager.getCartById(cid)
    cart.products = []
    await cartModel.updateOne({id: cid}, cart)
    res.status(200).send({
        status: `Cart (id: ${cid}) emptied.`
    })
})

cartRouter.put('/:cid', async(req, res)=>{
    const cid = req.params.cid
    const product1 = await productManager.getProductById(1)
    const product2 = await productManager.getProductById(2)
    const product3 = await productManager.getProductById(3)
    const product4 = await productManager.getProductById(4)
    const testArray = [
        {
            product: product1._id,
            quantity: 1
        },
        {
            product: product2._id,
            quantity: 1
        },
        {
            product: product3._id,
            quantity: 1
        },
        {
            product: product4._id,
            quantity: 1
        }
    ]

    const cart = await cartManager.getCartById(cid)
    cart.products = testArray
    
    await cartModel.updateOne({id: cid}, cart)
    res.status(200).send({
        status: `Products added to cart successfuly.`
    })
})

cartRouter.put('/:cid/products/:pid', async(req, res)=>{
    const cid = req.params.cid
    const pid = req.params.pid
    const bodyQuantity = req.body.quantity

    const cart = await cartManager.getCartById(cid)
    const product = await productManager.getProductById(pid)
    for(let prod of cart.products){
        if(prod.product.id == pid){
            prod.quantity += Number(bodyQuantity)
        }
    }
    
    await cartModel.updateOne({id: cid}, cart)
    res.status(200).send({
        status: `Prodcut (_id: ${product._id}) updated successfuly.`
    })
})