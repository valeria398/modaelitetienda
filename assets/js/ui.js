// ── LOGIN ────────────────────────────────────────────────────

// Abre el modal de login y bloquea el scroll del fondo
function uiAbrirLogin() {
  // Cierra alerta si está abierta
  uiCerrarAlerta();

  document.getElementById("login-overlay").classList.add("visible");
  document.getElementById("login-modal").classList.add("visible");
  document.body.style.overflow = "hidden";

  // Pone el cursor automáticamente en el campo email
  setTimeout(function() {
    document.getElementById("campo-email").focus();
  }, 300);
}

// Cierra el modal de login y restaura el scroll
function uiCerrarLogin() {
  document.getElementById("login-overlay").classList.remove("visible");
  document.getElementById("login-modal").classList.remove("visible");
  document.body.style.overflow = "";
  document.getElementById("login-error").style.display = "none";
}

// Muestra mensaje de error en login
function uiMostrarErrorLogin(mensaje) {
  var errorEl = document.getElementById("login-error");
  errorEl.textContent = mensaje;
  errorEl.style.display = "block";
}

// Oculta el mensaje de error de login
function uiOcultarErrorLogin() {
  document.getElementById("login-error").style.display = "none";
}

// Muestra la sesión activa del usuario en la UI
function uiMostrarSesionActiva(usuario) {
  var btnToggle = document.getElementById("btn-toggle");
  var navUsuario = document.getElementById("nav-usuario");
  var nombreUsuario = document.getElementById("nombre-usuario");
  var avatarUsuario = document.getElementById("avatar-usuario");
  var avisoLogin = document.getElementById("aviso-login");

  if (btnToggle) btnToggle.style.display = "none";
  if (navUsuario) navUsuario.style.display = "flex";
  if (nombreUsuario) nombreUsuario.textContent = usuario.nombre;
  if (avatarUsuario) avatarUsuario.textContent = usuario.avatar;
  if (avisoLogin) avisoLogin.style.display = "none";

  // Limpia inputs del login
  var campoEmail = document.getElementById("campo-email");
  var campoPassword = document.getElementById("campo-password");
  if (campoEmail) campoEmail.value = "";
  if (campoPassword) campoPassword.value = "";
}

// Cierra la sesión y restaura UI inicial
function uiCerrarSesion() {
  document.getElementById("btn-toggle").style.display = "block";
  document.getElementById("nav-usuario").style.display = "none";
  document.getElementById("aviso-login").style.display = "block";
  
  document.getElementById("campo-email").value = "";
  document.getElementById("campo-password").value = "";
}

// Efecto de animación shake cuando hay error en login
function uiAnimarLoginShake() {
  var modal = document.getElementById("login-modal");
  modal.style.animation = "shake 0.4s ease";

  setTimeout(function() {
    modal.style.animation = "";
  }, 400);
}


// ── CATEGORÍAS ───────────────────────────────────────────────

// Sincroniza el botón activo de categoría en el menú
function uiSincronizarBotonesCategoria(categoria) {
  var botones = document.querySelectorAll(".nav-cat");

  for (var i = 0; i < botones.length; i++) {
    if (botones[i].dataset.cat === categoria) {
      botones[i].classList.add("activo");
    } else {
      botones[i].classList.remove("activo");
    }
  }
}


// ── PRODUCTOS ────────────────────────────────────────────────

