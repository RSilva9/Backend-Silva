import { Router } from 'express';
import { userModel } from '../dao/models/users.model.js'

export const sessionRouter = Router()

function auth(req, res, next){
    if(req.session.user){
        return next()
    }
    return res.status(401).send('Error de autorización.')
}

sessionRouter.get('/register', (req, res)=>{
    res.render('register', {})
})

sessionRouter.post('/register', async (req, res)=>{
    const newUser = req.body
    const user = new userModel(newUser)
    await user.save()
    res.redirect('./login')
})

sessionRouter.get('/login', (req, res)=>{
    res.render('login', {})
})

sessionRouter.post('/login', async (req, res)=>{
    const { email, password } = req.body
    const user = await userModel.findOne({ email, password }).lean().exec()
    if(!user){
        return res.status(401).render('base', {
            error: 'Email o contraseña incorrectos.'
        })
    }

    var role
    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
        role = "admin"
    }else{
        role = "usuario"
    }
    req.session.user = {
        user,
        role
    }
    res.redirect('../productos')
})

sessionRouter.get('/logout', (req, res)=>{
    req.session.destroy(err=>{
        if(err) res.status(500).render('base', {
            error: err
        })
        else res.redirect('../')
    })
})

sessionRouter.get('/profile', auth, async(req, res)=>{
    const data = req.session.user
    res.render('profile', {data})
})
