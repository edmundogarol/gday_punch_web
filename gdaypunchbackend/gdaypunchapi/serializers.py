from django.contrib.auth.models import Group
from rest_framework import serializers
from django.contrib.auth import login
from rest_framework.response import Response
from .models import User, Manga, Like


class UserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
        )

        user.set_password(validated_data['password'])
        user.save()

        content = {
            'user': str(user),
            'logged_in': True,  # None
        }

        return user

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "bio", "location",
                  "birth_date", "roles", "password", "id", "is_staff")
        extra_kwargs = {'password': {'write_only': True}}


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class MangaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manga
        fields = ("id", "title", "author", "pdf", "cover", "likes", "user_likes")


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ("manga", "user")
