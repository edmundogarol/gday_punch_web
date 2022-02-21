import stripe
import json
import pytz
import random

from threading import Thread
from datetime import datetime, timedelta
from smtplib import SMTPAuthenticationError

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.shortcuts import get_list_or_404
from django.db.models import Q

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..constants import *
from ..models import (
    Order,
    OrderStatusUpdate,
    Product,
    Seller,
    SellerOrderRef,
    StripeCustomer,
    Customer,
    Purchase,
)
from ..serializers import OrderSerializer, OrderStatusUpdateSerializer
from ..api_permissions import (
    OrdersByUserPermissions,
    OrderStatusUpdatesPermissions,
    OrderDetailsPermissions,
)
from ..utils import (
    AdminOrReadOnly,
    AdminOnly,
)

from gdaypunchbackend.settings import STRIPE_API_KEY, DOMAIN

stripe.api_key = STRIPE_API_KEY


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by("-id")
    serializer_class = OrderSerializer
    permission_classes = (OrdersByUserPermissions,)

    def list(self, request, *args, **kwargs):
        queryset = Order.objects.all().order_by("-id")
        page = self.paginate_queryset(queryset)
        serializer = OrderSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Retrieve all orders for Customer [id]
        """
        if pk == "null":
            return Response(status=status.HTTP_404_NOT_FOUND)

        seller_id = request.GET.get("seller", None)

        if seller_id:
            queryset = SellerOrderRef.objects.all().order_by("-id")
            seller_order_refs = get_list_or_404(queryset, seller_id=seller_id)

            query = Q()
            for order_ref in seller_order_refs:
                query |= Q(id=order_ref.order_id)

            orders = Order.objects.filter(query).order_by("-id")
            page = self.paginate_queryset(orders)
            serializer = OrderSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        queryset = Order.objects.all().order_by("-id")
        orders = get_list_or_404(queryset, customer=pk)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class OrderDetailViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.none()
    serializer_class = OrderSerializer
    permission_classes = (OrderDetailsPermissions,)

    def retrieve(self, request, pk=None):
        order = Order.objects.get(id=pk)
        serializer = OrderSerializer(order)
        return Response(serializer.data)


class OrdersSalesGraph(APIView):
    permission_classes = [AdminOnly]

    def get(self, request, format=None):

        # Fortnightly range
        how_many_days = 14
        orders = Order.objects.filter(
            date_created__gte=datetime.now() - timedelta(days=how_many_days)
        ).order_by("date_created")

        order_sales = {}

        local_tz = pytz.timezone("Australia/Sydney")
        local_dt = datetime.now().replace(tzinfo=pytz.utc).astimezone(local_tz)
        order_sales[local_dt.strftime("%m/%d/%y")] = {"sale": 0}

        for order in orders:
            try:
                existing_key = order_sales[order.date_created.strftime("%m/%d/%y")]
                order_sales[order.date_created.strftime("%m/%d/%y")]["sale"] = float(
                    existing_key["sale"]
                ) + float(order.amount)

            except KeyError:
                order_sales[order.date_created.strftime("%m/%d/%y")] = {
                    "sale": float(order.amount)
                }

        today = datetime.now().replace(tzinfo=pytz.utc).astimezone(local_tz)
        for idx in range(0, 14):
            ref = today - timedelta(days=idx)

            try:
                order_sales[ref.strftime("%m/%d/%y")]
            except KeyError:
                order_sales[ref.strftime("%m/%d/%y")] = {"sale": 0}

        sales_days = []

        for idx in range(0, 14):
            if idx == 7:
                break
            ref = today - timedelta(days=idx)
            last_week_ref = today - timedelta(days=idx + 7)

            sales_days.append(
                [
                    ref.strftime("%a"),
                    order_sales[ref.strftime("%m/%d/%y")]["sale"],
                    order_sales[last_week_ref.strftime("%m/%d/%y")]["sale"],
                ]
            )

        return Response(sales_days[::-1])


class OrderConfirmationViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.none()
    serializer_class = OrderSerializer
    permission_classes = (AdminOrReadOnly,)

    def retrieve(self, request, pk=None):
        try:
            order = Order.objects.get(secret=pk)
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order details cannot be found."},
                status=status.HTTP_404_NOT_FOUND,
            )


def send_email_receipt(customer, order, items):
    email_template_name = "emails/receipt.html"
    all_digital = len(order.address_line_1) < 1

    email_config = {
        "customer": customer,
        "order": order,
        "items": items,
        "order_total": "{:.2f}".format(order.amount),
        "all_digital": all_digital,
        "aus_shipping": order.country == "AU",
        "coupon_desc": order.coupon_details["description"],
        "coupon_amount": "{:.2f}".format(order.coupon_details["discount_amount"])
        if order.coupon
        else None,
        "subtotal": "{:.2f}".format(order.products_total_price),
        "tax": "{:.2f}".format(order.tax),
        "website": DOMAIN,
    }

    try:
        email = render_to_string(email_template_name, email_config)

        send_mail(
            subject="Thank you for your order!",
            message=email,
            html_message=email,
            from_email="Gday Punch Manga Magazine<info@gdaypunch.com.au>",
            recipient_list=[order.email],
            fail_silently=False,
        )

    except SMTPAuthenticationError:
        print("Username and Password not accepted for smtp email config.")


def send_email_purchase_requires_sign_up(customer, order, items):
    email_template_name = "emails/purchase_requires_sign_up.html"
    all_digital = len(order.address_line_1) < 1

    email_config = {
        "customer": customer,
        "order": order,
        "items": items,
        "all_digital": all_digital,
        "website": DOMAIN,
    }

    try:
        email = render_to_string(email_template_name, email_config)

        send_mail(
            subject="Sign up now - You have manga waiting!",
            message=email,
            html_message=email,
            from_email="Gday Punch Manga Magazine<info@gdaypunch.com.au>",
            recipient_list=[order.email],
            fail_silently=False,
        )

    except SMTPAuthenticationError:
        print("Username and Password not accepted for smtp email config.")


def send_email_update(
    customer, order, order_status, items, notes, update_date, partial_refund=None
):
    email_template_name = "emails/update.html"
    subject = None
    subtitle = None
    refunding = False
    refund_amount = order.amount if not partial_refund else partial_refund
    all_digital = len(order.address_line_1) < 1

    if order_status is SHIPPED:
        subject = "Your items have been shipped!"
        subtitle = "Your items have been shipped."
    elif order_status is DECLINED:
        subject = "Your order has been declined."
        subtitle = "Your order has been declined."
    elif order_status is REFUNDED:
        refunding = True
        subject = "Your refund is on the way."
        subtitle = "Your order has been refunded."
    elif order_status is PARTIALLY_REFUNDED:
        refunding = True
        subject = "Your refund is on the way."
        subtitle = "Your order has been partially refunded."

    email_config = {
        "customer": customer,
        "order": order,
        "items": items,
        "notes": notes,
        "update_date": update_date,
        "refunding": refunding,
        "all_digital": all_digital,
        "order_total": "{:.2f}".format(float(refund_amount)),
        "subtitle": subtitle,
        "website": DOMAIN,
    }

    try:
        email = render_to_string(email_template_name, email_config)

        send_mail(
            subject=subject,
            message=email,
            html_message=email,
            from_email="Gday Punch Manga Magazine<info@gdaypunch.com.au>",
            recipient_list=[order.email],
            fail_silently=False,
        )

    except SMTPAuthenticationError:
        print("Username and Password not accepted for smtp email config.")


def generate_order_number():
    order_number = ""
    random_array = random.sample(range(10, 1000), 3)
    for elem in random_array:
        order_number = order_number + str(elem)

    return order_number


def get_order_number():
    order_number = None

    while order_number is None:
        try:
            new_order_number = generate_order_number()
            existing_order = Order.objects.get(number=new_order_number)
        except Order.DoesNotExist:
            order_number = new_order_number

    return order_number


def handle_create_order(
    order_secret,
    stripe_customer,
    customer,
    items,
    amount,
    coupon,
    subscriptions,
    shipping,
    billing,
    billing_same_as_shipping,
    card,
):
    order = None
    item_details = []
    shipping_address = shipping.address
    billing_address = billing.address
    order_number = get_order_number()

    if billing_same_as_shipping:
        order = Order.objects.create(
            customer=stripe_customer,
            amount=amount,
            coupon=coupon,
            date_created=datetime.now(),
            products_qty=items,
            number=order_number,
            secret=order_secret,
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
            number=order_number,
            secret=order_secret,
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
    items = json.loads(items.replace("'", '"'))

    if subscriptions is not None:
        subscriptions = json.loads(subscriptions.replace("'", '"'))

        if subscriptions:
            sub = stripe.Subscription.create(
                customer=stripe_customer.customer_id,
                items=subscriptions,
            )

            stripe_customer.stripe_subscription_id = sub.id
            stripe_customer.save()

    # Update order status for digital purchases only // Calculate item prices and update product stock
    digital_purchase = 0
    for item in order.product_qty_details:
        product = Product.objects.get(id=item["id"])

        # Record customer purchase
        purchase = Purchase.objects.create(customer=customer, product=product)
        order.purchase = purchase
        order.save()

        if product.product_type == DIGITAL:
            digital_purchase = digital_purchase + 1
        elif product.product_type == MAG_SUBSCRIPTION:
            customer.mag_subscribed = True
            customer.save()
        elif product.product_type == DIG_SUBSCRIPTION:
            customer.dig_subscribed = True
            customer.save()
            digital_purchase = digital_purchase + 1
        elif product.product_type == SUBSCRIPTION:
            digital_purchase = digital_purchase + 1
        else:
            product.stock = product.stock - int(item["qty"])
            product.save()

        if product.user.seller_id:

            seller_order_ref_exists = SellerOrderRef.objects.filter(
                seller=product.user.seller_id
            ).filter(order=order.id)

            if seller_order_ref_exists.first() is None:
                seller = Seller.objects.get(id=product.user.seller_id)

                SellerOrderRef.objects.create(
                    seller=seller,
                    order=order,
                )

    if digital_purchase == len(items):
        order.status = PURCHASED
        order.save()

        # Create order purchase status update for all digital purchases
        OrderStatusUpdate.objects.create(
            order=order,
            status=PURCHASED,
            description="Customer charged A${:.2f} on CC ending in {}".format(
                order.amount, order.last_four
            ),
        )
    else:
        # Create order pending status update for items needing shipping
        OrderStatusUpdate.objects.create(
            order=order,
            status=PENDING,
            description="Customer charged A${} on CC ending in {}".format(
                order.amount, order.last_four
            ),
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

    order.date_created = order.date_created.strftime("%d %b %Y")

    Thread(
        target=send_email_receipt,
        args=(
            customer,
            order,
            order.product_qty_details,
        ),
    ).start()

    if customer.user is None and digital_purchase > 0:
        Thread(
            target=send_email_purchase_requires_sign_up,
            args=(
                customer,
                order,
                order.product_qty_details,
            ),
        ).start()


class OrderStatusUpdateViewset(viewsets.ModelViewSet):
    pagination_class = None
    queryset = OrderStatusUpdate.objects.all()
    serializer_class = OrderStatusUpdateSerializer
    permission_classes = (OrderStatusUpdatesPermissions,)

    def retrieve(self, request, pk=None):
        """
        Retrieve all status updates for Order [id]
        """
        queryset = OrderStatusUpdate.objects.all().order_by("-id")
        status_updates = get_list_or_404(queryset, order=pk)
        serializer = OrderStatusUpdateSerializer(status_updates, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        order = Order.objects.get(id=request.data["order"])
        order_status = request.data["status"]
        reasons = request.data.get("reasons", None)
        partial_refund = request.data.get("partial_refund", 0)
        description = None

        stripe_customer = StripeCustomer.objects.get(id=order.customer.id)
        gp_customer = Customer.objects.get(id=stripe_customer.gp_customer.id)

        if order_status == SHIPPED:
            description = (
                "Order x{} shippable items have been shipped. Notes: {}".format(
                    order.total_shippable_items, reasons
                )
            )
            Thread(
                target=send_email_update,
                args=(
                    gp_customer,
                    order,
                    SHIPPED,
                    order.product_qty_details,
                    reasons,
                    datetime.now().strftime("%d %b %Y"),
                ),
            ).start()

        elif order_status == DECLINED:
            description = "Order has been declined due to reasons: {}".format(reasons)
            Thread(
                target=send_email_update,
                args=(
                    gp_customer,
                    order,
                    DECLINED,
                    order.product_qty_details,
                    reasons,
                    datetime.now().strftime("%d %b %Y"),
                ),
            ).start()

        elif order_status == REFUNDED:
            description = "Order has been refunded due to reasons: {}".format(reasons)
            Thread(
                target=send_email_update,
                args=(
                    gp_customer,
                    order,
                    REFUNDED,
                    order.product_qty_details,
                    reasons,
                    datetime.now().strftime("%d %b %Y"),
                ),
            ).start()

        elif order_status == PARTIALLY_REFUNDED:
            description = "Order has been partially refunded [Amount: $A{:.2f}] due to reasons: {}".format(
                float(partial_refund), reasons
            )
            Thread(
                target=send_email_update,
                args=(
                    gp_customer,
                    order,
                    PARTIALLY_REFUNDED,
                    order.product_qty_details,
                    reasons,
                    datetime.now().strftime("%d %b %Y"),
                    partial_refund,
                ),
            ).start()

        like = OrderStatusUpdate.objects.create(
            order=order, status=order_status, description=description
        )
        like.save()

        order.status = order_status
        order.save()

        return Response(
            {"details": "Order status updated."}, status=status.HTTP_201_CREATED
        )
