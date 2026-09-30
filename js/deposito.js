$(document).ready(function () {

    // ─── SALDO ───────────────────────────────────────────────
    // Si no existe en localStorage, se inicializa en 100.000
    if (localStorage.getItem('saldo') === null) {
        localStorage.setItem('saldo', 100000);
    }

    function getSaldo() {
        return parseInt(localStorage.getItem('saldo'));
    }

    function setSaldo(nuevoSaldo) {
        localStorage.setItem('saldo', nuevoSaldo);
    }

    function mostrarSaldo() {
        const saldo = getSaldo();
        $('#saldoTransferencia').text('$' + saldo.toLocaleString('es-CL'));
    }

    mostrarSaldo();


    // ─── DEPÓSITO ────────────────────────────────────────────
    $('#depositForm').on('submit', function (e) {
        e.preventDefault();

        const monto = parseInt($('#depositAmount').val());
        const saldoActual = getSaldo();

        // Validación
        if (!monto || monto <= 0) {
            mostrarMensaje('⚠️ Ingresa un monto válido.', 'text-warning');
            return;
        }

        // Sumar al saldo
        const nuevoSaldo = saldoActual + monto;
        setSaldo(nuevoSaldo);

        // Guardar en movimientos
        guardarMovimiento({
            fecha: new Date().toLocaleDateString('es-CL'),
            tipo: 'Depósito',
            detalle: 'Depósito de dinero',
            monto: monto    // positivo = ingreso
        });

        // Actualizar saldo en pantalla
        mostrarSaldo();

        // Limpiar formulario
        $('#depositForm')[0].reset();

        mostrarMensaje('✅ Depósito realizado con éxito.', 'text-success');
    });


    // ─── MOVIMIENTOS (localStorage compartido) ───────────────
    function guardarMovimiento(transaccion) {
        const historial = JSON.parse(localStorage.getItem('movimientos') || '[]');
        historial.unshift(transaccion);  // agrega al inicio
        localStorage.setItem('movimientos', JSON.stringify(historial));
    }


    // ─── CERRAR SESIÓN ───────────────────────────────────────
    $('#btnCerrarSesion').on('click', function () {
        window.location.href = 'index.html';
    });


    // ─── UTILIDAD: mostrar mensajes ──────────────────────────
    function mostrarMensaje(texto, clase) {
        $('#transferMessage')
            .removeClass('text-success text-danger text-warning')
            .addClass(clase)
            .text(texto)
            .fadeIn();

        setTimeout(function () {
            $('#transferMessage').fadeOut();
        }, 3000);
    }

});