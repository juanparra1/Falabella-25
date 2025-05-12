document.addEventListener('DOMContentLoaded', function() {
    // Función para obtener el token CSRF
    function getCSRFToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    }

    // Manejar el envío del formulario de recuperación por correo
    const emailRecoveryForm = document.getElementById('emailRecoveryForm');
    if (emailRecoveryForm) {
        emailRecoveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            if (email && email.includes('@')) {
                fetch('/api/forgot_password/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFToken(),
                    },
                    body: JSON.stringify({ email }),
                })
                .then(response => {
                    if (response.ok) {
                        alert('Se ha enviado un código de verificación a tu correo electrónico');
                        
                        // Ocultar el modal actual
                        const emailRecoveryModalElement = document.getElementById('emailRecoveryModal');
                        if (emailRecoveryModalElement) {
                            const emailRecoveryModal = bootstrap.Modal.getOrCreateInstance(emailRecoveryModalElement);
                            emailRecoveryModal.hide();
                        } else {
                            console.error('El modal emailRecoveryModal no se encuentra en el DOM.');
                        }

                        // Mostrar el contenedor de cambio de contraseña
                        const passwordResetContainer = document.getElementById('password-reset-container');
                        if (passwordResetContainer) {
                            passwordResetContainer.style.display = 'block';
                            passwordResetContainer.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else {
                        alert('Error al enviar el correo. Inténtalo de nuevo.');
                    }
                })
                .catch(error => console.error('Error:', error));
            } else {
                alert('Por favor, ingresa un correo electrónico válido');
            }
        });
    }
});