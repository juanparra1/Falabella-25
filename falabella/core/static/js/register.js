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

document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.querySelector("input[name='password']");
    const minLength = document.getElementById("minLength");
    const hasNumber = document.getElementById("hasNumber");
    const hasUppercase = document.getElementById("hasUppercase");
    const hasLowercase = document.getElementById("hasLowercase");
    const noSpaces = document.getElementById("noSpaces");
    const noSpecialChars = document.getElementById("noSpecialChars");

    passwordInput.addEventListener("input", function () {
        const value = passwordInput.value;

        // Validar longitud mínima
        if (value.length >= 8) {
            minLength.style.color = "green";
        } else {
            minLength.style.color = "#000000";
        }

        // Validar si contiene al menos un número
        if (/\d/.test(value)) {
            hasNumber.style.color = "green";
        } else {
            hasNumber.style.color = "#000000";
        }

        // Validar si contiene al menos una mayúscula
        if (/[A-Z]/.test(value)) {
            hasUppercase.style.color = "green";
        } else {
            hasUppercase.style.color = "#000000";
        }

        // Validar si contiene al menos una minúscula
        if (/[a-z]/.test(value)) {
            hasLowercase.style.color = "green";
        } else {
            hasLowercase.style.color = "#000000";
        }

        // Validar si no contiene espacios
        if (!/\s/.test(value)) {
            noSpaces.style.color = "green";
        } else {
            noSpaces.style.color = "#000000";
        }

        // Validar si no contiene caracteres especiales prohibidos
        if (!/['\\¡¿"ºª·`´çñÑ]/.test(value)) {
            noSpecialChars.style.color = "green";
        } else {
            noSpecialChars.style.color = "#000000";
        }
    });

    passwordInput.addEventListener("input", function () {
        console.log("Valor actual de la contraseña:", passwordInput.value);
    });
});