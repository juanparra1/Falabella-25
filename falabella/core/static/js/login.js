document.addEventListener('DOMContentLoaded', function () {
    setupLoginAndRegistration();
});

function setupLoginAndRegistration() {
    // Login
    document.addEventListener('click', function (event) {
        const loginLink = event.target.closest('#loginLink');
        if (loginLink) {
            event.preventDefault();
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        }
    });

    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        };

        fetch('/api/token/', {
            method: 'POST',
            headers: {
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
                    window.location.href = '/'; // Redirige a la página principal
                }
            })
            .catch(error => console.error('Error:', error));
    });
}