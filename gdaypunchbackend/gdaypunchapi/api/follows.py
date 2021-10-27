from rest_framework.response import Response
from rest_framework import viewsets

from ..api_permissions import FollowingPermissions
from ..models import Follow, User
from ..serializers import (
    FollowSerializer,
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
