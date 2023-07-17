import UserDTO from '../dtos/User.Dto.js'
import EErrors from '../services/errors/EErrors.js'
import CustomError from '../services/errors/CustomError.js'
import { generateLoginErrorInfo, generateRegisterErrorInfo } from '../services/errors/info.js'
import { userModel } from '../models/user.model.js'
import CartService from '../services/cartService.js'
import { createHash, isValidPassword } from "../utils.js";

const cartService = new CartService()

function auth(req, res, next){
    if(req.session.user){
        return next()
    }
    return res.status(401).send('Authentication error.')
}

const register = async(req, res)=>{
    if(req.session.user){
        return res.status(401).render('base', {
            error: 'You are already logged in.'
        })
    }else{
        res.render('register', {})
    }
}

const postRegister = async(req, res)=>{
    const { first_name, last_name, email, age, password } = req.body
    if(!first_name || !last_name|| !email || !age || !password){
        CustomError.createError({
            name:"User creation error",
            cause: generateRegisterErrorInfo({first_name, last_name, email, age, password}),
            message: "Error trying to create user.",
            code: EErrors.INVALID_REGISTER_CREDENTIALS_ERROR
        })
    }else{
        var role
        if(email === "adminCoder@coder.com"){
            role = "admin"
        }else{
            role = "usuario"
        }
        
        let user = await userModel.findOne({email: email})
        if(user){
            console.log("User already exists.")
            return
        }
        await cartService.createCart()
        const cartId = await cartService.getCarts()
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cartId: cartId.length,
            role
        }
        await userModel.create(newUser)
        res.redirect('./login')
    }
}

const failRegister = async(req, res)=>{
    console.log("Failed Strategy")
    res.send({error: "Failed"})
}

const login = async(req, res)=>{
    if(req.session.user){
        return res.status(401).render('base', {
            error: 'You are already logged in.'
        })
    }else{
        res.render('login', {})
    }
}

const postLogin = async(req, res)=>{
    const { email, password } = req.body
    const user = await userModel.findOne({email: email})
    if(!user){
        CustomError.createError({
            name:"User login error",
            cause: generateLoginErrorInfo({email, password}),
            message: "Error trying to login.",
            code: EErrors.INVALID_LOGIN_CREDENTIALS_ERROR
        })
    }else{
        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email,
            cartId: user.cartId,
            role: user.role
        }
        res.redirect('../products')
    }
}

const failLogin = async(req,res)=>{
    res.send({error: "Failed Login"})
}

const githubCallback = async(req, res)=>{
    req.session.user = req.user
    res.redirect('/')
}

const logout = async(req, res)=>{
    req.session.destroy(err=>{
        if(err) res.status(500).render('base', {
            error: err
        })
        else res.redirect('../')
    })
}

const checkLogin = async(req, res) =>{
    res.status(200).send('User logged in');
}

const getCartId = async(req, res)=>{
    if(req.session.user && req.session.user.cartId){
        const cartId = req.session.user.cartId
        res.json({cartId})
    }else{
        res.status(404).json({error: 'Cart ID not found.'})
    }
}

const current = async(req, res)=>{
    try {
        if(req.session.user){
            let dtoUser = new UserDTO(req.session.user)
            res.status(200).send(dtoUser)
        }else{
            res.status(401).send('Authentication error.')
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

export default { auth, register, postRegister, failRegister, login, postLogin, failLogin, githubCallback, logout, checkLogin, getCartId, current }