from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from users.serializers import CustomObtainPairSerializer
from datetime import datetime
import random
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.

def index(request):
    return render(request, 'core/index.html')

def help(request):
    return render(request, 'core/help.html')

def register_view(request):
    if request.method == 'POST':
        # Lógica de registro
        return redirect('core:index')  # Cambia 'core:index' por el nombre correcto de la ruta
    return render(request, 'partials/modals/register.html')

class CustomLoginView(LoginView):
    template_name = 'partials/modals/login.html'

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomObtainPairSerializer

def payment_success(request):
    context = {
        'is_payment_success': True,  # Agregar esta línea
        'order_number': f"FAL-{datetime.now().strftime('%Y%m%d')}-{random.randint(1000,9999)}",
        'order_date': datetime.now().strftime('%d/%m/%Y %H:%M'),
        'total_amount': request.session.get('total_amount', '0.00'),
        'shipping_address': request.session.get('shipping_address', 'Dirección no especificada'),
        'shipping_method': request.session.get('shipping_method', 'Entrega estándar'),
    }
    
    # Limpiar datos de la sesión
    request.session.pop('total_amount', None)
    request.session.pop('shipping_address', None)
    request.session.pop('shipping_method', None)
    
    return render(request, 'core/payment_success.html', context)

@csrf_exempt
def save_payment_data(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        request.session['total_amount'] = data.get('total_amount')
        request.session['shipping_address'] = data.get('shipping_address')
        request.session['shipping_method'] = data.get('shipping_method')
        return JsonResponse({'status': 'success'})