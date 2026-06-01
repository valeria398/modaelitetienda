<?php
session_start();

$error_login = null;

require_once __DIR__ . '/config/database.php';

// Cargar productos desde assets/js/productos.js para render server-side
$productos = [];
$prod_js_path = __DIR__ . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . 'productos.js';
if (file_exists($prod_js_path)) {
    $js = file_get_contents($prod_js_path);
    $start = strpos($js, 'const productos');
    if ($start !== false) {
        $start = strpos($js, '[', $start);
        $end = strrpos($js, '];');
        if ($start !== false && $end !== false && $end > $start) {
            $array_text = substr($js, $start, $end - $start + 1);

            $json_like = preg_replace('/([a-zA-Z0-9_]+)\s*:/', '"$1":', $array_text);
            $json_like = preg_replace('#/\*.*?\*/#s', '', $json_like);
            $json_like = preg_replace('/,\s*([}\]])/', '$1', $json_like);

            $decoded = json_decode($json_like, true);
            if (is_array($decoded)) {
                $productos = $decoded;
            }
        }
    }
}

// ─────────────────────────────────────────────
// MANEJO DE REGISTRO CON MySQL
// ─────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'register') {
    $nombre = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    // Validación básica
    if (empty($nombre) || empty($email) || empty($password)) {
        http_response_code(400);
        echo 'error: Campos incompletos';
        exit;
    }
    if (strlen($password) < 6) {
        http_response_code(400);
        echo 'error: Contraseña muy corta';
        exit;
    }

    // Generar avatar
    $palabras = explode(' ', $nombre);
    $avatar = strtoupper(substr($palabras[0], 0, 1) . substr(end($palabras), 0, 1));

    // Verificar si email ya existe
    $stmt = $conexion->prepare('SELECT id FROM usuarios WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        http_response_code(400);
        echo 'error: Email ya registrado';
        exit;
    }

    // Insertar nuevo usuario
    $stmt = $conexion->prepare('INSERT INTO usuarios (nombre, email, password, avatar) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('ssss', $nombre, $email, $password, $avatar);
    
    if ($stmt->execute()) {
        $new_user = [
            'id' => $conexion->insert_id,
            'nombre' => $nombre,
            'email' => $email,
            'avatar' => $avatar
        ];
        $_SESSION['usuario'] = $new_user;
        $_SESSION['carrito'] = [];
        http_response_code(200);
        echo 'success: Usuario registrado';
        exit;
    } else {
        http_response_code(500);
        echo 'error: Error al registrar usuario';
        exit;
    }
}

// ─────────────────────────────────────────────
// MANEJO DE LOGIN CON MySQL
// ─────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['email']) && isset($_POST['password']) && (!isset($_POST['action']) || $_POST['action'] !== 'register')) {
        $email = trim($_POST['email']);
        $password = trim($_POST['password']);

        $stmt = $conexion->prepare('SELECT id, nombre, email, avatar FROM usuarios WHERE email = ? AND password = ?');
        $stmt->bind_param('ss', $email, $password);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $_SESSION['usuario'] = $user;
            if (!isset($_SESSION['carrito'])) {
                $_SESSION['carrito'] = [];
            }
            header("Location: index.php");
            exit;
        } else {
            $error_login = "Correo o contrasena incorrectos.";
        }
    }
}

