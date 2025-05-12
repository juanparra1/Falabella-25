document.addEventListener('DOMContentLoaded', function() {
    setupLoginAndRegistration();
    setupModalTriggers();
    setupRecoveryLinks();
    checkSessionStatus(); // Agregamos esta función
});

function checkSessionStatus() {
    const userName = localStorage.getItem('user_name');
    const accessToken = localStorage.getItem('access_token');
    
    if (userName && accessToken) {
        updateNavbarLoginState(userName);
    }
}

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
                    sessionStorage.setItem('isLoggedIn', 'true');

                    // Actualizar UI
                    updateNavbarLoginState(data.first_name);
                    
                    // Cerrar el modal correctamente
                    const modalElement = document.getElementById('loginModal');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();
                    
                    // Limpiar efectos del modal
                    document.body.classList.remove('modal-open');
                    document.body.style.removeProperty('overflow');
                    document.body.style.removeProperty('padding-right');
                    
                    // Eliminar backdrop
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) backdrop.remove();

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
