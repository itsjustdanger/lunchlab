from django.shortcuts import render, reverse, get_object_or_404
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseRedirect

from restaurants.models import Restaurant

def index(request):
    user = request.user if request.user.is_authenticated() else None
    if not user.lunchprofile.can_create_restaurants:
        return HttpResponseForbidden

    restaurants = Restaurant.objects.all()

    return render(request, 'admin/index.html', {'restaurants': restaurants})

def new(request):
    return render(request, 'admin/new.html')

def edit(request, id):
    restaurant = get_object_or_404(Restaurant, id=id)

    return render(request, 'admin/edit.html', {'restaurant': restaurant})

EDITABLE_FIELDS = ['name', 'description']

def create(request):
    id = request.POST['restaurant-id'] if 'restaurant-id' in request.POST else None
    restaurant = Restaurant.objects.get(id=id) if id else Restaurant()

    name = request.POST['name']
    address = request.POST['address']
    description = request.POST['description']
    lat = request.POST['latitude']
    lng = request.POST['longitude']
    image = request.FILES['restaurant-image'] if 'restaurant-image' in request.FILES else None

    if restaurant.id:
        for field in EDITABLE_FIELDS:
            if getattr(restaurant, field) != request.POST[field]:
                setattr(restaurant, field, request.POST[field])

        if image:
            restaurant.image = image

    else:

        restaurant = Restaurant.objects.create(name=name, address=address,
                                            description=description,
                                            lat=lat, lng=lng)
        if image:
            restaurant.image = image

    try:
        restaurant.save()
        return HttpResponseRedirect(reverse('admin-index'))
    except:
        return render(request, 'admin/new.html')
