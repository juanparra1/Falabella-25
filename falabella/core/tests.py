from django.test import TestCase
from rest_framework.test import APIClient
from .models import Product

class ProductAPITest(TestCase):
    def setUp(self):
        Product.objects.create(name="Test Product", price=10.0, stock=5)

    def test_get_products(self):
        client = APIClient()
        response = client.get('/api/products/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Test Product")
