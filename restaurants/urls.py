from django.conf.urls import url
from . import views

urlpatterns = (
    url(r'^$', views.index),
    url(r'^(?P<id>[0-9]+)/$', views.show),
    url(r'^new/$', views.new),
    url(r'^edit/(?P<id>[0-9]+)/$', views.edit),
    url(r'^visit/(?P<id>[0-9]+)/$', views.visit),
    url(r'^thumbs-down/(?P<id>[0-9]+)/$', views.thumbs_down),
)
