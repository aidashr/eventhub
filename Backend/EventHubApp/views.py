import django_filters.rest_framework
from rest_condition import And, Or, Not
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics, mixins
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from datetime import datetime

from .serializers import UserSerializer, CafeSerializer, UpdateRegularUserSerializer, UpdateCafeSerializer, \
    ChangePasswordSerializer, EventSerializer, ParticipateSerializer, CafeFollowSerializer, PostParticipateSerializer, \
    CafeFollowersSerializer, UserFollowingsSerializer, LikeSerializer, PostLikeSerializer, CommentSerializer, \
    PostCommentSerializer, PostCommentLikeSerializer, CommentLikeSerializer
from .permissions import IsOwner, IsPrivate
from .models import User, Event, Participation, CafeFollow, EventLike, EventComment, CommentLike, Tags
from .permissions import IsOwner, IsPostRequest, IsPutRequest, IsDeleteRequest, IsGetRequest


class GetTags(generics.GenericAPIView):
    def get(self, request, **kwargs):
        new_data = request.data
        counter = 1

        for tag in Tags:
            new_data.update({'tag' + str(counter): str(tag).split('.')[1]})
            counter += 1

        return Response(new_data, status=status.HTTP_200_OK)


class CommentLikesAPI(generics.GenericAPIView):
    queryset = CommentLike.objects.all()
    permission_classes = [Or(And(IsPostRequest, IsAuthenticated),
                             And(IsDeleteRequest, IsAuthenticated))]

    def post(self, request, **kwargs):
        new_data = {'comment': kwargs.get('comment_id'),
                    'user': request.user.id
                    }

        serializer = PostCommentLikeSerializer(data=new_data)

        comment = EventComment.objects.get(id=new_data.get('comment'))

        if serializer.is_valid():
            comment_like = serializer.save()
            data = {"like_count": comment.like_count + 1}
            update_ser = PostCommentLikeSerializer(comment, data=data, partial=True)

            if update_ser.is_valid():
                update_ser.update(instance=comment, validated_data=data)

            return Response(CommentLikeSerializer(comment_like).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        try:
            if CommentLike.objects.get(id=kwargs.get('like_id')).comment.id != kwargs.get('comment_id'):
                return Response(status=status.HTTP_400_BAD_REQUEST)

            if CommentLike.objects.get(id=kwargs.get('like_id')).user.id != request.user.id:
                return Response(status=status.HTTP_403_FORBIDDEN)

            CommentLike.objects.filter(id=kwargs.get('like_id')).delete()
            comment = EventComment.objects.get(id=kwargs.get('comment_id'))

            data = {"like_count": comment.like_count - 1}

            if comment.like_count == 0:
                data = {"like_count": 0}

            update_ser = PostCommentLikeSerializer(comment, data=data, partial=True)

            if update_ser.is_valid():
                update_ser.update(instance=comment, validated_data=data)

            return Response(status=status.HTTP_200_OK)

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


class CommentAPI(generics.GenericAPIView):
    queryset = EventComment.objects.all()
    permission_classes = [Or(And(IsGetRequest, AllowAny),
                             And(IsPostRequest, IsAuthenticated))]

    def get(self, request, **kwargs):
        comments = EventComment.objects.filter(event_id=kwargs.get('event_id'))
        serializer = CommentSerializer(comments, many=True)
        if str(request.user) == 'AnonymousUser':
            return Response(serializer.data, status=status.HTTP_200_OK)

        new_data = []

        for comment in comments:
            like = CommentLike.objects.filter(comment=comment, user=request.user)

            if len(like) == 0:
                continue

            new_data.append([comment.id, True])

        return Response(serializer.data + new_data, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, **kwargs):
        new_data = {'event': kwargs.get('event_id'),
                    'user': request.user.id,
                    'content': request.data.get('comment')
                    }

        if Participation.objects.filter(event=kwargs.get('event_id'), user=request.user.id):
            new_data.update({'is_participant': True})

        serializer = PostCommentSerializer(data=new_data)

        if serializer.is_valid():
            comment = serializer.save()

            return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LikesAPI(generics.GenericAPIView):
    queryset = EventLike.objects.all()
    permission_classes = [Or(And(IsGetRequest, AllowAny),
                             And(IsPostRequest, AllowAny),
                             And(IsDeleteRequest, IsOwner))]

    def get(self, request, **kwargs):
        post = EventLike.objects.filter(event_id=kwargs.get('event_id'))
        serializer = LikeSerializer(post, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, **kwargs):
        new_data = {'event': kwargs.get('event_id'),
                    'user': request.data.get('user')
                    }

        serializer = PostLikeSerializer(data=new_data)

        event = Event.objects.get(id=new_data.get('event'))

        if serializer.is_valid():
            like = serializer.save()
            data = {"like_count": event.like_count + 1}
            update_ser = PostLikeSerializer(event, data=data, partial=True)

            if update_ser.is_valid():
                update_ser.update(instance=event, validated_data=data)

            return Response(LikeSerializer(like).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        try:
            if EventLike.objects.get(id=kwargs.get('like_id')).event.id != kwargs.get('event_id'):
                return Response(status=status.HTTP_400_BAD_REQUEST)

            EventLike.objects.filter(id=kwargs.get('like_id')).delete()
            event = Event.objects.get(id=kwargs.get('event_id'))

            data = {"like_count": event.like_count - 1}

            if event.like_count == 0:
                data = {"like_count": 0}

            update_ser = PostLikeSerializer(event, data=data, partial=True)

            if update_ser.is_valid():
                update_ser.update(instance=event, validated_data=data)

            return Response(status=status.HTTP_200_OK)

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


class CafeEventsAPI(generics.GenericAPIView):
    def get(self, request, **kwargs):
        try:
            if len(request.query_params) == 0:
                try:
                    events = Event.objects.filter(user=User.objects.get(id=kwargs.get("id")))
                    ser = EventSerializer(events, many=True)
                    return Response(ser.data, status=status.HTTP_200_OK)

                except:
                    return Response(status=status.HTTP_404_NOT_FOUND)

            from_time = request.query_params.get("from")
            from_time = datetime.strptime(from_time, '%Y-%m-%dT%H:%M:%S')

            to_time = request.query_params.get("to")
            to_time = datetime.strptime(to_time, '%Y-%m-%dT%H:%M:%S')

            try:
                events = Event.objects.filter(user_id=kwargs.get('id'))
                event_ser = EventSerializer(events, many=True)
            except:
                return Response(status=status.HTTP_404_NOT_FOUND)

            new_event = event_ser.data

            counter = 0
            for i in range(len(new_event)):
                event_time = str(new_event[i - counter].get('start_time')).split('+')[0]
                event_time = datetime.strptime(event_time, '%Y-%m-%dT%H:%M:%S')

                if not to_time >= event_time >= from_time:
                    new_event.pop(i - counter)
                    counter += 1

            return Response(new_event, status=status.HTTP_200_OK)

        except NameError:
            print(NameError)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RemoveFollowerAPI(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsOwner)

    def delete(self, request, **kwargs):
        try:
            CafeFollow.objects.filter(id=kwargs.get('follower')).delete()
            return Response(status=status.HTTP_200_OK)

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


class GetFollowingsAPI(generics.GenericAPIView, mixins.ListModelMixin):
    permission_classes = [IsPrivate, ]
    queryset = CafeFollow.objects.all()
    serializer_class = UserFollowingsSerializer
    # pagination_class = PageNumberPagination

    def get_queryset(self):
        data = CafeFollow.objects.filter(follower=User.objects.get(id=self.kwargs.get('id')))
        return data

    def get(self, request, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class GetFollowersAPI(generics.GenericAPIView, mixins.ListModelMixin):
    queryset = CafeFollow.objects.all()
    serializer_class = CafeFollowersSerializer
    # pagination_class = PageNumberPagination
    permission_classes = [IsPrivate, ]

    def get_queryset(self):
        data = CafeFollow.objects.filter(followed=User.objects.get(id=self.kwargs.get('id')))
        return data

    def get(self, request, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CafeFollowAPI(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsOwner)

    def post(self, request, **kwargs):
        new_data = {'is_regular': kwargs.get('id'),
                    'cafe': request.data.get('cafe')
                    }
        serializer = CafeFollowSerializer(data=new_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        try:
            CafeFollow.objects.filter(follower=kwargs.get('id'), followed=kwargs.get('cafe')).delete()
            return Response(status=status.HTTP_200_OK)

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


class ParticipantsAPI(generics.GenericAPIView):
    queryset = Participation.objects.all()
    serializer_class = ParticipateSerializer
    permission_classes = [Or(And(IsGetRequest, AllowAny),
                             And(IsPostRequest, AllowAny),
                             And(IsDeleteRequest, IsOwner))]

    def get(self, request, **kwargs):
        post = Participation.objects.filter(event_id=kwargs.get('event_id'))
        serializer = ParticipateSerializer(post, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, **kwargs):
        new_data = {'event': kwargs.get('event_id'),
                    'user': request.data.get('user')
                    }

        serializer = PostParticipateSerializer(data=new_data)

        event = Event.objects.get(id=new_data.get('event'))

        if event.capacity <= event.participants_count:
            return Response({"error": "Can't accept more participants"}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            par = serializer.save()
            data = {"participants_count": event.participants_count + 1}
            update_ser = PostParticipateSerializer(event, data=data, partial=True)

            if update_ser.is_valid():
                update_ser.update(instance=event, validated_data=data)

            return Response(ParticipateSerializer(par).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        try:
            if Participation.objects.get(id=kwargs.get('participation_id')).event.id != kwargs.get('event_id'):
                return Response(status=status.HTTP_400_BAD_REQUEST)

            Participation.objects.filter(id=kwargs.get('participation_id')).delete()
            event = Event.objects.get(id=kwargs.get('event_id'))

            data = {"participants_count": event.participants_count - 1}

            if event.participants_count == 0:
                data = {"participants_count": 0}

            update_ser = PostParticipateSerializer(event, data=data, partial=True)

            if update_ser.is_valid():
                update_ser.update(instance=event, validated_data=data)

            return Response(status=status.HTTP_200_OK)

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', ])
@permission_classes((AllowAny,))
def get_past_events(request, **kwargs):
    try:
        events = Event.objects.filter(user_id=kwargs.get('id'))
        event_ser = EventSerializer(events, many=True)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    new_event = event_ser.data

    counter = 0
    for i in range(len(new_event)):
        if datetime.strptime(str(new_event[i - counter].get('start_time')).split('+')[0], '%Y-%m-%dT%H:%M:%S') > datetime.now():
            new_event.pop(i - counter)
            counter += 1

    return Response(new_event, status=status.HTTP_200_OK)


@api_view(['GET', ])
@permission_classes((AllowAny,))
def get_future_events(request, **kwargs):
    try:
        events = Event.objects.filter(user_id=kwargs.get('id'))
        event_ser = EventSerializer(events, many=True)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    new_event = event_ser.data

    counter = 0
    for i in range(len(new_event)):
        if datetime.strptime(str(new_event[i - counter].get('start_time')).split('+')[0], '%Y-%m-%dT%H:%M:%S') <= datetime.now():
            new_event.pop(i - counter)
            counter += 1

    return Response(new_event, status=status.HTTP_200_OK)


class UserProfile(generics.GenericAPIView):
    permission_classes = [Or(And(IsGetRequest, IsPrivate),
                             And(IsPutRequest, IsOwner))]

    def get(self, request, **kwargs):
        try:
            user = User.objects.get(id=kwargs.get('id'))

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        follower_count = len(CafeFollow.objects.filter(followed=user.id))
        following_count = len(CafeFollow.objects.filter(follower=user.id))

        if user.is_regular:
            ser = UserSerializer(user)

        else:
            ser = CafeSerializer(user)

        new_data = ser.data
        new_data.update({'follower_count': follower_count, 'following_count': following_count})

        return Response(new_data, status=status.HTTP_200_OK)

    def put(self, request, **kwargs):
        try:
            request.data.update({'id': kwargs.get('id')})
            user = User.objects.get(id=kwargs.get('id'))
            request.data.update({'username': user.username})

            if user.is_regular:
                ser = UpdateRegularUserSerializer(user, data=request.data)

            else:
                ser = UpdateCafeSerializer(user, data=request.data)

            if ser.is_valid():
                ser.update(instance=user, validated_data=request.data)
                return Response(ser.data, status=status.HTTP_200_OK)

            else:
                return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', ])
@permission_classes((AllowAny,))
def get_cafes(request):
    try:
        users = User.objects.filter(is_regular=False)
        user_ser = CafeSerializer(users, many=True)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    new_users = user_ser.data

    if len(new_users) > 10:
        for i in range(len(new_users) - 10):
            new_users.pop(0)

    return Response(new_users, status=status.HTTP_200_OK)


@api_view(['GET', ])
@permission_classes((AllowAny,))
def get_events(request):
    try:
        events = Event.objects.all()
        event_ser = EventSerializer(events, many=True)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    new_events = event_ser.data

    if len(new_events) > 10:
        for i in range(len(new_events) - 10):
            new_events.pop(0)

    return Response(new_events, status=status.HTTP_200_OK)


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated, IsOwner)

    def get_object(self, queryset=None):
        self.request.data.update({'id': self.kwargs.get('id')})
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SearchEvent(ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = PageNumberPagination
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ['title', ]

    def get_queryset(self):
        query_set = Event.objects.all()

        try:
            event_ser = EventSerializer(query_set, many=True)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        new_event = event_ser.data

        start_time = self.request.query_params.get('start_time')
        if start_time is not None:
            start_time = datetime.strptime(start_time, '%Y-%m-%dT%H:%M:%S')

            counter = 0
            for i in range(len(new_event)):
                event_time = str(new_event[i - counter].get('start_time')).split('+')[0]
                event_time = datetime.strptime(event_time, '%Y-%m-%dT%H:%M:%S')

                if not start_time <= event_time:
                    query_set = query_set.exclude(id=new_event[i - counter].get('id'))
                    new_event.pop(i - counter)
                    counter += 1

        capacity_count = self.request.query_params.get('capacity_count')
        if capacity_count is not None:
            counter = 0

            for i in range(len(new_event)):
                event_capacity = new_event[i - counter].get('capacity')

                if event_capacity < int(capacity_count):
                    query_set = query_set.exclude(id=new_event[i - counter].get('id'))
                    new_event.pop(i - counter)
                    counter += 1

        tags = self.request.query_params.get('tags')
        if tags is not None:
            tags = tags.split('$')
            counter = 0

            for i in range(len(new_event)):
                event_tags = new_event[i - counter].get('tags')

                if event_tags is not None:
                    event_tags = event_tags.split('$')

                    for tag in tags:
                        has_tag = False

                        for event_tag in event_tags:
                            if tag == event_tag:
                                has_tag = True
                                break

                        if not has_tag:
                            query_set = query_set.exclude(id=new_event[i - counter].get('id'))
                            print(i - counter)
                            new_event.pop(i - counter)
                            counter += 1
                            break

                else:
                    query_set = query_set.exclude(id=new_event[i - counter].get('id'))
                    new_event.pop(i - counter)
                    counter += 1

        return query_set


class SearchCafe(ListAPIView):
    queryset = User.objects.all()
    serializer_class = CafeSerializer
    pagination_class = PageNumberPagination
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ['cafe_name', ]
