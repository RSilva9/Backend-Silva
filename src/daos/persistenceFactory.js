import config from "../config/config.js"

export default class PersistenceFactory{
    static getPersistence = async()=>{
        switch(config.app.persistence){
            case "FILE":
                const { default: ProductDaoFs } = await import ('./products/productDaoFs.js')
                const { default: CartDaoFs } = await import('./carts/cartDaoFs.js')
                return { ProductDaoFs: new ProductDaoFs(), CartDaoFs: new CartDaoFs() }
            case "MONGO":
                const { default: ProductDaoMongo } = await import ('./products/productDaoMongo.js')
                const { default: CartDaoMongo } = await import('./carts/cartDaoMongo.js')
                return { ProductDaoMongo: new ProductDaoMongo(), CartDaoMongo: new CartDaoMongo() }
        }
    }
}