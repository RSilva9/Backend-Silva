import mongoose from "mongoose";

const userCollection = 'usuarios'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    cartId: Number,
    role: String
})

userSchema.pre('findOne', function(){
    this.populate('cartId')
})

export const userModel = mongoose.model(userCollection, userSchema);