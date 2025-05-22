function closeCarouselsAndShowPerfil() {
    const carousel = document.getElementById('carouselExampleIndicators');
    const mostSoldCarousels = document.querySelectorAll('.container-md.py-7');
    if (carousel) carousel.style.display = 'none';
    mostSoldCarousels.forEach(c => c.style.display = 'none');

    const perfilModal = document.getElementById('perfil-modal');
    if (perfilModal) {
        perfilModal.style.display = 'block';
        perfilModal.scrollIntoView({ behavior: "smooth" });
    }
}

function closePerfilAndShowCarousels() {
    const carousel = document.getElementById('carouselExampleIndicators');
    const mostSoldCarousels = document.querySelectorAll('.container-md.py-7');
    if (carousel) carousel.style.display = '';
    mostSoldCarousels.forEach(c => c.style.display = '');

    const perfilModal = document.getElementById('perfil-modal');
    if (perfilModal) perfilModal.style.display = 'none';
}

document.addEventListener("DOMContentLoaded", () => {
    const cerrarBtn = document.getElementById('cerrarPerfilBtn');
    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', closePerfilAndShowCarousels);
    }
});

// Para que puedas llamarlo desde otros scripts:
window.abrirMiCuentaModulo = closeCarouselsAndShowPerfil;

// Puedes agregar esto al final de MiPerfil.js
document.addEventListener("DOMContentLoaded", () => {
    // Cambiar sección al hacer click en el menú lateral
    document.querySelectorAll('#perfil-menu .list-group-item').forEach(btn => {
        btn.addEventListener('click', function() {
            // Quitar clase active a todos
            document.querySelectorAll('#perfil-menu .list-group-item').forEach(b => b.classList.remove('active'));
            // Poner clase active al actual
            this.classList.add('active');
            // Ocultar todas las secciones
            document.querySelectorAll('.perfil-section').forEach(sec => sec.style.display = 'none');
            // Mostrar la sección correspondiente
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                document.getElementById(sectionId).style.display = 'block';
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Renderizar lista de direcciones al cargar la sección
    Direcciones.renderDireccionesLista('lista-direcciones');

    // Botón agregar dirección
    const btnAgregar = document.getElementById('btn-agregar-direccion');
    if (btnAgregar) {
        btnAgregar.onclick = function() {
            Direcciones.abrirModalAgregarDireccion(() => {
                Direcciones.renderDireccionesLista('lista-direcciones');
            });
        };
    }
});