import express from 'express'
import cartController from '../controllers/cart.controller.js'

const cartRouter = express.Router()

cartRouter.get('/', cartController.getCarts)
cartRouter.get('/:cid', cartController.getCartById)
cartRouter.post('/', cartController.createCart)
cartRouter.put('/:cid/product/:pid', cartController.addProductToCart)
cartRouter.delete('/:cid', cartController.deleteCart)

export default cartRouter