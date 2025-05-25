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

document.addEventListener("DOMContentLoaded", () => {
    // Función para cargar los datos del usuario
    function loadUserData() {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('No hay token de acceso');
            return;
        }

        fetch('/api/auth/user-profile/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar datos del usuario');
            }
            return response.json();
        })
        .then(data => {
            // Actualizar los campos con los datos del usuario
            document.getElementById('perfil-nombre').textContent = data.first_name || 'Usuario';
            document.getElementById('nombre').value = data.first_name || '';
            document.getElementById('apellido1').value = data.last_name || '';
            document.getElementById('cedula').value = data.documento || '';
            document.getElementById('celular').value = data.phone || '';
            document.getElementById('correo').value = data.email || '';
            
            // Habilitar el botón de guardar si los campos requeridos están llenos
            validateForm();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar los datos del usuario');
        });
    }

    // Evento para cuando se abre el modal de perfil
    const perfilModal = document.getElementById('perfil-modal');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                if (perfilModal.style.display === 'block') {
                    loadUserData();
                }
            }
        });
    });

    observer.observe(perfilModal, { attributes: true });

    // Cargar datos cuando se hace clic en la pestaña de perfil
    document.getElementById('tab-perfil')?.addEventListener('click', loadUserData);

    // Validación del formulario
    const formDatosPersonales = document.getElementById('form-datos-personales');
    if (formDatosPersonales) {
        const inputs = formDatosPersonales.querySelectorAll('input');
        const guardarBtn = document.getElementById('guardar-btn');

        function validateForm() {
            const email = document.getElementById('correo').value;
            const celular = document.getElementById('celular').value;
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            const celularValid = /^\d{10}$/.test(celular);

            guardarBtn.disabled = !(emailValid && celularValid);
        }

        inputs.forEach(input => {
            input.addEventListener('input', validateForm);
        });

        // Manejo del envío del formulario
        formDatosPersonales.addEventListener('submit', function(e) {
            e.preventDefault();
            const token = localStorage.getItem('access_token');
            
            const userData = {
                first_name: document.getElementById('nombre').value,
                last_name: document.getElementById('apellido1').value,
                phone: document.getElementById('celular').value,
                email: document.getElementById('correo').value
            };

            fetch('/api/auth/update-profile/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Datos actualizados correctamente');
                    loadUserData(); // Recargar datos
                } else {
                    throw new Error('Error al actualizar los datos');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al actualizar los datos');
            });
        });
    }
});