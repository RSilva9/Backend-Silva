const socketClient = io()

const prodContainer = document.getElementById("prodContainer")
const BtnAddToCart = document.querySelectorAll("#addToCart")
const BtnLogout = document.getElementById("btnLogout")
var numCarrito

BtnAddToCart.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        Swal.fire({
            title: 'Elije el ID de carrito.',
            input: 'text',
            inputPlaceholder: 'ID carrito',
            inputValidator: (value) => {
                return !value && 'Introduce un ID válido.'
            },
            allowOutsideClick: false,
        }).then(result => {
            numCarrito = result.value
            socketClient.emit('addToCart', btn.dataset.id, numCarrito)
        })
    })
})

BtnLogout.addEventListener("click", ()=>{
    window.location.replace("/sessions/logout")
})