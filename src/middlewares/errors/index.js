import EErrors from "../../services/errors/EErrors.js";

export default (error, req, res, next)=>{
    console.log(error.cause)
    switch(error.code){
        case (EErrors.INVALID_CART_ERROR || EErrors.INVALID_REGISTER_CREDENTIALS_ERROR || EErrors.INVALID_LOGIN_CREDENTIALS_ERROR || EErrors.INVALID_PRODUCT_ERROR):
            res.send({status: "error", error: error.name})
            break;
        default:
            res.send({status: "error", error: "Unhandled error."})
            break;
        }
}
