from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.index, name='index'),
    path('help/', views.help, name='help'),
    path('register/', views.register_view, name='register'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('payment-success/', views.payment_success, name='payment_success'),
    path('save-payment-data/', views.save_payment_data, name='save_payment_data'),
]