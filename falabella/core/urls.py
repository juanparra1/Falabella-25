from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.index, name='index'),  # Ruta para el índice
    path('help/', views.help, name='help'),
    path('register/', views.register_view, name='register'),
]