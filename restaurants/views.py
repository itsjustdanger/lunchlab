from django.shortcuts import render
from django.http import HttpResponse
from restaurants.models import Restaurant

# Create your views here.
def index(request):
    restaurants = Restaurant.objects.all()
    return HttpResponse(restaurants)
