from django.db import models
from django.conf import settings

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('approved', 'Aprobado'),
        ('rejected', 'Rechazado'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payment_orders'  # Agregamos related_name
    )
    order_id = models.CharField(max_length=100, unique=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    payment_id = models.CharField(max_length=100, null=True, blank=True)
    preference_id = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Order {self.order_id} - {self.status}"
