from django.shortcuts import render, reverse, get_object_or_404
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseRedirect

from restaurants.models import Restaurant

# Constant for editable 'normal' fields for the restaurant model
EDITABLE_FIELDS = ['name', 'description']

def index(request):
    """ Returns a pre-rendered list of all restaurants. Allows for direct editing of restaurant values and adding new restaurants. Serves as a sort of restaurant admin console.
    """
    user = request.user if request.user.is_authenticated() else None
    if not user.lunchprofile.can_create_restaurants:
        return HttpResponseForbidden

    restaurants = Restaurant.objects.all()

    return render(request, 'admin/index.html', {'restaurants': restaurants})


def new(request):
    """ Returns the basic form for adding new restaurants.
    """
    return render(request, 'admin/new.html')


def edit(request, id):
    """ Retrieves the restaurant model determined by the given id and renders the restaurant edit form pre-populated with the restaurant information.
    """
    restaurant = get_object_or_404(Restaurant, id=id)

    return render(request, 'admin/edit.html', {'restaurant': restaurant})


def delete(requst, id):
    """ Deletes the restaurant model determined by the given id. Redirects to the admin index.
    """
    restaurant = get_object_or_404(Restaurant, id=id)
    restaurant.delete()

    return HttpResponseRedirect(reverse('admin-index'))
    

def create(request):
    """ Create method for process new submitted restaurant data. Handles
    requestsions for both new and edited restaurants and returns either a
    redirect or re-renders the new form.
    """
    if 'restaurant-id' in request.POST:
        id = request.POST['restaurant-id']
    else:
        id = None

    restaurant = Restaurant.objects.get(id=id) if id else Restaurant()

    name = request.POST['name']
    address = request.POST['address']
    description = request.POST['description']
    lat = request.POST['latitude']
    lng = request.POST['longitude']

    if 'restaurant-image' in request.FILES:
        image = request.FILES['restaurant-image']
    else:
        image = None

    if restaurant.id:
        for field in EDITABLE_FIELDS:
            if getattr(restaurant, field) != request.POST[field]:
                setattr(restaurant, field, request.POST[field])
        if image:
            restaurant.image = image
    else:
        restaurant = Restaurant.objects.create(name=name, address=address,
                                    description=description, lat=lat, lng=lng)
        if image:
            restaurant.image = image
    try:
        restaurant.save()
        return HttpResponseRedirect(reverse('admin-index'))
    except:
        return render(request, 'admin/new.html')
