"""gdaypunchbackend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

from rest_framework import routers
from rest_framework_swagger.views import get_swagger_view

from .gdaypunchapi.views import (
    UserViewSet,
    LoginView,
    LogoutView,
    MangaDetailView,
    AllMangaViewSet,
    LikeViewSet,
    CommentViewSet,
    MangaCommentsViewSet,
    CommentLikeViewSet,
    PromptViewSet,
    PromptRandomStylePanelViewSet,
    PromptSelectedViewSet,
    SwaggerSchemaView,
    AdminCreateUserViewSet,
    UpdateUserPrivilegeViewSet,
)
from .gdaypunchapi.api.reset_password import ResetPasswordViewSet
from .gdaypunchapi.api.verify_account import (
    VerifyAccountViewSet,
    RequestVerificationViewSet,
)
from .gdaypunchapi.api.products import (
    ProductViewSet,
    ProductDetailView,
    SaveViewSet,
    ProductSimpleListView,
)
from .gdaypunchapi.api.stripe import (
    PriceView,
    PaymentSubmitView,
    PaymentsWebhookHandler,
    StripeProductsViewSet,
    StripePriceViewSet,
)
from .gdaypunchapi.api.contact import ContactViewSet
from .gdaypunchapi.api.customer import CustomerViewSet, UpdatedProductPurchasesViewSet
from .gdaypunchapi.api.coupons import CouponViewSet, CouponApplyViewSet
from .gdaypunchapi.api.orders import (
    OrderViewSet,
    OrderStatusUpdateViewset,
    OrderDetailViewSet,
    OrderConfirmationViewSet,
    OrdersSalesGraph,
)
from .gdaypunchapi.api.marketing import DownloadManuscript
from .gdaypunchapi.api.voting import (
    VotingSystemDetailsViewSet,
    VoteCastingViewSet,
    VotingDashboard,
)
from .gdaypunchapi.api.gp_settings import (
    SettingsViewSet,
)
from .gdaypunchapi.api.socials import FollowViewSet
from .gdaypunchapi.api.follows import FollowingViewSet

router = routers.DefaultRouter()
router.register(r"user", UserViewSet, basename="user")
router.register(r"manga", MangaDetailView, basename="manga")
router.register(r"mangas", AllMangaViewSet, basename="mangas")
router.register(r"like", LikeViewSet, basename="like")
router.register(r"comment", CommentViewSet, basename="comment")
router.register(r"comments", MangaCommentsViewSet, basename="comments")
router.register(r"comment-like", CommentLikeViewSet, basename="comment-like")
router.register(r"prompts", PromptViewSet, basename="prompts")
router.register(r"prompts-selected", PromptSelectedViewSet, basename="prompts")
router.register(r"prompts-random", PromptRandomStylePanelViewSet, basename="prompts")
router.register(r"products", ProductViewSet, basename="products")
router.register(r"product", ProductDetailView, basename="product")
router.register(r"product-save", SaveViewSet, basename="product-save")
router.register(r"contact", ContactViewSet, basename="contact")
router.register(r"customer", CustomerViewSet, basename="customer")
router.register(r"coupons", CouponViewSet, basename="customer")
router.register(r"orders", OrderViewSet, basename="orders")
router.register(r"order", OrderDetailViewSet, basename="order")
router.register(r"orders-status", OrderStatusUpdateViewset, basename="orders-status")
router.register(
    r"order-confirmation", OrderConfirmationViewSet, basename="order-confirmation"
)
router.register(r"reset-password", ResetPasswordViewSet, basename="reset-password")
router.register(r"follow", FollowViewSet, basename="follow")
router.register(r"following", FollowingViewSet, basename="following")
router.register(r"settings", SettingsViewSet, basename="settings")

# Inactive endpoints

urlpatterns = [
    # Docs
    url(r"^docs/", SwaggerSchemaView.as_view()),
    # Login
    url(r"api/login/", LoginView.as_view()),
    url(r"api/logout/", LogoutView.as_view()),
    url(r"api/login-check/", LoginView.as_view()),
    # API
    path("api/", include(router.urls)),
    # Admin
    url(r"api/create-user/", AdminCreateUserViewSet.as_view()),
    url(r"api/privileges/", UpdateUserPrivilegeViewSet.as_view()),
    # Products [Simple, Update Purchases]
    url(r"api/products-simple/", ProductSimpleListView.as_view()),
    url(r"api/update-purchases/", UpdatedProductPurchasesViewSet.as_view()),
    # Orders [Sales Graph] OrdersSalesGraph
    url(r"api/orders-graph/", OrdersSalesGraph.as_view()),
    # Voting
    url(r"api/voting-details/", VotingSystemDetailsViewSet.as_view()),
    url(r"api/voting-cast/", VoteCastingViewSet.as_view()),
    url(r"api/voting-dashboard/", VotingDashboard.as_view()),
    # Marketing Emails
    url(r"api/manga-manuscript/", DownloadManuscript.as_view()),
    # Coupons
    url(r"api/coupon/apply/", CouponApplyViewSet.as_view({"post": "apply"})),
    # Auth
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    url(r"api/verify-account/", VerifyAccountViewSet.as_view({"post": "email"})),
    url(
        r"api/request-verification/",
        RequestVerificationViewSet.as_view({"post": "email"}),
    ),
    # Stripe/Payments
    url(r"api/price/", PriceView.as_view()),
    url(r"api/payment-submit/create/", PaymentSubmitView.as_view({"post": "create"})),
    url(r"api/payments/webhooks/", csrf_exempt(PaymentsWebhookHandler)),
    url(r"api/stripe-products/", StripeProductsViewSet.as_view()),
    url(
        r"api/stripe-prices/",
        StripePriceViewSet.as_view({"post": "create", "get": "list"}),
    ),
    # FE Urls
    url(r"", include("gdaypunchwebapp.urls")),
]
