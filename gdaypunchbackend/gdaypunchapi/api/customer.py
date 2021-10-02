from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from ..api_permissions import CustomerPermissions
from ..models import (
    Customer, User
)
from ..serializers import (
    CustomerSerializer,
)
from ..constants import *


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by('-id')
    serializer_class = CustomerSerializer
    permission_classes = (CustomerPermissions, )

    def list(self, request, *args, **kwargs):
        queryset = Customer.objects.all().order_by('-id')
        search = request.GET.get('search', None)

        if search:
            queryset = queryset.filter(email__icontains=search)

        serializer = CustomerSerializer(queryset, many=True)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        queryset = Customer.objects.all()
        email = request.data.get('email', None)
        user = request.data.get('user', None)
        pk = kwargs.get("pk")

        if not pk or pk == 'null':
            return Response({'error': 'No customer id provided'}, status=status.HTTP_406_NOT_ACCEPTABLE)
        elif pk == 'new':
            try:
                user = User.objects.get(
                    id=user)
                existingCustomer = Customer.objects.get(
                    email=email)

                if existingCustomer.user is None:
                    existingCustomer.user = user
                    existingCustomer.save()

                if existingCustomer.subscribed in [NOT_SUBSCRIBED, UNSUBSCRIBED, CHECKOUT_SUBSCRIBED]:
                    existingCustomer.subscribed = SUBSCRIBED_ONLY
                    existingCustomer.save()

            except User.DoesNotExist:
                return Response({'error': 'User details cannot be found'}, status=status.HTTP_404_NOT_FOUND)

            except Customer.DoesNotExist:
                customer = Customer.objects.create(
                    user=user,
                    email=user.email,
                    subscribed=SUBSCRIBED_ONLY,
                )
                customer.save()

                serializer = CustomerSerializer(customer)
                return Response(serializer.data)

        customer = queryset.get(pk=pk)
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
