const btnLogin = document.getElementById("btnLogin")
const btnLogout = document.getElementById("btnLogout")
const btnRegister = document.getElementById("btnRegister")
const btnProfile = document.getElementById("btnProfile")
const btnProducts = document.getElementById("btnProducts")
const btnCarts = document.getElementById("btnCarts")

btnLogin.onclick = ()=>{
    window.location.href = "/sessions/login"
}
btnRegister.onclick = ()=>{
    window.location.href = "/sessions/register"
}
btnProfile.onclick = ()=>{
    window.location.href = "/sessions/profile"
}
btnProducts.onclick = ()=>{
    window.location.href = "/productos"
}
btnCarts.onclick = ()=>{
    var numCarrito
    Swal.fire({
        title: 'Elije el ID de carrito.',
        input: 'number',
        inputPlaceholder: 'ID carrito',
        inputValidator: (value) => {
            return !value && 'Introduce un ID válido.'
        },
        allowOutsideClick: false,
    }).then(result => {
        numCarrito = result.value
        window.location.href = `/carts/${numCarrito}`
    })
}
btnLogout.onclick = ()=>{
    window.location.href = "/sessions/logout"
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/sessions/check-login')
    .then(function (response) {
        if (response.ok) {
            btnLogin.disabled = true;
            btnRegister.disabled = true;
            btnLogin.style.backgroundColor = "grey"
            btnRegister.style.backgroundColor = "grey"
        } else {
            btnProfile.disabled = true
            btnProducts.disabled = true
            btnCarts.disabled = true
            btnLogout.disabled = true
            btnProfile.style.backgroundColor = "grey"
            btnProducts.style.backgroundColor = "grey"
            btnCarts.style.backgroundColor = "grey"
            btnLogout.style.backgroundColor = "grey"
            console.log('Error al verificar el login');
        }
        })
    .catch(function (error) {
        console.log(error);
    });
});