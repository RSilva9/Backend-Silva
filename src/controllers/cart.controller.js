import CartService from '../services/cartService.js'
import ProductService from '../services/productService.js'
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
    await cartService.deleteCart(cid)

    res.send("Cart deleted successfully.")
}

export default { isAdmin, getCarts, getCartById, createCart, addProductToCart, deleteCart }