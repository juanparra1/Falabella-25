document.addEventListener('DOMContentLoaded', function () {
    const userName = localStorage.getItem('user_name');
    const accessToken = localStorage.getItem('access_token');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (userName && accessToken && isLoggedIn === 'true') {
        updateNavbarLoginState(userName);
    } else {
        initializeTooltipsAndPopovers();
    }
});

function initializeTooltipsAndPopovers() {
    // Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Popover
    const loginArea = document.getElementById('loginArea');
    const chevronIcon = document.getElementById('chevronIcon');
    
    if (!loginArea || !chevronIcon) {
        console.error('Elementos necesarios no encontrados');
        return;
    }

    // Destruir popover existente si hay uno
    const existingPopover = bootstrap.Popover.getInstance(chevronIcon);
    if (existingPopover) {
        existingPopover.dispose();
    }

    // Crear nuevo popover
    const popover = new bootstrap.Popover(chevronIcon, {
        trigger: 'manual',
        placement: 'bottom',
        html: true,
        content: `
        <div class="popover-body text-start">
            <ul class="list-unstyled m-0">
                <li class="mb-3">
                    <a href="#" class="semi-bold-on-hover no-underline" id="loginLink">Inicia sesión</a>
                </li>
                <li class="mb-3">
                    <a href="#" class="semi-bold-on-hover no-underline" id="registerLink">Regístrate</a>
                </li>
                <hr class="my-3">
                <li class="mb-3">
                    <a href="/cmr-puntos" class="semi-bold-on-hover no-underline">CMR Puntos</a>
                </li>
            </ul>
        </div>
        `
    });

    // Mostrar/ocultar popover
    loginArea.addEventListener('mouseover', () => {
        if (popover) popover.show();
    });
    
    loginArea.addEventListener('mouseleave', () => setTimeout(() => {
        if (!loginArea.matches(':hover') && !document.querySelector('.popover:hover')) {
            if (popover) popover.hide();
        }
    }, 300));

    document.addEventListener('click', (event) => {
        const popoverElement = document.querySelector('.popover');
        if (!loginArea.contains(event.target) && popoverElement && !popoverElement.contains(event.target)) {
            if (popover) popover.hide();
        }
    });

    // Evento para login y registro
    document.body.addEventListener('click', function(e) {
        if (e.target.id === 'loginLink') {
            e.preventDefault();
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        }
        if (e.target.id === 'registerLink') {
            e.preventDefault();
            const registerForm = document.getElementById('inlineRegisterForm');
            if (registerForm) {
                registerForm.style.display = 'block';
                registerForm.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    return popover;
}

function handleLogout() {
    // Eliminar datos de sesión
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_name');
    sessionStorage.removeItem('isLoggedIn');
    
    // Actualizar UI al estado inicial
    const loginArea = document.getElementById('loginArea');
    if (loginArea) {
        loginArea.querySelector('.fs-5').textContent = 'Hola,';
        loginArea.querySelector('.semi-bold-on-hover').textContent = 'Inicia sesión';
    }
    
    // Ocultar y destruir el popover existente
    const chevronIcon = document.getElementById('chevronIcon');
    const existingPopover = bootstrap.Popover.getInstance(chevronIcon);
    if (existingPopover) {
        existingPopover.hide();
        existingPopover.dispose();
    }
    
    // Reinicializar el popover con las opciones de no logueado
    initializeTooltipsAndPopovers();
    
    // Recargar página
    window.location.reload();
}

function updateNavbarLoginState(userName = null) {
    const loginArea = document.getElementById('loginArea');
    if (!loginArea) return;

    const chevronIcon = document.getElementById('chevronIcon');
    
    // Destruir el popover existente
    const existingPopover = bootstrap.Popover.getInstance(chevronIcon);
    if (existingPopover) {
        existingPopover.dispose();
    }

    // Actualizar el texto del área de login
    loginArea.querySelector('.fs-5').textContent = 'Hola,';
    loginArea.querySelector('.semi-bold-on-hover').textContent = userName || 'Inicia sesión';

    // Crear nuevo popover con el contenido actualizado
    const popover = new bootstrap.Popover(chevronIcon, {
        trigger: 'manual',
        placement: 'bottom',
        html: true,
        content: userName ? `
            <div class="popover-body text-start">
                <ul class="list-unstyled m-0">
                    <li class="mb-3">
                        <a href="#" class="semi-bold-on-hover no-underline" id="miCuentaLink">
                            <i class="bi bi-person me-2"></i>Mi cuenta
                        </a>
                    </li>
                    <li class="mb-3">
                        <a href="#" class="semi-bold-on-hover no-underline text-danger" id="logoutLink">
                            <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                        </a>
                    </li>
                </ul>
            </div>
        ` : `
            <div class="popover-body text-start">
                <ul class="list-unstyled m-0">
                    <li class="mb-3">
                        <a href="#" class="semi-bold-on-hover no-underline" id="loginLink">
                            <i class="bi bi-box-arrow-in-right me-2"></i>Inicia sesión
                        </a>
                    </li>
                    <li class="mb-3">
                        <a href="#" class="semi-bold-on-hover no-underline" id="registerLink">
                            <i class="bi bi-person-plus me-2"></i>Regístrate
                        </a>
                    </li>
                    <hr class="my-2">
                    <li class="mb-3">
                        <a href="/cmr-puntos" class="semi-bold-on-hover no-underline">
                            <i class="bi bi-credit-card me-2"></i>CMR Puntos
                        </a>
                    </li>
                </ul>
            </div>
        `
    });

    // Mostrar/ocultar popover
    loginArea.addEventListener('mouseover', () => {
        // Verifica que chevronIcon sigue en el DOM
        if (document.body.contains(chevronIcon) && popover) {
            popover.show();

            setTimeout(() => {
                const miCuentaLink = document.querySelector('.popover #miCuentaLink');
                if (miCuentaLink) {
                    miCuentaLink.onclick = function(e) {
                        e.preventDefault();
                        if (window.abrirMiCuentaModulo) {
                            window.abrirMiCuentaModulo();
                        }
                        popover.hide();
                    };
                }
                const logoutLink = document.querySelector('.popover #logoutLink');
                if (logoutLink) {
                    logoutLink.onclick = function(e) {
                        e.preventDefault();
                        handleLogout();
                        popover.hide();
                    };
                }
            }, 50);
        }
    });
    
    loginArea.addEventListener('mouseleave', () => setTimeout(() => {
        if (!loginArea.matches(':hover') && !document.querySelector('.popover:hover')) {
            if (popover) popover.hide();
        }
    }, 300));

    return popover;
}