let cartCounter = 0;
let totalPrice = 0;

// Renderizar productos dinámicamente
function renderProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Limpiar contenido previo

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!Array.isArray(cart)) {
        console.error("El carrito no es un array válido.");
        return;
    }

    cart.forEach((product) => {
        const productHTML = `
            <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                <div class="d-flex align-items-center">
                    <input class="form-check-input me-3" type="checkbox" checked>
                    <img src="${product.image}" alt="${product.name}" width="80" class="me-3">
                    <div>
                        <h6 class="mb-1">${product.name}</h6>
                        <p class="mb-0">${formatCurrency(product.price)}</p>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <span class="me-3">${formatCurrency(product.price)}</span> <!-- Mostrar precio aquí -->
                    <button class="btn btn-outline-secondary btn-sm me-2" onclick="updateQuantity(-1, ${product.id})">-</button>
                    <span id="quantity-${product.id}">${product.quantity}</span>
                    <button class="btn btn-outline-secondary btn-sm ms-2" onclick="updateQuantity(1, ${product.id})">+</button>
                </div>
            </div>
        `;
        productList.insertAdjacentHTML("beforeend", productHTML);
    });

    updateSummary();
}

// Actualizar cantidad de productos
function updateQuantity(change, productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!Array.isArray(cart)) {
        console.error("El carrito no es un array válido.");
        return;
    }
    const productIndex = cart.findIndex((p) => p.id === productId);
    if (productIndex === -1) return;

    const product = cart[productIndex];
    product.quantity += change;

    // Si la cantidad es menor a 1, eliminar el producto del carrito
    if (product.quantity < 1) {
        cart.splice(productIndex, 1);
    }

    // Guardar carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Actualizar la vista del carrito
    renderProducts();

    // Actualizar totales
    updateSummary();
    updateCartCounter();
}

// Actualizar resumen del carrito
function updateSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!Array.isArray(cart)) {
        console.error("El carrito no es un array válido.");
        return;
    }
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + item.quantity * item.price, 0);

    document.getElementById("product-count").textContent = totalItems;
    document.getElementById("total-items").textContent = totalItems;
    document.getElementById("total-products").textContent = `$${totalPrice.toLocaleString()}`;
    document.getElementById("total-price").textContent = `$${totalPrice.toLocaleString()}`;
}

// Función para ocultar carruseles y mostrar el carrito
function closeCarouselsAndShowCart() {
    const carousel = document.getElementById('carouselExampleIndicators');
    const mostSoldCarousels = document.querySelectorAll('.container-md.py-7'); // Selecciona los contenedores de "Most Sold"

    // Ocultar el carrusel principal
    if (carousel) {
        carousel.style.display = 'none';
    }

    // Ocultar los carruseles de "Most Sold"
    mostSoldCarousels.forEach(carousel => {
        carousel.style.display = 'none';
    });

    // Mostrar el modal del carrito
    showCartModal();
}

// Mostrar el modal del carrito
function showCartModal() {
    const cartModal = document.getElementById("cart-modal");
    if (cartModal) {
        cartModal.style.display = "block";
        renderProducts(); // Asegúrate de renderizar los productos
        cartModal.scrollIntoView({ behavior: "smooth" });
    }
}

// Inicializar eventos
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();

    // Seleccionar todos los productos
    document.getElementById("selectAll").addEventListener("change", function (e) {
        const checkboxes = document.querySelectorAll(".form-check-input");
        checkboxes.forEach((checkbox) => (checkbox.checked = e.target.checked));
    });

    // Agregar evento al ícono del carrito
    const cartIcon = document.querySelector(".bi-cart3");
    if (cartIcon) {
        cartIcon.addEventListener("click", (e) => {
            e.preventDefault(); // Evitar comportamiento predeterminado
            closeCarouselsAndShowCart(); // Ocultar carruseles y mostrar el carrito
        });
    }
});

// Función para agregar productos al carrito
function addToCart(productData) {
    const product = JSON.parse(decodeURIComponent(productData));

    // Obtener el carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!Array.isArray(cart)) {
        console.error("El carrito no es un array válido.");
        return;
    }
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    // Guardar carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Actualizar el contador del carrito en el DOM
    updateCartCounter();
    renderProducts(); // Actualizar la vista del carrito si es necesario
}

// Asegúrate de que la función sea global
window.addToCart = addToCart;

// Función para actualizar el contador del carrito
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!Array.isArray(cart)) {
        console.error("El carrito no es un array válido.");
        return;
    }
    const cartCounter = cart.reduce((total, item) => total + item.quantity, 0);

    const navbarCounter = document.getElementById("cart-counter");
    if (navbarCounter) {
        navbarCounter.textContent = cartCounter;
    } else {
        console.error("No se encontró el contador del carrito en el DOM.");
    }
}

const selectAll = document.getElementById("selectAll");
if (selectAll) {
    selectAll.addEventListener("change", function (e) {
        const checkboxes = document.querySelectorAll(".form-check-input");
        checkboxes.forEach((checkbox) => (checkbox.checked = e.target.checked));
    });
} else {
    console.warn("El elemento #selectAll no se encontró en el DOM.");
}