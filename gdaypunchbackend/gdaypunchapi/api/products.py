from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.mixins import UpdateModelMixin

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
        queryset = Product.objects.all().order_by('-id')
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)


class ProductDetailView(UpdateModelMixin, viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def partial_update(self, request, *args, **kwargs):
        queryset = Product.objects.all()
        product = queryset.get(pk=kwargs.get("pk"))
        serializer = ProductSerializer(
            product, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
