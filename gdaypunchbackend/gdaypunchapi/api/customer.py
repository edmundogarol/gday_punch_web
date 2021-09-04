from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from ..utils import PostOnlyPermissions
from ..models import (
    Customer, User
)
from ..serializers import (
    CustomerSerializer,
)


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = (PostOnlyPermissions, )

    def partial_update(self, request, *args, **kwargs):
        queryset = Customer.objects.all()
        customer = queryset.get(pk=kwargs.get("pk"))
        serializer = CustomerSerializer(
            customer, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        loggedIn = str(self.request.user) != "AnonymousUser"
        user = None

        if loggedIn:
            user = User.objects.get(email=self.request.user)

        try:
            existingCustomer = Customer.objects.get(
                email=request.data['email'])

            if existingCustomer.user is None:
                existingCustomer.user = user
                existingCustomer.save()

            return Response({}, status=status.HTTP_208_ALREADY_REPORTED)

        except Customer.DoesNotExist:
            customer = Customer.objects.create(
                user=user if user is not None else None,
                subscribed=request.data['subscribed'],
                email=request.data['email'],
                first_name=request.data['first_name'],
                last_name=request.data['last_name'],
                address_line_1=request.data['address_line_1'],
                address_line_2=request.data['address_line_2'],
                city=request.data['city'],
                state=request.data['state'],
                postcode=request.data['postcode'],
                country=request.data['country'],
                phone_number=request.data['phone_number'],
            )

            customer.save()
            serializer = CustomerSerializer(customer)

            return Response(serializer.data)
