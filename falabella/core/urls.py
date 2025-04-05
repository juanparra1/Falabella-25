from django.urls import path
from django.contrib.auth.views import LoginView 
from . import views

app_name = 'core'  # Namespace opcional (si lo usas)

urlpatterns = [
    path('register/', views.register_view, name='register'),  # ¡Nombre correcto!
    path('login/', LoginView.as_view(template_name='partials/modals/login.html'), name='login'),
    ]