from django.urls import path, include
from .api import RegisterAPI, LoginAPI, PostEvent
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('users/sign-up', RegisterAPI.as_view()),
    path('users/login', LoginAPI.as_view()),
    path('users/profile', views.profile_view),
    path('users/change-password', views.ChangePasswordView.as_view(), name='password-update'),
    path('cafe/main-page', views.get_cafes),
    path('event/main-page', views.get_events),
    path('users/event', PostEvent.as_view()),
    path('event/search', views.SearchEvent.as_view()),
    path('cafe/search', views.SearchCafe.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
