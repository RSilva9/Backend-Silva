class ProductManager{
    constructor(){
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
        return this.products;
    }

    getProductById = (requestedCode) => {
        let found
        this.products.forEach(p => {
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
    }
}

const productManager = new ProductManager()
productManager.addProduct("Lata de Coca-Cola.", "Bebida gaseosa enlatada con azúcar y colorante. Sabor cola." , 350, "img/thumbnails/coke", 20)
productManager.addProduct("Paquete de papas Lays.", "Paquete de papas sabor clásico. 23 gramos." , 600, "img/thumbnails/lays", 15)
productManager.addProduct("Alfajor Fantoche triple.", "Alfajor sabor chocolate." , 200, "img/thumbnails/alfajorFantoche", 10)
productManager.addProduct("Sugus Confitados.", "Caja pequeña de confites azucarados de múltiples sabores." , 300, "img/thumbnails/sugusConf", 8)


// console.log(productManager.getProducts())
console.log(productManager.getProductById(3))