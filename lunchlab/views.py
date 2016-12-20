from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.urls import reverse
from restaurants.models import Restaurant

def restaurant_detail(request, id):
    user = request.user if request.user.is_authenticated() else None

    try:
        restaurant = user.visited_restaurants.get(id=id)
        restaurant.visited = True
    except:
        restaurant = get_object_or_404(Restaurant, pk=id)
        restaurant.visited = False

    return render(request, 'restaurants/show.html', {'restaurant': restaurant})
