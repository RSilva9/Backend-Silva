const socketClient = io()

const prodContainer = document.getElementById("prodContainer")
const productForm = document.getElementById("productForm")
const btnDelete = document.querySelectorAll("#btnDelete")

if(window.location.href.match(/\/\d+$/)) {
    document.getElementById("submitProduct").addEventListener("click", (evt)=>{
        evt.preventDefault()
        const productId = window.location.href.split('/').pop()
        const inputKeys = [] 
        const inputValues = []
        const inputs = document.forms["productForm"].getElementsByTagName("input")
        for(let item of inputs){
            if(item != ""){
                inputKeys.push(item.name)
                inputValues.push(item.value)
            }
        }
        socketClient.emit('sendProductValues', productId, inputKeys, inputValues)
    })
}

btnDelete.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        socketClient.emit('deleteProduct', btn.dataset.id)
        window.location.reload()
    })
})