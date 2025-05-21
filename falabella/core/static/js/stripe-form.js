let stripe;
let elements;

async function initializeStripeForm(clientSecret, publicKey) {
    // Inicializar Stripe con la clave pública
    stripe = Stripe(publicKey);
    elements = stripe.elements();
    
    const style = {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4"
            }
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
        }
    };
    
    const card = elements.create('card', {style: style});
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
    
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Deshabilitar el botón mientras procesa
        const submitButton = form.querySelector('button[type="submit"]');
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
                    // Limpiar carrito
                    localStorage.removeItem('cart');
                    
                    // Mostrar mensaje de éxito
                    const successMessage = document.createElement('div');
                    successMessage.className = 'alert alert-success';
                    successMessage.textContent = '¡Pago exitoso! Redirigiendo...';
                    form.insertBefore(successMessage, form.firstChild);
                    
                    // Redirigir después de 2 segundos
                    setTimeout(() => {
                        window.location.href = '/payment-success/';
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