import TicketService from '../services/ticketService.js'
import CartService from '../services/cartService.js'
import ProductService from '../services/productService.js'
import Randomstring from 'randomstring'

const ticketService = new TicketService()
const cartService = new CartService()
const productService = new ProductService()

const checkStock = async(cid)=>{
    const confirmedCart = {
        products: [],
        totalPrice: 0
    }
    const deniedCart = {
        products: [],
        totalPrice: 0
    }
    const cart = await cartService.getCartById(cid)
    const products = await productService.getProducts()
    for(let item of cart.products){
        for(let prod of products){
            if(item.product.title == prod.title){
                if(item.quantity <= prod.stock){
                    prod.stock -= item.quantity
                    confirmedCart.products.push(item)
                    confirmedCart.totalPrice += prod.price*item.quantity
                    await productService.updateProduct(prod.id, [ 'stock' ], [ prod.stock ])
                }else{
                    deniedCart.products.push(item)
                    deniedCart.totalPrice += prod.price*item.quantity
                }
            }
        }
    }
    return { confirmedCart, deniedCart }
}

const createTicket = async(req, res)=>{
    const cid = req.params.cid
    const cart = await cartService.getCartById(cid)
    if(cart.products.length > 0){
        const checker = await checkStock(cid)
        const confirmedCart = checker.confirmedCart
        const deniedCart = checker.deniedCart
        const amount = confirmedCart.totalPrice
        const code = Randomstring.generate()
        const purchase_datetime = new Date()
        const purchaser = req.session.user.email || req.session.user.first_name
    
        const newTicket = {
            code: code,
            purchase_datetime: purchase_datetime,
            amount: amount,
            purchaser: purchaser
        }
    
        await cartService.renewCart(cid, deniedCart)
        await ticketService.createTicket(newTicket)
        res.redirect(`/finalTicket/${code}`)
    }else{
        res.send("Cart empty.")
    }
}

export default { createTicket, checkStock }