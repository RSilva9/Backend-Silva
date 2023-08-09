import mongoose from 'mongoose'
import productModel from "../../models/product.model.js"

export default class ProductDaoMongo{
    constructor(){
        this.model = mongoose.model(productModel.productCollection, productModel.productSchema)
    }

    getAll = async() =>{
        try {
            let result = await this.model.find().lean()
            return result
        } catch (error) {
            return new Error(error)
        }
    }

    paginateAll = async(limit, page, query, sort) =>{
        try {
            let result = await this.model.paginate(query, limit, page, sort).lean()
            return result
        } catch (error) {
            return new Error(error)
        }
    }

    getById = async(pid)=>{
        try{
            return await this.model.findOne({id: pid}).lean()
        }catch(err){
            return new Error(err)
        }
    }

    add = async(product)=>{
        let result = await this.model.create(product)
        return result
    }

    update = async(pid, keys, values) =>{
        try{
            const producto = await this.model.findOne({id: pid}).lean()
            for(let i=0; i<keys.length; i++){
                if(producto.hasOwnProperty(keys[i]) && values[i]!=""){
                    producto[keys[i]] = values[i]
                }
            }
            return await this.model.updateOne({id: pid}, producto)
        }catch(err){
            return new Error(err)
        }
    }

    delete = async(pid)=>{
        try{
            return await this.model.deleteOne({id: pid})
        }catch(err){
            return new Error(err)
        }
    }
}