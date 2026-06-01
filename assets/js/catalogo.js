var categoriaActiva = "todos"; // Variable global que guarda la categoría activa del filtro

// Fallback: filtra usando la variable global `productos` si no hay otra fuente
function filtrarPorCategoria(categoria) {
  if (typeof productos === 'undefined' || !Array.isArray(productos)) return [];
  if (!categoria || categoria === 'todos') return productos.slice();
  return productos.filter(function(p) {
    return p.categoria === categoria;
  });
}

function filtrarCategoria(categoria) { // Cambia la categoría de productos mostrada
  categoriaActiva = categoria; // actualiza categoría activa

  uiSincronizarBotonesCategoria(categoria);  // sincroniza botones del menú (resalta el activo)

  renderizarProductos(filtrarPorCategoria(categoria)); // renderiza productos filtrados por categoría

  document.getElementById("productos").scrollIntoView({
    behavior: "smooth"
  });
}

function buscar(e) { // Función de búsqueda en tiempo real
  var texto = e.target.value.toLowerCase(); // texto escrito por el usuario

  var base  = filtrarPorCategoria(categoriaActiva); // base de productos según categoría actual

  if (!texto) { // si no hay texto, muestra todo
    renderizarProductos(base);
    return;
  }

  var resultado = base.filter(function(p) { // filtra por nombre del producto
    return p.nombre.toLowerCase().indexOf(texto) !== -1;
  });

  renderizarProductos(resultado); // renderiza resultado filtrado
}

document.addEventListener("keydown", function(e) { // Detecta teclas globales en la página

  if (e.key === "Escape") {   // Si el usuario presiona ESC
    cerrarLogin(); // Cierra login si está abierto
    cerrarModal(); // Cierra modal de producto si está abierto
  }
});