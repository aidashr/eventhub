from rest_condition import And, Or, Not
from rest_framework import generics, status, mixins
from rest_framework.decorators import permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from knox.models import AuthToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, UserRegisterSerializer, CafeRegisterSerializer, CafeSerializer, \
    LoginSerializer, EventSerializer, UpdateEventSerializer, ChatMessagesSerializer, ChatSerializer

from .models import Event, User, Tags, ChatMessage, ChatThread
from .permissions import IsOwner, IsPostRequest, IsPutRequest, IsDeleteRequest, IsGetRequest, IsParticipant, IsChatOwner


class CustomNumberPagination(PageNumberPagination):
    page_size = 50


class UserChatsAPI(generics.GenericAPIView):
    serializer_class = ChatSerializer

    def get(self, request, *args, **kwargs):
        return_data = {}

        threads = ChatThread.objects.filter(user1_id=kwargs.get('id'))
        return_data.update(self.chat_info(request, threads))

        threads = ChatThread.objects.filter(user2_id=kwargs.get('id'))
        return_data.update(self.chat_info(request, threads))

        return Response(return_data, status=status.HTTP_200_OK)

    def chat_info(self, request, threads):
        return_data = {}

        for i in range(len(threads)):
            if request.user.id == threads[i].user1.id:
                user = User.objects.get(id=threads[i].user2.id)

                if user.is_regular:
                    user_info = UserSerializer(user)
                    return_data.update({
                        'thread_id' + str(i+1): threads[i].id,
                        'user' + str(i+1): user_info.data
                    })

                else:
                    user_info = CafeSerializer(user)
                    return_data.update({
                        'thread_id' + str(i+1): threads[i].id,
                        'user' + str(i+1): user_info.data
                    })

            else:
                user = User.objects.get(id=threads[i].user1.id)

                if user.is_regular:
                    user_info = UserSerializer(user)
                    return_data.update({
                        'thread_id' + str(i+1): threads[i].id,
                        'user' + str(i+1): user_info.data
                    })

                else:
                    user_info = CafeSerializer(user)
                    return_data.update({
                        'thread_id' + str(i+1): threads[i].id,
                        'user' + str(i+1): user_info.data
                    })

        return return_data


class PostChatAPI(generics.GenericAPIView):
    serializer_class = ChatSerializer

    def get(self, request, *args, **kwargs):
        try:
            user1 = request.user
            user2 = User.objects.get(id=request.query_params.get('user2'))
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        thread = ChatThread.objects.filter(user1=user1, user2=user2)

        if not len(thread) == 0:
            serializer = ChatSerializer(thread.first())
            return Response({
                "chat": serializer.data
            })

        thread = ChatThread.objects.filter(user1=user2, user2=user1)
        if not len(thread) == 0:
            serializer = ChatSerializer(thread.first())
            return Response({
                "chat": serializer.data
            })

        request.data.update({
            'user1': request.user.id
        })
        serializer = ChatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "chat": serializer.data
        })


class ChatAPI(generics.GenericAPIView, mixins.ListModelMixin):
    serializer_class = ChatMessagesSerializer
    queryset = ChatMessage.objects.all()
    pagination_class = CustomNumberPagination
    permission_classes = [Or(And(IsGetRequest, IsChatOwner),
                             And(IsDeleteRequest, IsChatOwner),
                             And(IsPutRequest, IsChatOwner))]

    def get_queryset(self):
        data = ChatMessage.objects.filter(thread_id=self.kwargs.get('thread_id'))
        return data

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        thread_id = request.data.get('thread')
        request.data.update({
            "thread": thread_id,
            "sender": request.user.id
        })
        serializer = ChatMessagesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        try:
            ChatMessage.objects.get(id=kwargs.get('message_id')).delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        request.data.update({
            'id': kwargs.get('message_id')
        })
        ser = ChatMessagesSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.update(instance=ChatMessage.objects.get(id=kwargs.get('message_id')), validated_data=request.data)
        return Response({
            "message": ser.data
        })


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


def validate_tags(tags):
    is_valid = False
    for req_tag in tags:
        for tag in Tags:
            if str(tag).split('.')[1] == req_tag:
                is_valid = True
                break

        if is_valid:
            is_valid = False

        else:
            return False

    return True


class PostEventAPI(generics.GenericAPIView):
    serializer_class = EventSerializer
    permission_classes = (IsAuthenticated, IsOwner)

    def post(self, request, *args, **kwargs):
        tags = request.data.get('tags').split('$')

        if not validate_tags(tags):
            return Response({'error': 'invalid tag'}, status=status.HTTP_400_BAD_REQUEST)

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
        tags = request.data.get('tags')
        if tags is not None:
            tags = tags.split('$')
            if not validate_tags(tags):
                return Response({'error': 'invalid tag'}, status=status.HTTP_400_BAD_REQUEST)

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
