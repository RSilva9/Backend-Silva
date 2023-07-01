import PersistenceFactory from "../daos/persistenceFactory.js"

export default class CartService{
    constructor(){
        this.persistence
        this.cartDao
        this.init()
    }

    init = async()=>{
        this.persistence = await PersistenceFactory.getPersistence()
        this.cartDao = this.persistence.CartDao
    }

    getCarts = async()=>{
        return await this.cartDao.getAll()
    }

    getCartById = async(cid)=>{
        return await this.cartDao.getById(cid)
    }

    createCart = async()=>{
        return await this.cartDao.create()
    }

    addProductToCart = async(cid, p_id, pid)=>{
        return await this.cartDao.update(cid, p_id, pid)
    }

    deleteCart = async(cid)=>{
        return await this.cartDao.delete(cid)
    }
}