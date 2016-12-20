from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from restaurants.models import Restaurant
from reviews.models import Review

def restaurant_detail(request, id):
    user = request.user if request.user.is_authenticated() else None

    try:
        restaurant = user.visited_restaurants.get(id=id)
        restaurant.visited = True
    except:
        restaurant = get_object_or_404(Restaurant, pk=id)
        restaurant.visited = False

    reviews = Review.objects.filter(restaurant_id=id)
    restaurant.user_reviewed = not not Review.objects.filter(user_id=user.id, restaurant_id=id)

    return render(request, 'restaurants/show.html', {'restaurant': restaurant, 'reviews': reviews})
