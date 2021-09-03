import os
import stripe

from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from django.http import HttpResponse
from django.db.models import Q

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
    domain = "https://www.beta-gdaypunch.com"


def calculate_order_amount(customer, items_list):
    order_amount = 0
    subscription_items = []

    for stripe_id in items_list:
        stripe_price = StripePrice.objects.get(id=stripe_id)

        order_amount = order_amount + stripe_price.price_amount

        if stripe_price.price_type == "recurring":
            subscription_items.append({"price", stripe_price.price_id})

        if subscription_items:
            stripe.Subscription.create(
                customer=customer,
                items=subscription_items,
            )

        return int(order_amount * 100)


def get_customer_details(user_email, customer_payload):

    user = None
    customer = None
    gday_stripe_customer = None
    stripe_customer = None

    address_payload = {
        'city': customer_payload['city'],
        'country': customer_payload['country'],
        'line1': customer_payload['address_line_1'],
        'line2': customer_payload['address_line_2'],
        'postal_code': customer_payload['postcode'],
        'state': customer_payload['state'],
    }

    payment_email = customer_payload['email']

    # User Logged In
    if str(user_email) != "AnonymousUser":
        user = User.objects.get(email=user_email)

        # Check if user has a GP_StripeCustomer
        #
        #   - User has purchased through the site logged in
        try:
            gday_stripe_customer = StripeCustomer.objects.get(
                user_id=user.id)
            customer = gday_stripe_customer.customer_id

            # Check if GP_StripeCustomer email matches payment email
            #
            #   - Replace GP_StripeCustomer email with payment email
            if gday_stripe_customer.stripe_email != payment_email:
                gday_stripe_customer.stripe_email = payment_email
                gday_stripe_customer.save()

        except StripeCustomer.DoesNotExist:
            print("User id not associated with GP_StripeCustomer")

        # Check if user email is associated with a GP_StripeCustomer
        #
        #   - User email has been used in purchase through the site
        if customer is None:
            try:
                gday_stripe_customer = StripeCustomer.objects.get(
                    stripe_email=user_email)

                # Check if GP_StripeCustomer has a user associated already
                #
                #   - User email has been used in purchase through the site
                if gday_stripe_customer.user is not None:

                    stripe_customer = StripeCustomer(
                        customer_id=customer.id,
                        stripe_email=payment_email,
                        user=user
                    )

                customer = gday_stripe_customer.customer_id

                gday_stripe_customer.user = user

                # Check if GP_StripeCustomer email matches payment email
                #
                #   - Replace GP_StripeCustomer email with payment email
                if gday_stripe_customer.stripe_email != payment_email:
                    gday_stripe_customer.stripe_email = payment_email
                    gday_stripe_customer.save()

            except StripeCustomer.DoesNotExist:
                print("Email id not associated with GP_StripeCustomer")

        # Check if user email is associated with a previous Stripe purchase (not through new website)
        if customer is None:
            stripe_customer = stripe.Customer.list(
                limit=1, email=user_email)

            if len(stripe_customer.data) > 0:
                customer = stripe_customer.data[0]

    # User Logged Out
    if user is None:
        # Check if email has a GP_StripeCustomer
        #
        #   - Email is associated with a purchase created through the website (logged in)
        try:
            gday_stripe_customer = StripeCustomer.objects.get(
                email=payment_email)
            customer = gday_stripe_customer.customer_id

        except StripeCustomer.DoesNotExist:
            print("User id not associated with GP_StripeCustomer")

    # If email is not in Stripe, create Stripe customer
    if customer is None:
        customer = stripe.Customer.create(
            name=customer_payload['first_name'] +
            " " + customer_payload['last_name'],
            email=customer_payload['email'],
            address=address_payload,
            phone=customer_payload['phone_number'],
            shipping={
                'name': customer_payload['first_name'] +
                " " + customer_payload['last_name'],
                'address': address_payload,
                'phone': customer_payload['phone_number'],
            }
        )

        stripe_customer = StripeCustomer(
            customer_id=customer.id,
            stripe_email=payment_email,
            user=None
        )
        stripe_customer.save()

    return customer


class PaymentSubmitView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):

        try:
            data = request.data
            customer_payload = data['customer_details']
            items_list = data['items']

            customer = get_customer_details(
                self.request.user, customer_payload)

            intent = stripe.PaymentIntent.create(
                amount=calculate_order_amount(customer.id, items_list),
                customer=customer,
                currency='aud',
                receipt_email=customer.email,
                setup_future_usage='off_session',
            )

            content = {
                'clientSecret': intent['client_secret']
            }

        except Exception as e:
            content = {
                'error': str(e)
            }

        return Response(content)

    def delete(self, request, format=None):

        try:
            data = request.data

            intent = stripe.PaymentIntent.cancel(data['payment_intent_id'])
            content = {
                'payment_intent': intent['id']
            }

        except Exception as e:
            content = {
                'error': str(e)
            }

        return Response(content)


class PriceView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):

        name = request.data.get("name", None)
        unit_amount = request.data.get("unit_amount", None)
        price_type = request.data.get("type", None)

        price = stripe.Price.create(
            unit_amount=int(float(unit_amount)*100),
            currency="aud",
            recurring={
                "interval": "month",
                "interval_count": 2,
                "usage_type": "metered"
            } if price_type == "recurring" else None,
            product_data={
                "name": name,
            })

        content = {
            "id": price.id
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

    # Handle payment intent succeeded
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']

        print(payment_intent)

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

        line_items = stripe.checkout.Session.list_line_items(session.id)

        print('session', session)
        print('transaction', transaction)

        print('line_items', line_items)
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

        for price in stripe.Price.list(limit=100):
            stripe_price = None
            price_details = stripe.Price.retrieve(price.id)
            product_details = stripe.Product.retrieve(price_details.product)

            try:
                stripe_price = StripePrice.objects.get(price_id=price.id)
            except:
                print("No price in db: ", price.id)

            if product_details.active:
                product_list.append(
                    {
                        'stripe_id': price_details.id,
                        'name': product_details.name,
                        'type': price_details.type,
                        'price': price_details.unit_amount / 100,
                        'registered': False if stripe_price is None else True
                    }
                )

        return Response(product_list)


class StripePriceViewSet(viewsets.ModelViewSet):
    pagination_class = None
    queryset = StripePrice.objects.all()
    serializer_class = StripePriceSerializer
    permission_classes = [permissions.IsAuthenticated]
