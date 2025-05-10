from django.urls import path
from django.contrib.auth.views import LoginView 
from . import views
from .views import CustomTokenObtainPairView

app_name = 'core'

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', LoginView.as_view(template_name='partials/modals/login.html'), name='login'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]