// Renderiza los productos en la grilla principal
function renderizarProductos(lista) {

  var grilla = document.getElementById("grilla-productos");
  var titulo = document.getElementById("titulo-productos");

  // Títulos según categoría activa
  var titulosCategorias = {
    todos: "Toda la Coleccion",
    ropa: "Ropa",
    zapatos: "Zapatos",
    accesorios: "Accesorios"
  };

  // Cambia el título según categoría
  titulo.textContent = titulosCategorias[categoriaActiva] || "Coleccion";

  // Limpia la grilla antes de renderizar
  grilla.innerHTML = "";

  // Si no hay productos muestra mensaje vacío
  if (lista.length === 0) {
    grilla.appendChild(
      document.getElementById("tpl-sin-resultados").content.cloneNode(true)
    );
    return;
  }

  var tpl = document.getElementById("tpl-tarjeta");

  // Recorre todos los productos
  for (var i = 0; i < lista.length; i++) {

    var p = lista[i]; // producto actual
    var nodo = tpl.content.cloneNode(true);

    // ── Etiqueta (Oferta o Nuevo) ──
    var etiqueta = nodo.querySelector(".etiqueta-nuevo");

    if (p.oferta || p.enOferta) {
      etiqueta.textContent = "Oferta";
      etiqueta.classList.add("etiqueta-oferta");
    } else if (p.nuevo) {
      etiqueta.textContent = "Nuevo";
    } else {
      etiqueta.remove();
    }

    // ── Imagen del producto ──
    var img = nodo.querySelector("img");
    img.src = encodeURI(p.imagen);
    img.alt = p.nombre;

    // ── Datos del producto ──
    nodo.querySelector(".tarjeta-cat").textContent = p.categoria;
    nodo.querySelector(".tarjeta-nombre").textContent = p.nombre;
    nodo.querySelector(".tarjeta-precio").textContent =
      "$" + p.precio.toLocaleString("es-CO");

    // ── Botón agregar al carrito ──
    var btn = nodo.querySelector(".btn-agregar");
    
    

    btn.addEventListener("click", (function(id) {
      return function() {
        agregarAlCarrito(id);
      };
    })(p.id));

    // ── Botón ver detalles ──
    var btnDetalles = nodo.querySelector(".btn-ver-detalles");

    btnDetalles.addEventListener("click", (function(id) {
      return function() {
        abrirModal(id);
      };
    })(p.id));

    // Agrega tarjeta a la grilla
    grilla.appendChild(nodo);
  }
}


// ── CARRITO ────────────────────────────────────────────────

// Abre el carrito lateral
function abrirCarrito() {
  renderizarCarrito();
  document.getElementById("carrito-panel").classList.add("abierto");
  document.getElementById("overlay").classList.add("visible");
  document.body.style.overflow = "hidden";
}

// Cierra el carrito lateral
function cerrarCarrito() {
  document.getElementById("carrito-panel").classList.remove("abierto");
  document.getElementById("overlay").classList.remove("visible");
  document.body.style.overflow = "";
}

// Renderiza los productos dentro del carrito
function renderizarCarrito() {

  var contenedor = document.getElementById("carrito-items");
  var totalSpan = document.getElementById("total-carrito");

  contenedor.innerHTML = "";

  // Si carrito vacío
  if (carrito.length === 0) {
    contenedor.appendChild(
      document.getElementById("tpl-carrito-vacio").content.cloneNode(true)
    );
    totalSpan.textContent = "$0";
    return;
  }

  var tpl = document.getElementById("tpl-item-carrito");
  var total = 0;

  for (var i = 0; i < carrito.length; i++) {

    var item = carrito[i];
    var subtotal = item.precio * item.cantidad;
    total += subtotal;

    var nodo = tpl.content.cloneNode(true);

    // Imagen producto
    var img = nodo.querySelector("img");
    img.src = encodeURI(item.imagen);
    img.alt = item.nombre;

    // Datos producto
    nodo.querySelector(".nombre").textContent = item.nombre;
    nodo.querySelector(".precio").textContent =
      "$" + subtotal.toLocaleString("es-CO");
    nodo.querySelector(".item-cantidad").textContent = item.cantidad;

    // Botones acciones carrito
    nodo.querySelector(".btn-quitar").addEventListener("click", (function(id) {
      return function() { quitarUno(id); };
    })(item.id));

    nodo.querySelector(".btn-sumar").addEventListener("click", (function(id) {
      return function() { sumarUno(id); };
    })(item.id));

    nodo.querySelector(".btn-eliminar").addEventListener("click", (function(id) {
      return function() { eliminarDelCarrito(id); };
    })(item.id));

    contenedor.appendChild(nodo);
  }

  totalSpan.textContent = "$" + total.toLocaleString("es-CO");
}


// Actualiza el contador del carrito (badge)
function actualizarBadge() {

  var total = 0;

  for (var i = 0; i < carrito.length; i++) {
    total += carrito[i].cantidad;
  }

  var badge = document.getElementById("badge-carrito");
  
  if (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? "flex" : "none";
  }
}


// ── MODAL PRODUCTO ──────────────────────────────────────────

// Tallas por categoría
var tallasPorCategoria = {
  ropa: ["XS", "S", "M", "L", "XL"],
  zapatos: ["35", "36", "37", "38", "39", "40"],
  accesorios: []
};

// Descripciones por categoría
var descripcionesPorCategoria = {
  ropa: "Pieza de alta calidad confeccionada con materiales premium.",
  zapatos: "Calzado elegante con acabados de lujo.",
  accesorios: "Accesorio de coleccion artesanal."
};


