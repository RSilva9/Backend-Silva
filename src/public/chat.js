const chatSocket = io()
let userEmail = ""

Swal.fire({
    title: 'Introduce tu correo electrónico',
    input: 'email',
    inputPlaceholder: 'Tu correo',
    inputValidator: (value) => {
        return !value && 'Introduce un correo válido.'
    },
    allowOutsideClick: false,
    onOpen: (modal) => {
        modal.querySelector('input').focus()
    },
    preConfirm: (value) => {
        if (/\S+@\S+\.\S+/.test(value)) {
            return value.trim()
        } else {
            Swal.showValidationMessage('Introduce un correo válido.')
            return false
        }
    }
}).then(result => {
    userEmail = result.value
    chatSocket.emit('authenticated', userEmail)
})

const cajaMensaje = document.getElementById('msgUser')
const mensajes = document.getElementById('mensajes')
const date = new Date()

cajaMensaje.addEventListener("keyup", evt=>{
    if(evt.key === "Enter"){
        chatSocket.emit('userMessage', {email: userEmail, message: cajaMensaje.value, dateSent: date})
        cajaMensaje.value= ""
    }
})

chatSocket.on('mensajesCargados', data =>{
    let mensajesRecibidos= ""
    data.arrayMensajes.forEach(msg =>{
        mensajesRecibidos += `<li><p class="block">${msg.email} says: ${msg.content}  [${msg.dateSent}]</p></li>`
    })
    mensajes.innerHTML = mensajesRecibidos
})