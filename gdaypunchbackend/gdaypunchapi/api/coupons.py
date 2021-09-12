from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import (IsAuthenticated)

from ..utils import PostOnlyPermissions
from ..models import (
    Coupon
)
from ..serializers import (
    CouponSerializer,
)


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = (IsAuthenticated, )


class CouponApplyViewSet(viewsets.ViewSet):
    permission_classes = (PostOnlyPermissions, )

    @action(detail=False, methods=['post'], url_path='apply')
    def apply(self, request, *args, **kwargs):
        permission_classes = (PostOnlyPermissions, )
        data = request.data
        coupon = data['coupon']

        try:
            existing_coupon = Coupon.objects.get(name=coupon)
            print(existing_coupon, existing_coupon.name)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon.'},  status=status.HTTP_404_NOT_FOUND)
