document.addEventListener("DOMContentLoaded" , () =>{
  // AddEventLIstener: cuando p[ase esto, hace esto otro
  // Dom es un evento que se dispara cuando el navegador termino de cargar todo el html 

  const url = "http://localhost:3000/articulos";
  // DECLARAMOS CONSTANTES
  const resultadosEl = document.getElementById("resultados");
  const btnCrear= document.getElementById("btnCrear");
  const formArticulo = document.getElementById("formArticulo");
  const descripcion = document.getElementById("descripcion");
  const precio= document.getElementById("precio");
  const peso = document.getElementById("peso");
  const stock = document.getElementById("stock");
  const modalEl = document.getElementById("modalArticulo");
  const modalArticulo = new bootstrap.Modal(modalEl);
  // encontar y seleccionar un elemento del html usando el id 

  //ESTADOS
  let opcion = "crear";
  let idForm = null;

  // CARGA DE DATOS 
  const cargar = () =>{
    fetch(url)
        .then(res=>res.json())
        .then(data=>mostrar(data))
        .catch(err=>console.log("ERROR", err));
  };

  // MOSTRAR TABLA
    const mostrar = (articulos) => {
    let resultados = "";

    articulos.forEach(articulo => {
      resultados += `
        <tr>
          <td>${articulo.id}</td>
          <td>${articulo.descripcion}</td>
          <td>${articulo.precio}</td>
          <td>${articulo.peso}</td>
          <td>${articulo.stock}</td>
         <tr>
            <button class="btnEditar btn btn-primary btn-sm" data-id="${articulo.id}">Editar</button>
            <button class="btnBorrar btn btn-danger btn-sm" data-id="${articulo.id}">Borrar</button></td>
          </tr>
        
      `;
    });

    resultadosEl.innerHTML = resultados;
  };
  // BOTON CREAR
  btnCrear.addEventListener("click", ()=>{
    opcion="crear";
    idForm= null;
    formArticulo.reset();
    modalArticulo.show();
  });
  // GUARDAR CREAR/EDITAR
  formArticulo.addEventListener("submit", (e)=>{
    e.preventDefault();
    const data = {
      descripcion: descripcion.ariaValueMax.trim(),
      precio: Number(precio.value),
      peso: Number(peso.value),
      stock: Number(stock.value)
      
    };
    if (opcion=== "crear"){
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(() => {
        modalArticulo.hide();
        cargar();
        alertify.succes("Creado correctamente");
      })
      .catch(err => console.log("POST error:", err));
    }
     if (opcion === "editar") {
      fetch(`${url}/${idForm}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(() => {
        modalArticulo.hide();
        cargar();
        alertify.success("Editado correctamente");
      })
      .catch(err => console.log("PUT error:", err));
    }
  })
  //  EDITAR/BORRAR
  resultadosEl.addEventListener("click", (e) =>{
    //EDITAR
    if(e.target.classList.contains("btnEditar")){
      idForm= e.target.dataset.id;
      opcion= "editar";
       fetch(`${url}/${idForm}`)
        .then(res => res.json())
        .then(data => {
          descripcion.value = data.descripcion;
          precio.value = data.precio;
          peso.value = data.peso;
          stock.value = data.stock;
          modalArticulo.show();
        });
    //BORRAR
    if (e.target.classList.contains("btnBorrar")){
      const id= e.target.dataset.id;
      alertify.confirm("Confirmar","¿Eliminar articulo?",
                ()=>{
                  fetch(`${url}/${id}`, { method: "DELETE" })
                    .then(() =>{
                      cargar();
                      alertify.success("Elminado")
                    });
                }
      )
    }
    }
  })
  // INICIALIZA
  cargar();
})

