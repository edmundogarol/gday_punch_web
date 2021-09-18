import os
import random
import stripe
import json
import pytz

from threading import Thread
from datetime import datetime
from smtplib import SMTPAuthenticationError

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.shortcuts import get_list_or_404

from rest_framework import viewsets, permissions, status
from rest_framework.permissions import (IsAuthenticated)
from rest_framework.response import Response

from ..constants import *
from ..models import (
    Order, OrderStatusUpdate, Product, Coupon
)
from ..serializers import (
    OrderSerializer, OrderStatusUpdateSerializer
)
from ..api_permissions import (
    OrdersByUserPermissions, OrderStatusUpdatesPermissions, OrderDetailsPermissions
)

if 'DEVENV' in os.environ:
    stripe.api_key = 'sk_test_Z4XLxyrM6xiiRVj54nJv47oU'
    endpoint_secret = 'whsec_Ff0bJ3CeMLroLNsaOroj3n8Wz3mRQPal'
    domain = "http://localhost:8000"
else:
    stripe.api_key = 'sk_live_YXBR1HhTpxIbLVwoMHsP727I'
    domain = "https://www.beta-gdaypunch.com"


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-id')
    serializer_class = OrderSerializer
    permission_classes = (OrdersByUserPermissions, )

    def list(self, request, *args, **kwargs):
        queryset = Order.objects.all().order_by('-id')
        page = self.paginate_queryset(queryset)
        serializer = OrderSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Retrieve all orders for Customer [id]
        """
        queryset = Order.objects.all().order_by('-id')
        orders = get_list_or_404(queryset, customer=pk)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class OrderDetailViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.none()
    serializer_class = OrderSerializer
    permission_classes = (OrderDetailsPermissions, )

    def retrieve(self, request, pk=None):
        order = Order.objects.get(id=pk)
        serializer = OrderSerializer(order)
        return Response(serializer.data)


def send_email_receipt(customer, order, items):
    email_template_name = "emails/receipt.html"

    email_config = {
        "customer": customer,
        "order": order,
        "items": items,
        "order_total": "{:.2f}".format(order.amount),
        "aus_shipping": order.country == "AU",
        "coupon_desc": order.coupon_details['description'],
        "coupon_amount": "{:.2f}".format(order.coupon_details['discount_amount']) if order.coupon else None,
        "subtotal": "{:.2f}".format(order.products_total_price),
        "tax": "{:.2f}".format(order.tax),
        "website": domain
    }

    try:
        email = render_to_string(email_template_name, email_config)

        send_mail(
            subject='Thank you for your order!',
            message='Thank you for your order!',
            html_message=email,
            from_email='noreply@gdaypunch.com',
            recipient_list=[order.email],
            fail_silently=False,
        )

    except SMTPAuthenticationError:
        print("Username and Password not accepted for smtp email config.")


def generate_order_number():
    order_number = ''
    random_array = random.sample(range(10, 1000), 3)
    for elem in random_array:
        order_number = order_number + str(elem)

    return order_number


def handle_create_order(stripe_customer, customer, items, amount, coupon, subscriptions,
                        shipping, billing, billing_same_as_shipping, card):
    fmt = '%Y-%m-%d %H:%M:%S'

    order = None
    item_details = []
    use_order_number = None
    shipping_address = shipping.address
    billing_address = billing.address

    while use_order_number is None:
        try:
            new_order_number = generate_order_number()
            existing_order = Order.objects.get(number=new_order_number)
        except Order.DoesNotExist:
            use_order_number = new_order_number

    if billing_same_as_shipping:
        order = Order.objects.create(
            customer=stripe_customer,
            amount=amount,
            coupon=coupon,
            date_created=datetime.now(),
            products_qty=items,
            number=use_order_number,
            email=stripe_customer.stripe_email,
            first_name=customer.first_name,
            last_name=customer.last_name,
            address_line_1=shipping_address.line1,
            address_line_2=shipping_address.line2,
            city=shipping_address.city,
            state=shipping_address.state,
            postcode=shipping_address.postal_code,
            country=shipping_address.country,
            phone_number=shipping.phone,
            last_four=card.last4,
            exp_month=card.exp_month,
            exp_year=card.exp_year,
        )
        order.save()
    else:
        order = Order.objects.create(
            customer=stripe_customer,
            amount=amount,
            coupon=coupon,
            date_created=datetime.now(),
            products_qty=items,
            number=use_order_number,
            email=stripe_customer.stripe_email,
            first_name=customer.first_name,
            last_name=customer.last_name,
            address_line_1=shipping_address.line1,
            address_line_2=shipping_address.line2,
            city=shipping_address.city,
            state=shipping_address.state,
            postcode=shipping_address.postal_code,
            country=shipping_address.country,
            phone_number=shipping.phone,
            billing_same_address=False,
            billing_email=billing.email,
            billing_first_name=billing.name,
            billing_last_name="",
            billing_address_line_1=billing_address.line1,
            billing_address_line_2=billing_address.line2,
            billing_city=billing_address.city,
            billing_state=billing_address.state,
            billing_postcode=billing_address.postal_code,
            billing_country=billing_address.country,
            billing_number=billing.phone,
            last_four=card.last4,
            exp_month=card.exp_month,
            exp_year=card.exp_year,
        )
        order.save()

    # Handle subscriptions update
    items = json.loads(items.replace("\'", "\""))

    if subscriptions is not None:
        subscriptions = json.loads(subscriptions.replace("\'", "\""))

        if subscriptions:
            stripe.Subscription.create(
                customer=stripe_customer.customer_id,
                items=subscriptions,
            )

            if len(subscriptions) == len(items):
                order.status = PENDING  # Subscription will always include a pre-order of the next issue
                order.save()

    # Update order status for digital purchases only // Calculate item prices and update product stock
    digital_purchase = 0
    for item in items:
        product = Product.objects.get(id=item['id'])

        item_details.append({'desc': product.title, 'price': product.active_price,
                            'qty': item['qty'], 'total': int(item['qty']) * product.active_price})

        product.stock = product.stock - int(item['qty'])
        product.save()

        if product.product_type == DIGITAL:
            digital_purchase = digital_purchase + 1

    if digital_purchase == len(items):
        order.status = PURCHASED
        order.save()

        # Create order purchase status update for all digital purchases
        OrderStatusUpdate.objects.create(
            order=order,
            status=PURCHASED,
            description="Customer charged A${:.2f} on CC ending in {}".format(
                order.amount, order.last_four)
        )
    else:
        # Create order pending status update for items needing shipping
        OrderStatusUpdate.objects.create(
            order=order,
            status=PENDING,
            description="Customer charged A${} on CC ending in {}".format(
                order.amount, order.last_four)
        )

    # Temporarily copy shipping details to billing for receipt email
    if order.billing_same_address:
        order.billing_email = order.email
        order.billing_first_name = order.first_name
        order.billing_last_name = order.last_name
        order.billing_address_line_1 = order.address_line_1
        order.billing_address_line_2 = order.address_line_2
        order.billing_city = order.city
        order.billing_state = order.state
        order.billing_postcode = order.postcode
        order.billing_country = order.country
        order.billing_number = order.phone_number

    order.date_created = order.date_created.strftime("%m/%d/%Y")

    Thread(target=send_email_receipt, args=(
        customer, order, item_details,)).start()


class OrderStatusUpdateViewset(viewsets.ModelViewSet):
    pagination_class = None
    queryset = OrderStatusUpdate.objects.all()
    serializer_class = OrderStatusUpdateSerializer
    permission_classes = (OrderStatusUpdatesPermissions, )

    def retrieve(self, request, pk=None):
        """
        Retrieve all status updates for Order [id]
        """
        queryset = OrderStatusUpdate.objects.all().order_by('-id')
        status_updates = get_list_or_404(queryset, order=pk)
        serializer = OrderStatusUpdateSerializer(status_updates, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        order = Order.objects.get(id=request.data['order'])
        order_status = request.data['status']
        reasons = request.data.get("reasons", None)
        description = 'Order x{} shippable items have been shipped.'.format(
            order.total_shippable_items)

        if order_status == DECLINED:
            description = 'Order has been declined due to reasons: {}'.format(
                reasons)
        elif order_status == REFUNDED:
            description = 'Order has been refunded due to reasons: {}'.format(
                reasons)
        elif order_status == PARTIALLY_REFUNDED:
            description = 'Order has been partially refunded due to reasons: {}'.format(
                reasons)

        like = OrderStatusUpdate.objects.create(
            order=order,
            status=order_status,
            description=description
        )
        like.save()

        order.status = order_status
        order.save()

        return Response({'details': 'Order status updated.'}, status=status.HTTP_201_CREATED)
