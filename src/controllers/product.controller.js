import ProductService from "../services/productService.js";
import EErrors from '../services/errors/EErrors.js'
import CustomError from '../services/errors/CustomError.js'
import { generateProductErrorInfo } from '../services/errors/info.js'
import { logger } from "../utils.js";
const productService = new ProductService()

const isAdminOrPremium = async(req, res, next)=>{
    if(req.session.user.role == "admin" || req.session.user.role == "premium"){
        return next()
    }
    logger.error("Authentication error.")
    return res.status(401).send('Authentication error.')
}

const getProducts = async(req, res)=>{
    let result = await productService.getProducts()
    res.json(result)
}

const paginateProducts = async(req, res)=>{
    var limit = +req.query.limit
    var page = +req.query.page
    var query = req.query.query
    var sort = req.query.sort
    if(!limit) limit = 10
    if(query) query = JSON.parse(query)
    let result = await productService.paginateProducts(limit,page,query,sort)
    res.json(result)
}

const getProductById = async(req, res)=>{
    let pid = +req.params.pid
    let result = await productService.getProductById(pid)
    res.json(result)
}

const addProduct = async(req, res)=>{
    const {title, description, code, price, stock, category, thumbnail} = req.body
    var products = await productService.getProducts()
    const product = {
        title,
        description,
        code,
        price: +price,
        stock: +stock,
        category,
        thumbnail,
        owner: req.session.user.email
      };
    let id
    if(products.length === 0){
        id = 1
    }else{
        id = products[products.length-1].id + 1
    }

    if(title, description, code, price, stock, category, thumbnail){
        product.id = id
        let result = await productService.addProduct(product)
        res.json(result)
    }else{
        logger.warning("Please, fill all the fields.")
        res.send("Please, fill all the fields.")
    }
}

const updateProduct = async(req, res)=>{
    const updProd = req.body
    let result = await productService.updateProduct(req.params.pid, Object.keys(updProd), Object.values(updProd))
    if(!result){
        logger.error("Error trying to update product.")
        CustomError.createError({
            name:"Product update error.",
            cause: generateProductErrorInfo(req.params.pid),
            message: "Error trying to update product.",
            code: EErrors.INVALID_PRODUCT_ERROR
        })
    }
    res.json(result)
}

const deleteProduct = async(req, res)=>{
    let result
    if(req.session.user.role == "admin"){
        result = await productService.deleteProduct(req.params.pid)
    }else if(req.session.user.role == "premium"){
        let found = await productService.getProductById(req.params.pid)
        if(found.owner == req.session.user.email){
            result = await productService.deleteProduct(req.params.pid)
        }else{
            return res.status(401).send('Authentication error.')
        }
    }else{
        return res.status(401).send('Authentication error.')
    }
    
    if(result.deletedCount == 0){
        logger.error("Error trying to delete product.")
        CustomError.createError({
            name:"Product deletion error.",
            cause: generateProductErrorInfo(req.params.pid),
            message: "Error trying to delete product.",
            code: EErrors.INVALID_PRODUCT_ERROR
        })
    }
    return res.json(result)
}

export default { isAdminOrPremium, getProducts, getProductById, addProduct, updateProduct, deleteProduct }