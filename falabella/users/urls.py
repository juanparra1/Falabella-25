from django.urls import path
from .views import UserListCreateView, UserDetailView, ChangePasswordView, ForgotPasswordView, ResetPasswordView, AddressListCreateView, AddressDetailView, UserProfileView, CustomTokenObtainPairView, VerifyCodeView

urlpatterns = [
    path('register/', UserListCreateView.as_view(), name='register'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('users/change_password/', ChangePasswordView.as_view(), name='change_password'),
    path('forgot_password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset_password/', ResetPasswordView.as_view(), name='reset_password'),
    path("addresses/", AddressListCreateView.as_view(), name="address-list-create"),
    path("addresses/<int:pk>/", AddressDetailView.as_view(), name="address-detail"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('verify_code/', VerifyCodeView.as_view(), name='verify_code'),
]
