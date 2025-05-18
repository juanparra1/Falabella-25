document.addEventListener("DOMContentLoaded", function() {
    // Paso 1: Del carrito a entrega
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            // Oculta el modal del carrito
            const cartModal = document.getElementById("cart-modal");
            if (cartModal) cartModal.style.display = "none";
            // Muestra el modal de entrega
            const entregaModal = document.getElementById("entrega-modal");
            if (entregaModal) {
                entregaModal.style.display = "block";
                actualizarResumenEntrega();
            }
        });
    }

    // Paso 2: De entrega a pago
    const goToPagoBtn = document.getElementById("go-to-pago-btn");
    if (goToPagoBtn) {
        goToPagoBtn.addEventListener("click", function(e) {
            e.preventDefault();
            // Oculta el modal de entrega
            const entregaModal = document.getElementById("entrega-modal");
            if (entregaModal) entregaModal.style.display = "none";
            // Muestra el modal de pago
            const pagoModal = document.getElementById("pago-modal");
            if (pagoModal) {
                pagoModal.style.display = "block";
                actualizarResumenPago();
            }
        });
    }

    // Escucha cambios en las opciones de entrega
    entregaOpciones.forEach(opcion => {
        const radio = document.getElementById(opcion.id);
        if (radio) {
            radio.addEventListener("change", actualizarResumenEntrega);
        }
    });
});

// Mapea los radios con su valor de entrega
const entregaOpciones = [
    { id: "retiro1", precio: 0 },
    { id: "retiro2", precio: 9800 },
    { id: "envio1", precio: 13200 },
    { id: "envio2", precio: 11000 }
];

function getEntregaSeleccionada() {
    for (const opcion of entregaOpciones) {
        const radio = document.getElementById(opcion.id);
        if (radio && radio.checked) {
            return opcion.precio;
        }
    }
    return 0;
}

// Actualiza el resumen en el módulo de entrega
function actualizarResumenEntrega() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalProducts = cart.reduce((total, item) => total + item.quantity * item.price, 0);

    // Nuevo: obtener precio de entrega seleccionado
    const precioEntrega = getEntregaSeleccionada();

    document.getElementById("total-items-entrega").textContent = totalItems;
    document.getElementById("total-products-entrega").textContent = `$${totalProducts.toLocaleString()}`;
    document.getElementById("entrega-precio-entrega").textContent = precioEntrega === 0 ? "Gratis" : `$${precioEntrega.toLocaleString()}`;
    document.getElementById("total-price-entrega").textContent = `$${(totalProducts + precioEntrega).toLocaleString()}`;
}

// Actualiza el resumen en el módulo de pago (ajusta los IDs según tu pago.html)
function actualizarResumenPago() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalProducts = cart.reduce((total, item) => total + item.quantity * item.price, 0);

    // Simulación de descuentos y entregas
    const descuentos = 0;
    const entregas = 0;

    document.getElementById("pago-total-items").textContent = totalItems;
    document.getElementById("pago-total-products").textContent = `$${totalProducts.toLocaleString()}`;
    document.getElementById("pago-descuentos").textContent = `- $${descuentos.toLocaleString()}`;
    document.getElementById("pago-entregas").textContent = `$${entregas.toLocaleString()}`;
    document.getElementById("pago-total").textContent = `$${(totalProducts - descuentos + entregas).toLocaleString()}`;
}