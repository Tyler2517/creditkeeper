from django.shortcuts import render
from django.http import JsonResponse
from .models import Customer

def customer_list(request):
    customers = list(Customer.objects.values())
    return JsonResponse(customers, safe=False)  # Return the list of customers as JSON