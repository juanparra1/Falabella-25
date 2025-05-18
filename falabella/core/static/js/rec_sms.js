document.addEventListener('DOMContentLoaded', function() {
    // Función para obtener el token CSRF
    function getCSRFToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    }

    // Manejar el envío del formulario de recuperación por SMS
    const smsRecoveryForm = document.getElementById('smsRecoveryForm');
    if (smsRecoveryForm) {
        smsRecoveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const phoneNumber = this.querySelector('input[type="tel"]').value;

            if (phoneNumber && phoneNumber.length >= 10) {
                fetch('/api/forgot_password_sms/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFToken(),
                    },
                    body: JSON.stringify({ phone: phoneNumber }),
                })
                .then(response => {
                    if (response.ok) {
                        alert('Se ha enviado un código de verificación a tu número de teléfono');
                        
                        // Ocultar el modal actual
                        const smsModal = bootstrap.Modal.getInstance(document.getElementById('smsModal'));
                        if (smsModal) smsModal.hide();

                        // Eliminar el overlay del modal
                        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());

                        // Mostrar el contenedor de cambio de contraseña
                        const passwordResetContainer = document.getElementById('password-reset-container');
                        if (passwordResetContainer) {
                            passwordResetContainer.style.display = 'block';
                            passwordResetContainer.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else {
                        alert('Error al enviar el SMS. Inténtalo de nuevo.');
                    }
                })
                .catch(error => console.error('Error:', error));
            } else {
                alert('Por favor, ingresa un número de teléfono válido');
            }
        });
    }
});