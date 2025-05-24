from django.urls import path
from .views import LoginView, RegisterView, UserProfileView, UpdateProfileView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('update-profile/', UpdateProfileView.as_view(), name='update-profile'),
]
