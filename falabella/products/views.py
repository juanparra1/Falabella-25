from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, generics  # Asegúrate de importar filters
from .models import Product
from .serializers import ProductSerializer
from rest_framework.views import APIView    
from rest_framework.response import Response


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    #Filtrado de busqueda y ordenamiento
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    #Define filtros exactos
    filterset_fields = ['category', 'price', 'brand' ]
    #Define busqueda por campos de texto 
    search_fields = ['name', 'description']
    #Define ordenamiento por campos
    ordering_fields = ['price', 'name', 'created_at']
    ordering = ['name']  # Orden por defecto


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductListView(APIView):
    def get(self,request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)