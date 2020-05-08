from django.contrib.auth.models import Group
from rest_framework import viewsets, permissions, exceptions, authentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, get_user_model, login
from django.contrib.auth.hashers import check_password
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from .serializers import UserSerializer, GroupSerializer
from .models import User


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class LoginView(APIView):
    authentication_classes = (SessionAuthentication,)

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

        content = {
            'user': str(request.user),
            'logged_in': True,  # None
        }
        return Response(content)
