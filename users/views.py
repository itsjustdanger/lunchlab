from django.shortcuts import render, reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
import uuid

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

EDITABLE_FIELDS = ['first_name', 'last_name', 'email']

def create(request):
    user = request.user if request.user.is_authenticated() else None

    username = request.POST['username']
    password = request.POST['password']
    first_name = request.POST['first_name']
    last_name = request.POST['last_name']
    email = request.POST['email']
    avatar = request.FILES['user-image'] if 'user-image' in request.FILES else None
    can_create_restaurants = 'is-admin' in request.POST

    if user:
        for field in EDITABLE_FIELDS:
            if getattr(user, field) != request.POST[field]:
                setattr(user, field, request.POST[field])

        if avatar:
            user.lunchprofile.avatar.save((str(uuid.uuid1()) + '.png'), avatar)
        if password:
            user.set_password(password)
    else:
        user = User.objects.create_user(username=username, password=password,
                first_name=first_name, last_name=last_name, email=email)
        user.lunchprofile.can_create_restaurants = can_create_restaurants
        if avatar:
            user.lunchprofile.avatar.save(str(uuid.uuid1()), avatar)

    user.save()

    if user is not None:
        login(request, user)
        return HttpResponseRedirect(reverse('index'))
    else:
        return render(request, 'users/new.html',
            {'error_message': 'Something went wrong...'})

def edit(request):
    user = request.user if request.user.is_authenticated() else None

    if not user:
        return HttpResponseRedirect(reverse('sign-up'))

    return render(request, 'users/edit.html', {'user': user})
