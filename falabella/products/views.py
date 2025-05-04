from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # Filtrado de búsqueda y ordenamiento
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    # Define filtros exactos
    filterset_fields = ['category', 'price', 'brand']
    # Define búsqueda por campos de texto
    search_fields = ['name', 'description']
    # Define ordenamiento por campos
    ordering_fields = ['price', 'name', 'created_at']
    ordering = ['name']  # Orden por defecto

    # Solo usuarios autenticados pueden crear, actualizar o eliminar productos
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:  # Ver productos y detalles es público
            permission_classes = [AllowAny]
        else:  # Crear, actualizar o eliminar requiere autenticación
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]  # Ver detalles es público


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method == 'GET':  # Ver lista de productos es público
            permission_classes = [AllowAny]
        else:  # Crear productos requiere autenticación
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class ProductListView(APIView):
    permission_classes = [AllowAny]  # Ver lista de productos es público

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)