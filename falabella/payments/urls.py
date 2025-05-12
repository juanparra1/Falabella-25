from django.urls import path
from .views import CheckoutView, CreatePreferenceView

app_name = 'payments'

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('create-preference/', CreatePreferenceView.as_view(), name='create_preference'),
]