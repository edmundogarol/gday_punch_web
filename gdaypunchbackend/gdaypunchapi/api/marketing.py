import os
from smtplib import SMTPAuthenticationError
from threading import Thread

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import exceptions

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from ..utils import PostOnly, devprint
from ..constants import *

from ..models import User, Customer

from gdaypunchbackend.settings import DOMAIN

# Implement Advertising Manga/Issues for emails that have space for ads: eg. Download links, Announcements etc


def send_manuscript_download_link(email):
    email_template_name = "emails/download_manuscript.html"

    email_config = {
        "download": "download",
        "website": DOMAIN
    }

    try:
        email_html = render_to_string(email_template_name, email_config)

        send_mail(
            subject='Manga manuscript download ready',
            message=email_html,
            html_message=email_html,
            from_email='Gday Punch Manga Magazine<info@gdaypunch.com>',
            recipient_list=[email],
            fail_silently=False,
        )

    except SMTPAuthenticationError:
        print("Username and Password not accepted for smtp email config.")


class DownloadManuscript(APIView):
    permission_classes = [PostOnly]

    def post(self, request, format=None):
        loggedIn = str(self.request.user) != "AnonymousUser"
        user = None
        email = request.data.get("email", None)

        if loggedIn:
            user = User.objects.get(email=self.request.user)

            Thread(target=send_manuscript_download_link,
                   args=(user.email,)).start()

            try:
                existingCustomer = Customer.objects.get(
                    email=user.email)

                if existingCustomer.user is None:
                    existingCustomer.user = user
                    existingCustomer.save()

                if existingCustomer.subscribed in [NOT_SUBSCRIBED, UNSUBSCRIBED, CHECKOUT_SUBSCRIBED]:
                    existingCustomer.subscribed = DOWNLOAD_SUBSCRIBED
                    existingCustomer.save()

            except Customer.DoesNotExist:
                customer = Customer.objects.create(
                    user=user,
                    email=user.email,
                    subscribed=DOWNLOAD_SUBSCRIBED,
                )
                customer.save()

            return Response(
                {'detail': 'We have sent you an email with the download link! Please check your junk folder.'},
                status=status.HTTP_200_OK
            )

        if email is None:
            return Response({'error': 'Must provide email to send download link to.'}, status=status.HTTP_406_NOT_ACCEPTABLE)

        try:
            validate_email(email)
        except ValidationError as e:
            raise exceptions.ValidationError(
                {
                    'error': 'Invalid format. Check and try again.'
                })

        Thread(target=send_manuscript_download_link, args=(email,)).start()

        try:
            existingCustomer = Customer.objects.get(
                email=request.data['email'])

            if existingCustomer.subscribed in [NOT_SUBSCRIBED, UNSUBSCRIBED, CHECKOUT_SUBSCRIBED]:
                existingCustomer.subscribed = DOWNLOAD_SUBSCRIBED
                existingCustomer.save()

            return Response({'detail': 'We have sent you an email with the download link! Please check your junk folder.'}, status=status.HTTP_208_ALREADY_REPORTED)

        except Customer.DoesNotExist:
            customer = Customer.objects.create(
                user=None,
                email=email.lower(),
                subscribed=DOWNLOAD_SUBSCRIBED,
            )
            customer.save()

        return Response(
            {'detail': 'We have sent you an email with the download link! Please check your junk folder.'},
            status=status.HTTP_200_OK
        )
