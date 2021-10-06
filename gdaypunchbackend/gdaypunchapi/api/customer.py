import os
import pytz
from threading import Thread
from datetime import datetime
from smtplib import SMTPAuthenticationError

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.mail import send_mail
from django.template.loader import render_to_string

from ..utils import AdminOnly
from ..api_permissions import CustomerPermissions
from ..models import (
    Customer, User, Purchase, Product
)
from ..serializers import (
    CustomerSerializer,
    PurchaseSerializer
)
from ..constants import *


if 'DEVENV' in os.environ:
    domain = "http://localhost:8000"
else:
    domain = "https://www.beta-gdaypunch.com"


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
        subscribed = request.data.get('subscribed', None)
        mag_subscribed = request.data.get('mag_subscribed', None)
        dig_subscribed = request.data.get('dig_subscribed', None)
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

                if subscribed is not None:
                    existingCustomer.subscribed = subscribed
                if mag_subscribed is not None:
                    existingCustomer.mag_subscribed = mag_subscribed
                if dig_subscribed is not None:
                    existingCustomer.dig_subscribed = dig_subscribed

                existingCustomer.save()

                serializer = CustomerSerializer(existingCustomer)
                return Response(serializer.data)

            except User.DoesNotExist:
                return Response({'error': 'User details cannot be found'}, status=status.HTTP_404_NOT_FOUND)

            except Customer.DoesNotExist:
                customer = Customer.objects.create(
                    user=user,
                    email=user.email,
                    subscribed=subscribed,
                    mag_subscribed=mag_subscribed,
                    dig_subscribed=dig_subscribed,
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
                email=request.data['email'].lower(),
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


def send_access_updates_email_summary(customer, granting_items, removing_items, notes):
    email_template_name = "emails/manga_access_update_summary.html"

    if granting_items and not removing_items:
        subject = 'You have been granted access to manga!'
    elif removing_items and not granting_items:
        subject = 'Your access to some manga have been removed.'
    elif removing_items and granting_items:
        subject = 'Your access to some manga have been updated.'

    local_tz = pytz.timezone('Australia/Sydney')
    local_dt = datetime.now().replace(tzinfo=pytz.utc).astimezone(local_tz)

    email_config = {
        "customer": customer.first_name if len(customer.first_name) else customer.email,
        "granting_items": granting_items,
        "removing_items": removing_items,
        "date": local_dt.strftime("%d %b %Y"),
        "subject": subject,
        "notes": notes,
        "website": domain
    }

    try:
        email = render_to_string(email_template_name, email_config)

        send_mail(
            subject=subject,
            message=subject,
            html_message=email,
            from_email='Gday Punch Manga Magazine<edmundo.garol@gdaypunch.com>',
            recipient_list=[customer.email],
            fail_silently=False,
        )

    except SMTPAuthenticationError:
        print("Username and Password not accepted for smtp email config.")


class UpdatedProductPurchasesViewSet(APIView):
    permission_classes = [AdminOnly]

    def post(self, request, format=None):
        customer_id = request.data.get('customer', None)
        updated_products = request.data.get("updated_products", None)
        email_summary = request.data.get("email_summary", None)
        email_notes = request.data.get("email_notes", None)

        for product in updated_products:

            if product.get('removing', None):
                purchase = Purchase.objects.get(id=product['purchase_id'])
                purchase.delete()

                purchases = Purchase.objects.filter(
                    customer=customer_id).filter(product=product['id'])

                for purchase in purchases:
                    purchase.delete()

            elif product.get('granting', None):
                assigning_product = Product.objects.get(id=product['id'])
                assigning_customer = Customer.objects.get(id=customer_id)

                Purchase.objects.create(
                    customer=assigning_customer,
                    product=assigning_product
                )

        if email_summary:
            customer = Customer.objects.get(id=customer_id)

            granting_items = []
            removing_items = []

            for item in updated_products:
                product = Product.objects.get(id=item['id'])

                if item.get('removing', None):
                    removing_items.append(
                        {
                            'id': product.id,
                            'product': {
                                'title': product.title,
                                'image': product.image,
                                'sku': product.sku,
                                'type': product.product_type,
                            },
                        })
                elif item.get('granting', None):
                    granting_items.append(
                        {
                            'id': product.id,
                            'product': {
                                'title': product.title,
                                'image': product.image,
                                'sku': product.sku,
                                'type': product.product_type,
                            },
                        })

            Thread(target=send_access_updates_email_summary, args=(
                customer, granting_items, removing_items, email_notes,)).start()

        return Response(status=status.HTTP_204_NO_CONTENT)
