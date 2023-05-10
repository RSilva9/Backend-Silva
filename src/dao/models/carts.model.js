import mongoose from "mongoose";

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    id: Number,
    products: {
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number
            }
        ]
    }
})

cartSchema.pre('findOne', function(){
    this.populate('products.product')
})

export const cartModel = mongoose.model(cartCollection, cartSchema);