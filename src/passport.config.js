import passport from "passport";
import local from 'passport-local';
import { userModel } from './models/user.model.js';
import CartService from "./services/cartService.js";
import { createHash, isValidPassword } from "./utils.js";
import GitHubStrategy from 'passport-github2';
import { generate } from "randomstring";

const cartService = new CartService()
const LocalStrategy = local.Strategy

const initializePassport = ()=>{
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.4548b1c1decfc590',
        clientSecret: 'ee0a7c19c5a635c065a99f893ff5d98589229a4d',
        callbackURL: 'http://localhost:8080/sessions/githubcallback'
    }, async(accessToken, refreshToken, profile, done)=>{
        try{
            const user = await userModel.findOne({email:profile._json.email})
            if(user) return done(null, user)
            await cartService.createCart()
            const cartId = await cartService.getCarts()
            const newUser =  await userModel.create({
                first_name: profile._json.name,
                email: profile._json.email,
                cartId: cartId.length,
                role: "usuario"
            })
            return done(null, newUser)
        }catch(err){
            return done('Unable to enter with GitHub.')
        }
    }
    ))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })
    passport.deserializeUser(async(id, done)=>{
        let user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport