import express from 'express';
import __dirname from './utils.js';
import path from 'path';
import handlebars from 'express-handlebars';
import routerViews from './routes/views.router.js';
import productManager from './managersJS/ProductManager.js';
import { Server } from 'socket.io';
import { Socket } from 'net';

var app = express()
const httpServer = app.listen(8080, ()=>{ console.log("Server Up.") })
const socketServer = new Server(httpServer)

app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, 'public', 'views'))
app.set('view engine', 'handlebars')
app.use('/', routerViews)

socketServer.on('connection', socket=>{
    console.log("Nuevo cliente conectado.")
    socketServer.emit('productManager', productManager.getProducts())

    socket.on('sendProductValues', data=>{
        console.log("Data recibida")
        productManager.addProduct(data[0], data[1], data[2], data[3], true, data[4], data[5], data[6])
    })
})

