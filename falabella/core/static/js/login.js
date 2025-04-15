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
}