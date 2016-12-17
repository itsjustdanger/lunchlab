from django.conf.urls import url
from . import views

urlpatterns = [
    # url(r'^new/$', views.new, name='new'),
    url(r'^auth/$', views.auth, name='auth'),
    url(r'^sign-out/$', views.sign_out, name='sign-out'),
    url(r'^sign-in/$', views.sign_in, name='sign-in'),
    url(r'^new/$', views.new, name='sign-up'),
    url(r'^create/$', views.create, name='create'),
]
