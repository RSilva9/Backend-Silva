import express from 'express'
import productRouter from './routers/product.router.js'
import cartRouter from './routers/cart.router.js'
import sessionRouter from './routers/session.router.js'
import viewsRouter from './routers/views.router.js'
import chatRouter from './routers/chat.router.js'
import ticketRouter from './routers/ticket.router.js'
import { messageModel } from './models/messages.model.js'
import MongoClient from './daos/MongoClient.js'
import initializePassport from './passport.config.js'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import session from 'express-session'
import handlebars from 'express-handlebars'
import path from 'path'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import __dirname from './utils.js'
import ProductService from './services/productService.js'
import CartService from './services/cartService.js'

const productService = new ProductService()
const cartService = new CartService()
const app = express()

app.use(cookieParser("CoderS3cR3tC0D3"))
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://ramasilva909:backendcoder@backend-coder.gfvdsvb.mongodb.net/ecommerce',
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 15
    }),
    cookie:{
        maxAge: 120000
    },
    secret: 'secretCoder',
    resave: true,
    saveUnitialized: false
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.engine('handlebars', handlebars.engine())
app.set('views', path.join('src', 'public', 'views'))
app.set('view engine', 'handlebars')

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/sessions', sessionRouter)
app.use('/ticket', ticketRouter)
app.use('/', viewsRouter)

const httpServer = app.listen(8080, ()=> console.log("Server Up!"))
export const socketServer = new Server(httpServer)
let client = new MongoClient()
client.connect()

socketServer.on('connection', socket=>{
    console.log("Nuevo cliente conectado.")
    
    let arrayMensajes = [];
    socket.on('userMessage', data =>{
        const newMessage = {email: data.email, content: data.message, dateSent: data.dateSent}
        arrayMensajes.push(newMessage)
        messageModel.create(newMessage)
        socketServer.emit('mensajesCargados', {arrayMensajes});
    })

    socket.on('addToCart', async(pid, cid)=>{
        const product = await productService.getProductById(pid)
        await cartService.addProductToCart(cid, product._id, product.id, product.price)
    })
})