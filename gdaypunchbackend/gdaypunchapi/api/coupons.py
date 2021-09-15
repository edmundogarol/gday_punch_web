from datetime import datetime

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import (IsAuthenticated)

from ..utils import (
    PostOnly
)
from ..models import (
    Coupon
)
from ..serializers import (
    CouponSerializer,
)
from ..utils import (
    AdminOnly,
)


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = (AdminOnly, )


class CouponApplyViewSet(viewsets.ViewSet):
    permission_classes = (PostOnly, )

    @action(detail=False, methods=['post'], url_path='apply')
    def apply(self, request, *args, **kwargs):
        data = request.data
        coupon = data['coupon']

        try:
            existing_coupon = Coupon.objects.get(name=coupon)

            if existing_coupon.expiry_date < datetime.now():
                return Response({'error': 'Expired or invalid Coupon.'},  status=status.HTTP_404_NOT_FOUND)

            serializer = CouponSerializer(existing_coupon)
            return Response(serializer.data)

        except Coupon.DoesNotExist:
            return Response({'error': 'Expired or invalid coupon.'},  status=status.HTTP_404_NOT_FOUND)
