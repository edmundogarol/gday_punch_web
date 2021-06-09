import os

from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.db.models import Q
from django.http import HttpResponse

import stripe

from ..models import (
    User, StripeCustomer
)

if 'DEVENV' in os.environ:
    stripe.api_key = 'sk_test_Z4XLxyrM6xiiRVj54nJv47oU'
    endpoint_secret = 'whsec_Ff0bJ3CeMLroLNsaOroj3n8Wz3mRQPal'
else:
    stripe.api_key = 'sk_live_YXBR1HhTpxIbLVwoMHsP727I'


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

        subscriptionPrice = stripe.Price.create(
            unit_amount=2333,
            currency="aud",
            recurring={
                "interval": "month",
                "interval_count": 2,
                "usage_type": "metered"
            },
            product_data={
                "name": "Gday Punch Subscription",
            },
        )
        nextIssuePrice = stripe.Price.create(
            unit_amount=2333,
            currency="aud",
            product_data={
                "name": "Gday Punch Next Issue Pre-Order",
            },
        )

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            customer=stripe_customer.customer_id if stripe_customer else None,
            line_items=[
                {'price': subscriptionPrice},
                {'price': nextIssuePrice, 'quantity': 1}
            ],
            mode='subscription',
            success_url='http://localhost:8000/admin',
            cancel_url='https://example.com/cancel',
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

        print("checkout.session.completed")

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