// Abre modal de producto
function abrirModal(id) {

  var producto = obtenerProductoPorId(id);
  if (!producto) return;

  modalProductoActual = producto;
  modalCantidad = 1;
  modalTallaSeleccionada = null;

  // Carga imagen y datos
  document.getElementById("modal-img").src = encodeURI(producto.imagen);
  document.getElementById("modal-img").alt = producto.nombre;

  document.getElementById("modal-categoria").textContent =
    producto.categoria.toUpperCase();

  document.getElementById("modal-nombre").textContent = producto.nombre;

  document.getElementById("modal-precio").textContent =
    "$" + producto.precio.toLocaleString("es-CO");

  document.getElementById("modal-descripcion").textContent =
    producto.descripcion || "";

  document.getElementById("modal-cantidad-valor").textContent = "1";

  // ── TALLAS ──
  var tallas = tallasPorCategoria[producto.categoria] || [];
  var seccionTallas = document.getElementById("seccion-tallas");
  var contenedorTallas = document.getElementById("modal-tallas");

  contenedorTallas.innerHTML = "";

  if (tallas.length === 0) {
    seccionTallas.style.display = "none";
  } else {
    seccionTallas.style.display = "flex";

    tallas.forEach(function(t, i) {

      var btn = document.createElement("button");

      btn.className = "talla-btn" + (i === 0 ? " seleccionada" : "");
      btn.textContent = t;

      if (i === 0) modalTallaSeleccionada = t;

      btn.onclick = function() {

        document.querySelectorAll(".talla-btn").forEach(function(b) {
          b.classList.remove("seleccionada");
        });

        btn.classList.add("seleccionada");
        modalTallaSeleccionada = t;
      };

      contenedorTallas.appendChild(btn);
    });
  }

  // ── COLORES ──
  var contenedorColores = document.getElementById("modal-colores");
  contenedorColores.innerHTML = "";

  var colores = producto.colores || [];

  colores.forEach(function(colorHex, i) {

    var btn = document.createElement("button");

    btn.className = "color-btn" + (i === 0 ? " seleccionado" : "");
    btn.style.background = colorHex;
    btn.title = colorHex;

    if (i === 0) modalColorSeleccionado = colorHex;

    btn.onclick = function() {

      document.querySelectorAll(".color-btn").forEach(function(b) {
        b.classList.remove("seleccionado");
      });

      btn.classList.add("seleccionado");
      modalColorSeleccionado = colorHex;
    };

    contenedorColores.appendChild(btn);
  });

  document.getElementById("btn-modal-agregar").disabled = !usuarioActual;

  document.getElementById("modal-overlay").classList.add("visible");
  document.getElementById("modal-producto").classList.add("visible");

  document.body.style.overflow = "hidden";
}


// Cierra modal
function cerrarModal() {
  document.getElementById("modal-overlay").classList.remove("visible");
  document.getElementById("modal-producto").classList.remove("visible");
  document.body.style.overflow = "";
  modalProductoActual = null;
}


// Cambia cantidad
function cambiarCantidad(delta) {
  modalCantidad = Math.max(1, modalCantidad + delta);
  document.getElementById("modal-cantidad-valor").textContent = modalCantidad;
}


// ── TOAST ────────────────────────────────────────────────

var toastTimer;

// Muestra mensaje toast
function mostrarToast(mensaje) {

  var toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.add("visible");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(function() {
    toast.classList.remove("visible");
  }, 2500);
}


// ── MODAL ALERTA ──────────────────────────────────────────

// Abre modal de alerta con un mensaje personalizado
function uiAbrirAlerta(mensaje) {
  var mensajeEl = document.getElementById("alerta-mensaje");
  if (mensajeEl && mensaje) {
    mensajeEl.textContent = mensaje;
  }

  document.getElementById("alerta-overlay").classList.add("visible");
  document.getElementById("alerta-modal").classList.add("visible");
  document.body.style.overflow = "hidden";
}

// Cierra modal de alerta
function uiCerrarAlerta() {
  var overlay = document.getElementById("alerta-overlay");
  var modal = document.getElementById("alerta-modal");

  if (overlay) overlay.classList.remove("visible");
  if (modal) modal.classList.remove("visible");
  
  // Solo restaura overflow si no hay otros modales abiertos
  if (!document.getElementById("login-modal").classList.contains("visible") &&
      !document.getElementById("modal-producto").classList.contains("visible")) {
    document.body.style.overflow = "";
  }
}