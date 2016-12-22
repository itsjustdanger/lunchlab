from django.shortcuts import render, reverse
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
    pass

def create(request):
    name = request.POST['name']
    address = request.POST['address']
    description = request.POST['description']
    lat = request.POST['latitude']
    lng = request.POST['longitude']

    restaurant = Restaurant.objects.create(name=name, address=address,
                                            description=description,
                                            lat=lat, lng=lng)

    try:
        restaurant.save()
        return HttpResponseRedirect(reverse('admin-index'))
    except:
        return render(request, 'admin/new.html')
