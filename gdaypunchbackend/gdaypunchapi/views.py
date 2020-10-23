from rest_framework import viewsets, permissions, exceptions, authentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import UpdateModelMixin

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import Group
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from django.shortcuts import get_object_or_404
from django_currentuser.middleware import (get_current_user, get_current_authenticated_user)
from django_currentuser.db.models import CurrentUserField

from .serializers import UserSerializer, GroupSerializer, MangaSerializer, LikeSerializer, CommentSerializer
from .models import User, Manga, Like, Comment


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.none()
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class LogoutView(APIView):
    authentication_classes = (SessionAuthentication,)

    def get(self, request, format=None):
        logout(request)
        content = {
            'logged_in': False,
        }
        return Response(content)


class LoginView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        if str(self.request.user) != 'AnonymousUser':
            user = User.objects.get(email=self.request.user)
            serializer = UserSerializer(user)
            content = {
                'user': serializer.data,
                'logged_in': True,
            }
            return Response(content)
        else:
            content = {
                'logged_in': False,
            }
            return Response(content)

    def post(self, request, format=None):

        email = request.data.get('email', None)
        password = request.data.get('password', None)

        if not email or not password:
            raise exceptions.AuthenticationFailed('No credentials provided.')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('User does not exist.')

        if user is None or not check_password(password, user.password):
            raise exceptions.AuthenticationFailed(
                'Invalid username/password.')
        else:
            login(request, user)

        if not user.is_active:
            raise exceptions.AuthenticationFailed('User inactive or deleted.')

        user = User.objects.get(email=self.request.user)
        serializer = UserSerializer(user)
        content = {
            'user': serializer.data,
            'logged_in': True,
        }
        return Response(content)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.none()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.none()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]


class MangaViewSet(viewsets.ModelViewSet):
    queryset = Manga.objects.none()
    serializer_class = MangaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_user(self):
        return self.request.user

    def list(self, request, *args, **kwargs):
        author = User.objects.get(email=self.get_user())
        queryset = Manga.objects.all().filter(author=author)
        serializer = MangaSerializer(queryset, many=True)
        return Response(serializer.data)


class MangaDetailView(UpdateModelMixin, viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def retrieve(self, request, pk=None):
        queryset = Manga.objects.all()
        manga = get_object_or_404(queryset, pk=pk)
        serializer = MangaSerializer(manga)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        queryset = Manga.objects.all()
        manga = queryset.get(pk=kwargs.get('pk'))
        serializer = MangaSerializer(manga, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)