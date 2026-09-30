// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    // --- 1. DATOS (se guardan en localStorage, igual que en depósito) ---
    // Saldo: si no existe todavía, se inicia en 100.000
    if (localStorage.getItem("saldo") === null) {
        localStorage.setItem("saldo", 100000);
    }

    function getSaldo() {
        return parseInt(localStorage.getItem("saldo"), 10);
    }

    function setSaldo(nuevoSaldo) {
        localStorage.setItem("saldo", nuevoSaldo);
    }

    // Contactos: si no existen, se cargan los de ejemplo
    const contactosBase = ["Pedro Pérez", "María López", "Juan Herrera", "Ana González", "Carlos Silva"];
    let contactos = JSON.parse(localStorage.getItem("contactos") || "null") || contactosBase;

    // Elementos del DOM
    const saldoText = document.getElementById("saldoTransferencia");
    const contactInput = document.getElementById("contact");
    const amountInput = document.getElementById("amount");
    const sendForm = document.getElementById("sendForm");
    const transferMessage = document.getElementById("transferMessage");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    // Modal de nuevo contacto
    const btnSaveContact = document.getElementById("btnSaveContact");
    const newContactInput = document.getElementById("newContactName");
    const addContactModalElement = document.getElementById("addContactModal");
    const bootstrapModal = new bootstrap.Modal(addContactModalElement);

    // --- 2. INICIALIZACIÓN ---
    function actualizarSaldoPantalla() {
        saldoText.textContent = `$${getSaldo().toLocaleString("es-CL")}`;
    }
    actualizarSaldoPantalla();

    function inicializarAutocomplete() {
        if (typeof $ !== "undefined" && $.ui && $.ui.autocomplete) {
            $(contactInput).autocomplete({
                source: contactos
            });
        }
    }
    inicializarAutocomplete();


    // --- 3. LÓGICA DE TRANSFERENCIA ---
    sendForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const contactoDestino = contactInput.value.trim();
        const montoTransferir = parseInt(amountInput.value, 10);
        const saldoActual = getSaldo();

        transferMessage.style.display = "none";
        transferMessage.className = "mt-3 text-center alert";

        if (!contactoDestino) {
            mostrarMensaje("Por favor, selecciona o escribe un contacto válido.", "alert-danger");
            return;
        }

        if (!montoTransferir || montoTransferir <= 0) {
            mostrarMensaje("Ingresa un monto válido.", "alert-warning");
            return;
        }

        if (montoTransferir > saldoActual) {
            mostrarMensaje("Saldo insuficiente para realizar esta transacción.", "alert-danger");
            return;
        }

        // Transacción exitosa: descontar saldo y guardar el movimiento
        setSaldo(saldoActual - montoTransferir);
        actualizarSaldoPantalla();

        guardarMovimiento({
            fecha: new Date().toLocaleDateString("es-CL"),
            tipo: "Transferencia",
            detalle: "Enviado a " + contactoDestino,
            monto: -montoTransferir   // negativo = egreso
        });

        mostrarMensaje(`¡Transferencia exitosa! Has enviado $${montoTransferir.toLocaleString("es-CL")} a ${contactoDestino}.`, "alert-success");

        // Limpiar el formulario
        sendForm.reset();
    });


    // --- MOVIMIENTOS (mismo 'movimientos' que usa depósito y la página de movimientos) ---
    function guardarMovimiento(transaccion) {
        const historial = JSON.parse(localStorage.getItem("movimientos") || "[]");
        historial.unshift(transaccion);  // agrega al inicio
        localStorage.setItem("movimientos", JSON.stringify(historial));
    }


    // --- 4. AGREGAR NUEVO CONTACTO (MODAL) ---
    btnSaveContact.addEventListener("click", function () {
        const nuevoNombre = newContactInput.value.trim();

        if (nuevoNombre === "") {
            alert("Por favor, ingresa un nombre para el contacto.");
            return;
        }

        if (contactos.includes(nuevoNombre)) {
            alert("Este contacto ya existe en tu lista.");
            return;
        }

        contactos.push(nuevoNombre);
        localStorage.setItem("contactos", JSON.stringify(contactos));
        inicializarAutocomplete();
        contactInput.value = nuevoNombre;

        newContactInput.value = "";
        bootstrapModal.hide();
    });


    // --- 5. BOTÓN DE CERRAR SESIÓN ---
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", function () {
            if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                window.location.href = "index.html";
            }
        });
    }

    // --- FUNCIONES AUXILIARES ---
    function mostrarMensaje(texto, claseBootstrap) {
        transferMessage.textContent = texto;
        transferMessage.classList.add(claseBootstrap);
        transferMessage.style.display = "block";
    }
});
