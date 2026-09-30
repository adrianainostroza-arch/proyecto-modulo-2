// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Simulación de base de datos / Estado actual
    // Intentamos obtener el saldo guardado; si no existe, usamos el por defecto ($100.000)
    let saldoActual = localStorage.getItem("saldo") || "100000";
    
    // 2. Referencias a los elementos del HTML
    const balanceDisplay = document.getElementById("balanceDisplay");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    // 3. Función para formatear el saldo como dinero (ej: 100000 -> $100.000)
    const formatearMoneda = (valor) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(valor);
    };

    // 4. Renderizar el saldo en la pantalla
    if (balanceDisplay) {
        balanceDisplay.textContent = formatearMoneda(saldoActual);
    }

    // 5. Manejo del Cierre de Sesión
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", () => {
            // Aquí podrías limpiar tokens de sesión si los usaras más adelante
            // sessionStorage.clear(); 
            
            alert("Cerrando sesión... ¡Hasta pronto!");
            
            // Redireccionar al login (asegúrate de tener esta página creada)
            window.location.href = "index.html"; 
        });
    }
});