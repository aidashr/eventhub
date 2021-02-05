from rest_framework import serializers
from .models import User, Event, Participation, CafeFollow, EventLike, EventComment, CommentLike, ChatThread, \
    ChatMessage
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'phone_number', 'is_regular', 'profile_image', 'is_private')


class CafeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'cafe_name',
                  'phone_number', 'is_regular', 'profile_image', 'cafe_address', 'lang', 'lat')


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'phone_number',
                  'is_regular', 'is_private')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)

        return user


class CafeRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'cafe_name', 'phone_number',
                  'cafe_address', 'is_regular', 'lang', 'lat')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class UpdateRegularUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'phone_number', 'is_regular', 'profile_image', 'is_private')

    def update(self, instance, validated_data):
        obj = super().update(instance, validated_data)
        obj.is_regular = True
        obj.save()
        return obj


class UpdateCafeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'cafe_name',
                  'phone_number', 'is_regular', 'profile_image', 'cafe_address')

    def update(self, instance, validated_data):
        obj = super().update(instance, validated_data)
        obj.is_regular = False
        obj.save()
        return obj


class ChangePasswordSerializer(serializers.Serializer):
    model = User
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class EventSerializer(serializers.ModelSerializer):
    user = CafeSerializer()

    class Meta:
        model = Event
        fields = '__all__'


class UpdateEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        depth = 1

    def create(self, validated_data):
        user = User.objects.get(id=self.initial_data.get('user'))
        event = Event.objects.create(**validated_data, user=user)
        return event

    def update(self, instance, validated_data):
        obj = super().update(instance, validated_data)
        obj.is_regular = False
        obj.save()
        return obj


class ParticipateSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Participation
        fields = '__all__'


class ParticipateSerializer2(serializers.ModelSerializer):
    event = EventSerializer()

    class Meta:
        model = Participation
        fields = 'all'


class PostParticipateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participation
        fields = '__all__'


class CafeFollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = CafeFollow
        fields = '__all__'

    def create(self, validated_data):
        user = User.objects.get(id=self.initial_data.get('is_regular'))
        cafe = User.objects.get(id=self.initial_data.get('cafe'))
        cafe_following = CafeFollow.objects.create(**validated_data, follower=user, followed=cafe)
        return cafe_following


class FollowerFollowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'cafe_name', 'first_name', 'last_name', 'profile_image')


class CafeFollowersSerializer(serializers.ModelSerializer):
    follower = FollowerFollowingSerializer()

    class Meta:
        model = CafeFollow
        fields = '__all__'


class UserFollowingsSerializer(serializers.ModelSerializer):
    followed = FollowerFollowingSerializer()

    class Meta:
        model = CafeFollow
        fields = '__all__'


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = EventLike
        fields = '__all__'


class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventLike
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = EventComment
        fields = '__all__'


class PostCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventComment
        fields = '__all__'


class CommentLikeSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = CommentLike
        fields = '__all__'


class PostCommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = '__all__'


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatThread
        fields = '__all__'


class ChatMessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'


class GroupChatMessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'
