from django.db import models
from django.contrib.auth.models import User
from restaurants.models import Restaurant

# Create your models here.
class Review(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reviews')
