import mongoose from "mongoose";

const userCollection = 'usuarios'

const userSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: true
    }
})

export const userModel = mongoose.model(userCollection, userSchema);