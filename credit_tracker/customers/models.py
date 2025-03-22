from django.db import models

class BusinessOwner(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    
class Customer(models.Model):
    owner = models.ForeignKey(BusinessOwner, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    credit = models.DecimalField(max_digits=10, decimal_places=2)
    note = models.TextField(null=True, blank=True)

class Transaction(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='transactions')
    previous_credit = models.DecimalField(max_digits=10, decimal_places=2)
    new_credit = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def credit_change(self):
        return self.new_credit - self.previous_credit

    class Meta:
        ordering = ['-created_at']