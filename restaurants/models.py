from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    visitors = models.ManyToManyField(User, through='Visit', related_name='visited_restaurants')

    def __str__(self):
        return self.name

class Visit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
