document.addEventListener('DOMContentLoaded', function() {
    setupLoginAndRegistration();
    setupModalTriggers();
    setupRecoveryLinks();
});

function setupModalTriggers() {
    // Agregar evento de clic para el enlace de inicio de sesión
    document.addEventListener('click', function(e) {
        if (e.target.id === 'loginLink') {
            e.preventDefault();
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        }
    });
}

function setupLoginAndRegistration() {
    const loginForm = document.querySelector('#loginModal form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
            };

            fetch('/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
                body: JSON.stringify(formData),
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(data => {
                        throw new Error(data.detail || 'Error en el inicio de sesión');
                    });
                }
            })
            .then(data => {
                if (data) {
                    // Guardar datos en localStorage
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);
                    localStorage.setItem('user_name', data.first_name);
                    
                    // Actualizar la UI antes de cerrar el modal
                    updateNavbarLoginState(data.first_name);
                    
                    // Cerrar el modal correctamente
                    const modalElement = document.getElementById('loginModal');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    
                    // Primero eliminamos las clases y estilos que bloquean el scroll
                    document.body.classList.remove('modal-open');
                    document.body.style.removeProperty('overflow');
                    document.body.style.removeProperty('padding-right');
                    document.body.style.removeProperty('overflow-y');
                    document.body.style.position = '';
                    
                    // Luego ocultamos el modal
                    modalInstance.hide();
                    
                    // Removemos inmediatamente el backdrop
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.parentNode.removeChild(backdrop);
                    }
                    
                    // Forzar el reflow del documento
                    document.body.offsetHeight;
                    
                    // Asegurarnos de que el scroll esté habilitado
                    document.body.style.overflow = 'auto';
                    document.documentElement.style.overflow = 'auto';
                    
                    // Mostrar mensaje de éxito
                    setTimeout(() => {
                        alert('Inicio de sesión exitoso');
                    }, 100);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
        });
    }
}

function setupRecoveryLinks() {
    // Manejador para recuperación por correo
    document.addEventListener('click', function(e) {
        if (e.target.id === 'recoveryByEmail' || e.target.closest('#forgotPasswordLink')) {
            e.preventDefault();
            // Cerrar el modal de login
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) {
                loginModal.hide();
            }
            // Abrir el modal de recuperación por correo
            const emailRecoveryModal = new bootstrap.Modal(document.getElementById('emailRecoveryModal'));
            emailRecoveryModal.show();
        }
    });

    // Manejador para recuperación por SMS
    document.addEventListener('click', function(e) {
        if (e.target.id === 'recoveryBySMS') {
            e.preventDefault();
            // Cerrar el modal de login
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) {
                loginModal.hide();
            }
            // Abrir el modal de recuperación por SMS
            const smsModal = new bootstrap.Modal(document.getElementById('smsModal'));
            smsModal.show();
        }
    });
}

function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById('togglePassword');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('bi-eye-slash');
        toggleIcon.classList.add('bi-eye');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('bi-eye');
        toggleIcon.classList.add('bi-eye-slash');
    }
}
