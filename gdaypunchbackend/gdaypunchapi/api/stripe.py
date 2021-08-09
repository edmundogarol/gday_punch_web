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

from .orders import (
    handle_create_order
)

if 'DEVENV' in os.environ:
    stripe.api_key = 'sk_test_Z4XLxyrM6xiiRVj54nJv47oU'
    endpoint_secret = 'whsec_Ff0bJ3CeMLroLNsaOroj3n8Wz3mRQPal'
    domain = "http://localhost:8000"
else:
    stripe.api_key = 'sk_live_YXBR1HhTpxIbLVwoMHsP727I'
    domain = "https://www.beta-gdaypunch:com"

# price_type: one_time, recurring


def StripePriceCreator(price):
    prices = []
    name = price.get("name", None)
    unit_amount = price.get("unit_amount", None)
    price_type = price.get("type", None)
    stripe_ids = price.get("stripe_ids", None)
    has_subscription = False

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
    elif stripe_ids is not None:
        for stripe_id in stripe_ids:
            stripe_price = StripePrice.objects.get(id=stripe_id)
            append = True

            if stripe_price.price_type == "recurring":
                has_subscription = True

            if len(prices):
                for entry in prices:
                    if entry['price'] == stripe_price.price_id:
                        prices[prices.index(entry)]['quantity'] = prices[prices.index(
                            entry)]['quantity'] + 1
                        append = False

            if append:
                prices.append({
                    'price': stripe_price.price_id,
                    'quantity': 1 if stripe_price.price_type == "one_time" else None
                })

    return {"prices": prices, "type":  has_subscription}


def get_customer_details(user_email):

    customer = None
    customer_email = None

    gday_stripe_customer = None
    stripe_customer = None

    if str(user_email) != "AnonymousUser":
        user = User.objects.get(email=user_email)

        # Check if user has a GP_StripeCustomer
        try:
            gday_stripe_customer = StripeCustomer.objects.get(
                user_id=user.id)
            customer = gday_stripe_customer.customer_id

        except StripeCustomer.DoesNotExist:
            print("User id not associated with GP_StripeCustomer")
            customer_email = user_email

        if customer is None:
            # Check if user email is associated with a previous stripe purchase
            stripe_customer = stripe.Customer.list(
                limit=1, email=user_email)

            if len(stripe_customer.data) > 0:
                customer = stripe_customer.data[0]

    print("gday_stripe_customer", gday_stripe_customer)
    print("stripe_customer", stripe_customer)
    print("customer", customer)
    print("customer_email", customer_email)

    return {
        'customer': customer,
        'customer_email': customer_email,
    }


class PaymentView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):

        customer_details = get_customer_details(self.request.user)
        customer = customer_details['customer']
        customer_email = customer_details['customer_email']

        price_creator = StripePriceCreator(request.data)
        subscriptionMode = (request.data.get(
            "type", None) == "recurring") or price_creator["type"]

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            billing_address_collection='required',
            shipping_address_collection={
                'allowed_countries': ['AU']
            },
            customer=customer,
            customer_email=customer_email,
            line_items=price_creator["prices"],
            mode='subscription' if subscriptionMode else 'payment',
            success_url=domain+'/',
            cancel_url=request.data.get(
                "previous_url", domain),
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

    # Handle checkout complete
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        customer_id = session.customer
        customer_email = session.customer_details.email
        payment_email_exists = False
        subscription_payment = False
        transaction = None

        shipping = session.shipping.address
        billing = None

        if session.payment_intent is None:
            transaction = stripe.Subscription.retrieve(session.subscription)
            subscription_payment = True
        else:
            transaction = stripe.PaymentIntent.retrieve(session.payment_intent)

        if subscription_payment:
            payment_method = stripe.PaymentMethod.retrieve(
                transaction.default_payment_method)
            billing = payment_method.billing_details.address
        else:
            billing = transaction.charges.data[0].billing_details.address

        print('shipping', shipping)
        print('billing', billing)

        # Get GP_StripeCustomer with checkout email or customer_id
        stripe_customer = StripeCustomer.objects.filter(
            Q(stripe_email=customer_email) | Q(customer_id=customer_id)
        ).first()

        # User is buying a product with an email that exists as a GP_StripeCustomer
        if stripe_customer and stripe_customer.customer_id != transaction.customer:
            stripe_customer = None
            payment_email_exists = True
            print(
                'Unregistered payment email is associated with a GP_StripeCustomer')

        # GP_StripeCustomer is making a payment
        if stripe_customer:
            try:
                # If GP_StripeCustomer is associated with a user
                user = User.objects.get(id=stripe_customer.user_id)

                # If GP_StripeCustomer is using another email - update GP_StripeCustomer
                if stripe_customer.stripe_email != customer_email:
                    stripe_customer.stripe_email = customer_email
                    stripe_customer.save()

                    handle_create_order()

            except User.DoesNotExist:
                print("GP_StripeCustomer not associated with user ")

                stripe_customer.user = None
                stripe_customer.stripe_email = customer_email
                stripe_customer.save()

        else:
            try:
                # If payment email is associated with a user
                user = User.objects.get(email=customer_email)

                # Payment email associated with existing GP_StripeCustomer,
                # delete new payment customer
                if payment_email_exists:
                    stripe_customer = StripeCustomer.objects.get(
                        stripe_email=customer_email)

                    stripe.Customer.delete(transaction.customer)

                else:
                    stripe_customer = StripeCustomer(
                        customer_id=customer_id,
                        stripe_email=customer_email,
                        user=user
                    )
                    stripe_customer.save()

            except User.DoesNotExist:
                print("Payment email is not associated with user ")

                # Payment email associated with existing GP_StripeCustomer,
                # delete new payment customer
                if payment_email_exists:
                    stripe_customer = StripeCustomer.objects.get(
                        stripe_email=customer_email)

                    stripe.Customer.delete(transaction.customer)

                else:
                    stripe_customer = StripeCustomer(
                        customer_id=customer_id,
                        stripe_email=customer_email,
                        user=None
                    )
                    stripe_customer.save()

    else:
        if 'DEVENV' in os.environ:
            print('Unhandled event type {}'.format(event.type))

    return HttpResponse(status=200)


class StripeProductsViewSet(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):

        product_list = []
        stripe_price = None

        for price in stripe.Price.list(limit=100):
            price_details = stripe.Price.retrieve(price.id)
            product_details = stripe.Product.retrieve(price_details.product)

            try:
                stripe_price = StripePrice.objects.get(price_id=price.id)
            except:
                print("No price in db: ", price.id)

            if product_details.active:
                product_list.append(
                    {
                        'price': price_details,
                        'product': product_details,
                        'registered': False if stripe_price is None else True
                    }
                )

        return Response(product_list)


class StripePriceViewSet(viewsets.ModelViewSet):
    pagination_class = None
    queryset = StripePrice.objects.all()
    serializer_class = StripePriceSerializer
    permission_classes = [permissions.IsAuthenticated]
