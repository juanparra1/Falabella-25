document.addEventListener('DOMContentLoaded', function () {
    setupLoginAndRegistration();
});

function setupLoginAndRegistration() {
    // Login
    document.addEventListener('click', function (event) {
        const loginLink = event.target.closest('#loginLink');
        if (loginLink) {
            event.preventDefault();
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (!loginModal) {
                const newLoginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                newLoginModal.show();
            }
        }
    });

    const loginForm = document.querySelector('#loginModal form');
    if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
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
                    console.log('Inicio de sesión exitoso. Redirigiendo...');
                    window.location.href = '/'; // Redirige a la página principal
                }
            })
            .catch(error => console.error('Error:', error));
    });
}}