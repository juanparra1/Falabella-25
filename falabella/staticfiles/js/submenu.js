document.addEventListener('DOMContentLoaded', function () {
    setupSubmenus();
});

function setupSubmenus() {
    const menuItems = document.querySelectorAll('.menu-item');
    let activeSubmenu = null;

    menuItems.forEach(item => {
        const submenu = item.querySelector('.submenu');

    if (submenu) {
        item.addEventListener('mouseenter', () => {
            if (activeSubmenu && activeSubmenu !== submenu) {
                hideSubmenu(activeSubmenu);
            }
            showSubmenu(submenu);
            activeSubmenu = submenu;
        });

        submenu.addEventListener('mouseenter', () => showSubmenu(submenu));
        item.addEventListener('mouseleave', () => setTimeout(() => {
            if (!submenu.matches(':hover')) hideSubmenu(submenu);
        }, 300));
        submenu.addEventListener('mouseleave', () => setTimeout(() => {
            if (!item.matches(':hover')) hideSubmenu(submenu);
        }, 300));
    }
    });

    // Cerrar el menú y submenú al hacer clic en una categoría
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const category = this.getAttribute('data-category');
            loadProducts(category);

            // Cerrar el menú y submenú
            const offcanvasMenu = document.getElementById('offcanvasMenu');
            const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasMenu);
            offcanvasInstance.hide();

            const submenus = document.querySelectorAll('.submenu');
            submenus.forEach(submenu => {
                hideSubmenu(submenu);
            });

            // Mostrar los filtros y productos
            const filtersContainer = document.getElementById('filters-container');
            const productContainer = document.getElementById('product-container');
            filtersContainer.style.display = 'block';
            productContainer.style.display = 'block';
            productContainer.scrollIntoView({ behavior: 'smooth' });
        });
        });
    }

    function showSubmenu(submenu) {
        submenu.style.display = 'block';
        submenu.style.visibility = 'visible';
        submenu.style.opacity = '1';
    }

    function hideSubmenu(submenu) {
        submenu.style.display = 'none';
        submenu.style.visibility = 'hidden';
        submenu.style.opacity = '0';
    }