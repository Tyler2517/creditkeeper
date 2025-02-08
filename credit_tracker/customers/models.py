from django.db import models

class BusinessOwner(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)  # For simplicity, though you should use Django’s built-in user authentication system

class Customer(models.Model):
    owner = models.ForeignKey(BusinessOwner, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    credit = models.DecimalField(max_digits=10, decimal_places=2)