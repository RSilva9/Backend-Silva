import { Router } from "express";

export const chatRouter = Router()

chatRouter.get('/', async(req, res)=>{
    res.render("chat", {})
})