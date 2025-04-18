document.addEventListener('DOMContentLoaded', function () {
    const btnRegistro = document.getElementById('btnRegistro');

    if (btnRegistro) {
        btnRegistro.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('Botón de registro presionado'); // Verifica si el evento funciona

            const email = document.querySelector('input[name="email"]').value;
            const firstName = document.querySelector('input[name="first_name"]').value;
            const lastName = document.querySelector('input[name="last_name"]').value;
            const documento = document.querySelector('input[name="documento"]').value;
            const phone = document.querySelector('input[name="phone"]').value;
            const password = document.querySelector('input[name="password"]').value;
            const confirmPassword = document.querySelector('input[name="confirm_password"]').value;

            if (!email || !firstName || !lastName || !documento || !phone || !password || !confirmPassword) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            const cmrPuntosCheck = document.getElementById('cmrPuntosCheck').checked;
            const terminosCheck = document.getElementById('terminosCheck').checked;

            if (!cmrPuntosCheck || !terminosCheck) {
                alert('Debes aceptar los términos y condiciones.');
                return;
            }

            const formData = { email, first_name: firstName, last_name: lastName, documento, phone, password };

            fetch('/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
                body: JSON.stringify(formData),
            })
                .then(response => {
                    if (response.ok) {
                        alert('Registro exitoso. Ahora puedes iniciar sesión.');
                        window.location.href = '/login/';
                    } else {
                        return response.json().then(data => {
                            alert('Error en el registro: ' + JSON.stringify(data));
                        });
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    } else {
        console.error('El botón de registro no se encontró en el DOM.');
    }
});
