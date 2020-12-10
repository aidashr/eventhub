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
    image = models.ImageField(blank=True, null=True)
    start_time = models.DateTimeField(null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)


class Participation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True)
