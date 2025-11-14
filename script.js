// ====== REFERENCIAS A LOS BOTONES ======
const btnGuardar = document.getElementById("btnGuardar");
const btnVer = document.getElementById("btnVer");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnBorrar = document.getElementById("btnBorrar");

// ==== FUNCION PARA LIMPIAR FORMULARIO ====
function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("email").value = "";
  document.getElementById("edad").value = "";
}

// ==== GUARDAR DATOS ====
btnGuardar.addEventListener("click", () => {
  // Limpia los mensajes de error anteriores
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const edad = document.getElementById("edad").value.trim();

  let valido = true;

  // Validación de Nombre
  if (nombre === "") {
    document.getElementById("error-nombre").textContent =
      "El nombre es obligatorio.";
    valido = false;
  }

  // Validación de Email
  if (email === "") {
    document.getElementById("error-email").textContent =
      "El email es obligatorio.";
    valido = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    document.getElementById("error-email").textContent =
      "Ingrese un email válido.";
    valido = false;
  }

  // Validación de Edad
  if (edad === "") {
    document.getElementById("error-edad").textContent =
      "La edad es obligatoria.";
    valido = false;
  } else if (isNaN(edad) || edad <= 0) {
    document.getElementById("error-edad").textContent =
      "Ingrese una edad válida.";
    valido = false;
  }

  // Si es válido, guarda en LocalStorage
  if (valido) {
    const usuario = { nombre, email, edad };
    // Obtiene la lista actual de usuarios o un array vacío
    let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    listaUsuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
    
    // Alerta de éxito
    alert("✅ Datos guardados correctamente en LocalStorage.");
    
    limpiarFormulario();

    // Refresca la lista de usuarios si está visible
    const resultado = document.getElementById("resultado");
    if (resultado.style.display === "block") {
      mostrarUsuarios();
    }
  }
});

// ==== FUNCIÓN PARA MOSTRAR USUARIOS ====
function mostrarUsuarios() {
  const resultado = document.getElementById("resultado");
  const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuariosGuardados.length === 0) {
    // No hay datos, oculta el panel y restablece el botón
    resultado.style.display = "none";
    resultado.innerHTML = "";
    btnVer.textContent = "Ver Datos";
    return;
  }

  let html = "<h3>Usuarios Guardados:</h3>";
  usuariosGuardados.forEach((u, i) => {
    html += `
            <div class="usuario" data-index="${i}">
                <p><strong>Usuario #${i + 1}</strong></p>
                <p><strong>Nombre:</strong> ${u.nombre}</p>
                <p><strong>Email:</strong> ${u.email}</p>
                <p><strong>Edad:</strong> ${u.edad}</p>
                <button class="btn-borrar-individual" data-index="${i}">Borrar Usuario</button>
            </div>
            <hr>
        `;
  });

  resultado.innerHTML = html;
  resultado.style.display = "block"; // Muestra el panel
  btnVer.textContent = "Ocultar Datos";

  // Asigna eventos a los botones de borrar individualmente
  const botonesBorrar = document.querySelectorAll(".btn-borrar-individual");
  botonesBorrar.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"));
      
      // Borra el usuario del array y actualiza LocalStorage
      usuariosGuardados.splice(index, 1);
      localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
      
      mostrarUsuarios(); // Refresca la lista
      alert("✅ Usuario eliminado.");
    });
  });
}

// ==== FUNCIÓN PARA MOSTRAR USUARIOS AL CARGAR (SOLO SI HAY DATOS) ====
function mostrarUsuariosAlCargar() {
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    // Si hay datos, llama a mostrarUsuarios para que la lista aparezca visible al refrescar.
    if (usuariosGuardados.length > 0) {
        mostrarUsuarios();
    }
}

// ==== BOTÓN VER/OCULTAR DATOS ====
// CORRECCIÓN: Comprobar si hay usuarios antes de intentar mostrar
btnVer.addEventListener("click", () => {
  const resultado = document.getElementById("resultado");
  const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuariosGuardados.length === 0) {
    alert("⚠ No hay datos que mostrar.");
    return;
  }

  if (resultado.style.display === "block") {
    // Ocultar lista
    resultado.style.display = "none";
    resultado.innerHTML = "";
    btnVer.textContent = "Ver Datos";
  } else {
    mostrarUsuarios(); // Mostrar lista (sabemos que hay datos)
  }
});

// ==== LIMPIAR FORMULARIO ====
btnLimpiar.addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const edad = document.getElementById("edad").value;

  const errores = [...document.querySelectorAll(".error")];
  const hayErrores = errores.some((e) => e.textContent.trim() !== "");

  const todoVacio =
    nombre.trim() === "" &&
    email.trim() === "" &&
    edad.trim() === "" &&
    !hayErrores;

  if (todoVacio) {
    alert("No hay nada que limpiar.");
    return;
  }

  limpiarFormulario();
  errores.forEach((e) => (e.textContent = ""));
  alert("Formulario limpiado.");
});

// ==== BORRAR TODOS LOS DATOS DE LOCALSTORAGE ====
btnBorrar.addEventListener("click", () => {
  const usuarios = JSON.parse(localStorage.getItem("usuarios"));

  if (!usuarios || usuarios.length === 0) {
    alert("⚠ No hay datos para borrar.");
    return;
  }

  const confirmar = confirm("¿Está seguro que desea borrar TODOS los datos de LocalStorage?");
    
  if(confirmar){
      localStorage.removeItem("usuarios");
      document.getElementById("resultado").innerHTML = "";
      document.getElementById("resultado").style.display = "none";
      btnVer.textContent = "Ver Datos";
      alert("✅ Datos borrados del LocalStorage.");
  }
});

// ==== INICIALIZACIÓN: MUESTRA DATOS AL CARGAR LA PÁGINA SI EXISTEN ====
// Esto asegura que la lista de datos se "refresque" y esté visible si hay datos.
document.addEventListener("DOMContentLoaded", mostrarUsuariosAlCargar);
