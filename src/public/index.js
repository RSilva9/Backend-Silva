const socketClient = io()

const prodContainer = document.getElementById("prodContainer")
const productForm = document.getElementById("productForm")



// socketClient.on('productos', (products, limit)=>{
//     while (prodContainer.firstChild) {
//         prodContainer.removeChild(prodContainer.lastChild);
//     }
//     if(limit){
//         for(let i=0; i<limit; i++){
//             const newDiv = document.createElement("div")
//             newDiv.classList.add("card", "m-1")
//             newDiv.style.width = "18rem"
//             newDiv.innerHTML = 
//             `
//             <div class="card-body">
//                 <h5 class="card-title">${products[i].title}</h5>
//                 <h6 class="card-subtitle mb-2 text-body-secondary">Disponibles: ${products[i].stock}</h6>
//                 <p class="card-text">${products[i].description}</p>
//                 <div class="d-flex justify-content-between">
//                     <h4>$${products[i].price}</h4>
//                     <button id="btnDelete" data-id="${products[i].id}">Borrar</button>
//                 </div>
//             </div>
//             `
//             prodContainer.appendChild(newDiv)
//         }
//     }else{
//         products.forEach(prod=>{
//             const newDiv = document.createElement("div")
//             newDiv.classList.add("card", "m-1")
//             newDiv.style.width = "18rem"
//             newDiv.innerHTML = 
//             `
//             <div class="card-body">
//                 <h5 class="card-title">${prod.title}</h5>
//                 <h6 class="card-subtitle mb-2 text-body-secondary">Disponibles: ${prod.stock}</h6>
//                 <p class="card-text">${prod.description}</p>
//                 <div class="d-flex justify-content-between">
//                     <h4>$${prod.price}</h4>
//                     <button id="btnDelete" data-id="${prod.id}">Borrar</button>
//                 </div>
//             </div>
//             `
//             prodContainer.appendChild(newDiv)
//         })
//     }
//     const btnDelete = document.querySelectorAll("#btnDelete")

//     btnDelete.forEach(btn=>{
//         console.log(btn)
//         btn.addEventListener("click", ()=>{
//             socketClient.emit('deleteProduct', btn.dataset.id)
//         })
//     })
// })

// socketClient.on('foundProduct', product=>{
//     while (prodContainer.firstChild) {
//         prodContainer.removeChild(prodContainer.lastChild);
//     }
//     const newDiv = document.createElement("div")
//             newDiv.classList.add("card", "m-1")
//             newDiv.style.width = "18rem"
//             newDiv.innerHTML = 
//             `
//             <div class="card-body">
//                 <h5 class="card-title">${product.title}</h5>
//                 <h6 class="card-subtitle mb-2 text-body-secondary">Disponibles: ${product.stock}</h6>
//                 <p class="card-text">${product.description}</p>
//                 <div class="d-flex justify-content-between">
//                     <h4>$${product.price}</h4>
//                     <button id="btnDelete" data-id="${product.id}">Borrar</button>
//                 </div>
//             </div>
//             `
//             prodContainer.appendChild(newDiv)
// })