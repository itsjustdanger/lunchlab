from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=250, default="")
    description = models.TextField(default="")
    lat = models.DecimalField(max_digits=8, decimal_places=5, default=0)
    lng = models.DecimalField(max_digits=8, decimal_places=5, default=0)
    image = models.ImageField(upload_to='restaurant-images', null=True)

    def __str__(self):
        return self.name

    def to_json(self):
        return ({
            'id': self.id,
            'address': self.address,
            'name': self.name,
            'lat': self.lat,
            'lng': self.lng,
        })
