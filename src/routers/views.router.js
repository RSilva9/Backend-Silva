import { Router } from "express";
import viewsController from "../controllers/views.controller.js";

const viewsRouter = Router()

viewsRouter.get('/', viewsController.viewIndex)
viewsRouter.get('/products', viewsController.auth, viewsController.viewProducts)
viewsRouter.get('/carts/:cid', viewsController.auth, viewsController.viewCartWithId)
viewsRouter.get('/profile', viewsController.auth, viewsController.viewProfile)
viewsRouter.get('/finalTicket/:code', viewsController.auth, viewsController.viewFinalTicket)
viewsRouter.get('/passRecovery', (req, res)=> res.render("passRecovery", {}))
viewsRouter.get('/chat', viewsController.isUser, (req, res)=> res.render("chat", {}))
viewsRouter.get('/documents', viewsController.viewDocuments)
viewsRouter.get('/adminPanel', viewsController.isAdmin, viewsController.viewAdminPanel)

export default viewsRouter