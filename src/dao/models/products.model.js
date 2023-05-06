import mongoose from "mongoose";

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnail: String
})

export const productModel = mongoose.model(productCollection, productSchema);