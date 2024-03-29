import ProductService from "../services/productService.js";
import CartService from "../services/cartService.js";
import TicketService from "../services/ticketService.js";
import { userModel } from "../models/user.model.js";
import { logger } from "../utils.js";

const productService = new ProductService()
const cartService = new CartService()
const ticketService = new TicketService()

function auth(req, res, next){
    if(req.session.user){
        return next()
    }
    logger.error("Authentication error.")
    return res.status(401).send('Authentication error.')
}

function isUser(req, res, next){
    if(req.session.user && req.session.user.role == "usuario"){
        return next()
    }
    logger.error("Authentication error.")
    return res.status(401).send('Authentication error.')
}

function isAdmin(req, res, next){
    if(req.session.user && req.session.user.role == "admin"){
        return next()
    }
    logger.error("Authentication error.")
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
        logger.error("Cart not found.")
        return res.status(401).send('Cart not found.')
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

const viewFinalTicket = async(req, res)=>{
    const code = req.params.code
    const data = await ticketService.showFinalTicket(code)
    const ticket = data[0]
    res.render('finalTicket', {ticket})
}

const viewDocuments = async(req, res)=>{
    const user = await userModel.findOne({email: req.session.user.email}).lean().exec()
    if(user.documents){
        const documents = user.documents
        res.render('userDocuments', {documents})
    }else{
        res.render('noDocuments')
    }
}

const viewAdminPanel = async(req, res)=>{
    const users = await userModel.find({}).lean().exec()
    res.render('adminPanel', {users})
}

export default { auth, isUser, isAdmin, viewIndex, viewProducts, viewCartWithId, viewProfile, viewFinalTicket, viewDocuments, viewAdminPanel }