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

from ..utils import PostOnly
from ..constants import *

from ..models import User, Customer

if 'DEVENV' in os.environ:
    website = "http://localhost:8000"
else:
    website = "https://www.beta-gdaypunch.com"


# Implement Advertising Manga/Issues for emails that have space for ads: eg. Download links, Announcements etc


def send_manuscript_download_link(email):
    email_template_name = "emails/download_manuscript.html"

    email_config = {
        "download": "download",
        "website": website
    }

    try:
        email_html = render_to_string(email_template_name, email_config)

        send_mail(
            subject='Manga manuscript download ready',
            message='Manga M=manuscript download ready',
            html_message=email_html,
            from_email='Gday Punch Manga Magazine<edmundo.garol@gdaypunch.com>',
            recipient_list=[email],
            fail_silently=False,
        )

    except SMTPAuthenticationError:
        print("Username and Password not accepted for smtp email config.")


class DownloadManuscript(APIView):
    permission_classes = [PostOnly]

    def post(self, request, format=None):

        email = request.data.get("email", None)

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

        print(self.request.user)
        loggedIn = str(self.request.user) != "AnonymousUser"
        user = None

        if loggedIn:
            print('loggedin')
            user = User.objects.get(email=self.request.user)

        try:
            print('trying to find existing customer')
            existingCustomer = Customer.objects.get(
                email=request.data['email'])

            if existingCustomer.subscribed == NOT_SUBSCRIBED:
                existingCustomer.subscribed = DOWNLOAD_SUBSCRIBED
                existingCustomer.save()

        except Customer.DoesNotExist:
            print('No Customer. creating')
            customer = Customer.objects.create(
                user=user,
                email=email,
                subscribed=DOWNLOAD_SUBSCRIBED,
            )
            print('Saving Customer', customer.id)
            customer.save()

        return Response(
            {'detail': 'We have sent you an email with the download link! Please check your junk folder.'},
            status=status.HTTP_200_OK
        )
