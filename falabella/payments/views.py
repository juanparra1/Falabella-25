import json
import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from decimal import Decimal

# Configurar la clave secreta de Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
@require_http_methods(["POST"])
def create_payment_intent(request):
    try:
        data = json.loads(request.body)
        cart_total = Decimal(data.get('total_amount', 0))
        
        # Validar que el monto no sea 0
        if cart_total <= 0:
            return JsonResponse({'error': 'El monto debe ser mayor a 0'}, status=400)
            
        # Crear el PaymentIntent con Stripe
        intent = stripe.PaymentIntent.create(
            amount=int(cart_total * 100),  # Stripe requiere el monto en centavos
            currency='usd',
            payment_method_types=['card'],
            metadata={'integration_check': 'accept_a_payment'}
        )
        
        return JsonResponse({
            'clientSecret': intent.client_secret,
            'publicKey': settings.STRIPE_PUBLISHABLE_KEY
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)