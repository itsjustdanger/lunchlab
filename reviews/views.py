import json
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseBadRequest, HttpResponseForbidden
from reviews.models import Review
from restaurants.models import Restaurant

def index(request):
    user = request.user if request.user.is_authenticated() else None
    restaurant_id = request.GET.get('restaurant', '')
    reviews = []

    for r in Review.objects.filter(restaurant_id=restaurant_id).prefetch_related('user'):
        review = r.to_json()
        review['isUserReview'] = (user and user.id == r.user_id)
        review['user'] = r.user.lunchprofile.to_json()
        reviews.append(review)

    return JsonResponse(reviews, safe=False)

def show(request, id):
    user = request.user if request.user.is_authenticated() else None
    r = get_object_or_404(Review, id=id)

    review = r.to_json()
    review['isUserReview'] = (user and user.id == r.user_id)

    return JsonResponse(review, safe=False)

def new(request):
    if not request.user.is_authenticated():
        return HttpResponseForbidden

    user = request.user

    data = json.loads(request.body.decode('utf-8'))
    restaurant = get_object_or_404(Restaurant, id=data['restaurantId'])
    review = Review(title=data['title'], body=data['body'], user=user,
                        restaurant=restaurant)

    try:
        review.save()
    except:
        return HttpResponseBadRequest

    return HttpResponse('OK')

def edit(request, id):
    review = get_object_or_404(Review, id=id)
    if not request.user.is_authenticated() or review.user_id != request.user.id:
        return HttpResponseForbidden

    data = json.loads(request.BODY)
    review.title = data['title']
    review.body = data['body']

    try:
        review.save()
    except:
        return HttpResponseBadRequest

def delete(request, id):
    review = get_object_or_404(Review, id=id)
    if not request.user.is_authenticated() or review.user_id != request.user.id:
        return HttpResponseForbidden

    try:
        review.delete()
    except:
        return HttpResponseBadRequest()
