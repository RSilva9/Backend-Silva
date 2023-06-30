import PersistenceFactory from "../daos/persistenceFactory.js"

export default class ProductService{
    constructor(){
        this.productDao
        this.init()
    }

    init = async()=>{
        this.productDao = await PersistenceFactory.getPersistence()
    }

    getProducts = async()=>{
        return await this.productDao.getAll()
    }

    paginateProducts = async() =>{
        return await this.productDao.paginateAll()
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