from django.urls import path, include
from .api import RegisterAPI, LoginAPI, EventAPI, PostEventAPI, EventRateAPI, ChatAPI, PostChatAPI, UserChatsAPI, \
    EventGroupChatAPI, MessageAPI
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('users/sign-up', RegisterAPI.as_view()),
    path('users/login', LoginAPI.as_view()),
    path('users/<int:id>', views.UserProfile.as_view()),
    path('users/<int:id>/chats', UserChatsAPI.as_view()),
    path('users/<int:id>/events', views.CafeEventsAPI.as_view()),
    path('users/<int:id>/achievements', views.GetAchievements.as_view()),
    path('users/<int:id>/participated-events', views.GetParticipatedEventsAPI.as_view()),
    path('users/<int:id>/future-events', views.get_future_events),
    path('users/<int:id>/past-events', views.get_past_events),
    path('users/<int:id>/change-password', views.ChangePasswordView.as_view(), name='password-update'),
    path('users/<int:id>/following', views.CafeFollowAPI.as_view()),
    path('users/<int:id>/following/<int:cafe>', views.CafeFollowAPI.as_view()),
    path('users/<int:id>/followers', views.GetFollowersAPI.as_view()),
    path('users/<int:id>/followers/<int:follower>', views.RemoveFollowerAPI.as_view()),
    path('users/<int:id>/followings', views.GetFollowingsAPI.as_view()),
    path('users/<int:id>/event/<int:event_id>', EventRateAPI.as_view()),
    path('cafe/latest', views.get_cafes),
    path('event/latest', views.get_events),
    path('event/<int:event_id>', EventAPI.as_view()),
    path('event', PostEventAPI.as_view()),
    path('event/<int:event_id>/participate',  views.ParticipantsAPI.as_view()),
    path('event/<int:event_id>/chat', EventGroupChatAPI.as_view()),
    path('event/<int:event_id>/participate/<int:participation_id>', views.ParticipantsAPI.as_view()),
    path('event/<int:event_id>/like',  views.LikesAPI.as_view()),
    path('event/<int:event_id>/like/<int:like_id>', views.LikesAPI.as_view()),
    path('event/<int:event_id>/comment',  views.CommentAPI.as_view()),
    path('comment/<int:comment_id>/like',  views.CommentLikesAPI.as_view()),
    path('comment/<int:comment_id>/like/<int:like_id>',  views.CommentLikesAPI.as_view()),
    path('event/tags', views.GetTags.as_view()),
    path('event/search', views.SearchEvent.as_view()),
    path('cafe/search', views.SearchCafe.as_view()),
    path('achievements/<str:user_type>', views.GetAllAchievements.as_view()),
    path('chat', PostChatAPI.as_view()),
    path('chat/<int:thread_id>', ChatAPI.as_view()),
    path('message', ChatAPI.as_view()),
    path('message/<int:message_id>', MessageAPI.as_view()),
    path('group-message/<int:message_id>', EventGroupChatAPI.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
