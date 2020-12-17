from rest_framework import permissions
from .models import User, Event



class IsOwner(permissions.BasePermission):
    def has_permission(self, request, view, **kwargs):
        try:
            user = User.objects.get(id=view.kwargs.get('id'))
        except:
            return self.check_request(request=request, view=view)

        if not request.user.username == user.username:
            return False

        else:
            return True

    def check_request(self, request, view):
        try:
            user = User.objects.get(id=request.data.get('user'))
        except:
            return self.check_event_owner(request=request, view=view)

        if not request.user.username == user.username:
            return False

        else:
            return True

    def check_event_owner(self, request, view):
        try:
            event = Event.objects.get(id=view.kwargs.get('event_id'))
            user = event.user
        except:
            return False

        if not request.user.username == user.username:
            return False

        else:
            return True


class IsPostRequest(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method == "POST"


class IsPutRequest(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method == "PUT"


class IsGetRequest(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method == "GET"


class IsDeleteRequest(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method == "DELETE"
