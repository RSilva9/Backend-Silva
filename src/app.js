import express from 'express'
import productRouter from './routers/product.router.js'
import cartRouter from './routers/cart.router.js'
import sessionRouter from './routers/session.router.js'
import viewsRouter from './routers/views.router.js'
import chatRouter from './routers/chat.router.js'
import ticketRouter from './routers/ticket.router.js'
import testRouter from './routers/test.router.js'
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
import __dirname , { logger, swaggerOptions } from './utils.js'
import ProductService from './services/productService.js'
import CartService from './services/cartService.js'
import errorHandler from './middlewares/errors/index.js'
import compression from 'express-compression'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

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
        maxAge: 160000
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
app.use(errorHandler)
app.engine('handlebars', handlebars.engine())
app.set('views', path.join('src', 'public', 'views'))
app.set('view engine', 'handlebars')
app.use(compression({
    brotli:{enabled:true, zlib:{}}
}))

const handelbars = handlebars.create({})

handelbars.handlebars.registerHelper('ifAdmin', function (role, options) {
    if (role === 'admin') {
      return options.fn(this);
    }
    return options.inverse(this);
});

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(swaggerOptions)))
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/sessions', sessionRouter)
app.use('/ticket', ticketRouter)
app.use('/test', testRouter)
app.use('/', viewsRouter)
app.get('/mockingproducts', async(req, res)=>{
    const payload = []
    for(let i=0; i<100; i++){
        let product = await productService.getProductById(Math.floor(Math.random() * 5) + 1)
        payload.push(product)
    }
    res.send(payload)
})

const httpServer = app.listen(8080, ()=> logger.debug('Server up on port 8080!'))
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
    socket.on('createProduct', async()=>{
        const newProducts = await productService.getProducts()
        socketServer.emit('productCreated', newProducts);
    })
    socket.on('updateProduct', async(data)=>{
        const newProducts = await productService.getProducts()
        socketServer.emit('productCreated', newProducts)
    })
})