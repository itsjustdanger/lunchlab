from django.db import models
from reviews.models import Review
from django.contrib.auth.models import User

class Comment(models.Model):
    body = models.TextField()
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
