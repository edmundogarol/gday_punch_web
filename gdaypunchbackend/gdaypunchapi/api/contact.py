from rest_framework import viewsets, permissions
from rest_framework.response import Response

from ..utils import PostOnly
from ..models import (
    Contact
)
from ..serializers import (
    ContactSerializer,
)


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = (PostOnly, )

    def list(self, request, *args, **kwargs):
        queryset = Contact.objects.all().order_by('-id')
        serializer = ContactSerializer(queryset, many=True)
        return Response(serializer.data)
