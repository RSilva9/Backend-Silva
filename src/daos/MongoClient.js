import mongoose from "mongoose";

export default class MongoClient{
    constructor(){
        this.connected = true
        this.client = mongoose
    }

    connect = async()=>{
        try {
            await this.client.connect('mongodb+srv://ramasilva909:backendcoder@backend-coder.gfvdsvb.mongodb.net/ecommerce')
        } catch (error) {
            throw new Error('Cannot connect to MongoDB.')
        }
    }
}