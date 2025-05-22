import json
import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from decimal import Decimal

stripe.api_key = settings.STRIPE_SECRET_KEY

@ensure_csrf_cookie
@require_http_methods(["POST"])
def create_payment_intent(request):
    try:
        data = json.loads(request.body)
        cart_total = Decimal(data.get('total_amount', 0))
        
        if cart_total <= 0:
            return JsonResponse({'error': 'El monto debe ser mayor a 0'}, status=400)
            
        intent = stripe.PaymentIntent.create(
            amount=int(cart_total * 100),
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