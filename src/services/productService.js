import PersistenceFactory from "../daos/persistenceFactory.js"

export default class ProductService{
    constructor(){
        this.persistence
        this.productDao
        this.init()
    }

    init = async()=>{
        this.persistence = await PersistenceFactory.getPersistence()
        this.productDao = this.persistence.ProductDao
    }

    getProducts = async()=>{
        return await this.productDao.getAll()
    }

    paginateProducts = async(limit, page, query, sort) =>{
        return await this.productDao.paginateAll(limit, page, query, sort)
    }

    getProductById = async(pid)=>{
        return await this.productDao.getById(pid)
    }

    addProduct = async(product)=>{
        return await this.productDao.add(product)
    }

    updateProduct = async(pid, keys, values)=>{
        return await this.productDao.update(pid, keys, values)
    }

    deleteProduct = async(pid)=>{
        return await this.productDao.delete(pid)
    }
}