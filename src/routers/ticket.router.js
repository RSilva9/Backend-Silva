import express from 'express'
import ticketController from '../controllers/ticket.controller.js'

const ticketRouter = express.Router()

ticketRouter.get('/createTicket/:cid', ticketController.createTicket)

export default ticketRouter