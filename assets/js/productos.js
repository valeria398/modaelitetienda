// Lista de productos (cliente) — usado por catalogo.js cuando no se hace fetch
const productos = [
    { id: 1, nombre: "Vestido blanco", categoria: "ropa", precio: 329990, precioOriginal: 420990, descripcion: "Vestido blanco versátil juvenil.", imagen: "assets/imagenes/vestido1.jpeg", tallas: ["XS","S","M","L","XL"], colores: ["#ffffff"], enOferta: true },
    { id: 2, nombre: "Chaqueta denim azul", categoria: "ropa", precio: 229000, precioOriginal: null, descripcion: "Chaqueta denim azul claro con detalle curvo.", imagen: "assets/imagenes/chaqueta denim azul.png", tallas: ["XS","S","M","L"], colores: ["#c0c8f2"], enOferta: false },
    { id: 3, nombre: "Buzo oversize", categoria: "ropa", precio: 104930, precioOriginal: 149900, descripcion: "Buzo oversize con bordados florales.", imagen: "assets/imagenes/buzo oversize.png", tallas: ["XS","S","M","L","XL"], colores: ["#dfb184"], enOferta: false },
    { id: 4, nombre: "Jean denim azul", categoria: "ropa", precio: 79990, precioOriginal: 99990, descripcion: "Jean clásico corte recto.", imagen: "assets/imagenes/jeans.png", tallas: ["S","M","L","XL"], colores: ["#2b4b6f"], enOferta: false },
    { id: 5, nombre: "Camisa blanca", categoria: "ropa", precio: 45990, precioOriginal: null, descripcion: "Camisa blanca de algodón premium.", imagen: "assets/imagenes/camisa.png", tallas: ["S","M","L"], colores: ["#ffffff"], enOferta: false },
    { id: 6, nombre: "Falda plisada", categoria: "ropa", precio: 69990, precioOriginal: 89990, descripcion: "Falda plisada midi elegante.", imagen: "assets/imagenes/pareo.png", tallas: ["S","M","L"], colores: ["#8a4b9a"], enOferta: true },
    { id: 7, nombre: "Polera básica", categoria: "ropa", precio: 19990, precioOriginal: null, descripcion: "Polera básica algodón.", imagen: "assets/imagenes/camisa.png", tallas: ["XS","S","M","L","XL"], colores: ["#000000","#ffffff"], enOferta: false },

    { id: 8, nombre: "Zapatillas urbanas", categoria: "zapatos", precio: 129990, precioOriginal: 149990, descripcion: "Zapatillas para uso diario con suela cómoda.", imagen: "assets/imagenes/botass.jpeg", tallas: ["38","39","40","41","42"], colores: ["#ffffff","#000000"], enOferta: true },
    { id: 9, nombre: "Botín cuero", categoria: "zapatos", precio: 159990, precioOriginal: null, descripcion: "Botín de cuero con forro interior.", imagen: "assets/imagenes/botass.jpeg", tallas: ["38","39","40","41","42"], colores: ["#6b3a2a"], enOferta: false },
    { id: 10, nombre: "Sandalias planas", categoria: "zapatos", precio: 49990, precioOriginal: 69990, descripcion: "Sandalias para verano cómodas.", imagen: "assets/imagenes/sandalias.png", tallas: ["36","37","38","39"], colores: ["#c89b6a"], enOferta: true },
    { id: 11, nombre: "Mocasines", categoria: "zapatos", precio: 119990, precioOriginal: null, descripcion: "Mocasines elegantes para oficina.", imagen: "assets/imagenes/suecos.png", tallas: ["39","40","41","42"], colores: ["#3b2f2f"], enOferta: false },
    { id: 12, nombre: "Tenis running", categoria: "zapatos", precio: 139990, precioOriginal: 159990, descripcion: "Tenis ligeros para correr.", imagen: "assets/imagenes/znegros.png", tallas: ["38","39","40","41","42"], colores: ["#2b8cff"], enOferta: false },

    { id: 13, nombre: "Gorra clásica", categoria: "accesorios", precio: 15990, precioOriginal: null, descripcion: "Gorra con logo bordado.", imagen: "assets/imagenes/charm.png", tallas: [], colores: ["#000000"], enOferta: false },
    { id: 14, nombre: "Bolso tote", categoria: "accesorios", precio: 89990, precioOriginal: 109990, descripcion: "Bolso tote espacioso para el día a día.", imagen: "assets/imagenes/bolso.png", tallas: [], colores: ["#e9c7b5"], enOferta: true },
    { id: 15, nombre: "Cinturón piel", categoria: "accesorios", precio: 29990, precioOriginal: null, descripcion: "Cinturón de piel ajustable.", imagen: "assets/imagenes/llavero.png", tallas: [], colores: ["#3b2f2f"], enOferta: false },
    { id: 16, nombre: "Bufanda larga", categoria: "accesorios", precio: 24990, precioOriginal: 34990, descripcion: "Bufanda cálida para invierno.", imagen: "assets/imagenes/pañoleta.png", tallas: [], colores: ["#b45f6d"], enOferta: true },
    { id: 17, nombre: "Gafas de sol", categoria: "accesorios", precio: 45990, precioOriginal: null, descripcion: "Gafas con protección UV.", imagen: "assets/imagenes/charm.png", tallas: [], colores: ["#000000"], enOferta: false },
    { id: 18, nombre: "Reloj minimal", categoria: "accesorios", precio: 199990, precioOriginal: 249990, descripcion: "Reloj con correa intercambiable.", imagen: "assets/imagenes/fragancia.png", tallas: [], colores: ["#000000"], enOferta: false }
];

// Devuelve la lista completa de productos (copia)
function obtenerProductos() {
    return productos.slice();
}

// Devuelve un producto por su ID
function obtenerProductoPorId(id) {
    for (var i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
            return productos[i];
        }
    }
    return null;
}

// Filtra productos por categoría: 'todos' devuelve todos
function filtrarPorCategoria(categoria) {
    if (!categoria || categoria === 'todos') return obtenerProductos();
    return productos.filter(function(p) {
        return p.categoria === categoria;
    });
}
