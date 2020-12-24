from rest_condition import And, Or, Not
from rest_framework import generics, status
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from knox.models import AuthToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, UserRegisterSerializer, CafeRegisterSerializer, CafeSerializer, \
    LoginSerializer, \
    EventSerializer, UpdateEventSerializer

from .models import Event, User
from .permissions import IsOwner, IsPostRequest, IsPutRequest, IsDeleteRequest, IsGetRequest, IsParticipant


class EventRateAPI(generics.GenericAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsPutRequest, IsOwner, IsParticipant]

    def put(self, request, *args, **kwargs):
        if not 0 < request.data.get('rate') < 6:
            return Response({'error': 'rating must be between 1 to 5'}, status=status.HTTP_400_BAD_REQUEST)

        event = Event.objects.get(id=kwargs.get('event_id'))
        curr_rate = event.rate
        if curr_rate is None:
            curr_rate = 0
        curr_rate_count = event.rate_count
        rate = (curr_rate * curr_rate_count) + request.data.get('rate')
        rate_count = curr_rate_count + 1
        rate = rate / rate_count

        request.data.update({'rate': rate, 'rate_count': rate_count})
        serializer = UpdateEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        updated_event = serializer.update(instance=event, validated_data=request.data)
        return Response({
            "event": EventSerializer(updated_event, context=self.get_serializer_context()).data
        })


class PostEventAPI(generics.GenericAPIView):
    serializer_class = EventSerializer
    permission_classes = (IsAuthenticated, IsOwner)

    def post(self, request, *args, **kwargs):
        serializer = UpdateEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save()
        return Response({
            "event": EventSerializer(event, context=self.get_serializer_context()).data
        })


class EventAPI(generics.GenericAPIView):
    serializer_class = EventSerializer
    permission_classes = [Or(And(IsGetRequest, AllowAny),
                             And(IsPutRequest, IsOwner),
                             And(IsDeleteRequest, IsOwner))]

    def put(self, request, *args, **kwargs):
        serializer = UpdateEventSerializer(data=request.data)
        event = Event.objects.get(id=kwargs.get('event_id'))
        request.data.update({'user': User.objects.get(id=event.user.id)})
        serializer.is_valid(raise_exception=True)
        updated_event = serializer.update(instance=event, validated_data=request.data)
        return Response({
            "event": EventSerializer(updated_event, context=self.get_serializer_context()).data
        })

    def get(self, request, *args, **kwargs):
        try:
            event = Event.objects.get(id=kwargs.get('event_id'))

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        ser = EventSerializer(event)

        return Response(ser.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        Event.objects.get(id=kwargs.get('event_id')).delete()
        return Response(status=status.HTTP_200_OK)


class RegisterAPI(generics.GenericAPIView):

    def post(self, request, *args, **kwargs):
        if request.data.get('is_regular'):
            serializer = UserRegisterSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            return Response({
                "user": UserSerializer(user, context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1]
            })

        else:
            serializer = CafeRegisterSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            return Response({
                "user": CafeSerializer(user, context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1]
            })


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def get(self, request, *args, **kwargs):
        new_data = {'username': request.query_params.get('username'),
                    'password': request.query_params.get('password')
                    }
        serializer = self.get_serializer(data=new_data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        ser = UserSerializer(user)
        return Response({
            "user": ser.data,
            "token": AuthToken.objects.create(user)[1]
        })
