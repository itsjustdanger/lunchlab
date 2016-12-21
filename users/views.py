from django.shortcuts import render, reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect

# Create your views here.
def auth(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)

        return HttpResponseRedirect(reverse('index'))
    else:
        return render(request, 'users/sign-in.html',
            {'error_message': 'That username/password combination is not recognized.'})

def sign_out(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

def sign_in(request):
    return render(request, 'users/sign-in.html')

def new(request):
    return render(request, 'users/new.html')

def create(request):
    username = request.POST['username']
    password = request.POST['password']
    first_name = request.POST['first-name']
    last_name = request.POST['last-name']
    email = request.POST['email']
    can_create_restaurants = 'is-admin' in request.POST

    user = User.objects.create_user(username=username, password=password,
            first_name=first_name, last_name=last_name, email=email)
    user.lunchprofile.can_create_restaurants = can_create_restaurants
    user.save()

    if user is not None:
        login(request, user)
        return HttpResponseRedirect(reverse('index'))
    else:
        return render(request, 'users/new.html',
            {'error_message': 'Somethin went wrong...'})
