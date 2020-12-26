from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    phone_number = models.IntegerField(null=True, unique=True)
    cafe_name = models.CharField(null=True, max_length=100)
    email = models.EmailField(null=True, max_length=254, unique=True)
    is_regular = models.BooleanField(default=False)
    profile_image = models.ImageField(blank=True, null=True)
    cafe_address = models.CharField(null=True, max_length=500)
    is_private = models.BooleanField(default=False)


class Event(models.Model):
    title = models.CharField(null=True, max_length=50)
    description = models.CharField(null=True, max_length=450)
    created_at = models.DateTimeField(auto_now=True, auto_now_add=False)
    capacity = models.IntegerField(null=True, default=10)
    participants_count = models.IntegerField(null=True, default=0)
    image = models.ImageField(blank=True, null=True)
    start_time = models.DateTimeField(null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    like_count = models.IntegerField(null=True, default=0)
    rate = models.FloatField(null=True, default=None)
    rate_count = models.IntegerField(null=True, default=0)


class Participation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True)


class CafeFollow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='regular_user')
    followed = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='cafe')


class EventLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True)


class EventComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True)
    is_participant = models.BooleanField(null=True, default=False)
    content = models.CharField(null=True, max_length=450)
    like_count = models.IntegerField(null=True, default=0)


class CommentLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    comment = models.ForeignKey(EventComment, on_delete=models.CASCADE, null=True)
