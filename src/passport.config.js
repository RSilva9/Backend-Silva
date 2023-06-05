import passport from "passport";
import local from 'passport-local';
import { userModel } from './dao/models/users.model.js'
import { cartManager } from "./dao/managersMongo/CartManager.js";
import { createHash, isValidPassword } from "./utils.js";
import GitHubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy

const initializePassport = ()=>{
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async(req, username, password, done)=>{
            const { first_name, last_name, email, age } = req.body
            try{
                var role
                if(email === "adminCoder@coder.com"){
                    role = "admin"
                }else{
                    role = "usuario"
                }
                
                let user = await userModel.findOne({email: username})
                if(user){
                    console.log("User already exists.")
                    return done(null, false)
                }
                await cartManager.createCart()
                const cartId = await cartManager.getCarts()
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cartId: cartId.length,
                    role
                }
                let result = await userModel.create(newUser)
                return done(null, result)
            }catch(err){
                return done("Unable to get user: " + err)
            }
        }
    ))
    passport.use('login', new LocalStrategy(
        {usernameField: 'email'}, async(username, password, done)=>{
            try{
                const user = await userModel.findOne({email: username})
                if(!user){
                    console.log("User does not exist.")
                    return done(null, false)
                }
                if(!isValidPassword(user,password)) return done(null, false)
                return done(null, user)
            }catch(err){
                return done(err)
            }
        }
    ))
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.4548b1c1decfc590',
        clientSecret: 'ee0a7c19c5a635c065a99f893ff5d98589229a4d',
        callbackURL: 'http://localhost:8080/sessions/githubcallback'
    }, async(accessToken, refreshToken, profile, done)=>{
        try{
            const user = await userModel.findOne({email:profile._json.email})
            if(user) return done(null, user)
            await cartManager.createCart()
            const cartId = await cartManager.getCarts()
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