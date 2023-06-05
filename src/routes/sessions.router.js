import { Router } from 'express';
import passport from 'passport';

export const sessionRouter = Router()

function auth(req, res, next){
    if(req.session.user){
        return next()
    }
    return res.status(401).send('Authentication error.')
}

sessionRouter.get('/register', (req, res)=>{
    if(req.session.user){
        return res.status(401).render('base', {
            error: 'You are already logged in.'
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
            error: 'You are already logged in.'
        })
    }else{
        res.render('login', {})
    }
})

sessionRouter.post('/login', passport.authenticate('login', {failureRedirect:'failLogin'}), async (req, res)=>{
    if(!req.user){
        return res.status(401).render('base', {
            error: 'Incorrect email or password.'
        })
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        cartId: req.user.cartId,
        role: req.user.role
    }
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
    res.status(200).send('User logged in');
});

sessionRouter.get('/getCartId', (req, res)=>{
    if(req.session.user && req.session.user.cartId){
        const cartId = req.session.user.cartId
        res.json({cartId})
    }else{
        res.status(404).json({error: 'Cart ID not found.'})
    }
})

sessionRouter.get('/current', (req, res)=>{
    try {
        req.session.user ?
        res.status(200).send(req.session.user)
        :
        res.status(401).send('Authentication error.')
    } catch (error) {
        res.status(400).send(error);
    }
})