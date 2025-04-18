        document.addEventListener('DOMContentLoaded', function () {
            initializeTooltipsAndPopovers();
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
                    <li class="mb-3">
                        <a href="#" class="semi-bold-on-hover no-underline" id="myAccountLink">Mi cuenta</a>
                    </li>
                    <hr class="my-3">
                    <li class="mb-3"><a href="/" class="semi-bold-on-hover no-underline">CMR Puntos</a></li>
                    </ul>
                </div>
                `
            });

          // Mostrar/ocultar popover
            loginArea.addEventListener('mouseover', () => popover.show());
            loginArea.addEventListener('mouseleave', () => setTimeout(() => {
                if (!loginArea.matches(':hover') && !document.querySelector('.popover:hover')) {
                popover.hide();
                }
            }, 300));

            document.addEventListener('click', (event) => {
                if (!loginArea.contains(event.target) && !document.querySelector('.popover').contains(event.target)) {
                popover.hide();
                }
            });
            }