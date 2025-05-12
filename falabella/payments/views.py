import mercadopago
from django.conf import settings
from django.shortcuts import render, redirect
from django.views.generic import View
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from cart.models import Cart
from .models import Order
import uuid

class CheckoutView(LoginRequiredMixin, View):
    template_name = 'payments/checkout.html'
    
    def get(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
            cart_items = cart.items.all()
            
            if not cart_items:
                return redirect('cart')
                
            total = sum(item.product.price * item.quantity for item in cart_items)
            
            return render(request, self.template_name, {
                'cart_items': cart_items,
                'total': total,
                'mercadopago_public_key': settings.MERCADOPAGO_CONFIG['PUBLIC_KEY']
            })
        except Cart.DoesNotExist:
            return redirect('cart')

class CreatePreferenceView(LoginRequiredMixin, View):
    def post(self, request):
        sdk = mercadopago.SDK(settings.MERCADOPAGO_CONFIG['ACCESS_TOKEN'])
        
        try:
            cart = Cart.objects.get(user=request.user)
            cart_items = cart.items.all()
            
            if not cart_items:
                return JsonResponse({'error': 'Cart is empty'}, status=400)
            
            total = sum(item.product.price * item.quantity for item in cart_items)
            
            # Crear orden en la base de datos
            order = Order.objects.create(
                user=request.user,
                order_id=str(uuid.uuid4()),
                total_amount=total,
                status='pending'
            )
            
            items = [{
                "title": item.product.name,
                "quantity": item.quantity,
                "currency_id": "COP",
                "unit_price": float(item.product.price)
            } for item in cart_items]
            
            preference_data = {
                "items": items,
                "back_urls": {
                    "success": request.build_absolute_uri('/payment/success/'),
                    "failure": request.build_absolute_uri('/payment/failure/'),
                    "pending": request.build_absolute_uri('/payment/pending/')
                },
                "external_reference": order.order_id,
                "auto_return": "approved"
            }

            preference_response = sdk.preference().create(preference_data)
            preference = preference_response["response"]
            
            order.preference_id = preference["id"]
            order.save()

            return JsonResponse({
                "id": preference["id"],
                "init_point": preference["init_point"]
            })
            
        except Cart.DoesNotExist:
            return JsonResponse({'error': 'Cart not found'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)