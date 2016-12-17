from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from restaurants.models import Restaurant

# Create your views here.
def index(request):
    restaurants = Restaurant.objects.all()

    return render(request, 'restaurants/index.html',
        {'restaurants': restaurants})

def show(request, id):
    restaurant = get_object_or_404(Restaurant, pk=id)

    return render(request, 'restaurants/show.html', {'restaurant': restaurant})
