from django.urls import path, include
from .api import RegisterAPI, RegisterAPI2, LoginAPI, PostEvent
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('Users/regular/sign-up', RegisterAPI.as_view()),
    path('Users/cafe/sign-up', RegisterAPI2.as_view()),
    path('Users/login', LoginAPI.as_view()),
    path('Users/profile', views.profile_view),
    path('Users/change-password', views.ChangePasswordView.as_view(), name='password-update'),
    path('main-page', views.get_cafes),
    path('Users/event', PostEvent.as_view()),
    path('search-event', views.SearchEvent.as_view()),
    path('search-cafe', views.SearchCafe.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
