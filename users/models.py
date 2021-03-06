from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from restaurants.models import Restaurant

# Create your models here.
class LunchProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    can_create_restaurants = models.BooleanField(default=False)
    visits = models.ManyToManyField(Restaurant, related_name='visitors')
    thumbsdowns = models.ManyToManyField(Restaurant, related_name='thumbsdown_users')
    avatar = models.ImageField(upload_to="avatars", null=True)

    def to_json(self):
        return {
            'firstName': self.user.first_name,
            'lastName': self.user.last_name,
            'username': self.user.username,
            'avatar': self.avatar.url if self.avatar else '',
        }

@receiver(post_save, sender=User)
def create_lunch_profile(sender, instance, created, **kwargs):
    if created:
        LunchProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_lunch_profile(sender, instance, **kwargs):
    instance.lunchprofile.save()
