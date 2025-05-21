export function abrirMiCuentaModulo() {
    // Ocultar carruseles y otros módulos
    const carousel = document.getElementById('carouselExampleIndicators');
    const mostSoldCarousels = document.querySelectorAll('.container-md.py-7');
    if (carousel) carousel.style.display = 'none';
    mostSoldCarousels.forEach(c => c.style.display = 'none');

    // Ocultar el carrito si está abierto
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) cartModal.style.display = 'none';

    // Ocultar el formulario de registro si está visible
    const registerForm = document.getElementById('inlineRegisterForm');
    if (registerForm) registerForm.style.display = 'none';

    // Mostrar el módulo de Mi Cuenta
    const miCuentaSection = document.getElementById('mi-cuenta-section');
    if (miCuentaSection) {
        miCuentaSection.style.display = 'block';
        
        // Cargar datos del usuario desde localStorage
        const nombreUsuario = localStorage.getItem('user_name') || '';
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        
        // Actualizar los campos con los datos del usuario
        document.getElementById('nombre-usuario').textContent = nombreUsuario;
        document.getElementById('user-first-name').textContent = userData.first_name || '';
        document.getElementById('user-last-name').textContent = userData.last_name || '';
        document.getElementById('user-second-last-name').textContent = userData.second_last_name || 'Ingresa tu apellido';
        document.getElementById('user-email').textContent = userData.email || '';
        document.getElementById('user-phone').textContent = userData.phone || '';
        document.getElementById('user-doc-type').textContent = userData.document_type ? `${userData.document_type} ${userData.document_number}` : '';
        
        // Configurar el evento de logout
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                handleLogout();
            });
        }
        
        miCuentaSection.scrollIntoView({ behavior: "smooth" });
    } else {
        console.error('No se encontró el módulo Mi Cuenta');
    }
}

// Función para manejar el logout (puede ser importada desde popovers.js)
function handleLogout() {
    // Eliminar datos de sesión
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('isLoggedIn');
    
    // Recargar la página
    window.location.reload();
}