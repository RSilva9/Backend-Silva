import CartService from '../services/cartService.js'
import ProductService from '../services/productService.js'
const productService = new ProductService()
const cartService = new CartService()

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
    res.send("Carrito created successfully.")
}

const addProductToCart = async(req, res)=>{
    const cid = req.params.cid
    const pid = req.params.pid
    const product = await productService.getProductById(pid)
    if(product){
        const p_id = product._id
        await cartService.addProductToCart(cid, p_id, pid)
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

export default { getCarts, getCartById, createCart, addProductToCart, deleteCart }