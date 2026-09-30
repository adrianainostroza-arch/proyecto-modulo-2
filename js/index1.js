// ─── Validadores ────────────────────────────────────────────────────────────

/**
 * Valida formato de correo electrónico.
 * Acepta cualquier string con estructura local@dominio.ext
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Valida que la contraseña no esté vacía y tenga al menos 6 caracteres.
 * Puedes ampliar las reglas aquí sin tocar el resto del código.
 */
function validarPassword(password) {
  return password.length >= 6;
}

// ─── Referencias al DOM ──────────────────────────────────────────────────────

const form       = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passInput  = document.getElementById("password");
const errorMsg   = document.getElementById("errorMsg");
const btnCancelar = document.getElementById("btnCancelar");

// ─── Helpers de UI ───────────────────────────────────────────────────────────

/**
 * Muestra un mensaje de error en el div #errorMsg.
 * Pasa cadena vacía para limpiar el mensaje.
 */
function mostrarError(mensaje) {
  errorMsg.textContent = mensaje;
  errorMsg.style.display = mensaje ? "block" : "none";
}

/** Marca visualmente un campo como inválido */
function marcarInvalido(input) {
  input.classList.add("input-error");
  input.classList.remove("input-ok");
}

/** Marca visualmente un campo como válido */
function marcarValido(input) {
  input.classList.remove("input-error");
  input.classList.add("input-ok");
}

// ─── Validación en tiempo real (feedback inmediato al usuario) ───────────────

emailInput.addEventListener("input", () => {
  if (emailInput.value === "") {
    emailInput.classList.remove("input-error", "input-ok");
    return;
  }
  validarEmail(emailInput.value) ? marcarValido(emailInput) : marcarInvalido(emailInput);
});

passInput.addEventListener("input", () => {
  if (passInput.value === "") {
    passInput.classList.remove("input-error", "input-ok");
    return;
  }
  validarPassword(passInput.value) ? marcarValido(passInput) : marcarInvalido(passInput);
});

// ─── Envío del formulario ────────────────────────────────────────────────────

form.addEventListener("submit", (e) => {
  e.preventDefault(); // evita recarga de página
  mostrarError("");   // limpia errores previos

  const email    = emailInput.value.trim();
  const password = passInput.value;

  // ── Validaciones ──
  if (!email) {
    mostrarError("Por favor, ingresa tu correo electrónico.");
    marcarInvalido(emailInput);
    emailInput.focus();
    return;
  }

  if (!validarEmail(email)) {
    mostrarError("El correo electrónico no tiene un formato válido. Ejemplo: usuario@dominio.com");
    marcarInvalido(emailInput);
    emailInput.focus();
    return;
  }

  if (!password) {
    mostrarError("Por favor, ingresa tu contraseña.");
    marcarInvalido(passInput);
    passInput.focus();
    return;
  }

  if (!validarPassword(password)) {
    mostrarError("La contraseña debe tener al menos 6 caracteres.");
    marcarInvalido(passInput);
    passInput.focus();
    return;
  }

  // ── Todo OK: redirige al siguiente paso ──
  console.log("Credenciales válidas:", { email });
  mostrarError("");

  // Guarda el email en sessionStorage para que index2.html lo pueda usar si lo necesita
  sessionStorage.setItem("usuarioEmail", email);

  window.location.href = "index2.html";
});

// ─── Botón Cancelar ──────────────────────────────────────────────────────────

btnCancelar.addEventListener("click", () => {
  // Limpia el formulario y los mensajes
  form.reset();
  mostrarError("");
  emailInput.classList.remove("input-error", "input-ok");
  passInput.classList.remove("input-error", "input-ok");

  // Vuelve a la página anterior en el historial del navegador.
  // Si no hay página anterior (ej. abriste directo), va al inicio.
  if (document.referrer) {
    history.back();
  } else {
    window.location.href = "index.html";
  }
});