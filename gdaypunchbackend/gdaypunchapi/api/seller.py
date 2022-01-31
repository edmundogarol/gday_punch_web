from rest_framework.response import Response
from rest_framework import viewsets, status

from ..api_permissions import SellerPermissions
from ..models import Seller, User
from ..serializers import (
    SellerSerializer,
)


class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer
    permission_classes = [SellerPermissions]

    # def retrieve(self, request, *args, **kwargs):
    #     try:
    #         seller = Seller.objects.get(pk=kwargs.get("pk"))
    #     except Seller.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)

    #     serializer = SellerSerializer(seller)
    #     return Response(serializer.data)
