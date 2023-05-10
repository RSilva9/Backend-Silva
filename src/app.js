import express from 'express';
import __dirname from './utils.js';
import path from 'path';
import handlebars from 'express-handlebars';
import { productRouter } from './routes/products.router.js'
import { viewsRouter } from './routes/views.router.js'
import { chatRouter } from './routes/chat.router.js';
import { cartRouter } from './routes/carts.router.js'
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import {messageModel} from './dao/models/messages.model.js'

var app = express()
const httpServer = app.listen(8080, ()=>{ console.log("Server Up.") })
export const socketServer = new Server(httpServer)

app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, 'public', 'views'))
app.set('view engine', 'handlebars')
app.use('/chat', chatRouter)
app.use('/', viewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
// Handlebars.registerHelper('length', function(array, len, options) {
//     if(array.length == len) {
//       return options.fn(this);
//     }
//     return options.inverse(this);
// });

mongoose.set('strictQuery', false)
var connectionString = 'mongodb+srv://ramasilva909:backendcoder@backend-coder.gfvdsvb.mongodb.net/ecommerce'
mongoose.connect(connectionString)

socketServer.on('connection', socket=>{
    console.log("Nuevo cliente conectado.")
    
    let arrayMensajes = [];

    socket.on('userMessage', data =>{
        const newMessage = {email: data.email, content: data.message, dateSent: data.dateSent}
        arrayMensajes.push(newMessage)
        messageModel.create(newMessage)
        socketServer.emit('mensajesCargados', {arrayMensajes});
    })
})