import json
import logging

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseBadRequest
from django.urls import reverse
from restaurants.models import Restaurant

def index(request):
    user = request.user if request.user.is_authenticated() else None
    visited = set(user.lunchprofile.visits.all()) if user else set()
    thumbs_down = set([r.id for r in user.lunchprofile.thumbsdowns.all()]) if user else set()
    restaurants = []

    for r in Restaurant.objects.all():
        if r.id not in thumbs_down:
            restaurants.append({
                'id': r.id,
                'name': r.name,
                'visited': r in visited
            })

    return JsonResponse(restaurants, safe=False)

def show(request, id):
    user = request.user if request.user.is_authenticated() else None

    try:
        r = user.lunchprofile.visits.get(id=id)
        r.visited = True
        r.user_reviewed = Review.objects.filter(user_id=user.id, restuarant_id=id) != None


    except:
        r = get_object_or_404(Restaurant, pk=id)
        r.visited = False
        r.user_reviewed = False
    restaurant = {
        'id': r.id,
        'name': r.name,
        'visited': r.visited
    }

    print ('~~~~>', r.user_reviewed)

    return JsonResponse(restaurant, safe=False)

def new(request):
    data = json.loads(request.BODY)
    restaurant = Restaurant(name=data['name'])

    try:
        restaurant.save()
    except:
        return HttpResponseBadRequest

    return HttpResponse('OK')

def edit(request, id):
    data = json.loads(request.BODY)
    restaurant = get_object_or_404(Restaurant, id=id)

    restaurant.name = data['name']

    try:
        new_restaurant.save()
    except:
        return HttpResponseBadRequest

    return HttpResponse('OK')

def visit(request, id):
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
