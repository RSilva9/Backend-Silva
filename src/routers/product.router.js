import express from 'express'
import productController from '../controllers/product.controller.js'
import multer from 'multer';

const productRouter = express.Router()

const destinationByFileType = (req, file, cb) => {
    cb(null, 'src/public/uploads/products')
}

const storage  = multer.diskStorage({
    destination: destinationByFileType,
    filename: function (req, file, cb) { cb(null, file.originalname) }
})

const upload = multer({storage: storage})

productRouter.get('/', productController.getProducts)
productRouter.get('/:pid', productController.getProductById)
productRouter.post('/', productController.isAdminOrPremium, upload.fields([
    { name: 'thumbnail', maxCount: 1 },
]), productController.addProduct)
productRouter.put('/:pid', productController.isAdminOrPremium, productController.updateProduct)
productRouter.delete('/:pid', productController.isAdminOrPremium, productController.deleteProduct)

export default productRouter