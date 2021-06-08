import os

from rest_framework import viewsets, permissions, exceptions, authentication, throttling
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import UpdateModelMixin

from django.db.models import Q
from django.db.utils import IntegrityError
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import Group
from rest_framework.authentication import SessionAuthentication
from django.shortcuts import get_object_or_404, get_list_or_404
from django.http import HttpResponse

import stripe

from .models import (
    User, Manga, Like, Comment, CommentLike, Prompt,
    StripeCustomer
)
from .serializers import (
    UserSerializer,
    GroupSerializer,
    MangaSerializer,
    LikeSerializer,
    PromptSerializer,
    CommentSerializer,
    CommentLikeSerializer,
)

# stripe.api_key = 'sk_live_YXBR1HhTpxIbLVwoMHsP727I'
stripe.api_key = 'sk_test_Z4XLxyrM6xiiRVj54nJv47oU'


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


endpoint_secret = 'whsec_Ff0bJ3CeMLroLNsaOroj3n8Wz3mRQPal'


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


class PostUserRateThrottle(throttling.UserRateThrottle):
    scope = "post_user"

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)


class UserViewSet(UpdateModelMixin, viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, validated_data):
        user = None

        try:
            user = User.objects.create_user(
                email=validated_data.data["email"],
                password=validated_data.data["password"],
            )
        except IntegrityError:
            content = {"error": "Duplicate email. User already exists."}
            return Response(content, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user.set_password(validated_data.data["password"])
        user.save()

        content = {
            "user": str(user),
            "logged_in": True,  # None
        }

        return Response(content)

    def retrieve(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        queryset = User.objects.all()
        user = queryset.get(pk=kwargs.get("pk"))
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class LogoutView(APIView):
    authentication_classes = (SessionAuthentication,)

    def get(self, request, format=None):
        logout(request)
        content = {
            "logged_in": False,
        }
        return Response(content)


class LoginView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        if str(self.request.user) != "AnonymousUser":
            user = User.objects.get(email=self.request.user)
            serializer = UserSerializer(user)
            content = {
                "user": serializer.data,
                "logged_in": True,
            }
            return Response(content)
        else:
            content = {
                "logged_in": False,
            }
            return Response(content)

    def post(self, request, format=None):

        email = request.data.get("email", None)
        password = request.data.get("password", None)

        if not email or not password:
            raise exceptions.AuthenticationFailed("No credentials provided.")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed("User does not exist.")

        if user is None or not check_password(password, user.password):
            raise exceptions.AuthenticationFailed("Invalid username/password.")
        else:
            login(request, user)

        if not user.is_active:
            raise exceptions.AuthenticationFailed("User inactive or deleted.")

        user = User.objects.get(email=self.request.user)
        serializer = UserSerializer(user)
        content = {
            "user": serializer.data,
            "logged_in": True,
        }
        return Response(content)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.none()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommentLikeViewSet(viewsets.ModelViewSet):
    queryset = CommentLike.objects.none()
    serializer_class = CommentLikeSerializer
    permission_classes = [permissions.IsAuthenticated]


class PromptViewSet(viewsets.ModelViewSet):
    queryset = Prompt.objects.all()
    serializer_class = PromptSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        queryset = Prompt.objects.all().order_by('-id')
        serializer = PromptSerializer(queryset, many=True)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        promptToUnselect = Prompt.objects.get(is_selected=True)
        promptToUnselect.is_selected = False
        promptToUnselect.save()

        queryset = Prompt.objects.all()
        prompt = queryset.get(pk=kwargs.get("pk"))
        prompt.is_selected = True
        prompt.save()
        serializer = PromptSerializer(prompt)
        return Response(serializer.data)


class PromptRandomStylePanelViewSet(viewsets.ModelViewSet):
    queryset = Prompt.objects.none()
    serializer_class = PromptSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        style = Prompt.objects.filter(promptType=2).order_by('?')[:1].get()
        framing = Prompt.objects.filter(promptType=3).order_by('?')[:1].get()
        style_and_framing = " ".join([framing.prompt, style.prompt])

        contributors = style.meta
        if framing.meta != style.meta:
            contributors = " and ".join([framing.meta, style.meta])

        response = {}
        response['prompt'] = style_and_framing
        response['meta'] = contributors
        return Response(response)


class PromptSelectedViewSet(viewsets.ModelViewSet):
    queryset = Prompt.objects.none()
    serializer_class = PromptSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        queryset = Prompt.objects.get(is_selected=True)
        serializer = PromptSerializer(queryset)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    throttle_classes = [PostUserRateThrottle]
    queryset = Comment.objects.none()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, pk=None):
        queryset = Comment.objects.all()
        comment = get_object_or_404(queryset, id=pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)


class MangaCommentsViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def retrieve(self, request, pk=None):
        queryset = Comment.objects.all()
        mangaComments = get_list_or_404(queryset, manga=pk)
        serializer = CommentSerializer(mangaComments, many=True)
        return Response(serializer.data)


class MangaViewSet(viewsets.ModelViewSet):
    queryset = Manga.objects.none()
    serializer_class = MangaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_user(self):
        return self.request.user

    def list(self, request, *args, **kwargs):
        author = User.objects.get(email=self.get_user())
        queryset = Manga.objects.all().filter(author=author)
        serializer = MangaSerializer(queryset, many=True)
        return Response(serializer.data)


class MangaDetailView(UpdateModelMixin, viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def retrieve(self, request, pk=None):
        queryset = Manga.objects.all()
        manga = get_object_or_404(queryset, pk=pk)
        serializer = MangaSerializer(manga)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        queryset = Manga.objects.all()
        manga = queryset.get(pk=kwargs.get("pk"))
        serializer = MangaSerializer(manga, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
