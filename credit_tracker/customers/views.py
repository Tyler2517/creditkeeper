import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import Customer
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ObjectDoesNotExist

@csrf_exempt
@require_http_methods(["GET", "PUT"])
def customer_detail(request, customer_id):
    try:
        customer = Customer.objects.get(id=customer_id)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Customer not found'}, status=404)

    if request.method == "GET":
        return JsonResponse({
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'credit': str(customer.credit)
        })

    elif request.method == "PUT":
        data = json.loads(request.body)
        customer.name = data.get('name', customer.name)
        customer.email = data.get('email', customer.email)
        customer.credit = data.get('credit', customer.credit)
        customer.save()
        return JsonResponse({
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'credit': str(customer.credit)
        })

def customer_list(request):
    customers = list(Customer.objects.values())
    return JsonResponse(customers, safe=False)  # Return the list of customers as JSON