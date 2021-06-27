import os

from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from django.db.models import Q
from django.http import HttpResponse

import stripe

from ..models import (
    User, StripeCustomer, StripePrice
)

from ..serializers import (
    StripePriceSerializer
)

if 'DEVENV' in os.environ:
    stripe.api_key = 'sk_test_Z4XLxyrM6xiiRVj54nJv47oU'
    endpoint_secret = 'whsec_Ff0bJ3CeMLroLNsaOroj3n8Wz3mRQPal'
else:
    stripe.api_key = 'sk_live_YXBR1HhTpxIbLVwoMHsP727I'

# price_type: one_time, recurring


def StripePriceCreator(price):
    prices = []
    name = price.get("name", None)
    unit_amount = price.get("unit_amount", None)
    price_type = price.get("type", None)
    stripe_ids = price.get("stripe_ids", None)

    if name is not None:
        prices.append({
            'price': stripe.Price.create(
                unit_amount=int(float(unit_amount)*100),
                currency="aud",
                recurring={
                    "interval": "month",
                    "interval_count": 2,
                    "usage_type": "metered"
                } if price_type == "recurring" else None,
                product_data={
                    "name": name,
                }),
            'quantity': 1 if price_type == "one_time" else None
        })
    else:
        for stripe_id in stripe_ids:
            stripe_price = stripe.Price.retrieve(stripe_id)
            prices.append({
                'price': stripe_id,
                'quantity': 1 if stripe_price.type == "one_time" else None
            })

    return prices


class PaymentView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):

        stripe_customer = None

        if str(self.request.user) != "AnonymousUser":
            try:
                stripe_customer = StripeCustomer.objects.get(
                    stripe_email=self.request.user)
            except StripeCustomer.DoesNotExist:
                print("User email not associated with Stripe customer")

            try:
                user = User.objects.get(email=self.request.user)
                stripe_customer = StripeCustomer.objects.get(
                    user_id=user.id)
            except StripeCustomer.DoesNotExist:
                print("User id not associated with Stripe customer")

        prices = StripePriceCreator(request.data)
        subscriptionMode = request.data.get("type", None) == "recurring"

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            customer=stripe_customer.customer_id if stripe_customer else None,
            line_items=prices,
            mode='subscription' if subscriptionMode else 'payment',
            success_url='http://localhost:8000/admin',
            cancel_url=request.data.get(
                "previous_url", 'http://localhost:8000'),
        )

        content = {
            "id": session.id,
        }

        return Response(content)


def PaymentsWebhookHandler(request):
    payload = request.body
    event = None

    try:
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']

        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
        # Invalid signature
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)
    except KeyError:
        return HttpResponse(status=400)

    # Handle stripe payment
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        customer_id = session.customer
        customer_email = session.customer_details.email
        stripe_customer = None
        user = None

        # Retrieve and subscribe GdayPunch User (from payment email)
        stripe_customer = StripeCustomer.objects.filter(
            Q(stripe_email=customer_email) | Q(customer_id=customer_id)
        ).first()

        user = User.objects.filter(
            Q(email=customer_email) | Q(
                id=stripe_customer.user_id if stripe_customer else None)
        ).first()

        if user:
            user.subscribed = True
            user.save()

        # Retrieve and update existing Stripe customer or create new
        if stripe_customer:
            stripe_customer.user = user or None
            stripe_customer.stripe_email = customer_email
            stripe_customer.save()

        else:
            stripe_customer = StripeCustomer(
                customer_id=session.customer,
                stripe_email=customer_email,
                user=user if user else None
            )
            stripe_customer.save()

    else:
        if 'DEVENV' in os.environ:
            print('Unhandled event type {}'.format(event.type))

    return HttpResponse(status=200)


class StripeProductsViewSet(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):

        product_list = []

        for price in stripe.Price.list(limit=10):
            price_details = stripe.Price.retrieve(price.id)
            product_details = stripe.Product.retrieve(price_details.product)

            stripe_price = StripePrice.objects.filter(price_id=price.id)

            if product_details.active:
                product_list.append(
                    {
                        'price': price_details,
                        'product': product_details,
                        'registered': False if not stripe_price else True
                    }
                )

        return Response(product_list)


class StripePriceViewSet(viewsets.ModelViewSet):
    queryset = StripePrice.objects.all()
    serializer_class = StripePriceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
