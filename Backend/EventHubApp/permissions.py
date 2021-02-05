from rest_framework import permissions
from .models import User, Event, Participation, CafeFollow, ChatThread, ChatMessage


class IsChatOwner(permissions.BasePermission):
    def has_permission(self, request, view, **kwargs):
        try:
            chat = ChatThread.objects.get(id=view.kwargs.get('thread_id'))
        except:
            return self.check_message(request, view)

        if request.user.id == chat.user1.id:
            return True

        if request.user.id == chat.user2.id:
            return True

        return False

    def check_message(self, request, view):
        try:
            thread_id = ChatMessage.objects.get(id=view.kwargs.get('message_id')).thread.id
            chat = ChatThread.objects.get(id=thread_id)
        except:
            return self.check_thread(request)

        if request.user.id == chat.user1.id:
            return True

        if request.user.id == chat.user2.id:
            return True

        return False

    def check_thread(self, request):
        try:
            chat = ChatThread.objects.get(id=request.data.get('thread'))
        except:
            return False

        if request.user.id == chat.user1.id:
            return True

        if request.user.id == chat.user2.id:
            return True

        return False


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
            return self.check_participation_id(request=request, view=view)

        if not request.user.username == user.username:
            return False

        else:
            return True

    def check_participation_id(self, request, view):
        try:
            participation = Participation.objects.get(id=view.kwargs.get('participation_id'))
            user = participation.user
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


class IsParticipant(permissions.BasePermission):
    def has_permission(self, request, view, **kwargs):
        try:
            participation = Participation.objects.filter(event_id=view.kwargs.get('event_id'))
            user = participation[0].user
        except:
            return False

        if not request.user.username == user.username:
            return False

        return True


class IsPrivate(permissions.BasePermission):
    def has_permission(self, request, view, **kwargs):
        try:
            user = User.objects.get(id=view.kwargs.get('id'))

            if not user.is_private or request.user.username == user.username:
                return True

            else:
                followers = CafeFollow.objects.filter(followed=User.objects.get(id=user.id))
                follower = followers.filter(follower=request.user)
                if not len(follower) == 0:
                    return True
        except:
            return False

        return False


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
