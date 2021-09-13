import os
from smtplib import SMTPAuthenticationError
from secrets import token_urlsafe
from threading import Thread

from django.core.mail import send_mail
from django.template.loader import render_to_string

from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from ..models import (User, StripeCustomer, Customer)
from ..serializers import UserSerializer
from ..utils import PostOnly

if 'DEVENV' in os.environ:
    website = "http://localhost:8000"
else:
    website = "https://www.beta-gdaypunch.com"


def send_account_verification_email(user, token):
    email_template_name = "emails/verify_account.txt"

    email_config = {
        "email": user.email,
        'website': website,
        "user": user,
        'token': token,
    }

    try:
        email = render_to_string(email_template_name, email_config)

        send_mail(
            'Verify Email for Gday Punch Account',
            email,
            'noreply@gdaypunch.com',
            [user.email],
            fail_silently=False,
        )

    except SMTPAuthenticationError:
        print("Username and Password not accepted for smtp email config.")


def update_stripe_and_gp_customer(user):
    gday_stripe_customer = None

    # On email verify, check if User or User email has associated GP_StripeCustomer
    #
    #   - Update GP_StripeCustomer with new email or new verified user
    try:
        gday_stripe_customer = StripeCustomer.objects.get(
            user_id=user.id)

        gday_stripe_customer.email = user.email
        gday_stripe_customer.save()

    except StripeCustomer.DoesNotExist:
        print("User does not have GP_StripeCustomer, try Email")

        try:
            gday_stripe_customer = StripeCustomer.objects.get(
                stripe_email=user.email)

            gday_stripe_customer.user = user
            gday_stripe_customer.save()

        except StripeCustomer.DoesNotExist:
            print("User email does not have GP_StripeCustomer")

    if gday_stripe_customer is not None:
        try:
            gp_customer = Customer.objects.get(
                email=user.email)

            gp_customer.user = user
            gp_customer.save()

        except Customer.DoesNotExist:
            print("User does not have GP_Customer")


class VerifyAccountViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = (PostOnly,)

    @action(detail=False, methods=['post'], url_path='email')
    def email(self, request, *args, **kwargs):
        data = request.data
        token = data['token']

        try:
            user = User.objects.get(verified=token)
            user.verified = "verified"

            Thread(target=update_stripe_and_gp_customer, args=(user,)).start()

            user.save()

            content = {'detail': 'Verification complete.'}
            return Response(content)

        except User.DoesNotExist:
            return Response(
                {'error': 'Email Verification link expired. Please create another email verification request.'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class RequestVerificationViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['post'], url_path='email')
    def email(self, request, *args, **kwargs):

        try:
            user = User.objects.get(email=self.request.user)

            user.verified = token_urlsafe(20)
            user.save()

            Thread(target=send_account_verification_email,
                   args=(user, user.verified,)).start()

            content = {'detail': 'Email Verification request complete.'}
            return Response(content)

        except User.DoesNotExist:
            return Response(
                {'error': 'Email Verification request failed.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
