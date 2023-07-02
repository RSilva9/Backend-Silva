import { Router } from "express";
import viewsController from "../controllers/views.controller.js";

const viewsRouter = Router()

viewsRouter.get('/', viewsController.viewIndex)
viewsRouter.get('/products', viewsController.auth, viewsController.viewProducts)
viewsRouter.get('/carts/:cid', viewsController.auth, viewsController.viewCartWithId)
viewsRouter.get('/profile', viewsController.auth, viewsController.viewProfile)

export default viewsRouter