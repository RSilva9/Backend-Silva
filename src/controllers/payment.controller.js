import Stripe from "stripe"
import dotenv from 'dotenv'
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_PK)

export const createSession = (req, res)=>{
    stripe.checkout.sessions.create({})
}