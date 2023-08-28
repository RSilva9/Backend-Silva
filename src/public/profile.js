const viewDocuments = document.getElementById("viewDocuments")
const fileForm = document.querySelector("#fileForm")
const btnInicio = document.getElementById("btnInicio")

viewDocuments.onclick = ()=>{
    window.location.href = "/documents"
}

btnInicio.onclick = ()=>{
    window.location.href = "/"
}