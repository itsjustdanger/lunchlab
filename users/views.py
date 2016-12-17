from django.shortcuts import render, reverse
from django.contrib.auth import authenticate, login, logout
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
