let stripe;
let elements;

async function initializeStripeForm(clientSecret, publicKey) {
    // Inicializar Stripe con la clave pública
    stripe = Stripe(publicKey);
    elements = stripe.elements();
    const card = elements.create('card');
    const form = document.getElementById('payment-form');
    const submitButton = form.querySelector('button[type="submit"]');
    
    card.mount('#card-element');
    
    // Manejar errores de validación en tiempo real
    card.addEventListener('change', ({error}) => {
        const displayError = document.getElementById('card-errors');
        if (error) {
            displayError.textContent = error.message;
        } else {
            displayError.textContent = '';
        }
    });
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = 'Procesando...';
        
        try {
            const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                }
            });
            
            if (error) {
                const errorElement = document.getElementById('card-errors');
                errorElement.textContent = error.message;
                submitButton.disabled = false;
                submitButton.textContent = 'Pagar';
            } else {
                if (paymentIntent.status === 'succeeded') {
                    // Guardar información en la sesión
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const totalAmount = cart.reduce((total, item) => total + item.quantity * item.price, 0);
                    const precioEntrega = getEntregaSeleccionada(); // Asegúrate de que esta función esté disponible
                    const totalWithShipping = totalAmount + precioEntrega;
                    
                    // Guardar datos en la sesión de Django
                    await fetch('/save-payment-data/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                        },
                        body: JSON.stringify({
                            total_amount: totalWithShipping,
                            shipping_address: document.getElementById('direccion-actual').textContent,
                            shipping_method: document.querySelector('input[name="entrega"]:checked').nextElementSibling.textContent
                        })
                    });

                    // Limpiar carrito
                    localStorage.removeItem('cart');
                    
                    // Mostrar mensaje de éxito
                    const successMessage = document.createElement('div');
                    successMessage.className = 'alert alert-success';
                    successMessage.textContent = '¡Pago exitoso! Redirigiendo...';
                    form.insertBefore(successMessage, form.firstChild);
                    
                    // Redirigir después de 2 segundos
                    setTimeout(() => {
                        // Usar la URL definida en base.html
                        if (typeof PAYMENT_SUCCESS_URL !== 'undefined') {
                            window.location.href = PAYMENT_SUCCESS_URL;
                        } else {
                            // Fallback por si la variable no está definida
                            window.location.href = '/payment-success/';
                        }
                    }, 2000);
                }
            }
        } catch (e) {
            console.error('Error:', e);
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = 'Ocurrió un error al procesar el pago.';
            submitButton.disabled = false;
            submitButton.textContent = 'Pagar';
        }
    });
}