import os
import datetime
from secrets import token_urlsafe
from next_prev import next_in_order, prev_in_order

from rest_framework import viewsets, permissions, exceptions, authentication, throttling
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import UpdateModelMixin
from rest_framework.permissions import BasePermission
from rest_framework.authentication import SessionAuthentication

from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db.models import Q
from django.db.utils import IntegrityError
from django.contrib.auth import authenticate, login, logout, password_validation
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import Group
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404, get_list_or_404
from django.http import HttpResponse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from .models import (
    User, Manga, Like, Comment, CommentLike, Prompt, ResetPasswordSession
)
from .serializers import (
    UserSerializer,
    GroupSerializer,
    MangaSerializer,
    LikeSerializer,
    PromptSerializer,
    CommentSerializer,
    CommentLikeSerializer,
    ResetPasswordSerializer,
)


class PostOnlyPermissions(BasePermission):
    def has_permission(self, request, view):
        WRITE_METHODS = ["POST", ]

        return (
            request.method in WRITE_METHODS or
            request.user and
            request.user.is_authenticated
        )


class PostUserRateThrottle(throttling.UserRateThrottle):
    scope = "post_user"

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)


class UserViewSet(UpdateModelMixin, viewsets.ViewSet):
    permission_classes = (PostOnlyPermissions, )

    def create(self, validated_data):
        user = None

        try:
            password_validation.validate_password(
                validated_data.data["password"])
        except ValidationError as error:
            content = {"error": error}
            return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)

        try:
            user = User.objects.create_user(
                email=validated_data.data["email"],
                password=validated_data.data["password"],
            )
        except IntegrityError:
            content = {"error": "Duplicate email. User already exists."}
            return Response(content, status=status.HTTP_409_CONFLICT)

        user.set_password(validated_data.data["password"])
        user.save()

        content = {
            "user": str(user),
            "logged_in": True,  # None
        }

        return Response(content)

    def retrieve(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):

        try:
            password_validation.validate_password(
                request.data["password"])
        except ValidationError as error:
            content = {"error": error}
            return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)

        queryset = User.objects.all()
        user = queryset.get(pk=kwargs.get("pk"))
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class LogoutView(APIView):
    authentication_classes = (SessionAuthentication,)

    def get(self, request, format=None):
        logout(request)
        content = {
            "logged_in": False,
        }
        return Response(content)


class LoginView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        if str(self.request.user) != "AnonymousUser":
            user = User.objects.get(email=self.request.user)
            serializer = UserSerializer(user)
            content = {
                "user": serializer.data,
                "logged_in": True,
            }
            return Response(content)
        else:
            content = {
                "logged_in": False,
            }
            return Response(content)

    def post(self, request, format=None):

        email = request.data.get("email", None)
        password = request.data.get("password", None)

        if not email or not password:
            raise exceptions.AuthenticationFailed("No credentials provided.")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed("User does not exist.")

        if user is None or not check_password(password, user.password):
            raise exceptions.AuthenticationFailed("Invalid username/password.")
        else:
            login(request, user)

        if not user.is_active:
            raise exceptions.AuthenticationFailed("User inactive or deleted.")

        user = User.objects.get(email=self.request.user)
        serializer = UserSerializer(user)
        content = {
            "user": serializer.data,
            "logged_in": True,
        }
        return Response(content)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.none()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = User.objects.get(email=self.request.user)
        manga = Manga.objects.get(id=request.data['manga'])

        like = Like.objects.create(
            manga=manga,
            user=user,
        )

        like.save()

        serializer = MangaSerializer(manga)
        return Response(serializer.data)


class CommentLikeViewSet(viewsets.ModelViewSet):
    queryset = CommentLike.objects.none()
    serializer_class = CommentLikeSerializer
    permission_classes = [permissions.IsAuthenticated]


class PromptViewSet(viewsets.ModelViewSet):
    queryset = Prompt.objects.all()
    serializer_class = PromptSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        queryset = Prompt.objects.all().order_by('-id')
        serializer = PromptSerializer(queryset, many=True)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        promptToUnselect = Prompt.objects.get(is_selected=True)
        promptToUnselect.is_selected = False
        promptToUnselect.save()

        queryset = Prompt.objects.all()
        prompt = queryset.get(pk=kwargs.get("pk"))
        prompt.is_selected = True
        prompt.last_selected = datetime.datetime.now()
        prompt.save()
        serializer = PromptSerializer(prompt)
        return Response(serializer.data)


