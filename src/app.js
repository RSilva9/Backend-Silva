import express from 'express'
import productRouter from './routers/product.router.js'
import MongoClient from './daos/MongoClient.js'

const app = express()
app.use(express.json())
app.use('/api/products', productRouter)

app.listen(8080, ()=> console.log("Server Up!"))
let client = new MongoClient()
client.connect()