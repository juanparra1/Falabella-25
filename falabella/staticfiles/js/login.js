document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = {
        username: document.querySelector('input[name="username"]').value,
        password: document.querySelector('input[name="password"]').value,
    };

    fetch('/api/token/', {
        method: 'POST',     headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(data => {
                    alert('Error en el inicio de sesión: ' + JSON.stringify(data));
                });
            }
        })
        .then(data => {
            if (data) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                alert('Inicio de sesión exitoso.');
                // Opcional: Redirigir al usuario a la página principal
            }
        })
        .catch(error => console.error('Error:', error));
});