from threading import Thread
from smtplib import SMTPAuthenticationError
from datetime import datetime

from django.core.mail import send_mail
from django.template.loader import render_to_string

from rest_framework.response import Response
from rest_framework import viewsets, status

from gdaypunchbackend.gdaypunchapi.constants import (
    PAYOUT_FAILED,
    PAYOUT_PROCESSING,
    PAYOUT_RETRYING,
    PAYOUT_SUCCEEDED,
)

from ..api_permissions import (
    PayoutPermissions,
    SellerPermissions,
    PayoutStatusUpdatesPermissions,
)
from ..models import Seller, User, Payout, PayoutUpdate
from ..serializers import (
    SellerSerializer,
    PayoutSerializer,
    PayoutUpdateSerializer,
)

from gdaypunchbackend.settings import DOMAIN


class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer
    permission_classes = [SellerPermissions]

    # def retrieve(self, request, *args, **kwargs):
    #     try:
    #         seller = Seller.objects.get(pk=kwargs.get("pk"))
    #     except Seller.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)

    #     serializer = SellerSerializer(seller)
    #     return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        queryset = Seller.objects.all()
        seller = queryset.get(pk=kwargs.get("pk"))
        serializer = SellerSerializer(seller, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class PayoutViewSet(viewsets.ModelViewSet):
    pagination_class = None
    queryset = Payout.objects.all().order_by("-id")
    serializer_class = PayoutSerializer
    permission_classes = (PayoutPermissions,)

    def list(self, request, *args, **kwargs):
        if str(self.request.user) != "AnonymousUser":
            user = User.objects.get(email=self.request.user)
        else:
            return Response([])

        admin_view = request.GET.get("admin", None)

        if admin_view and user.is_staff:
            queryset = Payout.objects.all().order_by("-id")
            serializer = PayoutSerializer(queryset, many=True)
            return Response(serializer.data)

        try:
            seller = Seller.objects.get(user_id=user.id)
        except Seller.DoesNotExist:
            return Response({"detail": "Seller not found."}, status.HTTP_404_NOT_FOUND)

        queryset = Payout.objects.filter(seller_id=seller.id).order_by("-id")
        serializer = PayoutSerializer(queryset, many=True)
        return Response(serializer.data)


def send_seller_email_update(amount, payout, payout_status, notes, update_date):
    email_template_name = "emails/seller_update.html"
    subject = None
    subtitle = None
    using_bank = not payout.use_paypal

    if payout_status is PAYOUT_PROCESSING:
        subject = "You have a payout processing!"
        subtitle = "You have a payout processing!"
    elif payout_status is PAYOUT_FAILED:
        subject = "Your payout has failed."
        subtitle = "Your payout has failed."
    elif payout_status is PAYOUT_RETRYING:
        subject = "Your payout retry is in progress."
        subtitle = "Your payout retry is in progress."
    elif payout_status is PAYOUT_SUCCEEDED:
        subject = "Your payout is on the way!"
        subtitle = "Your payout is on the way!"

    email_config = {
        "amount": amount,
        "payout": payout,
        "notes": notes,
        "update_date": update_date,
        "using_bank": using_bank,
        "subtitle": subtitle,
        "website": DOMAIN,
    }

    try:
        email = render_to_string(email_template_name, email_config)

        send_mail(
            subject=subject,
            message=email,
            html_message=email,
            from_email="Gday Punch Manga Magazine<info@gdaypunch.com.au>",
            recipient_list=[payout.seller.user.email],
            fail_silently=False,
        )

    except SMTPAuthenticationError:
        print("Username and Password not accepted for smtp email config.")


class PayoutStatusUpdateViewset(viewsets.ModelViewSet):
    pagination_class = None
    queryset = PayoutUpdate.objects.all()
    serializer_class = PayoutUpdateSerializer
    permission_classes = (PayoutStatusUpdatesPermissions,)

    def create(self, request, *args, **kwargs):
        payout = Payout.objects.get(id=request.data["payout"])
        payout_status = request.data["status"]
        reasons = request.data.get("reasons", None)
        description = None
        amount = "{:.2f}".format(float(payout.amount))

        seller = payout.author

        if payout_status == PAYOUT_PROCESSING:
            description = "Payout of amount: A${} is now processing. Notes: {}".format(
                payout.amount, reasons
            )
            Thread(
                target=send_seller_email_update,
                args=(
                    amount,
                    payout,
                    PAYOUT_PROCESSING,
                    reasons,
                    datetime.now().strftime("%d %b %Y"),
                ),
            ).start()

        elif payout_status == PAYOUT_FAILED:
            description = "Payout has failed due to reasons: {}".format(reasons)
            Thread(
                target=send_seller_email_update,
                args=(
                    amount,
                    payout,
                    PAYOUT_FAILED,
                    reasons,
                    datetime.now().strftime("%d %b %Y"),
                ),
            ).start()

        elif payout_status == PAYOUT_RETRYING:
            description = "Payout retry is in progress. Notes: {}".format(reasons)
            Thread(
                target=send_seller_email_update,
                args=(
                    amount,
                    payout,
                    PAYOUT_RETRYING,
                    reasons,
                    datetime.now().strftime("%d %b %Y"),
                ),
            ).start()

        elif payout_status == PAYOUT_SUCCEEDED:
            description = "Payout has successfully been paid to seller account: A${}. Notes: {}".format(
                float(payout.amount), reasons
            )
            Thread(
                target=send_seller_email_update,
                args=(
                    amount,
                    payout,
                    PAYOUT_SUCCEEDED,
                    reasons,
                    datetime.now().strftime("%d %b %Y"),
                ),
            ).start()

        payout_update = PayoutUpdate.objects.create(
            payout=payout, status=payout_status, description=description
        )
        payout_update.save()

        return Response(
            {"details": "Payout status updated."}, status=status.HTTP_201_CREATED
        )
