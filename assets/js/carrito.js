// ============================================================
//  CARRITO.JS
//  Lógica del carrito: agregar, quitar, eliminar y finalizar.
// ============================================================


// Arreglo global que almacena los productos en el carrito
var carrito = [];


// Variables del modal (compartidas con ui.js)
// Guardan el estado del producto seleccionado en el modal
var modalProductoActual    = null;  // producto abierto en el modal
var modalCantidad          = 1;     // cantidad seleccionada
var modalTallaSeleccionada = null;  // talla elegida
var modalColorSeleccionado = null;  // color elegido


// ─────────────────────────────────────────────────────────────
// AGREGAR PRODUCTO AL CARRITO
// ─────────────────────────────────────────────────────────────
function agregarAlCarrito(id) {
  // Si no hay usuario logueado, muestra alerta y no permite agregar
  if (!usuarioActual) {
    uiAbrirAlerta("Inicia sesion desde la barra superior para agregar piezas al carrito.");
    return;
  }

  // Busca el producto por ID
  var producto = obtenerProductoPorId(id);
  if (!producto) return;

  // Verifica si el producto ya existe en el carrito
  var existente = null;
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id === id) {
      existente = carrito[i];
      break;
    }
  }

  // Si ya existe, aumenta la cantidad
  if (existente) {
    existente.cantidad++;

  // Si no existe, lo agrega como nuevo item
  } else {
    carrito.push({
      id:       producto.id,
      nombre:   producto.nombre,
      precio:   producto.precio,
      imagen:   producto.imagen,
      cantidad: 1
    });
  }

  // Actualiza contador del carrito
  actualizarBadge();

  // Muestra notificación
  mostrarToast(producto.nombre + " agregado");
}


// ─────────────────────────────────────────────────────────────
// SUMAR UNA UNIDAD A UN PRODUCTO DEL CARRITO
// ─────────────────────────────────────────────────────────────
function sumarUno(id) {

  // Recorre el carrito y aumenta la cantidad del producto
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id === id) {
      carrito[i].cantidad++;
      break;
    }
  }

  // Actualiza vista del carrito
  renderizarCarrito();

  // Actualiza badge
  actualizarBadge();
}


// ─────────────────────────────────────────────────────────────
// RESTAR UNA UNIDAD DEL CARRITO
// ─────────────────────────────────────────────────────────────
function quitarUno(id) {

  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id === id) {

      // Si hay más de 1, solo reduce cantidad
      if (carrito[i].cantidad > 1) {
        carrito[i].cantidad--;

      // Si es 1, elimina el producto del carrito
      } else {
        carrito.splice(i, 1);
      }
      break;
    }
  }

  // Actualiza interfaz
  renderizarCarrito();
  actualizarBadge();
}


// ─────────────────────────────────────────────────────────────
// ELIMINAR PRODUCTO COMPLETAMENTE DEL CARRITO
// ─────────────────────────────────────────────────────────────
function eliminarDelCarrito(id) {

  // Filtra el carrito quitando el producto seleccionado
  carrito = carrito.filter(function(i) {
    return i.id !== id;
  });

  // Actualiza interfaz
  renderizarCarrito();
  actualizarBadge();
}


// ─────────────────────────────────────────────────────────────
// FINALIZAR COMPRA
// ─────────────────────────────────────────────────────────────
function finalizarCompra() {

  // Si el carrito está vacío, no hace nada
  if (carrito.length === 0) return;

  var total = 0;

  // Calcula total de la compra
  for (var i = 0; i < carrito.length; i++) {
    total += carrito[i].precio * carrito[i].cantidad;
  }

  // Mensaje de confirmación
  alert(
    "Gracias, " + usuarioActual.nombre +
    "!\nPedido confirmado.\nTotal: $" +
    total.toLocaleString("es-CO") + " COP"
  );

  // Vacía el carrito
  carrito = [];

  // Cierra el panel del carrito
  cerrarCarrito();

  // Actualiza badge
  actualizarBadge();
}


// ─────────────────────────────────────────────────────────────
// AGREGAR DESDE EL MODAL
// ─────────────────────────────────────────────────────────────
function agregarDesdeModal() {
  // Solo permite si hay usuario y producto activo en modal
  if (!usuarioActual) {
    uiAbrirAlerta("Inicia sesion desde la barra superior para agregar piezas al carrito.");
    return;
  }
  if (!modalProductoActual) return;

  // Agrega el producto tantas veces como cantidad seleccionada
  for (var i = 0; i < modalCantidad; i++) {
    agregarAlCarrito(modalProductoActual.id);
  }

  // Cierra modal después de agregar
  cerrarModal();
}