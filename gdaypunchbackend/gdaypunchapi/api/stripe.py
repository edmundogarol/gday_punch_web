import os
import stripe

from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action

from django.http import HttpResponse
from django.db.models import Q

from ..models import (
    User, StripeCustomer, StripePrice, Customer, Order, Product
)

from ..serializers import (
    StripePriceSerializer, OrderSerializer
)

from .orders import (
    handle_create_order
)

from ..utils import (
    PostOnlyPermissions
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

    for product in items_list:
        current_product = Product.objects.get(id=product['id'])

        qty = 0
        while qty < product['qty']:
            for stripe_price in current_product.stripe_prices.all():

                if stripe_price.price_type == "recurring":
                    subscription_items.append({'price': stripe_price.price_id})
                else:
                    order_amount = order_amount + stripe_price.price_amount

            qty = qty + 1

    return {
        'amount': int(order_amount * 100),
        'subscriptions': subscription_items
    }


def get_gp_customer(email, customer_payload, subscribe_type):
    user = None
    existing_customer = None

    try:
        user = User.objects.get(email=email)

    except User.DoesNotExist:
        print('Guest Checkout - No user with payment email')

    try:
        existing_customer = Customer.objects.get(email=email)

        if existing_customer.user is None:
            existing_customer.user = user
            existing_customer.save()

        if (existing_customer.postcode != customer_payload['postcode']
                or existing_customer.address_line_1 != customer_payload['address_line_1']):
            existing_customer.subscribed = subscribe_type
            existing_customer.first_name = customer_payload['first_name']
            existing_customer.last_name = customer_payload['last_name']
            existing_customer.address_line_1 = customer_payload['address_line_1']
            existing_customer.address_line_2 = customer_payload['address_line_2']
            existing_customer.city = customer_payload['city']
            existing_customer.state = customer_payload['state']
            existing_customer.postcode = customer_payload['postcode']
            existing_customer.country = customer_payload['country']
            existing_customer.phone_number = customer_payload['phone_number']
            existing_customer.save()

        return existing_customer

    except Customer.DoesNotExist:
        print('Customer with details does not exist')

    gp_customer = Customer.objects.create(
        user=user if user is not None else None,
        subscribed=subscribe_type,
        email=customer_payload['email'],
        first_name=customer_payload['first_name'],
        last_name=customer_payload['last_name'],
        address_line_1=customer_payload['address_line_1'],
        address_line_2=customer_payload['address_line_2'],
        city=customer_payload['city'],
        state=customer_payload['state'],
        postcode=customer_payload['postcode'],
        country=customer_payload['country'],
        phone_number=customer_payload['phone_number'],
    )
    gp_customer.save()

    return gp_customer


def get_customer_details(user_email, customer_payload):

    user = None
    stripe_customer_id = None
    gday_stripe_customer = None
    stripe_customer = None
    gp_customer = None

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
    #
    #   - payment_email is ALWAYS User email when logged in.
    # (It is unique and has been checked through server validation/verification)
    if str(user_email) != "AnonymousUser":
        user = User.objects.get(email=user_email)

        gp_customer = get_gp_customer(
            payment_email, customer_payload, 'purchased_subscribed')

        # Check if user has a GP_StripeCustomer
        #
        #   - User has purchased through the site logged in
        try:
            gday_stripe_customer = StripeCustomer.objects.get(
                user_id=user.id)

            stripe_customer_id = gday_stripe_customer.customer_id

            # Check if GP_StripeCustomer email matches payment email
            #
            #   - User has changed email through Account - update GP_StripeCustomer
            if gday_stripe_customer.stripe_email != payment_email:
                gday_stripe_customer.stripe_email = payment_email
                gday_stripe_customer.save()

        except StripeCustomer.DoesNotExist:
            print("User not associated with GP_StripeCustomer")

        # ====> Logged in User has not purchased through website
        # Check if payment email is associated with a GP_StripeCustomer
        #
        #   - Payment Email has been used to purchase through the site
        if stripe_customer_id is None:
            try:
                gday_stripe_customer = StripeCustomer.objects.get(
                    stripe_email=payment_email)

                stripe_customer_id = gday_stripe_customer.customer_id
                # Check if GP_StripeCustomer has email and no user
                #
                #   - Payment email has been used in purchase through the site
                if gday_stripe_customer.user is None:
                    gday_stripe_customer.user = user
                    gday_stripe_customer.save()

                else:
                    print(
                        "GP_StripeCustomer has an email and user, that is not the current logged in User")

            except StripeCustomer.DoesNotExist:
                print("Payment email not associated with GP_StripeCustomer")

        # Check if payment email is associated with a previous Stripe purchase (not through new website)
        if stripe_customer_id is None:
            stripe_customer = stripe.Customer.list(
                limit=1, email=payment_email)

            if len(stripe_customer.data) > 0:
                stripe_customer = stripe_customer.data[0]

                new_stripe_customer = StripeCustomer(
                    customer_id=stripe_customer.id,
                    stripe_email=payment_email,
                    user=user,
                    gp_customer=gp_customer
                )
                new_stripe_customer.save()
                stripe_customer_id = new_stripe_customer.customer_id

    # User Logged Out
    if user is None:

        try:
            user = User.objects.get(email=payment_email)

        except User.DoesNotExist:
            print("Guest email not associated with user")

        gp_customer = get_gp_customer(
            payment_email, customer_payload, 'purchased_subscribed')

        # Check if email has a GP_StripeCustomer
        #
        #   - Email is associated with a purchase created through the website (logged in)
        try:
            gday_stripe_customer = StripeCustomer.objects.get(
                stripe_email=payment_email)
            gday_stripe_customer.user = user
            gday_stripe_customer.save()

            stripe_customer_id = gday_stripe_customer.customer_id

        except StripeCustomer.DoesNotExist:
            print("User id not associated with GP_StripeCustomer")

        # Check if payment email is associated with a previous Stripe purchase (not through new website)
        if stripe_customer_id is None:
            stripe_customer = stripe.Customer.list(
                limit=1, email=payment_email)

            if len(stripe_customer.data) > 0:
                stripe_customer = stripe_customer.data[0]

                new_stripe_customer = StripeCustomer(
                    customer_id=stripe_customer.id,
                    stripe_email=payment_email,
                    user=user,
                    gp_customer=gp_customer
                )
                new_stripe_customer.save()
                stripe_customer_id = new_stripe_customer.customer_id

    # If email is not in Stripe, create Stripe customer
    if stripe_customer_id is None:
        new_customer = stripe.Customer.create(
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

        gday_stripe_customer = StripeCustomer(
            customer_id=new_customer.id,
            stripe_email=payment_email,
            user=user if user is not None else None,
            gp_customer=gp_customer
        )
        gday_stripe_customer.save()

        stripe_customer_id = gday_stripe_customer.customer_id

    return stripe_customer_id


class PaymentSubmitView(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = (PostOnlyPermissions,)

    @action(detail=False, methods=['post'], url_path='create')
    def create(self, request, *args, **kwargs):

        try:
            data = request.data
            customer_payload = data['customer_details']
            items_list = data['items']

            customer = get_customer_details(
                self.request.user, customer_payload)

            order_amount_details = calculate_order_amount(customer, items_list)
            order_amount = order_amount_details['amount']
            order_subscriptions = order_amount_details['subscriptions']

            intent = stripe.PaymentIntent.create(
                amount=order_amount,
                customer=customer,
                currency='aud',
                setup_future_usage='off_session',
                metadata={
                    'billing_same_as_shipping': data['customer_details']['billing_same_as_shipping'],
                    'items': str(items_list),
                    'subscriptions': str(order_subscriptions) if order_subscriptions else None,
                }
            )

            content = {
                'clientSecret': intent['client_secret']
            }

        except Exception as e:
            content = {
                'error': str(e)
            }

        return Response(content)

    @action(detail=False, methods=['post'], url_path='confirm')
    def confirm(self, request, *args, **kwargs):
        data = request.data
        token = data['token']

        content = {
            'token': token
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
    permission_classes = [permissions.IsAuthenticated]

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

        stripe_customer = StripeCustomer.objects.get(
            customer_id=payment_intent.customer)
        gp_customer = Customer.objects.get(id=stripe_customer.gp_customer.id)

        items = payment_intent.metadata['items']
        subscriptions = payment_intent.metadata['subscriptions'] if 'subscriptions' in payment_intent.metadata else None
        shipping = payment_intent.shipping
        billing = payment_intent.charges.data[0].billing_details
        card = payment_intent.charges.data[0].payment_method_details.card
        billing_same_as_shipping = payment_intent.metadata['billing_same_as_shipping'] == "True"

        handle_create_order(stripe_customer, gp_customer, items,
                            subscriptions, shipping, billing, billing_same_as_shipping, card)

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
