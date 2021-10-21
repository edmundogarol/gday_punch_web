
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..utils import (
    visitor_ip_address,
    AdminOnly,
    PostOnly,
    AdminOrReadOnly,
    AuthenticatedCreateOnly,
    AuthenticatedCreateAndEditOnly
)
from ..models import (
    User, Settings
)
from ..serializers import (
    SettingsSerializer,
)

class SettingsViewSet(ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer
    permission_classes = [AdminOnly]

    def list(self, request, *args, **kwargs):
        settings = Settings.objects.all().order_by('-id').first()
        serializer = SettingsSerializer(settings)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        queryset = Settings.objects.all()
        settings = queryset.get(pk=kwargs.get("pk"))
        serializer = SettingsSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)