import datetime
from next_prev import next_in_order
from secrets import token_urlsafe
from threading import Thread

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.throttling import UserRateThrottle
from rest_framework.response import Response
from rest_framework.mixins import UpdateModelMixin
from rest_framework.authentication import SessionAuthentication

from rest_framework.viewsets import (ViewSet, ModelViewSet)
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import (
    AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly, BasePermission)

from django.db.models import Q
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from django.contrib.auth import login, logout, password_validation
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404, get_list_or_404
from django.http import HttpResponse

from .utils import PostOnlyPermissions
from .api.verify_account import send_account_verification_email
from .models import (
    User, Manga, Like, Comment, CommentLike, Prompt
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


class PostUserRateThrottle(UserRateThrottle):
    scope = "post_user"

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)


class UserViewSet(UpdateModelMixin, ViewSet):
    permission_classes = (PostOnlyPermissions, )

    def create(self, validated_data):
        user = None

        if not validated_data.data["password"] or not validated_data.data["email"]:
            content = {"error": "Please provide both email and password."}
            return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)

        try:
            password_validation.validate_password(
                validated_data.data["password"])
        except ValidationError as error:
            content = {"error": error}
            return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)

        try:
            user = User.objects.create_user(
                email=validated_data.data["email"].lower(),
                password=validated_data.data["password"],
            )
        except IntegrityError:
            content = {"error": "Duplicate email. User already exists."}
            return Response(content, status=status.HTTP_409_CONFLICT)

        user.verified = token_urlsafe(user.id)
        user.set_password(validated_data.data["password"])
        user.save()

        Thread(target=send_account_verification_email,
               args=(user, user.verified,)).start()

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


class GroupViewSet(ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]


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
    permission_classes = [AllowAny]

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
            raise AuthenticationFailed("No credentials provided.")

        try:
            user = User.objects.get(email=email.lower())
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid username/password.")

        if user is None or not check_password(password, user.password):
            raise AuthenticationFailed("Invalid username/password.")
        else:
            login(request, user)

        if not user.is_active:
            raise AuthenticationFailed("User inactive or deleted.")

        user = User.objects.get(email=self.request.user)
        serializer = UserSerializer(user)
        content = {
            "user": serializer.data,
            "logged_in": True,
        }
        return Response(content)


class LikeViewSet(ModelViewSet):
    queryset = Like.objects.none()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

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


class CommentLikeViewSet(ModelViewSet):
    queryset = CommentLike.objects.none()
    serializer_class = CommentLikeSerializer
    permission_classes = [IsAuthenticated]


class PromptViewSet(ModelViewSet):
    queryset = Prompt.objects.all()
    serializer_class = PromptSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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


class PromptRandomStylePanelViewSet(ModelViewSet):
    queryset = Prompt.objects.none()
    serializer_class = PromptSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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


class PromptSelectedViewSet(ModelViewSet):
    queryset = Prompt.objects.none()
    serializer_class = PromptSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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


class CommentViewSet(ModelViewSet):
    throttle_classes = [PostUserRateThrottle]
    queryset = Comment.objects.none()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, pk=None):
        queryset = Comment.objects.all()
        comment = get_object_or_404(queryset, id=pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)


class MangaCommentsViewSet(ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def retrieve(self, request, pk=None):
        queryset = Comment.objects.all()
        mangaComments = get_list_or_404(queryset, manga=pk)
        serializer = CommentSerializer(mangaComments, many=True)
        return Response(serializer.data)


class MangaViewSet(ModelViewSet):
    queryset = Manga.objects.none()
    serializer_class = MangaSerializer
    permission_classes = [IsAuthenticated]

    def get_user(self):
        return self.request.user

    def list(self, request, *args, **kwargs):
        author = User.objects.get(email=self.get_user())
        queryset = Manga.objects.all().filter(author=author)
        serializer = MangaSerializer(queryset, many=True)
        return Response(serializer.data)


class MangaDetailView(UpdateModelMixin, ViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]

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
