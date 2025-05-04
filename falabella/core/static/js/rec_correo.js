// Actualización en rec_correo.js (similar para rec_sms.js)
document.addEventListener('DOMContentLoaded', function() {
    function getCSRFToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    }

    const emailRecoveryForm = document.getElementById('emailRecoveryForm');
    if (emailRecoveryForm) {
        // Manejar el envío del formulario
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
                        // Cerrar el modal actual y abrir el de cambio de contraseña
                        const emailModal = bootstrap.Modal.getInstance(document.getElementById('emailRecoveryModal'));
                        emailModal.hide();
                        
                        const cambioContraModal = new bootstrap.Modal(document.getElementById('cambioContraModal'));
                        cambioContraModal.show();
                        
                        // Opcional: Mostrar el email en el modal de cambio de contraseña
                        document.querySelector('#cambioContraModal .modal-body').insertAdjacentHTML('afterbegin', 
                            `<p class="text-muted">Correo electrónico: ${email}</p>`);
                    } else {
                        alert('Error al enviar el correo. Inténtalo de nuevo.');
                    }
                })
                .catch(error => console.error('Error:', error));
            } else {
                alert('Por favor, ingresa un correo electrónico válido');
            }
        });

        // Manejar el enlace "Ya tengo código verificador"
        const tieneCodigoLink = emailRecoveryForm.querySelector('a[data-bs-toggle="modal"]');
        if (tieneCodigoLink) {
            tieneCodigoLink.addEventListener('click', function(e) {
                e.preventDefault();
                const emailModal = bootstrap.Modal.getInstance(document.getElementById('emailRecoveryModal'));
                emailModal.hide();
                
                const cambioContraModal = new bootstrap.Modal(document.getElementById('cambioContraModal'));
                cambioContraModal.show();
            });
        }
    }
});