import os

from smtplib import SMTPAuthenticationError

from django.core.mail import send_mail
from django.template.loader import render_to_string

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
