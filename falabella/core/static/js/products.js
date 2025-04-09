// products.js

document.addEventListener('DOMContentLoaded', function () {
    setupDynamicProducts();
});

function setupDynamicProducts() {
    const carousel = document.getElementById('carouselExampleIndicators');
    const productContainer = document.getElementById('product-container');
    const filtersContainer = document.getElementById('filters-container');
    const inlineRegisterForm = document.getElementById('inlineRegisterForm');

    document.addEventListener('click', function (event) {
    const registerLink = event.target.closest('#registerLink');
        if (registerLink) {
            event.preventDefault();
            carousel.style.display = 'none';
            inlineRegisterForm.style.display = 'block';
            inlineRegisterForm.scrollIntoView({ behavior: 'smooth' });
        }
    });

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

    function loadProducts(category) {
        const products = {
            'blusas': [
                { name: 'Blusa 1', marca: 'ARKITEC', price: '$59.990', oldPrice: '$99.990', image: 'static/img/blusa1.png' },
                { name: 'Blusa 2', marca: 'ARKITEC', price: '$49.990', oldPrice: '$79.990', image: 'static/img/blusa2.png' },
                { name: 'Blusa 3', marca: 'ARKITEC', price: '$39.990', oldPrice: '$69.990', image: 'static/img/blusa3.png' }
            ],
            'camisetas': [
                { name: 'Camiseta 1', price: '$15', oldPrice: '$20', image: 'img/camiseta1.jpg' },
                { name: 'Camiseta 2', price: '$18', oldPrice: '$25', image: 'img/camiseta2.jpg' }
            ]
        };

        const selectedProducts = products[category] || [];
        displayProducts(selectedProducts);
    }

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
                    <h2 class="card-Title">${product.marca}</h2> 
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text"><strong>${product.price}</strong> <del>${product.oldPrice}</del></p>
                    <button class="btn btn-dark w-100 rounded-pill">Agregar al carro</button>
                </div>
            </div>
                `;
            productsList.appendChild(productCard);
        });
}