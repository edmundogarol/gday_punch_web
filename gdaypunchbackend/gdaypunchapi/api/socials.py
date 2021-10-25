from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import User, Follow, Friend
from ..serializers import (
    FollowSerializer,
    FriendSerializer,
)
from ..api_permissions import FollowPermissions


class FollowViewSet(ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [FollowPermissions]

    def create(self, request, *args, **kwargs):
        follow_user = request.data.get("user", None)

        if follow_user is None:
            return Response(
                {"error": "No user."}, status=status.HTTP_406_NOT_ACCEPTABLE
            )

        try:
            to_follow = User.objects.get(id=follow_user)
        except User.DoesNotExist:
            return Response(
                {"error": "No user."}, status=status.HTTP_406_NOT_ACCEPTABLE
            )

        user = User.objects.get(email=self.request.user)

        follow = Follow.objects.create(
            follower=user,
            user=to_follow,
        )
        follow.save()

        return Response({"detail": "Successfully followed user."})

    def destroy(self, request, *args, **kwargs):
        try:
            follow = Follow.objects.get(pk=kwargs.get("pk"))
            follow.delete()

            return Response({"detail": "Successfully unfollowed user."})

        except Follow.DoesNotExist:
            return Response(
                {"error": "You are not following this account."},
                status=status.HTTP_406_NOT_ACCEPTABLE,
            )
