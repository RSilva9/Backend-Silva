import fs from 'fs';
import dataProductos from '../../json/productos.json' assert { type: 'json' };

class CartManager{
    constructor(){
        this.path = './src/json/carritos.json'
        JSON.parse((fs.readFileSync(this.path,'utf-8'))).length > 0 ? this.carts = JSON.parse((fs.readFileSync(this.path,'utf-8'))) : this.carts = []
    }

    generateId = () => {
        let id
        if(this.carts.length === 0){
            id = 1
        }else{
            id = this.carts[this.carts.length-1].id + 1
        }
        return id;
    }

    getCarts = (limite) => {
        if(!limite || limite > this.carts.length || limite < 0){
            return this.carts
        }else{
            const newArray = []
            for(let i=0; i<limite; i++){
                newArray.push(this.carts[i])
            }
            return newArray
        }
    }

    getCartById = (requestedCode) => {
        let found
        this.carts.forEach(p => {
            if(p.id == requestedCode){
                found = p
            }
        })
        return found.products;
    }

    addCart = () =>{
        let id = this.generateId()
        const products = []
        let newCart = {
            id, products
        }
        this.carts.push(newCart)
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, '\t'))
    }

    addProductToCart = (cartId, prodId)=>{
        let selectedCart
        let found

        for(let cart of this.carts){
            if(cart.id == cartId){
                selectedCart = cart.products
            }
        }
        for(let p of dataProductos){
            if(p.id == prodId){
                if(selectedCart.length < 1){
                    const newProd = { id: p.id, quantity: 1}
                    selectedCart.push(newProd) 
                }else{
                    for(let item of selectedCart){
                        if(item.id == prodId){
                            found = item;
                        }
                    }
                    if(found){
                        found.quantity++
                    }else{
                        const newProd = { id: p.id, quantity: 1}
                        selectedCart.push(newProd)
                    }
                }
                fs.writeFileSync(this.path, JSON.stringify(this.carts, null, '\t'))
            }
        }
    }
}

const cartManager = new CartManager()

export default cartManager;