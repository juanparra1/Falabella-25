const products = [
    {
        id: 1,
        name: "Juego de mesa UNO Cartas",
        price: 24900,
        quantity: 1,
        image: "/static/img/uno.jpg",
    },
    {
        id: 2,
        name: "Hot Wheels Die Cast Vehículo de Juguete",
        price: 32900,
        quantity: 2,
        image: "/static/img/hotwheels.jpg",
    },
];

let cartCounter = 0;
let totalPrice = 0;

  // Renderizar productos dinámicamente
function renderProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Limpiar contenido previo

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

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
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Evitar cantidades negativas
    if (product.quantity + change < 1) return;

    product.quantity += change;

    // Actualizar cantidad en el DOM
    document.getElementById(`quantity-${productId}`).textContent = product.quantity;

    // Actualizar totales
    cartCounter += change;
    totalPrice += change * product.price;

    updateSummary();
}

  // Actualizar resumen del carrito
function updateSummary() {
    document.getElementById("product-count").textContent = cartCounter;
    document.getElementById("total-items").textContent = cartCounter;
    document.getElementById("total-products").textContent = `$${totalPrice.toLocaleString()}`;
    document.getElementById("total-price").textContent = `$${totalPrice.toLocaleString()}`;

    // Actualizar contador en el navbar
    const navbarCounter = document.querySelector(".bi-cart3 + .badge");
    if (navbarCounter) {
        navbarCounter.textContent = cartCounter;
    }
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
        cartModal.style.display = "block"; // Mostrar el modal
        cartModal.scrollIntoView({ behavior: "smooth" }); // Desplazar la vista al modal
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