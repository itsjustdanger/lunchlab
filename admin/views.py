from django.shortcuts import render
from django.http import HttpResponse, HttpResponseForbidden

from restaurants.models import Restaurant

def index(request):
    user = request.user if request.user.is_authenticated() else None
    if not user.lunchprofile.can_create_restaurants:
        return HttpResponseForbidden

    restaurants = Restaurant.objects.all()

    return render(request, 'admin/index.html', {'restaurants': restaurants})

def new(request):
    return render(request, 'admin/new.html')

def edit(request, id):
    pass
