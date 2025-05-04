document.addEventListener('DOMContentLoaded', function() {
    function getCSRFToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    }

    // Validación en tiempo real de la contraseña
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            
            // Actualizar checkboxes de requisitos
            document.getElementById('lengthCheck').checked = password.length >= 8;
            document.getElementById('uppercaseCheck').checked = /[A-Z]/.test(password);
            document.getElementById('lowercaseCheck').checked = /[a-z]/.test(password);
            document.getElementById('numberCheck').checked = /[0-9]/.test(password);
            document.getElementById('spaceCheck').checked = !/\s/.test(password);
        });
    }

    const passwordResetForm = document.getElementById('passwordResetForm');
    if (passwordResetForm) {
        passwordResetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const code = this.querySelector('input[type="text"]').value;
            const newPassword = this.querySelector('input[type="password"]').value;

            if (code && newPassword.length >= 8) {
                fetch('/api/reset_password/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFToken(),
                    },
                    body: JSON.stringify({ code, new_password: newPassword }),
                })
                .then(response => {
                    if (response.ok) {
                        alert('Contraseña restablecida con éxito');
                        window.location.href = '/login/';
                    } else {
                        alert('Error al restablecer la contraseña. Inténtalo de nuevo.');
                    }
                })
                .catch(error => console.error('Error:', error));
            } else {
                alert('Por favor, completa todos los campos correctamente.');
            }
        });
    }
});