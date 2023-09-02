import { Router } from 'express';
import sessionController from '../controllers/session.controller.js'
import passport from 'passport';
import multer from 'multer';

const destinationByFileType = (req, file, cb) => {
  switch(file.fieldname){
    case 'pfp':
      cb(null, 'src/public/uploads/profiles')
    break;
    case 'documentos':
      cb(null, 'src/public/uploads/documents')
    break;
    case 'product':
      cb(null, 'src/public/uploads/products')
    break;
    default:
      cb(new Error('Invalid fieldname'))
      break;
  }
}
//     if (file.fieldname === 'pfp') {
//       cb(null, 'src/public/uploads/profiles')
//     } else if (file.fieldname === 'documentos') {
//       cb(null, 'src/public/uploads/documents')
//     } else {
//       cb(new Error('Invalid fieldname'))
//     }

const storage  = multer.diskStorage({
    destination: destinationByFileType,
    filename: function (req, file, cb) { cb(null, file.originalname) }
})
const upload = multer({storage: storage})

const sessionRouter = Router()

sessionRouter.get('/', sessionController.getAllUsers)
sessionRouter.get('/deleteInactiveUsers', sessionController.deleteInactiveUsers)
sessionRouter.get('/register', sessionController.register)
sessionRouter.post('/register', sessionController.postRegister)
sessionRouter.get('/login', sessionController.login)
sessionRouter.post('/login', sessionController.postLogin)
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), sessionController.githubCallback)
sessionRouter.get('/logout', sessionController.logout)
sessionRouter.get('/checkLogin', sessionController.auth, sessionController.checkLogin)
sessionRouter.get('/getCartId', sessionController.getCartId)
sessionRouter.get('/current', sessionController.current)
sessionRouter.post('/passRecovery', sessionController.passRecovery)
sessionRouter.get('/passReset/:token', sessionController.verifyToken)
sessionRouter.post('/passUpdate/:user', sessionController.passUpdate)
sessionRouter.get('/premium/:uid', sessionController.roleSwitch)
sessionRouter.post('/uploadDocuments', upload.fields([
    { name: 'pfp', maxCount: 1 },
    { name: 'product', maxCount: 1 },
    { name: 'documentos', maxCount: 10 }
]), sessionController.uploadDocuments)

export default sessionRouter