class PromptRandomStylePanelViewSet(viewsets.ModelViewSet):
    queryset = Prompt.objects.none()
    serializer_class = PromptSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        style = Prompt.objects.filter(promptType=2).order_by('?')[:1].get()
        framing = Prompt.objects.filter(promptType=3).order_by('?')[:1].get()
        style_and_framing = " ".join([framing.prompt, style.prompt])

        contributors = style.meta
        if framing.meta != style.meta:
            contributors = " and ".join([framing.meta, style.meta])

        response = {}
        response['prompt'] = style_and_framing
        response['meta'] = contributors
        return Response(response)


class PromptSelectedViewSet(viewsets.ModelViewSet):
    queryset = Prompt.objects.none()
    serializer_class = PromptSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        today = datetime.datetime.now()
        prompt = Prompt.objects.get(is_selected=True)

        try:
            prompt.last_selected.day
        except AttributeError:
            prompt.last_selected = datetime.datetime.now()
            prompt.save()

        if today.day == prompt.last_selected.day:
            serializer = PromptSerializer(prompt)
            return Response(serializer.data)
        else:
            prompt.is_selected = False
            prompt.save()

            next_prompt = next_in_order(prompt)

            if next_prompt is None:
                next_prompt = Prompt.objects.first()

            if (str(next_prompt.promptType) != "subject"):
                while str(next_prompt.promptType) != "subject":
                    next_prompt = next_in_order(next_prompt)

                    if next_prompt is None:
                        next_prompt = Prompt.objects.first()

            next_prompt.is_selected = True
            next_prompt.last_selected = datetime.datetime.now()
            next_prompt.save()

            serializer = PromptSerializer(next_prompt)
            return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    throttle_classes = [PostUserRateThrottle]
    queryset = Comment.objects.none()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, pk=None):
        queryset = Comment.objects.all()
        comment = get_object_or_404(queryset, id=pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)


class MangaCommentsViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def retrieve(self, request, pk=None):
        queryset = Comment.objects.all()
        mangaComments = get_list_or_404(queryset, manga=pk)
        serializer = CommentSerializer(mangaComments, many=True)
        return Response(serializer.data)


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
        manga = queryset.get(pk=kwargs.get("pk"))
        serializer = MangaSerializer(manga, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ResetPasswordViewSet(viewsets.ModelViewSet):
    permission_classes = (PostOnlyPermissions, )

    def create(self, request, *args, **kwargs):
        email = request.data['email']

        if email is None:
            raise exceptions.ValidationError(
                {
                    'email': 'Missing Email field.'
                })

        try:
            validate_email(email)
        except ValidationError as e:
            raise exceptions.ValidationError(
                {
                    'email': 'Invalid format. Check and try again.'
                })

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            return Response(status=status.HTTP_200_OK)

        try:
            reset_session = ResetPasswordSession.objects.get(user=user.id)
            reset_session.token = token_urlsafe(user.id)
            reset_session.created_date = datetime.datetime.now()
            reset_session.save()

            email_template_name = "templates/reset_password_email.txt"
            c = {
                "email": user.email,
                'domain': '127.0.0.1:8000',
                'site_name': 'Website',
                "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                "user": user,
                'token': reset_session.token,
                'protocol': 'http',
            }
            email = render_to_string(email_template_name, c)

            send_mail(
                'Reset Password Request',
                email,
                'noreply@gdaypunch.com',
                [user.email],
                fail_silently=False,
            )

            return Response(status=status.HTTP_200_OK)

        except ResetPasswordSession.DoesNotExist:
            token = token_urlsafe(user.id)
            created_date = datetime.datetime.now()

            reset_session = ResetPasswordSession.objects.create(
                user=user,
                token=token,
                created_date=created_date,
            )
            reset_session.save()

            email_template_name = "templates/reset_password_email.txt"
            c = {
                "email": user.email,
                'domain': '127.0.0.1:8000',
                'site_name': 'Website',
                "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                "user": user,
                'token': token,
                'protocol': 'http',
            }
            email = render_to_string(email_template_name, c)

            send_mail(
                'Reset Password Request',
                email,
                'noreply@gdaypunch.com',
                [user.email],
                fail_silently=False,
            )

        return Response(status=status.HTTP_200_OK)
