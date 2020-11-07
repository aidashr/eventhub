from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import UserSerializer, UserSerializer2, UpdateRegularUserSerializer, UpdateCafeSerializer, ChangePasswordSerializer
from .permissions import IsOwner
from .models import User


@api_view(['GET', 'PUT'])
@permission_classes((IsOwner, IsAuthenticated))
def profile_view(request):
    if request.method == 'GET':
        try:
            user = User.objects.get(username=request.data.get('username'))

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user.RegularUser:
            ser = UserSerializer(user)

        else:
            ser = UserSerializer2(user)

        return Response(ser.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        try:
            user = User.objects.get(username=request.data.get('username'))

            if user.RegularUser:
                ser = UpdateRegularUserSerializer(user, data=request.data)

            else:
                ser = UpdateCafeSerializer(user, data=request.data)

            if ser.is_valid():
                ser.save()
                return Response(ser.data, status=status.HTTP_200_OK)

            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', ])
@permission_classes((AllowAny,))
def get_cafes(request):
    try:
        users = User.objects.filter(CafesUser=True)
        ser = UserSerializer2(users, many=True)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    return Response(ser.data, status=status.HTTP_200_OK)


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated, IsOwner)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
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
