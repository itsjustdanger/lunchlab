import json
import logging

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.urls import reverse
from restaurants.models import Restaurant

def index(request):
    """ Returns JSON list of restaurants that are not thumbs down-ed by the
    current authenticated user (returns full list if no user). Tags restaurants
    as 'visited' if they have been marked as visited by the current user.
    """
    user = request.user if request.user.is_authenticated() else None
    visited = set(user.lunchprofile.visits.all()) if user else set()
    thumbs_down = set([r.id for r in user.lunchprofile.thumbsdowns.all()]) if user else set()
    restaurants = []

    for r in Restaurant.objects.all():
        if r.id not in thumbs_down:
            restaurant = r.to_json()
            restaurant['visited'] = r in visited
            restaurants.append(restaurant)

    return JsonResponse(restaurants, safe=False)

def show(request, id):
    """ Returns JSON object of restaurant requested by id. Tags restaurant as
    visited if the user has marked the restaurant as visited and tags the
    restaurant as user_reviewed if the user has submitted a review for the
    restaurant.
    """
    user = request.user if request.user.is_authenticated() else None

    try:
        r = user.lunchprofile.visits.get(id=id)
        restaurant = r.to_json()
        restaurant['visited'] = True
        restaurant['user_reviewed'] = Review.objects.filter(user_id=user.id, restuarant_id=id) != None
    except:
        r = get_object_or_404(Restaurant, pk=id)
        restaurant = r.to_json()
        restaurant['visited'] = False
        restaurant['user_reviewed'] = False

    return JsonResponse(restaurant, safe=False)

def new(request):
    """ Accepts JSON object for a new restaurant and saves it to the database.
    Checks if user is both authenticated and authorized to create restaurants.
    """
    user = request.user if request.user.is_authenticated() else None
    if not user.lunchprofile.can_create_restaurants:
        return HttpResponseForbidden

    data = json.loads(request.BODY)
    restaurant = Restaurant(name=data['name'])

    try:
        restaurant.save()
    except:
        return HttpResponseBadRequest

    return HttpResponse('OK')

def edit(request, id):
    """ Accepts JSON object for editing an existing restaurant by requested id
    and saves changes to the database.
    """
    data = json.loads(request.BODY)
    restaurant = get_object_or_404(Restaurant, id=id)

    restaurant.name = data['name']

    try:
        new_restaurant.save()
    except:
        return HttpResponseBadRequest

    return HttpResponse('OK')

def visit(request, id):
    """ Accepts a basic POST request to asynchronously (on the front-end) mark
    a restaurant as 'visited' by a given user. Adds the restaurant to the user's
    visited restaurants.
    """
    user = request.user if request.user.is_authenticated() else None
    restaurant = get_object_or_404(Restaurant, pk=id)

    if user:
        user.lunchprofile.visits.add(restaurant)

        try:
            user.save()
            return HttpResponse('OK')
        except:
            return HttpResponseBadRequest()

    return HttpResponseBadRequest()

def thumbs_down(request, id):
    """ Accepts a basic POST request to asynchronously (on the front-end) mark a restaurant as 'thumb-down'ed by a user. This prevents restaurants from being displayed in recommendation lists.
    """
    user = request.user if request.user.is_authenticated() else None
    restaurant = get_object_or_404(Restaurant, id=id)

    if user:
        user.lunchprofile.thumbsdowns.add(restaurant)

        try:
            user.save()
            return HttpResponse('OK')
        except:
            return HttpResponseBadRequest()

    return HttpResponseBadRequest()
