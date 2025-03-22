import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import Customer, BusinessOwner
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator
from django.db import models


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

@csrf_exempt
@require_http_methods(["GET", "POST"])
def customer_list(request):
    if request.method == "GET":
        page_size = int(request.GET.get('page_size', 10))
        page_number = int(request.GET.get('page', 1))
        search_term = request.GET.get('search', '')
        
        # Filter customers based on search term
        all_customers = Customer.objects.all().order_by('id')
        if search_term:
            all_customers = all_customers.filter(
                # Case-insensitive search on name or email
                models.Q(name__icontains=search_term) | 
                models.Q(email__icontains=search_term)
            )
        
        paginator = Paginator(all_customers, page_size)
        customers_page = paginator.get_page(page_number)
        
        customers_data = list(customers_page.object_list.values())
        return JsonResponse({
            'customers': customers_data,
            'total_pages': paginator.num_pages,
            'current_page': page_number,
            'total_customers': paginator.count,
        }, safe=False)
        
    
    elif request.method == "POST":
        data = json.loads(request.body)
        business_owner = BusinessOwner.objects.first()
        
        try:
            new_customer = Customer.objects.create(
                owner=business_owner,
                name=data['name'],
                email=data['email'],
                credit=data['credit']
            )
            
            return JsonResponse({
                'id': new_customer.id,
                'name': new_customer.name,
                'email': new_customer.email,
                'credit': str(new_customer.credit)
            }, status=201)
        except KeyError as e:
            return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)