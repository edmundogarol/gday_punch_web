import os
import pdb
from datetime import datetime
from threading import Thread
from secrets import token_urlsafe
from smtplib import SMTPAuthenticationError

from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets, exceptions
from rest_framework.decorators import action

from django.conf import settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.sessions.models import Session
from django.contrib.auth import password_validation

from ..utils import PostOnly
from ..models import (
    User, ResetPasswordSession
)
from ..serializers import ResetPasswordSerializer

if 'DEVENV' in os.environ:
    website = "http://localhost:8000"
else:
    website = "https://www.beta-gdaypunch.com"


def send_password_reset_email(user, token):
    email_template_name = "emails/reset_password.txt"

    email_config = {
        "email": user.email,
        'website': website,
        "user": user,
        'token': token,
    }

    try:
        email = render_to_string(email_template_name, email_config)

        send_mail(
            'Reset Password Request',
            email,
            'Gday Punch Manga Magazine<info@gdaypunch.com>',
            [user.email],
            fail_silently=False,
        )

    except SMTPAuthenticationError:
        print("Username and Password not accepted for smtp email config.")


def reset_password(email):
    user = None

    try:
        user = User.objects.get(email=email)

    except User.DoesNotExist:
        pass

    if user is not None:
        try:
            reset_session = ResetPasswordSession.objects.get(user=user.id)

            if reset_session.verified_token is not None:
                reset_session.verified_token = None

            reset_session.token = token_urlsafe(20)
            reset_session.created_date = datetime.now()
            reset_session.save()

            Thread(target=send_password_reset_email,
                   args=(user, reset_session.token,)).start()

        except ResetPasswordSession.DoesNotExist:
            token = token_urlsafe(20)

            reset_session = ResetPasswordSession.objects.create(
                user=user,
                token=token,
                created_date=datetime.now(),
            )
            reset_session.save()

            Thread(target=send_password_reset_email,
                   args=(user, token,)).start()


def delete_all_unexpired_sessions_for_user(user):
    all_sessions = Session.objects.filter(
        expire_date__gte=datetime.now())
    for session in all_sessions:
        session_data = session.get_decoded()
        if user.pk == int(session_data.get('_auth_user_id')):
            session.delete()


class ResetPasswordViewSet(viewsets.ModelViewSet):
    serializer_class = ResetPasswordSerializer
    permission_classes = (PostOnly, )

    def create(self, request, *args, **kwargs):
        email = request.data['email']

        if email is None:
            raise exceptions.ValidationError(
                {
                    'email': 'Missing Email field.'
                })

        email = email.lower()

        try:
            validate_email(email)
        except ValidationError as e:
            raise exceptions.ValidationError(
                {
                    'email': 'Invalid format. Check and try again.'
                })

        Thread(target=reset_password, args=(email,)).start()

        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='verify')
    def verify(self, request, *args, **kwargs):
        token = request.data['consumer']

        try:
            resetSession = ResetPasswordSession.objects.get(token=token)

            minutes_diff = (datetime.now() -
                            resetSession.created_date).total_seconds() / 60.0
            reset_expiry_minutes = 20  # 20

            if minutes_diff > reset_expiry_minutes:
                resetSession.delete()

                return Response(
                    {'error': 'Reset password link has expired. Please try another link or create a new reset password request'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            else:
                resetSession.verified_token = token_urlsafe(20)
                resetSession.save()

                return Response(
                    {'verified-token': resetSession.verified_token}
                )

        except ResetPasswordSession.DoesNotExist:
            return Response(
                {'error': 'Invalid reset password link. Please try another link or create a new reset password request'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='submit')
    def submit(self, request, *args, **kwargs):
        password = request.data['new_password']
        confirm_password = request.data['confirm_password']
        token = request.data['verified_token']

        if password is None:
            content = {"error": {
                'invalid': 'Missing password field.'
            }}
            return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)

        if password != confirm_password:
            content = {"error": {
                'invalid': 'Confirm passwords must match.'
            }}
            return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)

        try:
            password_validation.validate_password(password)
        except ValidationError as error:
            content = {"error": {
                'invalid': error
            }}
            return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)

        try:
            resetSession = ResetPasswordSession.objects.get(
                verified_token=token)

            minutes_diff = (datetime.now() -
                            resetSession.created_date).total_seconds() / 60.0
            reset_expiry_minutes = 5  # 5

            if minutes_diff > reset_expiry_minutes:
                resetSession.delete()

                return Response(
                    {'error': {
                        'expired': 'Reset password token has expired. Please create a new reset password request.'
                    }},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            else:
                try:
                    user = User.objects.get(id=resetSession.user.id)

                except User.DoesNotExist:
                    return Response(
                        {'error': {
                            'not_found': 'Invalid reset password token. Please create a new reset password request.'
                        }},
                        status=status.HTTP_401_UNAUTHORIZED
                    )

                delete_all_unexpired_sessions_for_user(user)
                resetSession.delete()

                # Does resetting password 'verify' the account? For now it does, as verification literally only checks
                # that the email is active and being used by the user
                if user.verified != "verified":
                    user.verified = "verified"

                user.set_password(password)
                user.save()

                return Response(status=status.HTTP_200_OK)

        except ResetPasswordSession.DoesNotExist:
            return Response(
                {'error': {
                    'not_found': 'Invalid reset password token. Please create a new reset password request.'
                }},
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response(status=status.HTTP_200_OK)
