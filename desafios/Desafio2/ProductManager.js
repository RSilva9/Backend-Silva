import fs from 'fs';

class ProductManager{
    constructor(){
        this.path = './desafios/Desafio2/productos.json'
        this.products = []
    }

    generateCode = () => {
        let code
        if(this.products.length === 0){
            code = 1
        }else{
            code = this.products[this.products.length-1].code + 1
        }
        return code;
    }

    getProducts = () => {
        let productosFile = JSON.parse((fs.readFileSync(this.path,'utf-8')))
        return productosFile
    }

    getProductById = (requestedCode) => {
        let found
        let productosFile = JSON.parse((fs.readFileSync(this.path,'utf-8')))
        productosFile.forEach(p => {
            if(p.code == requestedCode){
                found = p
            }
        })
        return found;
    }

    addProduct = (title, description, price, thumbnail, stock) =>{
        if(!title || !description || !price || !thumbnail || !stock){
            console.error("Debe completar todos los campos obligatoriamente.")
            return;
        }

        let code = this.generateCode()
        let newProduct = {
            title, description, price, thumbnail, code, stock
        }
        this.products.push(newProduct)
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'))
    }

    updateProduct = (id, fields, contents) =>{
        let productosFile = JSON.parse((fs.readFileSync(this.path,'utf-8')))
        productosFile.forEach(item=>{
            if(item.code == id){
                for(let i=0; i<fields.length; i++){
                    if(item.hasOwnProperty(fields[i])){
                        item[fields[i]] = contents[i]
                    }
                }
            }
        })
        fs.writeFileSync(this.path, JSON.stringify(productosFile, null, '\t'))
    }

    deleteProduct = (id)=>{
        let productosFile = JSON.parse((fs.readFileSync(this.path,'utf-8')))
        productosFile.forEach(item=>{
            if(item.code == id){
                let index = productosFile.indexOf(item)
                productosFile.splice(index, 1)
            }
        })
        fs.writeFileSync(this.path, JSON.stringify(productosFile, null, '\t'))
    }
}

const productManager = new ProductManager()
productManager.addProduct("Lata de Coca-Cola.", "Bebida gaseosa enlatada con azúcar y colorante. Sabor cola." , 350, "img/thumbnails/coke", 20)
productManager.addProduct("Botella de agua Villvicencio.", "Agua sin gas envasada." , 300, "img/thumbnails/villaVic", 30)
productManager.addProduct("Paquete de papas Lays.", "Paquete de papas sabor clásico. 23 gramos." , 600, "img/thumbnails/lays", 15)
productManager.addProduct("Alfajor Fantoche triple.", "Alfajor sabor chocolate." , 200, "img/thumbnails/alfajorFantoche", 10)
productManager.addProduct("Sugus Confitados.", "Caja pequeña de confites azucarados de múltiples sabores." , 300, "img/thumbnails/sugusConf", 8)


console.log("\n--------------------------------- TODOS LOS PRODUCTOS\n", productManager.getProducts(), "\n--------------------------------- PRODUCTO DE ID 4\n", productManager.getProductById(4), "\n--------------------------------- PRODUCTO DE ID 4 LUEGO DEL CAMBIO\n")
productManager.updateProduct(4, [ "stock", "title", "price" ], [ 25, "Alfajor Fantoche doble.", 150])
console.log(productManager.getProductById(4))
productManager.deleteProduct(2)
console.log("\n--------------------------------- TODOS LOS PRODUCTOS TRAS ELIMINAR PRODUCTO CON ID 2\n", productManager.getProducts())