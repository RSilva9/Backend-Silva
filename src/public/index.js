const socketClient = io()

const prodContainer = document.getElementById("prodContainer")
const BtnAddToCart = document.querySelectorAll("#addToCart")
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