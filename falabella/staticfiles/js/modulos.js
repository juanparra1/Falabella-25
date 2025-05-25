

document.addEventListener('DOMContentLoaded', function () {
    initializeTooltipsAndPopovers();

    // Mostrar módulos al hacer clic en los enlaces
    document.getElementById('loginLink').addEventListener('click', (event) => {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace
        showModule('loginForm'); // Muestra el módulo de inicio de sesión
    });

    document.getElementById('registerLink').addEventListener('click', (event) => {
        event.preventDefault();
        showModule('inlineRegisterForm'); // Muestra el módulo de registro
    });
});