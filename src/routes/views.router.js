import express from 'express';

const routerViews = express.Router()

routerViews.get('/', (req, res)=>{
    res.render('home', {})
})

routerViews.get('/realTimeProducts', (req, res)=>{
    res.render('realTimeProducts', {})
})

export default routerViews;