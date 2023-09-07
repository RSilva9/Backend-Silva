const viewDocuments = document.getElementById("viewDocuments")
const fileForm = document.querySelector("#fileForm")
const btnInicio = document.getElementById("btnInicio")
const btnAdmin = document.getElementById("btnAdmin")

viewDocuments.onclick = ()=>{
    window.location.href = "/documents"
}

btnInicio.onclick = ()=>{
    window.location.href = "/"
}

btnAdmin.onclick = ()=>{
    window.location.href = "/adminPanel"
}