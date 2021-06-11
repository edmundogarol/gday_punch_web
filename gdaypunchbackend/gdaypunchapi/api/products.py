from rest_framework import viewsets, permissions
from rest_framework.response import Response

from ..models import (
    Product
)
from ..serializers import (
    ProductSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        queryset = Product.objects.all()
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)
