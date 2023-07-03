import UserDTO from '../dtos/User.Dto.js'

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
    res.redirect('./login')
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
    res.redirect('../products')
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