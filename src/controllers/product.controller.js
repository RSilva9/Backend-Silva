import ProductService from "../services/productService.js";
const productService = new ProductService()

const isAdmin = async(req, res, next)=>{
    if(req.session.user.role == "admin"){
        return next()
    }
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
        res.send("Please, fill all the fields.")
    }
}

const updateProduct = async(req, res)=>{
    const updProd = req.body
    let result = await productService.updateProduct(req.params.pid, Object.keys(updProd), Object.values(updProd))
    res.json(result)
}

const deleteProduct = async(req, res)=>{
    let result = await productService.deleteProduct(req.params.pid)
    return res.json(result)
}

export default { isAdmin, getProducts, getProductById, addProduct, updateProduct, deleteProduct }