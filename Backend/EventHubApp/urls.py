from django.urls import path, include
from .api import RegisterAPI, RegisterAPI2, LoginAPI, PostEvent
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/user/signup', RegisterAPI.as_view()),
    path('api/cafe/signup', RegisterAPI2.as_view()),
    path('api/all-users/login', LoginAPI.as_view()),
    path('api/all-users/information', views.profile_view),
    path('api/all-users/password-update', views.ChangePasswordView.as_view(), name='password-update'),
    path('api/main-page', views.get_cafes),
    path('api/post-event', PostEvent.as_view()),
    path('api/edit-event', views.edit_event),
    path('api/search-event', views.SearchEvent.as_view()),
    path('api/search-cafe', views.SearchCafe.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
