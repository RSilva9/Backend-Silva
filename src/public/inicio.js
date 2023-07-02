const btnLogin = document.getElementById("btnLogin")
const btnLogout = document.getElementById("btnLogout")
const btnRegister = document.getElementById("btnRegister")
const btnGitHub = document.getElementById("btnGitHub")
const btnGitHubContainer = document.getElementById("btnGitHubContainer")
const btnProfile = document.getElementById("btnProfile")
const btnProducts = document.getElementById("btnProducts")
const btnCarts = document.getElementById("btnCarts")
const preLoader = document.getElementById("preLoader")
const container = document.getElementById("container")

setTimeout(() => {
    preLoader.classList.add("d-none")
    container.classList.remove("d-none")
}, 500);

btnLogin.onclick = ()=>{
    window.location.href = "/sessions/login"
}
btnRegister.onclick = ()=>{
    window.location.href = "/sessions/register"
}
btnGitHub.onclick = ()=>{
    window.location.href = "/sessions/githubcallback"
}
btnProfile.onclick = ()=>{
    window.location.href = "/profile"
}
btnProducts.onclick = ()=>{
    window.location.href = "/products"
}
btnCarts.onclick = async()=>{
    try {
        const response = await fetch('/sessions/getCartId')
        if(!response.ok){
            throw new Error("Unable to get cart ID")
        }
        const data = await response.json()
        const cartId = await data.cartId
        window.location.href = `/carts/${cartId}`
    } catch (error) {
        console.error(error)
    }
}
btnLogout.onclick = ()=>{
    window.location.href = "/sessions/logout"
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/sessions/checkLogin')
    .then(function (response) {
        if (response.ok) {
            btnLogin.disabled = true;
            btnRegister.disabled = true;
            btnGitHub.disabled = true;
            btnLogin.style.backgroundColor = "grey"
            btnRegister.style.backgroundColor = "grey"
            btnGitHub.style.backgroundColor = "grey"
            btnGitHubContainer.style.backgroundColor = "grey"
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