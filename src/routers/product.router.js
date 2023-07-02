import express from 'express'
import productController from '../controllers/product.controller.js'

const productRouter = express.Router()

productRouter.get('/', productController.getProducts)
productRouter.get('/:pid', productController.getProductById)
productRouter.post('/', productController.isAdmin, productController.addProduct)
productRouter.put('/:pid', productController.isAdmin, productController.updateProduct)
productRouter.delete('/:pid', productController.isAdmin, productController.deleteProduct)

export default productRouter