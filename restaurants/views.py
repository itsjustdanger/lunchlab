from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from restaurants.models import Restaurant, Visit

# Create your views here.
def index(request):
    user = request.user if request.user.is_authenticated() else None
    visited = set()

    if user:
        for restaurant in user.visited_restaurants.all():
            visited.add(restaurant)

    restaurants = [r for r in Restaurant.objects.all() if r not in visited]

    return render(request, 'restaurants/index.html',
        {'restaurants': restaurants, 'visited': visited})

def show(request, id):
    user = request.user if request.user.is_authenticated() else None

    try:
        restaurant = user.visited_restaurants.get(id=id)
        restaurant.visited = True
    except:
        restaurant = get_object_or_404(Restaurant, pk=id)
        restaurant.visited = False

    return render(request, 'restaurants/show.html', {'restaurant': restaurant})

def new(request):
    return render(request, 'restaurants/new.html')

def create(request):
    name = request.POST['name']
    new_restaurant = Restaurant(name=name)

    try:
        new_restaurant.save()
    except:
        return render(request, 'restaurants/new.html',
            {'error_message': 'There was an error creating the new restaurant.'}
        )

    return HttpResponseRedirect(reverse('index'))

def visit(request, id):
    user = request.user if request.user.is_authenticated() else None
    restaurant = get_object_or_404(Restaurant, pk=id)

    if user:
        visit = Visit(user=user, restaurant=restaurant)

        try:
            visit.save()
            return HttpResponseRedirect(reverse('index'))
        except:
            return HttpResponseRedirect(reverse('index'))
