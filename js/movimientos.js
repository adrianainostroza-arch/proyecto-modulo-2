$(document).ready(function () {

    // 1. Leer movimientos guardados (los escriben depósito y transferencia)
    const movimientos = JSON.parse(localStorage.getItem('movimientos') || '[]');

    const tbody = $('#tablaMovimientos tbody');

    // 2. Cerrar sesión (va primero para que funcione aunque no haya movimientos)
    $('#btnCerrarSesion').on('click', function () {
        window.location.href = 'index.html';
    });

    // 3. Si no hay movimientos, mostrar mensaje
    if (movimientos.length === 0) {
        $('#mensajeSinMovimientos').show();
        return;
    }

    // 4. Recorrer y crear una fila por cada movimiento
    movimientos.forEach(function (mov) {
        const esIngreso = mov.monto > 0;
        const claseCSS = esIngreso ? 'monto-ingreso' : 'monto-egreso';
        const signo = esIngreso ? '+' : '-';
        const montoFormateado = `${signo}$${Math.abs(mov.monto).toLocaleString('es-CL')}`;

        // .text() evita que un nombre con HTML rompa la tabla
        const fila = $('<tr>')
            .append($('<td>').text(mov.fecha))
            .append($('<td>').text(mov.tipo))
            .append($('<td>').text(mov.detalle))
            .append($('<td>').addClass(claseCSS).text(montoFormateado));

        tbody.append(fila);
    });

});
