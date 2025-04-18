// products.js

document.addEventListener('DOMContentLoaded', function () {
    setupDynamicProducts();
});

function setupDynamicProducts() {
    const carousel = document.getElementById('carouselExampleIndicators');
    const productContainer = document.getElementById('product-container');
    const filtersContainer = document.getElementById('filters-container');
    const inlineRegisterForm = document.getElementById('inlineRegisterForm');

    // Manejo del enlace de registro
    document.addEventListener('click', function (event) {
        const registerLink = event.target.closest('#registerLink');
        if (registerLink) {
            event.preventDefault();
            carousel.style.display = 'none';
            inlineRegisterForm.style.display = 'block';
            inlineRegisterForm.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Manejo de los enlaces de categorías
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const category = this.getAttribute('data-category');
            loadProducts(category);
            filtersContainer.style.display = 'block';
            productContainer.style.display = 'block';
            productContainer.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Función para cargar productos desde la API
function loadProducts(category) {
    fetch(`/api/products/?category=${category}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener productos: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => displayProducts(data))
        .catch(error => {
            console.error('Error al cargar productos:', error);
            showErrorMessage('No se pudieron cargar los productos. Inténtalo de nuevo más tarde.');
        });
}

// Función para mostrar los productos en el frontend
function displayProducts(products) {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';

    if (products.length === 0) {
        productsList.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 mb-4';
        productCard.innerHTML = `
            <div class="card product-card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h2 class="card-title">${product.brand}</h2>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">
                        <strong>${formatCurrency(product.price)}</strong>
                        ${product.oldPrice ? `<del>${formatCurrency(product.oldPrice)}</del>` : ''}
                    </p>
                    <button class="btn btn-dark w-100 rounded-pill">Agregar al carro</button>
                </div>
            </div>
        `;
        productsList.appendChild(productCard);
    });
}

// Función para mostrar mensajes de error
function showErrorMessage(message) {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = `<p class="text-danger">${message}</p>`;
}

// Función para formatear precios como moneda
function formatCurrency(value) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(value);
}