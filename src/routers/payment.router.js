import { Router } from "express";
import { createSession } from "../controllers/payment.controller.js";

const paymentRouter = Router()

paymentRouter.get('/create-checkout-session', createSession)
paymentRouter.get('/success', (req, res)=> res.send("Success"))
paymentRouter.get('/cancel', (req, res)=> res.send("Cancelled"))