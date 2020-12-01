from rest_framework import serializers
from .models import User, Event
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
                  'phone_number', 'is_regular', 'profile_image', 'cafe_address')


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'phone_number',
                  'is_regular', 'cafe_address', 'is_private')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)

        return user


class CafeRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'cafe_name', 'phone_number',
                  'cafe_address', 'is_regular')
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
                  'phone_number', 'is_regular', 'profile_image', 'cafe_address', 'is_private')

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
    class Meta:
        model = Event
        fields = '__all__'
        depth = 1

    def create(self, validated_data):
        user = User.objects.get(id=self.context['request'].data.get('user'))
        event = Event.objects.create(**validated_data, user=user)
        return event

    def update(self, instance, validated_data):
        obj = super().update(instance, validated_data)
        obj.is_regular = False
        obj.save()
        return obj
