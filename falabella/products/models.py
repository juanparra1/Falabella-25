from django.db import models
from django.core.exceptions import ValidationError

def validate_positive(value):
    if value < 0:
        raise ValidationError("El valor debe ser un número positivo.")

class Product(models.Model):
    name = models.CharField(max_length=255, verbose_name="Nombre del producto")  # Se eliminó unique=True
    brand = models.CharField(max_length=255, null=True, blank=True, verbose_name="Marca")
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[validate_positive],
        verbose_name="Precio (COP)"
    )
    discount_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True, 
        validators=[validate_positive],
        verbose_name="Precio con descuento (COP)"
    )
    description = models.TextField(verbose_name="Descripción")
    image = models.ImageField(upload_to='products/images', null=True, blank=True, verbose_name="Imagen")
    specifications = models.JSONField(default=dict, verbose_name="Especificaciones")
    stock = models.PositiveIntegerField(default=0, verbose_name="Cantidad en inventario")
    sku = models.CharField(max_length=50, unique=True, verbose_name="SKU")
    category = models.CharField(max_length=255, null=True, blank=True, verbose_name="Categoría")
    rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        default=0.0, 
        verbose_name="Calificación"
    )
    sold_quantity = models.PositiveIntegerField(default=0, verbose_name="Cantidad vendida")
    shipping_available = models.BooleanField(default=True, verbose_name="Envío disponible")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    def __str__(self):
        return self.name