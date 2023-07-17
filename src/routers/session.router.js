import { Router } from 'express';
import sessionController from '../controllers/session.controller.js'
import passport from 'passport';

const sessionRouter = Router()

sessionRouter.get('/register', sessionController.register)
sessionRouter.post('/register', sessionController.postRegister)
sessionRouter.get('/login', sessionController.login)
sessionRouter.post('/login', sessionController.postLogin)
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), sessionController.githubCallback)
sessionRouter.get('/logout', sessionController.logout)
sessionRouter.get('/checkLogin', sessionController.auth, sessionController.checkLogin)
sessionRouter.get('/getCartId', sessionController.getCartId)
sessionRouter.get('/current', sessionController.current)

export default sessionRouter