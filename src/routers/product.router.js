import express from 'express'
import productController from '../controllers/product.controller.js'

const productRouter = express.Router()

productRouter.get('/', productController.getProducts)
productRouter.get('/:pid', productController.getProductById)
productRouter.post('/', productController.isAdminOrPremium, productController.addProduct)
productRouter.put('/:pid', productController.updateProduct)
productRouter.delete('/:pid', productController.deleteProduct)

export default productRouter