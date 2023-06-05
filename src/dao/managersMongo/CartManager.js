import { cartModel } from '../models/carts.model.js'

class CartManager{
    constructor(model){
        this.cartModel = model
    }

    getCarts = async()=>{
        try {
            const carts = await cartModel.find({})
            if(carts){
                return carts
            }
            console.log("No carts in collection.")
        } catch (error) {
            return error
        }
    }

    generateId = async()=>{
        try {
            const carts = await cartModel.find({})
            if(carts && carts.length > 0){
                return carts[carts.length-1].id + 1
            }
            else{
                return 1
            }
        } catch (error) {
            return error
        }
    }

    getCartById = async(cid)=>{
        try{
            return await cartModel.findOne({id: cid}).lean()
        }catch(err){
            return new Error(err)
        }
    }

    createCart = async(id)=>{
        try{
            const newCart = {
                id: await this.generateId(),
            }
            return await cartModel.create(newCart)
        }catch(err){
            return new Error(err)
        }
    }

    updateCart = async(cid, p_id, pid)=>{
        try{
            const cart = await cartModel.findOne({id: cid}).lean()
            if(cart.products.length > 0){
                for(let item of cart.products){
                    if (item.product.id == pid){
                        item.quantity += 1
                        await cartModel.updateOne({id: cid}, cart) 
                        return;
                    }
                }
                cart.products.push({product: p_id, quantity: 1})
            }else{
                cart.products.push({product: p_id, quantity: 1})
            }
            await cartModel.updateOne({id: cid}, cart)  
        }catch(err){
            return new Error(err)
        }
    }

    // deleteCart = async(cid)=>{
    //     try{
    //         return await cartModel.deleteOne({id: cid})
    //     }catch(err){
    //         return new Error(err)
    //     }
    // }
}

export const cartManager = new CartManager()