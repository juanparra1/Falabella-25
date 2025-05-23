# Generated by Django 5.1.7 on 2025-05-04 16:30

import products.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='discount_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, validators=[products.models.validate_positive], verbose_name='Precio con descuento (COP)'),
        ),
        migrations.AlterField(
            model_name='product',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=10, validators=[products.models.validate_positive], verbose_name='Precio (COP)'),
        ),
        migrations.AlterField(
            model_name='product',
            name='shipping_available',
            field=models.BooleanField(default=True, verbose_name='Envío disponible'),
        ),
        migrations.AlterField(
            model_name='product',
            name='sold_quantity',
            field=models.PositiveIntegerField(default=0, verbose_name='Cantidad vendida'),
        ),
        migrations.AlterField(
            model_name='product',
            name='stock',
            field=models.PositiveIntegerField(default=0, verbose_name='Cantidad en inventario'),
        ),
    ]
