const socketClient = io()

const prodContainer = document.getElementById("prodContainer")
const BtnAddToCart = document.querySelectorAll("#addToCart")
const BtnLogout = document.getElementById("btnLogout")
const BtnInicio = document.getElementById("btnInicio")
var numCarrito

BtnAddToCart.forEach(btn=>{
    btn.addEventListener("click", async()=>{
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
    })
})

BtnLogout.onclick = ()=>{
    window.location.href = "/sessions/logout"
}

BtnInicio.onclick = ()=>{
    window.location.href = "/"
}