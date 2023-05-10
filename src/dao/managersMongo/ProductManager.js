import { productModel } from '../models/products.model.js'

class ProductManager{
    constructor(model){
        this.productModel = model
    }
    
    getProducts = async(limit, page, query, sort)=>{
        try{
            return await productModel.paginate(query, {limit: limit, page: page, sort: sort})
        }catch(err){
            return new Error(err)
        }
    }

    getProductById = async(pid)=>{
        try{
            return await productModel.findOne({id: pid}).lean()
        }catch(err){
            return new Error(err)
        }
    }

    addProduct = async(id, title, description, code, price, stock, category, thumbnail)=>{
        try{
            const status = true
            const newProduct = {
                id: id,
                title: title, 
                description: description, 
                code: code, 
                price: price, 
                status: status, 
                stock: stock, 
                category: category, 
                thumbnail: thumbnail
            }
            return await productModel.create(newProduct)
        }catch(err){
            return new Error(err)
        }
    }

    updateProduct = async(pid, keys, values)=>{
        try{
            const producto = await productModel.findOne({id: pid}).lean()
            for(let i=0; i<keys.length; i++){
                if(producto.hasOwnProperty(keys[i]) && values[i]!=""){
                    producto[keys[i]] = values[i]
                }
            }
            await productModel.updateOne({id: pid}, producto)
        }catch(err){
            return new Error(err)
        }
    }

    deleteProduct = async(pid)=>{
        try{
            return await productModel.deleteOne({id: pid})
        }catch(err){
            return new Error(err)
        }
    }
}

export const productManager = new ProductManager()