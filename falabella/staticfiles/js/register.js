document.getElementById('btnRegistro').addEventListener('click', function (event) {
    event.preventDefault();

    const email = document.querySelector('input[placeholder="Ingresa un correo"]').value;
    const firstName = document.querySelector('input[placeholder="Ingresa un nombre"]').value;
    const lastName = document.querySelector('input[placeholder="Ingresa apellidos"]').value;
    const documento = document.querySelector('input[placeholder="Ingresa una cedula"]').value;
    const phone = document.querySelector('input[placeholder="Ingresa un celular"]').value;
    const password = document.querySelector('input[placeholder="Ingresa una contraseña"]').value;
    const confirmPassword = document.querySelector('input[placeholder="Confirma tu contraseña"]').value;

    if (!email || !firstName || !lastName || !documento || !phone || !password || !confirmPassword) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
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
                window.location.href = '/login';
            } else {
                return response.json().then(data => {
                    alert('Error en el registro: ' + JSON.stringify(data));
                });
            }
        })
        .catch(error => console.error('Error:', error));
});
