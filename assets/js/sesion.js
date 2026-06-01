// Usuario actualmente logueado (null = no hay sesión)
var usuarioActual = null;

// Control de estado del modal login
var loginAbierto  = false;

// Evitar ReferenceError al actualizar UI
var productosFiltrados = null;


// ─────────────────────────────────────────────
// 🔄 REFRESCO GLOBAL DE UI
// ─────────────────────────────────────────────
function actualizarUICompleta() {
  renderizarProductos(filtrarPorCategoria(categoriaActiva));
  actualizarBadge();
}


// ─────────────────────────────────────────────
// 🔐 LOGIN
// ─────────────────────────────────────────────
function abrirLogin() {
  loginAbierto = true;
  uiAbrirLogin();
}

function cerrarLogin() {
  loginAbierto = false;
  uiCerrarLogin();
}

function intentarLogin() {

  var email    = document.getElementById("campo-email").value.trim();
  var password = document.getElementById("campo-password").value.trim();

  if (!email || !password) {
    uiMostrarErrorLogin("Por favor completa todos los campos.");
    return;
  }

  var usuario = autenticarUsuario(email, password);

  if (usuario) {

    // ✅ Guardar sesión
    usuarioActual = usuario;

    uiOcultarErrorLogin();
    uiMostrarSesionActiva(usuario);
    cerrarLogin();

    // 🔥 CLAVE: re-renderizar TODO
    actualizarUICompleta();

    mostrarToast("Bienvenido, " + usuario.nombre);

  } else {
    uiMostrarErrorLogin("Correo o contrasena incorrectos.");
    uiAnimarLoginShake();
  }
}


// ─────────────────────────────────────────────
// 🚪 LOGOUT
// ─────────────────────────────────────────────
// Cerrar sesión sincronizando con PHP
function cerrarSesion() {
  window.location.href = 'index.php?action=logout';
}


// ─────────────────────────────────────────────
// 📝 REGISTRO Y PESTAÑAS
// ─────────────────────────────────────────────
function cambiarTab(tab) {
  // Cambiar pestañas activas
  document.getElementById('tab-login').classList.remove('activo');
  document.getElementById('tab-registro').classList.remove('activo');
  document.getElementById('formulario-login').classList.remove('activo');
  document.getElementById('formulario-registro').classList.remove('activo');

  // Activar la pestaña seleccionada
  document.getElementById('tab-' + tab).classList.add('activo');
  document.getElementById('formulario-' + tab).classList.add('activo');

  // Limpiar errores
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('registro-error').style.display = 'none';

  // Limpiar campos
  document.getElementById('campo-email').value = '';
  document.getElementById('campo-password').value = '';
  document.getElementById('campo-nombre').value = '';
  document.getElementById('campo-email-registro').value = '';
  document.getElementById('campo-password-registro').value = '';
  document.getElementById('campo-password-confirmar').value = '';
}

// Mostrar formulario de registro
function mostrarRegistro() {
  document.getElementById('formulario-login').style.display = 'none';
  document.getElementById('formulario-registro').style.display = 'block';
  document.getElementById('mensaje-registro-exitoso').style.display = 'none';
  document.getElementById('registro-error').style.display = 'none';
  
  // Limpiar campos
  document.getElementById('campo-nombre').value = '';
  document.getElementById('campo-email-registro').value = '';
  document.getElementById('campo-password-registro').value = '';
  document.getElementById('campo-password-confirmar').value = '';
  
  // Focus en el primer campo
  setTimeout(function() {
    document.getElementById('campo-nombre').focus();
  }, 100);
}

// Volver al login
function volverAlLogin() {
  document.getElementById('formulario-login').style.display = 'block';
  document.getElementById('formulario-registro').style.display = 'none';
  document.getElementById('mensaje-registro-exitoso').style.display = 'none';
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('registro-error').style.display = 'none';
  
  // Limpiar campos
  document.getElementById('campo-email').value = '';
  document.getElementById('campo-password').value = '';
  document.getElementById('campo-nombre').value = '';
  document.getElementById('campo-email-registro').value = '';
  document.getElementById('campo-password-registro').value = '';
  document.getElementById('campo-password-confirmar').value = '';
  
  // Focus en email
  setTimeout(function() {
    document.getElementById('campo-email').focus();
  }, 100);
}

// Mostrar mensaje de registro exitoso
function mostrarMensajeExito() {
  document.getElementById('formulario-login').style.display = 'none';
  document.getElementById('formulario-registro').style.display = 'none';
  document.getElementById('mensaje-registro-exitoso').style.display = 'block';
}

// Intentar registrar usuario
function intentarRegistro(event) {
  event.preventDefault();

  var nombre = document.getElementById('campo-nombre').value.trim();
  var email = document.getElementById('campo-email-registro').value.trim();
  var password = document.getElementById('campo-password-registro').value.trim();
  var confirmar = document.getElementById('campo-password-confirmar').value.trim();

  var errorEl = document.getElementById('registro-error');

  // Validar campos
  if (!nombre || !email || !password || !confirmar) {
    errorEl.textContent = 'Por favor completa todos los campos.';
    errorEl.style.display = 'block';
    return;
  }

  if (password !== confirmar) {
    errorEl.textContent = 'Las contraseñas no coinciden.';
    errorEl.style.display = 'block';
    return;
  }

  if (password.length < 6) {
    errorEl.textContent = 'La contraseña debe tener al menos 6 caracteres.';
    errorEl.style.display = 'block';
    return;
  }

  // Verificar si el email ya existe
  // Enviar registro a PHP (backend valida duplicados)
  var formData = new FormData();
  formData.append('action', 'register');
  formData.append('nombre', nombre);
  formData.append('email', email);
  formData.append('password', password);

  fetch('index.php', {
    method: 'POST',
    body: formData
  })
  .then(function(response) {
    return response.text();
  })
  .then(function(data) {
    if (data && data.indexOf('success') === 0) {
      mostrarMensajeExito();
      mostrarToast('¡Cuenta creada exitosamente! Inicia sesión para continuar.');
    } else {
      errorEl.textContent = data || 'Error al registrarse. Intenta de nuevo.';
      errorEl.style.display = 'block';
      console.error('Registro fallido:', data);
    }
  })
  .catch(function(error) {
    errorEl.textContent = 'Error al registrarse. Intenta de nuevo.';
    errorEl.style.display = 'block';
    console.error('Error:', error);
  });
}

// Intentar login por PHP (POST tradicional)
function intentarLoginPHP(event) {
  event.preventDefault();

  var email = document.getElementById('campo-email').value.trim();
  var password = document.getElementById('campo-password').value.trim();
  var errorEl = document.getElementById('login-error');

  if (!email || !password) {
    errorEl.textContent = 'Por favor completa todos los campos.';
    errorEl.style.display = 'block';
    return;
  }

  // Usar POST tradicional que redirige automáticamente
  var form = document.createElement('form');
  form.method = 'POST';
  form.action = 'index.php';
  form.style.display = 'none';

  var emailInput = document.createElement('input');
  emailInput.type = 'hidden';
  emailInput.name = 'email';
  emailInput.value = email;
  form.appendChild(emailInput);

  var passwordInput = document.createElement('input');
  passwordInput.type = 'hidden';
  passwordInput.name = 'password';
  passwordInput.value = password;
  form.appendChild(passwordInput);

  document.body.appendChild(form);
  form.submit();
}