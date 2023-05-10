import { cartModel } from '../models/carts.model.js'

class CartManager{
    constructor(model){
        this.cartModel = model
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
                id: id,
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