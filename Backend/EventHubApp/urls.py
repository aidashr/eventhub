from django.urls import path, include
from .api import RegisterAPI, LoginAPI, EventAPI
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('users/sign-up', RegisterAPI.as_view()),
    path('users/login', LoginAPI.as_view()),
    path('users/<int:id>', views.profile_view),
    path('users/<int:id>/participate', views.ParticipateAPI.as_view()),
    path('users/<int:id>/future-events', views.get_future_events),
    path('users/<int:id>/past-events', views.get_past_events),
    path('users/<int:id>/change-password', views.ChangePasswordView.as_view(), name='password-update'),
    path('cafe/lastest', views.get_cafes),
    path('event/lastest', views.get_events),
    path('event/<int:id>', EventAPI.as_view()),
    # path('event/<int:id>/participants',  views.ParticipanatsAPI.as_view()),
    path('event/search', views.SearchEvent.as_view()),
    path('cafe/search', views.SearchCafe.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
