from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from restaurants.models import Restaurant, Visit
from django.core import serializers


def index(request):
    user = request.user if request.user.is_authenticated() else None
    visited = set(user.visited_restaurants.all()) if user else set()

    restaurants = []

    for r in Restaurant.objects.all():
        restaurants.append({
            'id': r.id,
            'name': r.name,
            'visited': r in visited
        })

    return JsonResponse(restaurants, safe=False)

def show(request, id):
    user = request.user if request.user.is_authenticated() else None

    try:
        r = user.visited_restaurants.get(id=id)
        r.visited = True
    except:
        r = get_object_or_404(Restaurant, pk=id)
        r.visited = False

    restaurant = {
        'id': r.id,
        'name': r.name,
        'visited': r.visited
    }

    return JsonResponse(restaurant, safe=False)

def new(request):
    name = request.POST['name']
    new_restaurant = Restaurant(name=name)

    try:
        new_restaurant.save()
    except:
        return render(request, 'restaurants/new.html',
            {'error_message': 'There was an error creating the new restaurant.'}
        )

    return HttpResponseRedirect(reverse('index'))

def edit(request, id):
    pass

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
