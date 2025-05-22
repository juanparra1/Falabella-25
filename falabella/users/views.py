from rest_framework import generics, status, permissions
from .models import CustomUser, Address
from .serializers import UserSerializer, AddressSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from .serializers import ForgotPasswordSerializer, ChangePasswordSerializer, ResetPasswordSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomObtainPairSerializer
from django.core.mail import send_mail
import random
from django.core.cache import cache  # Para almacenar el código temporalmente


User  = get_user_model()

class UserListCreateView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all() #Vista de usuarios y registros
    serializer_class = UserSerializer

    def get_permissions(self):#Permite registro de usuario pero GET requiere permisos
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):#Vista para actualizar o eliminar usuario esp.
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class ChangePasswordView(generics.UpdateAPIView):#Vista para cambiar contraseña
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self, queryset=None):
        return self.request.user #Devuelve usuario que hizo solicitud
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        #Verifica contraseña actual incorrecta
        if not user.check_password(serializer.data.get("old_password")):
            return Response({"old_password": ["Contraseña incorrecta."]}, status=status.HTTP_400_BAD_REQUEST)
        
        #Estable nueva contraseña y la guarda
        user.set_password(serializer.data.get("new_password"))
        user.save()
        
        return Response({"detail": "Contraseña actualizada correctamente."}, status=status.HTTP_200_OK)



class ForgotPasswordView(APIView):
    authentication_classes = []  # Deshabilitar autenticación basada en sesión
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "El usuario con este correo electrónico no existe."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generar un código de verificación de 6 dígitos
        verification_code = random.randint(100000, 999999)

        # Almacenar el código en la caché con una expiración de 10 minutos
        cache.set(f'verification_code_{user.id}', verification_code, timeout=600)

        # Enviar el código por correo
        send_mail(
            'Código de verificación',
            f'Tu código de verificación es: {verification_code}',
            'no-reply@falabella.com',
            [email],
            fail_silently=False,
        )

        return Response({"detail": "Se ha enviado un código de verificación a tu correo electrónico."}, status=status.HTTP_200_OK)
    
class ResetPasswordView(APIView):
    #Permite restablecer contraseña
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uid = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)
        except Exception:
            return Response ({"detaiil": "ID de usuario valido."}, status=status.HTTP_400_BAD_REQUEST)
        
        #Verificar el token
        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Token no válido."}, status=status.HTTP_400_BAD_REQUEST)
        
        #Establecer nueva contraseña y guardar
        user.set_password(new_password)
        user.save()
        return Response({"detail": "Contraseña restablecida correctamente."}, status=status.HTTP_200_OK)

class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
        })

    def patch(self, request):
        user = request.user
        user.username = request.data.get('username', user.username)
        user.email = request.data.get('email', user.email)
        user.save()
        return Response({'message': 'Profile updated successfully'})
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomObtainPairSerializer
    #Permite obtener token de acceso y refresco

class VerifyCodeView(APIView):
    authentication_classes = []  # Deshabilitar autenticación basada en sesión
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        code = request.data.get('code')

        if not user_id or not code:
            return Response({"detail": "Faltan datos requeridos."}, status=status.HTTP_400_BAD_REQUEST)

        # Recuperar el código de la caché
        cached_code = cache.get(f'verification_code_{user_id}')
        if cached_code is None:
            return Response({"detail": "El código ha expirado o no es válido."}, status=status.HTTP_400_BAD_REQUEST)

        if str(cached_code) != str(code):
            return Response({"detail": "El código ingresado no es correcto."}, status=status.HTTP_400_BAD_REQUEST)

        # Código verificado correctamente
        return Response({"detail": "Código verificado correctamente."}, status=status.HTTP_200_OK)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(email=email, password=password)
        
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'status': 'success',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'first_name': user.first_name,
                'email': user.email,
                'id': user.id
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'status': 'error',
                'error': 'Credenciales inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'first_name': user.first_name,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

