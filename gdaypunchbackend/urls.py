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
    UserViewSet, LoginView, LogoutView, MangaDetailView,
    MangaViewSet, LikeViewSet, CommentViewSet, MangaCommentsViewSet,
    CommentLikeViewSet, PromptViewSet, PromptRandomStylePanelViewSet,
    PromptSelectedViewSet
)
from .gdaypunchapi.api.products import (
    ProductViewSet,
    ProductDetailView
)
from .gdaypunchapi.api.stripe import (
    PaymentView,
    PaymentsWebhookHandler,
    StripeProductsViewSet,
    StripePriceViewSet,
)

schema_view = get_swagger_view(title='Gday Punch Web App API')

router = routers.DefaultRouter()
router.register(r'user', UserViewSet, basename='user')
router.register(r'manga', MangaDetailView, basename='manga')
router.register(r'mangas', MangaViewSet, basename='mangas')
router.register(r'like', LikeViewSet, basename="like")
router.register(r'comment', CommentViewSet, basename="comment")
router.register(r'comments', MangaCommentsViewSet, basename="comments")
router.register(r'comment-like', CommentLikeViewSet, basename="comment-like")
router.register(r'prompts', PromptViewSet, basename="prompts")
router.register(r'prompts-selected', PromptSelectedViewSet, basename="prompts")
router.register(
    r'prompts-random',
    PromptRandomStylePanelViewSet,
    basename="prompts"
)
router.register(r'products', ProductViewSet, basename="products")
router.register(r'product', ProductDetailView, basename="product")

urlpatterns = [
    url(r'^docs/', schema_view),
    url(r'api/login/', LoginView.as_view()),
    url(r'api/logout/', LogoutView.as_view()),
    url(r'api/login-check/', LoginView.as_view()),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'api/payments/create-checkout-session/',
        csrf_exempt(PaymentView.as_view())),
    url(r'api/payments/webhooks/', csrf_exempt(PaymentsWebhookHandler)),
    url(r'api/stripe-products/', StripeProductsViewSet.as_view()),
    url(r'api/stripe-prices/',
        StripePriceViewSet.as_view({'post': 'create', 'get': 'list'})),
    url(r'', include('gdaypunchwebapp.urls'))
]
