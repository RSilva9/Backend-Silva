import fs from 'fs';

class ProductManager{
    constructor(){
        this.path = './src/json/productos.json'
        JSON.parse((fs.readFileSync(this.path,'utf-8'))).length > 0 ? this.products = JSON.parse((fs.readFileSync(this.path,'utf-8'))) : this.products = []
    }
    
    generateId = () => {
        let id
        if(this.products.length === 0){
            id = 1
        }else{
            id = this.products[this.products.length-1].id + 1
        }
        return id;
    }

    getProducts = (limite) => {
        if(!limite || limite > this.products.length || limite < 0){
            return this.products
        }else{
            const newArray = []
            for(let i=0; i<limite; i++){
                newArray.push(this.products[i])
            }
            return newArray
        }
    }

    getProductById = (requestedCode) => {
        let found
        this.products.forEach(p => {
            if(p.id == requestedCode){
                found = p
            }
        })
        return found;
    }

    addProduct = (title, description, code, price, status, stock, category, thumbnail) =>{
        if(!title || !description || !code || !price || !status || !stock || !category){
            console.error("Debe completar todos los campos obligatoriamente.")
            return;
        }

        let id = this.generateId()
        let newProduct = {
            id, title, description, code, price, status, stock, category, thumbnail
        }
        this.products.push(newProduct)
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'))
    }

    updateProduct = (id, fields, contents) =>{
        this.products.forEach(item=>{
            if(item.id == id){
                for(let i=0; i<fields.length; i++){
                    if(item.hasOwnProperty(fields[i])){
                        item[fields[i]] = contents[i]
                    }
                }
            }
        })
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'))
    }

    deleteProduct = (id)=>{
        this.products.forEach(item=>{
            if(item.id == id){
                let index = this.products.indexOf(item)
                this.products.splice(index, 1)
            }
        })
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'))
    }
}

const productManager = new ProductManager()
// productManager.addProduct("Lata de Coca-Cola.", "Bebida gaseosa enlatada con azúcar y colorante. Sabor cola." , 350, "img/thumbnails/coke", 20)
// productManager.addProduct("Botella de agua Villvicencio.", "Agua sin gas envasada." , 300, "img/thumbnails/villaVic", 30)
// productManager.addProduct("Paquete de papas Lays.", "Paquete de papas sabor clásico. 23 gramos." , 600, "img/thumbnails/lays", 15)
// productManager.addProduct("Alfajor Fantoche triple.", "Alfajor sabor chocolate." , 200, "img/thumbnails/alfajorFantoche", 10)
// productManager.addProduct("Sugus Confitados.", "Caja pequeña de confites azucarados de múltiples sabores." , 300, "img/thumbnails/sugusConf", 8)
// productManager.addProduct("Baggio de manzana.", "Jugo envasado en cartón sabor manzana." , 210, "img/thumbnails/baggioManz", 6)

export default productManager;