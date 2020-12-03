from rest_framework import generics, status
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, UserRegisterSerializer, CafeRegisterSerializer, CafeSerializer, LoginSerializer, \
    EventSerializer

from .models import Event


class EventAPI(generics.GenericAPIView):
    serializer_class = EventSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "event": serializer.data
        })

    def put(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "event": EventSerializer(user, context=self.get_serializer_context()).data
        })

    def get(self, request, *args, **kwargs):
        try:
            event = Event.objects.get(id=kwargs.get('id'))

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        ser = EventSerializer(event)

        return Response(ser.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        event = Event.objects.get(id=kwargs.get('id')).delete()
        ser = EventSerializer(event)
        return Response(ser.data, status=status.HTTP_200_OK)


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
