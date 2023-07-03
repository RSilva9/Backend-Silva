import mongoose from "mongoose";

const messageCollection = 'messages'

const messageSchema = new mongoose.Schema({
    username: String,
    email: String,
    messages: Array
})

export const messageModel = mongoose.model(messageCollection, messageSchema);