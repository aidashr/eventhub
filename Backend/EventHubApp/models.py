from django.db import models
from django.contrib.auth.models import AbstractUser
from enum import Enum


class User(AbstractUser):
    phone_number = models.IntegerField(null=True, unique=True)
    cafe_name = models.CharField(null=True, max_length=100)
    email = models.EmailField(null=True, max_length=254, unique=True)
    is_regular = models.BooleanField(default=False)
    profile_image = models.ImageField(blank=True, null=True)
    cafe_address = models.CharField(null=True, max_length=1000)
    is_private = models.BooleanField(default=False)
    lang = models.FloatField(null=True, default=0)
    lat = models.FloatField(null=True, default=0)


class Event(models.Model):
    title = models.CharField(null=True, max_length=50)
    description = models.CharField(null=True, max_length=1500)
    created_at = models.DateTimeField(auto_now=True, auto_now_add=False)
    capacity = models.IntegerField(null=True, default=10)
    participants_count = models.IntegerField(null=True, default=0)
    image = models.ImageField(blank=True, null=True)
    start_time = models.DateTimeField(null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    like_count = models.IntegerField(null=True, default=0)
    rate = models.FloatField(null=True, default=None)
    rate_count = models.IntegerField(null=True, default=0)
    tags = models.CharField(null=True, max_length=450)


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
    like_count = models.IntegerField(null=True, default=0)


class CommentLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    comment = models.ForeignKey(EventComment, on_delete=models.CASCADE, null=True)


class Tags(Enum):
    video_game = 'video game'
    board_game = 'board game'
    game = 'game'
    movie_review = 'movie review'
    book_review = 'book review'
    sport_event = 'sports events'


class UserAchievement(Enum):
    event_participation = 'Participated events$1, 3, 7, 15, 25, 60'
    user_likes = 'Liked posts$3, 5, 10, 20, 30, 40, 60'
    user_comments = 'Comments on posts$1, 3, 7, 15, 30, 50'


class CafeAchievement(Enum):
    make_event = 'Number of events$1, 5, 12, 25 '
    having_participants = 'Participants in your events$5, 10, 20'
    post_likes = 'Likes on posts$10, 20, 40, 100, 300, 500 '
    followers = 'Number of followers$5, 10, 20, 40, 100'


class ChatThread(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='user2')


class ChatMessage(models.Model):
    thread = models.ForeignKey(ChatThread, on_delete=models.CASCADE, null=True)
    message = models.CharField(null=True, max_length=1500)
    is_read = models.BooleanField(null=True, default=False)
    created_at = models.DateTimeField(auto_now=True, auto_now_add=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='sender')
    reply_of = models.IntegerField(null=True)


class GroupChatMessage(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True)
    message = models.CharField(null=True, max_length=1500)
    is_read = models.BooleanField(null=True, default=False)
    created_at = models.DateTimeField(auto_now=True, auto_now_add=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='user')
    reply_of = models.IntegerField(null=True)