// Manejo del Logout (GET)
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    unset($_SESSION['usuario']);
    unset($_SESSION['carrito']);
    session_destroy();
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="UTF-8" />

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />

    <title>
        <?= htmlspecialchars($titulo ?? 'Elite Moda | Tienda Online de Ropa y Accesorios en Colombia') ?>
    </title>

    <meta name="description"
          content="Compra ropa, accesorios y productos de moda online en Elite Moda. Envíos a toda Colombia, pagos seguros y las últimas tendencias.">

    <meta name="keywords"
          content="ropa, moda, tienda online, ecommerce, accesorios, Colombia, Elite Moda">

    <meta name="robots"
          content="index, follow">

    <meta name="author"
          content="Elite Moda">

    <meta property="og:title"
          content="Elite Moda - Tienda Online">

    <meta property="og:description"
          content="Compra ropa y accesorios de moda de forma fácil y segura en Elite Moda.">

    <meta property="og:type"
          content="website">

    <meta property="og:url"
          content="https://modaelitetienda-1cwa.onrender.com">

    <meta property="og:site_name"
          content="Elite Moda">

    <meta property="og:locale"
          content="es_CO">

    <link rel="canonical"
          href="https://modaelitetienda-1cwa.onrender.com">

    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/variables.css">
    <link rel="stylesheet" href="assets/css/base.css">
    <link rel="stylesheet" href="assets/css/carrito.css">
    <link rel="stylesheet" href="assets/css/footer.css">
    <link rel="stylesheet" href="assets/css/hero.css">
    <link rel="stylesheet" href="assets/css/login.css">
    <link rel="stylesheet" href="assets/css/modal.css">
    <link rel="stylesheet" href="assets/css/navbar.css">
    <link rel="stylesheet" href="assets/css/productos.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
    <link rel="stylesheet" href="assets/css/toast.css">

</head>


<body>

    <!-- NAVBAR -->
    <?php include 'views/navbar.phtml'; ?>


    <!-- LOGIN -->
    <?php include 'views/login.phtml'; ?>


    <!-- HERO -->
    <?php include 'includes/hero.phtml'; ?>


    <!-- PRODUCTOS -->
    <?php include 'views/productos.phtml'; ?>


    <!-- FOOTER -->
    <?php include 'includes/footer.phtml'; ?>


    <!-- CARRITO -->
    <?php include 'views/carrito.phtml'; ?>


    <!-- TOAST -->
    <div id="views-toast">

        <div class="toast" id="toast"></div>

    </div>


    <!-- MODAL PRODUCTO -->
    <?php include 'views/modal-producto.phtml'; ?>


    <!-- MODAL ALERTA -->
    <?php include 'views/modal-alerta.phtml'; ?>


    <!-- TEMPLATES -->
    <?php include 'views/templates.phtml'; ?>


    <!-- JAVASCRIPT -->
    <script src="assets/js/ui.js"></script>
    <script src="assets/js/sesion.js"></script>
    <script src="assets/js/productos.js"></script>
    <script src="assets/js/carrito.js"></script>
    <script src="assets/js/catalogo.js"></script>
    <script src="assets/js/audio.js"></script>

    <!-- SINCRONIZACIÓN DE ESTADO PHP -> JS -->
    <script>
        usuarioActual = <?= isset($_SESSION['usuario']) ? json_encode($_SESSION['usuario']) : 'null' ?>;
        carrito = <?= isset($_SESSION['carrito']) ? json_encode(array_values($_SESSION['carrito'])) : '[]' ?>;
    </script>


    <script>

        document.addEventListener("DOMContentLoaded", () => {

            if (usuarioActual) {
                if (typeof uiMostrarSesionActiva === "function") {
                    uiMostrarSesionActiva(usuarioActual);
                }
            }

            if (typeof renderizarProductos === "function" &&
                typeof obtenerProductos === "function") {

                renderizarProductos(obtenerProductos());
            }

            if (typeof iniciarAudio === "function") {
                iniciarAudio();
            }

            if (typeof actualizarBadge === "function") {
                actualizarBadge();
            }

            <?php if (!empty($error_login)): ?>
                if (typeof abrirLogin === "function") {
                    abrirLogin();
                    if (typeof uiMostrarErrorLogin === "function") {
                        uiMostrarErrorLogin(<?= json_encode($error_login) ?>);
                    }
                }
            <?php endif; ?>

        });


        function irAProductos() {

            const seccion = document.getElementById("productos");

            if (seccion) {

                seccion.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }

    </script>

</body>

</html>