import mongoose from 'mongoose'
import cartModel from '../../models/cart.model.js'

export default class CartDaoMongo{
    constructor(){
        this.model = mongoose.model(cartModel.cartCollection, cartModel.cartSchema)
    }

    generateId = async()=>{
        try {
            const carts = await this.model.find({}).lean()
            if(carts && carts.length > 0){
                return carts[carts.length-1].id + 1
            }
            else{
                return 1
            }
        } catch (error) {
            return new Error(err)
        }
    }

    getAll = async() =>{
        try {
            let result = await this.model.find().lean()
            return result
        } catch (error) {
            return new Error(error)
        }
    }

    getById = async(cid)=>{
        try{
            return await this.model.findOne({id: cid}).lean()
        }catch(err){
            return new Error(err)
        }
    }

    create = async()=>{
        try{
            const newCart = {
                id: await this.generateId(),
                totalPrice: 0
            }
            return await this.model.create(newCart)
        }catch(err){
            return new Error(err)
        }
    }

    update = async(cid, p_id, pid, productPrice) =>{
        try{
            const cart = await this.model.findOne({id: cid}).lean()
            if(cart.products.length > 0){
                for(let item of cart.products){
                    if (item.product.id == pid){
                        item.quantity += 1
                        cart.totalPrice += Number(productPrice)
                        return await this.model.updateOne({id: cid}, cart)
                    }
                }
                cart.totalPrice += Number(productPrice)
                cart.products.push({product: p_id, quantity: 1})
            }else{
                cart.totalPrice += Number(productPrice)
                cart.products.push({product: p_id, quantity: 1})
            }
            return await this.model.updateOne({id: cid}, cart)  
        }catch(err){
            return new Error(err)
        }
    }

    renew = async(cid, cart)=>{
        try {
            return await this.model.updateOne({id: cid}, cart)
        } catch (err) {
            return new Error(err)
        }
    }

    delete = async(cid)=>{
        try{
            return await this.model.deleteOne({id: cid})
        }catch(err){
            return new Error(err)
        }
    }
}