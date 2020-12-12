from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from datetime import datetime

from .serializers import UserSerializer, CafeSerializer, UpdateRegularUserSerializer, UpdateCafeSerializer, \
    ChangePasswordSerializer, EventSerializer, ParticipateSerializer, CafeFollowSerializer
from .permissions import IsOwner
from .models import User, Event, Participation, CafeFollow


class GetFollowingsAPI(generics.GenericAPIView):
    def get(self, request, **kwargs):
        try:
            user = User.objects.get(id=kwargs.get('id'))
            print(user)
            followings = CafeFollow.objects.filter(follower=user)
            print(followings)
            ser = CafeFollowSerializer(followings, many=True)
            print(ser.data)
            return Response(ser.data, status=status.HTTP_200_OK)

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


class GetFollowersAPI(generics.GenericAPIView):
    def get(self, request, **kwargs):
        try:
            user = User.objects.get(id=kwargs.get('id'))
            print(user)
            followers = CafeFollow.objects.filter(followed=user)
            print(followers)
            ser = CafeFollowSerializer(followers, many=True)
            print(ser.data)
            return Response(ser.data, status=status.HTTP_200_OK)

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


class CafeFollowAPI(generics.GenericAPIView):
    def post(self, request, **kwargs):
        new_data = {'is_regular': kwargs.get('id'),
                    'cafe': kwargs.get('cafe')
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

    def get(self, request, **kwargs):
        print('-')
        post = Participation.objects.filter(event_id=kwargs.get('id'))
        print(post)
        serializer = ParticipateSerializer(post, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ParticipateAPI(generics.GenericAPIView):
    queryset = Participation.objects.all()
    serializer_class = ParticipateSerializer

    def post(self, request, **kwargs):
        new_data = {'event': request.data.get('event'),
                    'user': kwargs.get('id')
                    }

        serializer = ParticipateSerializer(data=new_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


@api_view(['GET', 'PUT'])
@permission_classes((IsAuthenticated, ))
# @permission_classes((IsOwner, IsAuthenticated))
def profile_view(request, **kwargs):
    if request.method == 'GET':
        try:
            user = User.objects.get(id=kwargs.get('id'))

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user.is_regular:
            ser = UserSerializer(user)

        else:
            ser = CafeSerializer(user)

        return Response(ser.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
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
    permission_classes = (IsAuthenticated, )

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


class SearchCafe(ListAPIView):
    queryset = User.objects.all()
    serializer_class = CafeSerializer
    pagination_class = PageNumberPagination
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ['cafe_name', ]
