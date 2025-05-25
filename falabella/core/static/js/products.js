// products.js

document.addEventListener('DOMContentLoaded', function () {
    setupDynamicProducts();
});


// Función para cargar productos desde la API
function loadProducts(category = '') {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div></div>';

    // Construir la URL con el parámetro de categoría
    const url = category 
        ? `/api/products/?category=${encodeURIComponent(category.trim())}`
        : '/api/products/';
        
    console.log('Fetching URL:', url); // Para debugging

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener productos: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Products received:', data); // Para debugging
            
            // Filtrar productos por categoría exacta
            const filteredProducts = category 
                ? data.filter(product => 
                    product.category && 
                    product.category.toLowerCase() === category.toLowerCase())
                : data;

            if (filteredProducts.length === 0) {
                productsList.innerHTML = `
                    <div class="col-12 text-center">
                        <p>No hay productos disponibles en la categoría ${category}</p>
                    </div>`;
                return;
            }
            displayProducts(filteredProducts);
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
            productsList.innerHTML = `
                <div class="col-12 text-center text-danger">
                    <p>Error al cargar los productos. Por favor, intenta de nuevo.</p>
                </div>`;
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

