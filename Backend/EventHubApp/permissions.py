from rest_framework import permissions
from .models import User


class IsOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            user = User.objects.get(username=request.query_params.get('username'))
        except:
            return False

        if not request.query_params.get('username') == user.username:
            return False

        else:
            return True
            return True