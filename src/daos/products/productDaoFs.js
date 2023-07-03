import fs from 'fs'

export default class ProductDaoFs{
    constructor(){
        this.path = './data/products.json'
        this.#init()
    }

    #init = async()=>{
        if(!fs.existsSync(this.path)) await fs.promises.writeFile(this.path, JSON.stringify([]))
    }

    getAll = async(limit, page, query, sort)=>{
        let products = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(products)
    }

    getById = async(pid)=>{
        let res = await fs.promises.readFile(this.path, 'utf-8')
        let products = JSON.parse(res)
        for(let prod of products){
            if(prod.id == pid) return prod
        }
    }

    add = async(product)=>{
        let res = await fs.promises.readFile(this.path, 'utf-8')
        let products = JSON.parse(res)
        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        return product
    }

    update = async(pid, keys, values) =>{
        let products = JSON.parse((fs.readFileSync(this.path,'utf-8')))
        for(let product of products){
            if(product.id == pid){
                for(let i=0; i<keys.length; i++){
                    if(product.hasOwnProperty(keys[i]) && values[i]!=""){
                        product[keys[i]] = values[i]
                    }
                }
            }
        }
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        return products
    }
}