const socketClient = io()

const prodContainer = document.getElementById("prodContainer")
// const productForm = document.getElementById("productForm")

socketClient.on('productManager', product=>{
    while (prodContainer.firstChild) {
        prodContainer.removeChild(prodContainer.lastChild);
    }
    product.forEach(prod=>{
        const newDiv = document.createElement("div")
        newDiv.classList.add("card", "m-1")
        newDiv.style.width = "18rem"
        newDiv.innerHTML = 
        `
        <div class="card-body">
            <h5 class="card-title">${prod.title}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">Disponibles: ${prod.stock}</h6>
            <p class="card-text">${prod.description}</p>
            <h4>$${prod.price}</h4>
        </div>
        `
        prodContainer.appendChild(newDiv)
    })
})

if (location.href === 'https://localhost:8080/realTimeProducts'){
    document.getElementById("submitProduct").addEventListener("click", (evt)=>{
        evt.preventDefault()
        const inputValues = [] 
        const inputs = document.forms["productForm"].getElementsByTagName("input")
        for(let item of inputs){
            inputValues.push(item.value)
        }
        console.log(inputValues)
        socketClient.emit('sendProductValues', inputValues)
    })
}

