from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from restaurants.models import Restaurant
from reviews.models import Review

def restaurant_detail(request, id):
    """ Pre-rendered restauranta detail page based on provided id. Queries for
    reviews in advance to display on page load.
    """
    user = request.user if request.user.is_authenticated() else None

    try:
        restaurant = user.lunchprofile.visits.get(id=id)
        restaurant.visited = True
        restaurant.user_reviewed = not not Review.objects.filter(user_id=user.id, restaurant_id=id)
    except:
        restaurant = get_object_or_404(Restaurant, pk=id)
        restaurant.visited = False
        restaurant.user_reviewed = False

    reviews = Review.objects.filter(restaurant_id=id)


    return render(request, 'restaurants/show.html', {'restaurant': restaurant, 'reviews': reviews})
