// products.js

document.addEventListener('DOMContentLoaded', function () {
    setupDynamicProducts();
});


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
                    <button class="btn btn-dark w-100 rounded-pill" onclick="addToCart('${encodeURIComponent(JSON.stringify(product))}')">Agregar al carro</button>
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

