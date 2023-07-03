import config from "../config/config.js"

export default class PersistenceFactory{
    static getPersistence = async()=>{
        switch(config.app.persistence){
            case "FILE":
                const { default: ProductDaoFs } = await import ('./products/productDaoFs.js')
                // const { default: CartDaoFs } = await import('./carts/cartDaoFs.js')
                return { ProductDao: new ProductDaoFs(), /*CartDaoFs: new CartDaoFs()*/ }
            case "MONGO":
                const { default: ProductDaoMongo } = await import ('./products/productDaoMongo.js')
                const { default: CartDaoMongo } = await import('./carts/cartDaoMongo.js')
                const { default: TicketDaoMongo } = await import('./tickets/ticketDaoMongo.js')
                return { ProductDao: new ProductDaoMongo(), CartDao: new CartDaoMongo(), TicketDao: new TicketDaoMongo() }
        }
    }
}