from django.db import models
from django.contrib.auth.models import User
from restaurants.models import Restaurant

# Create your models here.
class RestaurantVisit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
