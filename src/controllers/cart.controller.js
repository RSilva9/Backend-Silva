import CartService from '../services/cartService.js'
import ProductService from '../services/productService.js'
import EErrors from '../services/errors/EErrors.js'
import CustomError from '../services/errors/CustomError.js'
import { generateCartErrorInfo, generateRegisterErrorInfo } from '../services/errors/info.js'
const productService = new ProductService()
const cartService = new CartService()

const isAdmin = async(req, res, next)=>{
    if(req.session.user.role == "admin"){
        return next()
    }
    return res.status(401).send('Authentication error.')
}

const getCarts = async(req, res)=>{
    const result = await cartService.getCarts()
    res.json(result)
}

const getCartById = async(req, res)=>{
    const cid = req.params.cid
    const cart = await cartService.getCartById(cid)
    res.json(cart)
}

const createCart = async(req, res)=>{
    await cartService.createCart()
    res.send("Cart created successfully.")
}

const addProductToCart = async(req, res)=>{
    const cid = req.params.cid
    const pid = req.params.pid
    const product = await productService.getProductById(pid)
    if(product){
        const p_id = product._id
        const productPrice = product.price
        await cartService.addProductToCart(cid, p_id, pid, productPrice)
        res.send("Product added to cart successfully")
    }else{
        res.send("Product not found.")
    }
}

const deleteCart = async(req, res)=>{
    const cid = req.params.cid
    let result = await cartService.deleteCart(cid)
    if(result.deletedCount == 0){
        CustomError.createError({
            name:"Cart deletion error.",
            cause: generateCartErrorInfo(cid),
            message: "Error trying to delete cart.",
            code: EErrors.INVALID_PRODUCT_ERROR
        })
    }
    res.send("Cart deleted successfully.")
}

export default { isAdmin, getCarts, getCartById, createCart, addProductToCart, deleteCart }