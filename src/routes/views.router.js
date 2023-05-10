import { Router } from "express";
import { productManager } from '../dao/managersMongo/ProductManager.js'
import { productModel } from "../dao/models/products.model.js";
import { cartModel } from "../dao/models/carts.model.js";

export const viewsRouter = Router()

viewsRouter.get('/productos', async(req, res)=>{
    const products = await productModel.find({}).sort({}).limit(10).lean()
    res.render('realTimeProducts', {products})
})

viewsRouter.get('/carts/:cid', async(req, res)=>{
    var cart = await cartModel.find({"id": req.params.cid})
    console.log(cart)
    res.render('carts', {cart})
})