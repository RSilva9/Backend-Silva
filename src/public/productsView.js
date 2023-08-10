const socketClient = io()

const prodContainer = document.getElementById("prodContainer")
const BtnLogout = document.getElementById("btnLogout")
const BtnInicio = document.getElementById("btnInicio")
let BtnAddToCart = document.querySelectorAll("#addToCart")
let BtnDelete = document.querySelectorAll("#btnDelete")
const createForm = document.querySelector("#createForm")
const updateForm = document.querySelector("#updateForm")
var numCarrito

function setEventListeners(){
    BtnAddToCart.forEach(btn=>{
        btn.addEventListener("click", async()=>{
            if(btn.dataset.owner == createForm.dataset.user){
                alert("Can't buy your own product.")
            }else{
                const response = await fetch('/sessions/getCartId')
                if(!response.ok){
                    throw new Error("Unable to get cart ID")
                }
                const data = await response.json()
                const cartId = await data.cartId
                socketClient.emit('addToCart', btn.dataset.id, cartId)
                Swal.fire({
                    icon: 'success',
                    title: 'Producto agregado al carrito.',
                })
            }
        })
    })
    
    BtnDelete.forEach(btn=>{
        btn.addEventListener("click", async()=>{
            const response = await axios({
                method: 'delete',
                url: `http://localhost:8080/api/products/${btn.dataset.id}`,
            })
            .then(function (response) {
                console.log(response);
                window.location.reload()
                }
            )
            .catch(function (response) {
                if(response.response.status == 401){
                    alert("You are not autorized to delete this product.")
                };
            })
        })
    })
}
setEventListeners()

BtnLogout.onclick = ()=>{
    window.location.href = "/sessions/logout"
}

BtnInicio.onclick = ()=>{
    window.location.href = "/"
}

createForm.onsubmit = async(event)=>{
    event.preventDefault()
    const formData = new FormData(createForm)
    const product = {}
    formData.forEach((value, key)=>{
        product[key] = value
    })
    const json = JSON.stringify(product)
    let customConfig = {
        headers: {
        'Content-Type': 'application/json'
        }
    };
    const response = await axios.post('http://localhost:8080/api/products/', json, customConfig)
    .then(function (response) {
        console.log(response);
        }
    )
    .catch(function (response) {
        if(response.response.status == 401){
            alert("You are not autorized to create a product.")
        };
    })
    socketClient.emit('createProduct')
}

updateForm.onsubmit = async(event)=>{
    event.preventDefault()
    const form = document.forms['updateForm']
    const product = {
        title: form.title.value,
        description: form.description.value,
        code: form.code.value,
        price: Number(form.price.value),
        stock: Number(form.stock.value),
        category: form.category.value,
        thumbnail: form.thumbnail.value
    }
    let customConfig = {
        headers: {
        'Content-Type': 'application/json'
        }
    };
    const json = JSON.stringify(product)
    const response = await axios.put(`http://localhost:8080/api/products/${form.pid.value}`, json, customConfig)
    .then(function (response) {
        console.log(response);
        }
    )
    .catch(function (response) {
        if(response.response.status == 401){
            alert("You are not autorized to edit this product.")
        };
    })
    socketClient.emit('updateProduct')
}

socketClient.on('productCreated', async newProducts =>{
    prodContainer.innerHTML = ""
    for(let prod of newProducts){
        const newDiv = document.createElement("div")
        newDiv.innerHTML = `
        <div class="card m-1" style="width: 18rem">
            <div class="card-body">
                <h4 class="card-title">${prod.title}</h4>
                <h5 class="card-subtitle mb-2 text-body-secondary">Disponibles: ${prod.stock}</h5>
                <h6 class="card-text">${prod.description}</h6>
                <p>Categoría: ${prod.category}</p>
                <div class="d-flex flex-row justify-content-between">
                    <h4>$${prod.price}</h4>
                    <button id="addToCart" data-id=${prod.id} data-owner=${prod.owner}>Añadir al carrito</button>
                </div>
                <button id="btnDelete" data-id=${prod.id}>X</button>
            </div>
        </div>
        `
        prodContainer.appendChild(newDiv)
    }
    BtnAddToCart = document.querySelectorAll("#addToCart")
    BtnDelete = document.querySelectorAll("#btnDelete")
    setEventListeners()
})