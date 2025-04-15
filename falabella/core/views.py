from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView
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