from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from restaurants.models import Restaurant

# Create your views here.
def index(request):
    restaurants = Restaurant.objects.all()

    return render(request, 'restaurants/index.html',
        {'restaurants': restaurants})

def show(request, id):
    restaurant = get_object_or_404(Restaurant, pk=id)

    return render(request, 'restaurants/show.html', {'restaurant': restaurant})

def new(request):
    return render(request, 'restaurants/new.html')

def create(request):
    name = request.POST['name']
    new_restaurant = Restaurant(name=name)

    try:
        new_restaurant.save()
    except:
        render(request, 'restaurants/new.html',
            {'error_message': 'There was an error creating the new restaurant.'}
        )

    return HttpResponseRedirect(reverse('index'))
