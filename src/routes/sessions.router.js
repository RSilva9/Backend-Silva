import { Router } from 'express';
import passport from 'passport';

export const sessionRouter = Router()

function auth(req, res, next){
    if(req.session.user){
        return next()
    }
    return res.status(401).send('Error de autorización.')
}

sessionRouter.get('/register', (req, res)=>{
    if(req.session.user){
        return res.status(401).render('base', {
            error: 'Ya estás logueado.'
        })
    }else{
        res.render('register', {})
    }
})

sessionRouter.post('/register', passport.authenticate('register', {failureRedirect:'/failRegister'}), async (req, res)=>{
    res.redirect('./login')
})

sessionRouter.get('/failRegister', async(req, res)=>{
    console.log("Failed Strategy")
    res.send({error: "Failed"})
})

sessionRouter.get('/login', (req, res)=>{
    if(req.session.user){
        return res.status(401).render('base', {
            error: 'Ya estás logueado.'
        })
    }else{
        res.render('login', {})
    }
})

var userSession
sessionRouter.post('/login', passport.authenticate('login', {failureRedirect:'failLogin'}), async (req, res)=>{
    if(!req.user){
        return res.status(401).render('base', {
            error: 'Email o contraseña incorrectos.'
        })
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    }
    userSession = req.session.user
    res.redirect('../productos')
})

sessionRouter.get('/failLogin', async(req, res)=>{
    res.send({error: "Failed Login"})
})

sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res)=>{
    req.session.user = req.user
    res.redirect('/')
})

sessionRouter.get('/logout', (req, res)=>{
    req.session.destroy(err=>{
        if(err) res.status(500).render('base', {
            error: err
        })
        else res.redirect('../')
    })
})

sessionRouter.get('/check-login', auth, (req, res) => {
    res.status(200).send('Usuario logueado');
});