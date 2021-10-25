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

        try:
            follow = Follow.objects.get(
                follower=user,
                user=to_follow,
            )

            return Response(
                {"error": "Already following"}, status=status.HTTP_208_ALREADY_REPORTED
            )

        except Follow.DoesNotExist:
            follow = Follow.objects.create(
                follower=user,
                user=to_follow,
            )
            follow.save()

            return Response(
                {
                    "id": to_follow.id,
                    "name": to_follow.author_name,
                    "image": to_follow.image.name,
                    "likes": to_follow.total_manga_likes,
                    "friends": to_follow.friends,
                    "followers": to_follow.followers,
                    "following": to_follow.following,
                }
            )

    def destroy(self, request, *args, **kwargs):
        try:
            follow = Follow.objects.get(pk=kwargs.get("pk"))
            was_following = follow.user
            follow.delete()

            return Response(
                {
                    "id": was_following.id,
                    "name": was_following.author_name,
                    "image": was_following.image.name,
                    "likes": was_following.total_manga_likes,
                    "friends": was_following.friends,
                    "followers": was_following.followers,
                    "following": was_following.following,
                }
            )

        except Follow.DoesNotExist:
            return Response(
                {"error": "You are not following this account."},
                status=status.HTTP_406_NOT_ACCEPTABLE,
            )
