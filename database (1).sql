CREATE DATABASE IF NOT EXISTS tienda_elite;
USE tienda_elite;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(10)
);

INSERT INTO usuarios (id, nombre, email, password, avatar) VALUES
(1, 'Ana Garcia', 'ana@email.com', 'ana123', 'AG'),
(2, 'Carlos Lopez', 'carlos@email.com', 'carlos456', 'CL'),
(3, 'Admin', 'admin@tienda.com', 'admin000', 'AD');

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    precioOriginal DECIMAL(10, 2) NULL,
    descripcion TEXT,
    imagen VARCHAR(255),
    tallas JSON,
    colores JSON,
    enOferta BOOLEAN NOT NULL DEFAULT FALSE
);

-- Nota: Se asignó el id 19 a 'Camisa blanca' porque estaba duplicado con el id 4 de 'Jean denim azul' en database.js
INSERT INTO productos (id, nombre, categoria, precio, precioOriginal, descripcion, imagen, tallas, colores, enOferta) VALUES
(1, 'Vestido blanco', 'ropa', 329990, 420990, 'Vestido blanco versátil juvenil.', './assets/imagenes/vestido1.jpeg', '["XS", "S", "M", "L", "XL"]', '["#ffffff"]', TRUE),
(2, 'Chaquetas y cazadoras', 'ropa', 229000, NULL, 'Chaqueta denim azul claro con con detalle curvo en la parte inferior para mujer.', './assets/imagenes/chaqueta denim azul.png', '["XS", "S", "M", "L"]', '["#c0c8f2"]', FALSE),
(3, 'Buzos', 'ropa', 104930, 149900, 'Buzo oversize con bordados florales en algodón café para mujer.', './assets/imagenes/buzo oversize.png', '["XS", "S", "M", "L", "XL"]', '["#dfb184"]', FALSE),
(4, 'Jean denim azul', 'ropa', 160930, 229900, 'Jean recto con dobladillo ancho en denim azul oscuro para mujer.', './assets/imagenes/jeans.png', '["S", "M", "L"]', '["#364b54"]', TRUE),
(19, 'Camisa blanca', 'ropa', 160930, 229900, 'Camisa 100% lino manga larga blanca para mujer.', './assets/imagenes/camisa.png', '["S", "M", "L"]', '["#ffffff"]', TRUE),
(5, 'Camisa boxy', 'ropa', 202930, 289900, 'Camisa boxy crop con apliques florales en algodón azul para mujer.', './assets/imagenes/camisa boxy.png', '["S", "M", "L"]', NULL, TRUE),
(6, 'Jean denim café', 'ropa', 289990, 329900, 'Jean café, perfecto para el día a día.', './assets/imagenes/denim cafe.jpeg', '["6", "8", "10", "12", "14"]', '["#564434"]', TRUE),
(7, 'Zapatos', 'zapatos', 349930, 499900, 'Suecos punta fina planos con flecos y tachas en cuero camel para mujer, talla de 35 a 40', './assets/imagenes/suecos.png', '["35", "36", "37", "38", "39", "40"]', '["#D4A574"]', FALSE),
(8, 'Zapatos', 'zapatos', 107960, 269900, 'Sandalias azules para mujer', './assets/imagenes/sandalias.png', '["35", "36", "37", "38", "39", "40"]', '["#0000FF"]', FALSE),
(9, 'Sandalias cafés', 'zapatos', 79990, 99990, 'Sandalias con plataforma comoda y tiras elegantes. Perfectas para el verano.', './assets/imagenes/sandaliasp.png', '["35", "36", "37", "38", "39"]', '["#D4A574"]', TRUE),
(10, 'Zapatos negros', 'zapatos', 154630, 220900, 'Zapatos versátiles color negro para mujer.', './assets/imagenes/znegros.png', '["35", "36", "37", "38", "39"]', '["#000000"]', TRUE),
(11, 'Botas Chelsea', 'zapatos', 439900, NULL, 'Botas chelsea de cuero sintetico con elastico lateral. Clasicas y versatiles.', './assets/imagenes/botass.jpeg', '["35", "36", "37", "38", "39", "40"]', '["#2C2420"]', FALSE),
(12, 'Pareo', 'accesorios', 49.99, NULL, 'Pareo con estampado de peces terracota para mujer', './assets/imagenes/pareo.png', '["unico"]', NULL, FALSE),
(13, 'Vela', 'accesorios', 49990, NULL, 'Vela con olor.', './assets/imagenes/vela.png', '["Unico"]', '["#2C2420", "#D4A574", "#E8D5C4"]', FALSE),
(14, 'Fragancia', 'accesorios', 139900, NULL, 'Fragancia Amazonas.', './assets/imagenes/fragancia.png', '["Unico"]', '["#D4A574"]', FALSE),
(15, 'Charm', 'accesorios', 21546, 39900, 'Charm color café sintético.', './assets/imagenes/charm.png', '["Unico"]', NULL, TRUE),
(16, 'Llavero para mujer', 'accesorios', 59900, NULL, 'Llavero con flecos para mujer.', './assets/imagenes/llavero.png', '["unico"]', NULL, FALSE),
(17, 'Pañoleta flores', 'accesorios', 69900, NULL, 'Pañoleta vino con estampado de flores.', './assets/imagenes/pañoleta.png', '["Unico"]', NULL, FALSE),
(18, 'Bolso de flecos', 'accesorios', 499900, NULL, 'Bolso bandolera con flecos largos beige para mujer.', './assets/imagenes/bolso.png', '["Unico"]', '["#E8D5C4"]', FALSE);
