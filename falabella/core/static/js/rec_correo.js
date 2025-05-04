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
                        'X-CSRFToken': getCSRFToken(), // Agregar el token CSRF
                    },
                    body: JSON.stringify({ email }),
                })
                .then(response => {
                    if (response.ok) {
                        alert('Se ha enviado un código de verificación a tu correo electrónico');
                        // Cambiar el contenido del modal para ingresar el código
                        const modalBody = this.closest('.modal-body');
                        modalBody.innerHTML = `
                            <div class="container">
                                <div class="row justify-content-center">
                                    <div class="col-12">
                                        <h4 class="text-label mb-3">Verificación</h4>
                                        <p class="text-muted mb-4">Ingresa el código de verificación enviado a tu correo</p>
                                        <form id="verificationForm">
                                            <div class="mb-3">
                                                <label class="form-label">Código de verificación</label>
                                                <input type="text" class="form-control" placeholder="Ingresa el código" required>
                                            </div>
                                            <button type="submit" class="btn btn-primary">Verificar</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        `;
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