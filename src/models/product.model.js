import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

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
    thumbnail: String,
    owner: { type: String, required: true, default: 'admin', ref: 'users' }
})
productSchema.plugin(mongoosePaginate)

export default { productCollection, productSchema}