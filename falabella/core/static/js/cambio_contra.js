document.addEventListener('DOMContentLoaded', function() {
    function getCSRFToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    }

    const passwordResetContainer = document.getElementById('password-reset-container');

    // Función para ocultar los carruseles
    function hideCarousels() {
        const carousel = document.getElementById('carouselExampleIndicators');
        const mostSoldCarousels = document.querySelectorAll('.container-md.py-7');

        if (carousel) carousel.style.display = 'none';
        mostSoldCarousels.forEach(c => c.style.display = 'none');
    }

    // Mostrar el contenedor de cambio de contraseña
    function showPasswordReset() {
        hideCarousels(); // Ocultar los carruseles
        passwordResetContainer.style.display = 'block';
        passwordResetContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Exportar la función para mostrar el contenedor
    window.showPasswordReset = showPasswordReset;

    // Validación visual de la contraseña
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        const lengthCheck = document.getElementById('lengthCheck');
        const uppercaseCheck = document.getElementById('uppercaseCheck');
        const lowercaseCheck = document.getElementById('lowercaseCheck');
        const numberCheck = document.getElementById('numberCheck');
        const spaceCheck = document.getElementById('spaceCheck');

        newPasswordInput.addEventListener('input', function() {
            const password = this.value;

            // Validar longitud mínima
            if (password.length >= 8) {
                lengthCheck.style.color = 'green';
            } else {
                lengthCheck.style.color = '#000000';
            }

            // Validar si contiene al menos una mayúscula
            if (/[A-Z]/.test(password)) {
                uppercaseCheck.style.color = 'green';
            } else {
                uppercaseCheck.style.color = '#000000';
            }

            // Validar si contiene al menos una minúscula
            if (/[a-z]/.test(password)) {
                lowercaseCheck.style.color = 'green';
            } else {
                lowercaseCheck.style.color = '#000000';
            }

            // Validar si contiene al menos un número
            if (/\d/.test(password)) {
                numberCheck.style.color = 'green';
            } else {
                numberCheck.style.color = '#000000';
            }

            // Validar si no contiene espacios
            if (!/\s/.test(password)) {
                spaceCheck.style.color = 'green';
            } else {
                spaceCheck.style.color = '#000000';
            }
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

document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.getElementById('togglePassword');
    const newPasswordInput = document.getElementById('newPassword');

    if (togglePassword && newPasswordInput) {
        togglePassword.addEventListener('click', function () {
            const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            newPasswordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye');
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }
});