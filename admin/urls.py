from django.conf.urls import url
from . import views

urlpatterns = (
    url(r'^$', views.index, name='admin-index'),
    url(r'^new/$', views.new, name='new-restaurant'),
    url(r'^create/$', views.create, name='create-restaurant'),
    url(r'^edit/(?P<id>[0-9]+)$', views.edit, name='edit-restaurant'),
    url(r'^delete/(?P<id>[0-9]+)$', views.delete, name='delete-restaurant'),
)
