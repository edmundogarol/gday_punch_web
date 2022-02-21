from rest_framework.response import Response
from rest_framework import viewsets, status

from ..api_permissions import PayoutPermissions, SellerPermissions
from ..models import Seller, User, Payout
from ..serializers import (
    SellerSerializer,
    PayoutSerializer,
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

    def partial_update(self, request, *args, **kwargs):
        queryset = Seller.objects.all()
        seller = queryset.get(pk=kwargs.get("pk"))
        serializer = SellerSerializer(seller, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class PayoutViewSet(viewsets.ModelViewSet):
    queryset = Payout.objects.all().order_by("-id")
    serializer_class = PayoutSerializer
    permission_classes = (PayoutPermissions,)

    def list(self, request, *args, **kwargs):
        if str(self.request.user) != "AnonymousUser":
            user = User.objects.get(email=self.request.user)
        else:
            return Response([])

        admin_view = request.GET.get("admin", None)

        if admin_view and user.is_staff:
            queryset = Payout.objects.all().order_by("-id")
            page = self.paginate_queryset(queryset)
            serializer = PayoutSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        try:
            seller = Seller.objects.get(user_id=user.id)
        except Seller.DoesNotExist:
            return Response({"detail": "Seller not found."}, status.HTTP_404_NOT_FOUND)

        queryset = Payout.objects.filter(seller_id=seller.id).order_by("-id")
        page = self.paginate_queryset(queryset)
        serializer = PayoutSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)
