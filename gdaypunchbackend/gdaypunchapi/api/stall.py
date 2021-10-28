from rest_framework.response import Response
from rest_framework import viewsets, status

from ..api_permissions import FollowingPermissions
from ..models import Follow, User
from ..serializers import (
    FollowSerializer,
)


class StallViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [FollowingPermissions]

    def retrieve(self, request, *args, **kwargs):
        try:
            user = User.objects.get(pk=kwargs.get("pk"))
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        following = []
        follows = Follow.objects.all().filter(follower=user.id)
        for follow in follows:
            following.append(follow.user.author_details)

        content = user.author_details
        content["following_users"] = following
        content["cover"] = user.cover.name
        content["bio"] = user.bio

        return Response(content)
