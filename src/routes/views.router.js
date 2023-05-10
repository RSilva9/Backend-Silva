import { Router } from "express";
import { cartManager } from '../dao/managersMongo/CartManager.js'
import { productModel } from "../dao/models/products.model.js";
import { cartModel } from "../dao/models/carts.model.js";

export const viewsRouter = Router()

viewsRouter.get('/productos', async(req, res)=>{
    const products = await productModel.find({}).sort({}).limit(10).lean()
    res.render('realTimeProducts', {products})
})

viewsRouter.get('/carts/:cid', async(req, res)=>{
    const cid = req.params.cid
    let cart = await cartModel.findOne({id: cid}).lean()
    let cartProducts = cart.products
    const cartProductsArray = []
    cartProducts.forEach(prod=>{
        cartProductsArray.push(prod)
    })
    console.log(cart)
    console.log(cartProductsArray)
    const data = {
        cart: cart,
        cartProductsArray: cartProductsArray
    }
    res.render('carts', data)
})