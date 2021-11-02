from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet

from ..api_permissions import FollowPermissions, FollowingPermissions
from ..models import Follow, User
from ..serializers import (
    FollowSerializer,
)


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

            return Response(to_follow.author_details)

    def destroy(self, request, *args, **kwargs):
        try:
            follow = Follow.objects.get(pk=kwargs.get("pk"))
            was_following = follow.user
            follow.delete()

            return Response(was_following.author_details)

        except Follow.DoesNotExist:
            return Response(
                {"error": "You are not following this account."},
                status=status.HTTP_406_NOT_ACCEPTABLE,
            )


class FollowingViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [FollowingPermissions]

    def retrieve(self, request, *args, **kwargs):
        user = User.objects.get(pk=kwargs.get("pk"))

        following = []
        follows = Follow.objects.all().filter(follower=user.id)
        for follow in follows:
            following.append(follow.user.author_details)

        return Response(following)
