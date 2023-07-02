import ProductService from "../services/productService.js";
import CartService from "../services/cartService.js";

const productService = new ProductService()
const cartService = new CartService()

function auth(req, res, next){
    if(req.session.user){
        return next()
    }
    return res.status(401).send('Authentication error.')
}

const viewIndex = async(req, res)=>{
    res.render('inicio')
}

const viewProducts = async(req, res)=>{
    const products = await productService.getProducts()
    const data = {
        products: products,
        user: req.session.user
    }
    res.render('realTimeProducts', data)
}

const viewCartWithId = async(req, res)=>{
    const cid = req.params.cid
    const carts = await cartService.getCartById(cid)
    if(+cid < 1 || +cid > carts.length){
        return res.status(401).send('Cart not found')
    }else{
        let cart = await cartService.getCartById(cid)
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
}

const viewProfile = async(req, res)=>{
    const data = req.session.user
    res.render('profile', {data})
}

export default { auth, viewIndex, viewProducts, viewCartWithId, viewProfile }