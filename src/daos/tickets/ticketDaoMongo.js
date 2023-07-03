import mongoose from 'mongoose'
import ticketModel from "../../models/ticket.model.js"

export default class TicketDaoMongo{
    constructor(){
        this.model = mongoose.model(ticketModel.ticketCollection, ticketModel.ticketSchema)
    }

    create = async(ticket)=>{
        return await this.model.create(ticket)
    }

    show = async(code)=>{
        return await this.model.find({code: code}).lean()
    }
}