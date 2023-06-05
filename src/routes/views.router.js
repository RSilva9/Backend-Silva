import { Router } from "express";
import { cartManager } from '../dao/managersMongo/CartManager.js'
import { productModel } from "../dao/models/products.model.js";
import { cartModel } from "../dao/models/carts.model.js";

export const viewsRouter = Router()

function auth(req, res, next){
    if(req.session.user){
        return next()
    }
    return res.status(401).send('Authentication error.')
}

viewsRouter.get('/', async(req, res)=>{
    if(req.session.user){
        const data = req.session.user.cartId
        res.render('inicio', {data})
    }else{
        res.render('inicio')
    }
})

viewsRouter.get('/productos', auth, async(req, res)=>{
    const products = await productModel.find({}).sort({}).limit(10).lean()
    const data = {
        products: products,
        user: req.session.user
    }
    res.render('realTimeProducts', data)
})

viewsRouter.get('/carts/:cid', auth, async(req, res)=>{
    const cid = req.params.cid
    const carts = await cartModel.find({}).sort({}).limit(100).lean()
    if(+cid < 1 || +cid > carts.length){
        return res.status(401).send('Cart not found')
    }else{
        let cart = await cartModel.findOne({id: cid}).lean()
        let cartProducts = cart.products
        const cartProductsArray = []
        cartProducts.forEach(prod=>{
            cartProductsArray.push(prod)
        })
        const data = {
            cart: cart,
            cartProductsArray: cartProductsArray,
            user: req.session.user
        }
        res.render('carts', data)
    }
})

viewsRouter.get('/profile', auth, async(req, res)=>{
    const data = req.session.user
    res.render('profile', {data})
})