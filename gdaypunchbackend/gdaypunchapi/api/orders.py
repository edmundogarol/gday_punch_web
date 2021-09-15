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
from ..api_permissions import OrdersByUserPermissions
from ..models import (
    Order, Product, Coupon
)
from ..serializers import (
    OrderSerializer
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
        serializer = OrderSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Retrieve all orders for Customer [id]
        """
        queryset = Order.objects.all().order_by('-id')
        orders = get_list_or_404(queryset, customer=pk)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


def send_email_receipt(customer, order, items, coupon_details):
    email_template_name = "emails/receipt.html"

    total = order.amount
    subtotal = order.amount if order.country == "AU" else order.amount - 13
    subtotal = subtotal + \
        coupon_details['amount'] if coupon_details else subtotal

    email_config = {
        "customer": customer,
        "order": order,
        "items": items,
        "order_total": "{:.2f}".format(total),
        "aus_shipping": order.country == "AU",
        "coupon_percentage": coupon_details['percentage'] if coupon_details else None,
        "coupon_amount": "{:.2f}".format(coupon_details['amount']) if coupon_details else None,
        "coupon_amount_desc": coupon_details['amount_desc'] if coupon_details else None,
        "subtotal": "{:.2f}".format(subtotal),
        "tax": "{:.2f}".format(total / 11),
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
                order.status = PURCHASED
                order.save()

    # Update order status for digital purchases only // Calculate item prices
    total_items_price = 0
    digital_purchase = 0
    for item in items:
        product = Product.objects.get(id=item['id'])

        item_details.append({'desc': product.title, 'price': product.active_price,
                            'qty': item['qty'], 'total': int(item['qty']) * product.active_price})
        total_items_price = total_items_price + \
            (int(item['qty']) * product.active_price)

        if product.product_type == DIGITAL:
            digital_purchase = digital_purchase + 1

    if digital_purchase == len(items):
        order.status = PURCHASED
        order.save()

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

    coupon_details = None
    if coupon:
        current_coupon = Coupon.objects.get(name=coupon)

        if current_coupon.coupon_type == "percentage":
            coupon_details = {
                'amount_desc': current_coupon.amount,
                'percentage': current_coupon.coupon_type == "percentage",
                'amount': (current_coupon.amount / 100) * total_items_price
            }
        else:
            coupon_details = {
                'amount_desc': current_coupon.amount,
                'percentage': current_coupon.coupon_type == "percentage",
                'amount': current_coupon.amount
            }

    order.date_created = order.date_created.strftime("%m/%d/%Y")

    Thread(target=send_email_receipt, args=(
        customer, order, item_details, coupon_details,)).start()
