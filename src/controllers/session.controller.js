import UserDTO from '../dtos/User.Dto.js'
import EErrors from '../services/errors/EErrors.js'
import CustomError from '../services/errors/CustomError.js'
import { generateLoginErrorInfo, generateRegisterErrorInfo } from '../services/errors/info.js'
import { userModel } from '../models/user.model.js'
import CartService from '../services/cartService.js'
import { createHash, isValidPassword } from "../utils.js";
import { logger } from '../utils.js'
import Randomstring from 'randomstring'
import PassRecoveryModel from '../models/passRecovery.model.js'
import nodemailer from 'nodemailer'

const cartService = new CartService()

const mailerConfig = {
    service: 'gmail',
    auth: {user: "ramasilva909@gmail.com", pass: "vzpcejjwyjmeihtj" }
}
let transporter = nodemailer.createTransport(mailerConfig)

function auth(req, res, next){
    if(req.session.user){
        return next()
    }
    logger.error("Authentication error.")
    return res.status(401).send('Authentication error.')
}

const register = async(req, res)=>{
    if(req.session.user){
        logger.warning("You are already logged in.")
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
        logger.error("Error trying to create user.")
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
            logger.warning("User already exists.")
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
    logger.warning("Failed Strategy.")
    res.send({error: "Failed"})
}

const login = async(req, res)=>{
    if(req.session.user){
        logger.warning("You are already logged in.")
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
        logger.warning("Error trying to login.")
        CustomError.createError({
            name:"User login error",
            cause: generateLoginErrorInfo({email, password}),
            message: "Error trying to login.",
            code: EErrors.INVALID_LOGIN_CREDENTIALS_ERROR
        })
    }else{
        if(isValidPassword(user, password)){
            var pfp = ""
            if(user.documents && (user.documents).length > 0){
                for(let item of user.documents){
                    if(item.fileType=="pfp"){
                        pfp = item.name
                    }
                }
            }
            req.session.user = {
                first_name: user.first_name,
                last_name: user.last_name,
                age: user.age,
                email: user.email,
                cartId: user.cartId,
                role: user.role,
                pfp: pfp
            }
            user.last_connection = new Date()
            await user.save()
            res.redirect('../products')
        }else{
            logger.warning("Wrong password.")
            CustomError.createError({
                name:"User login error",
                cause: generateLoginErrorInfo({email, password}),
                message: "Error trying to login.",
                code: EErrors.INVALID_LOGIN_CREDENTIALS_ERROR
            })
        }
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
    const user = await userModel.findOne({email: req.session.user.email})
    req.session.destroy(async err=>{
        if(err) res.status(500).render('base', {
            error: err
        })
        else 
        {
            user.last_connection = new Date()
            await user.save()
            res.redirect('../')
        }
    })
}

const checkLogin = async(req, res) =>{
    logger.info("User logged in.")
    res.status(200).send('User logged in.');
}

const getCartId = async(req, res)=>{
    if(req.session.user && req.session.user.cartId){
        const cartId = req.session.user.cartId
        res.json({cartId})
    }else{
        logger.error("Cart ID not found.")
        res.status(404).json({error: 'Cart ID not found.'})
    }
}

const current = async(req, res)=>{
    try {
        if(req.session.user){
            let dtoUser = new UserDTO(req.session.user)
            res.status(200).send(dtoUser)
        }else{
            logger.error("Authentication error.")
            res.status(401).send('Authentication error.')
        }
    } catch (error) {
        logger.fatal(`Error: ${error}`)
        res.status(400).send(error);
    }
}

const passRecovery = async(req, res)=>{
    const email = req.body.email
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(404).json({status: 'error', error: 'User not found'})
    }
    const token = Randomstring.generate()
    await PassRecoveryModel.create({email, token})
    let message = {
        from: "ramasilva909@gmail.com",
        to: email,
        subject: '[CODER BACKEND API] Reset your password',
        html: `<h1>[CODER BACKEND API] Reset your password</h1><hr/><h2>Click the following button to reset your password</h2><hr/><a href="http://localhost:8080/sessions/passReset/${token}"><button>Reset password</button></a>`
    }
    try {
        await transporter.sendMail(message)
        res.json({status: 'success', message: `Email successfully sent to ${email} in order to reset password.`})
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
}

const verifyToken = async(req, res)=>{
    const passRecovery = await PassRecoveryModel.findOne({ token: req.params.token }) 
    if(!passRecovery){
        return res.status(404).json({ status: 'error', error: 'Non-valid/expired token.'})
    }
    const user = passRecovery.email
    res.render('passReset', {user})
}

const passUpdate = async(req, res)=>{
    try {
        const user = await userModel.findOne({ email: req.params.user })
        if(user.password == createHash(req.body.newPassword)){
            res.status(500).json({ status: 'error', error: 'Can not change to the same password' })
        }
        await userModel.findByIdAndUpdate(user._id, { password: createHash(req.body.newPassword )})
        res.json({status: 'success', message: 'Password updated.'})
        await PassRecoveryModel.deleteOne({ email: req.params.user })
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
}

const roleSwitch = async(req, res)=>{
    try {
        const uid = req.params.uid
        const user = await userModel.findById(uid)
        if(user.role == "usuario"){
            if(user.documents && user.documents.length > 0){
                for(let item of user.documents){
                    if(item.fileType == "comprobante_domicilio"){
                        await userModel.findByIdAndUpdate(uid, { role: 'premium'})
                        req.session.user.role = "premium"
                    }
                }
            }else{
                logger.error("User documentation insufficient.")
                res.status(400).json({ status: 'error', error: "User documentation insufficient." })
            }
        }
        res.redirect("/")
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
}

const uploadDocuments = async(req, res)=>{
    try {
        const user = await userModel.findOne({email: req.session.user.email})
        const uploadedFiles = req.files
        if(uploadedFiles.pfp){
            const newFile = {
                name: uploadedFiles.pfp[0].filename,
                reference: `${uploadedFiles.pfp[0].destination}/${uploadedFiles.pfp[0].filename}`,
                fileType: "pfp"
            }
            req.session.user.pfp = `${uploadedFiles.pfp[0].filename}`
            user.documents.push(newFile)
        }
        if(uploadedFiles.documentos){
            for(let item of uploadedFiles.documentos){
                const newFile = {
                    name: item.filename,
                    reference: `${item.destination}/${item.filename}`,
                    fileType: "comprobante_domicilio"
                }
                user.documents.push(newFile)
            }
        }
        await user.save()
        res.redirect('/profile')
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
}

const getAllUsers = async(req, res)=>{
    try {
        const users = await userModel.find()
        const dtoUsers = []
        for(let item of users){
            let dtoUser = new UserDTO(item)
            dtoUsers.push(dtoUser)
        }
        res.status(200).send(dtoUsers)
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
}

const deleteInactiveUsers = async(req, res)=>{
    try {
        const users = await userModel.find()
        const currentDate = new Date()
        const twoDays = new Date(currentDate)
        twoDays.setDate(currentDate.getDate()-2)

        for(let item of users){
            if(item.last_connection < twoDays){
                let message = {
                    from: "ramasilva909@gmail.com",
                    to: item.email,
                    subject: '[CODER BACKEND API] Your account was deleted',
                    html: `<h1>[CODER BACKEND API] <h2>Your account has been deleted by an administrator due to inactivity (+2 days).</h2>`
                }
                await transporter.sendMail(message)
                await userModel.findOneAndDelete({email: item.email})
            }
        }
        res.status(200).send("Inactive users deleted.")
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
}

export default { auth, register, postRegister, failRegister, login, postLogin, failLogin, githubCallback, logout, checkLogin, getCartId, current, passRecovery, verifyToken, passUpdate, roleSwitch, uploadDocuments, getAllUsers, deleteInactiveUsers}