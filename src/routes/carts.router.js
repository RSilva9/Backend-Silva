import { Router } from "express";
import cartManager from "../managersJS/CartManager.js"

const cartsRouter = Router()
const carts = []

cartsRouter.get('/', (req, res)=>{
    let limite = +req.query.limit
    res.send(cartManager.getCarts(limite))
})

cartsRouter.get('/:cid', (req, res)=>{
    res.send(cartManager.getCartById(req.params.cid))
})

cartsRouter.post('/', (req, res)=>{
    cartManager.addCart()
})

cartsRouter.post('/:cid/product/:pid', (req, res)=>{
    let cartId = req.params.cid
    let prodId = req.params.pid
    cartManager.addProductToCart(cartId, prodId)
})

export default cartsRouter;