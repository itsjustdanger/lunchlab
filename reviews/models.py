from django.db import models
from django.contrib.auth.models import User
from restaurants.models import Restaurant

# Create your models here.
class Review(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reviews')
    user_name = models.CharField(max_length=200, null=True)
    user_avatar_url = models.URLField(null=True)

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'body': self.body,
            'userId': self.user_id,
            'restaurantId': self.restaurant_id,
            'userName': self.user_name,
            'userAvatarUrl': self.user_avatar_url if self.user_avatar_url else '',
        }
