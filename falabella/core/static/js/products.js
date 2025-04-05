// products.js

document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos cuando se selecciona una categoría del menú
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            loadProducts(category);
        });
    });

    // Manejar filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            applyFilters();
        });
    });

    // Manejar rango de precios
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            document.getElementById('minPrice').textContent = `$${formatPrice(this.value)}`;
            applyFilters();
        });
    }

    // Manejar ordenamiento
    document.getElementById('sortProducts')?.addEventListener('change', function() {
        sortProducts(this.value);
        });
    });

    function loadProducts(category) {
        // Ocultar carrusel y mostrar vista de productos
        document.getElementById('carouselExampleIndicators').style.display = 'none';
        document.getElementById('filters-container').style.display = 'block';
        document.getElementById('product-container').style.display = 'block';
        
        // Actualizar título de categoría
        document.getElementById('category-title').textContent = category.charAt(0).toUpperCase() + category.slice(1);
        
        // Simular carga de productos (en un caso real sería una llamada AJAX)
        fetch(`/api/products?category=${category}`)
        .then(response => response.json())
        .then(data => {
            displayProducts(data.products);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    function displayProducts(products) {
        const container = document.getElementById('products-list');
        container.innerHTML = '';
    
        if (products.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5"><h5>No hay productos disponibles</h5></div>';
        return;
        }
    
        products.forEach(product => {
        const productCard = `
            <div class="col">
            <div class="card product-card h-100">
                ${product.discount > 0 ? `<div class="badge-offer">-${product.discount}%</div>` : ''}
                <img src="${product.image}" class="card-img-top p-3" alt="${product.name}">
                <div class="card-body">
                <p class="card-brand mb-1">${product.brand}</p>
                <h5 class="card-title">${product.name}</h5>
                <div class="price-container">
                    <span class="current-price">$${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                ${product.freeShipping ? '<div class="shipping-badge">Envío gratis</div>' : ''}
                ${product.lastUnits ? '<div class="last-units">Últimas unidades</div>' : ''}
                </div>
                <div class="card-footer bg-transparent">
                <button class="btn btn-dark w-100 rounded-pill add-to-cart" data-id="${product.id}">Agregar al carro</button>
                </div>
            </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', productCard);
        });
    }
    
    function applyFilters() {
        // Obtener filtros activos
        const activeFilters = {
        envio: [],
        categoria: [],
        marca: [],
        descuento: [],
        precioMin: document.getElementById('priceRange')?.value || 0
        };
    
        document.querySelectorAll('.filter-btn.active').forEach(btn => {
        const filterType = btn.getAttribute('data-filter');
        const filterValue = btn.getAttribute('data-value');
        if (activeFilters[filterType]) {
            activeFilters[filterType].push(filterValue);
        }
        });
    
        // Filtrar productos (en un caso real sería una llamada AJAX con los parámetros)
        console.log('Aplicando filtros:', activeFilters);
        // Aquí iría la lógica para filtrar los productos
    }
    
    function sortProducts(criteria) {
        // Lógica para ordenar productos
        console.log('Ordenando por:', criteria);
    }
    
    function formatPrice(price) {
        return new Intl.NumberFormat('es-CO').format(price);
    }