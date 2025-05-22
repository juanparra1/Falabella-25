from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.index, name='index'),
    path('payment-success/', views.payment_success, name='payment_success'),
    path('save-payment-data/', views.save_payment_data, name='save_payment_data'),
    # ... otras urls
]