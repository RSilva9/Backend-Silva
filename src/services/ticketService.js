import PersistenceFactory from "../daos/persistenceFactory.js"

export default class TicketService{
    constructor(){
        this.persistence
        this.ticketDao
        this.init()
    }

    init = async()=>{
        this.persistence = await PersistenceFactory.getPersistence()
        this.ticketDao = this.persistence.TicketDao
    }

    createTicket = async(ticket)=>{
        return await this.ticketDao.create(ticket)
    }

    showFinalTicket = async(code)=>{
        return await this.ticketDao.show(code)
    }
}