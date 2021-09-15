import os
import stripe

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.mixins import UpdateModelMixin

from ..constants import *
from ..api_permissions import ProductPermissions
from ..models import (
    Settings, User, Product, StripePrice
)
from ..serializers import (
    ProductSerializer, StripePriceSerializer
)

if 'DEVENV' in os.environ:
    stripe.api_key = 'sk_test_Z4XLxyrM6xiiRVj54nJv47oU'
    endpoint_secret = 'whsec_Ff0bJ3CeMLroLNsaOroj3n8Wz3mRQPal'
    domain = "http://localhost:8000"
else:
    stripe.api_key = 'sk_live_YXBR1HhTpxIbLVwoMHsP727I'
    domain = "https://www.beta-gdaypunch:com"

# price_type: one_time, recurring


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [ProductPermissions]

    def create(self, request, *args, **kwargs):

        free = request.data['active_price'] == 0 or request.data['active_price'] == "" or None
        use_existing_price = len(request.data['stripe_prices']) > 0
        create_stripe_price = not free and not use_existing_price

        if create_stripe_price:
            recurring = request.data['product_type'] == 'subscription'

            stripe_price = stripe.Price.create(
                unit_amount=int(float(request.data['active_price'])*100),
                currency="aud",
                recurring={
                    "interval": "month",
                    "interval_count": 2,
                    "usage_type": "metered"
                } if recurring else None,
                product_data={
                    "name": request.data['title'],
                })

            stripe_product = stripe.Product.retrieve(stripe_price.product)
            stripe.Product.modify(stripe_product.id, images=[
                "https://gdaypunch-static.s3.us-west-2.amazonaws.com/" + request.data['image']])

            new_stripe_price = StripePrice(
                price_amount=(stripe_price.unit_amount / 100),
                price_id=stripe_price.id,
                price_title=request.data['title'],
                price_type="recurring" if recurring else "one_time"
            )
            new_stripe_price.save()

        product = Product.objects.create(
            description=request.data['description'],
            title=request.data['title'],
            image=request.data['image'],
            sale_price=request.data['sale_price'],
            visible=request.data['visible'],
            stock=request.data['stock'],
            sku=request.data['sku'],
            product_type=request.data['product_type'],
            user=User.objects.get(email=self.request.user)
        )

        if create_stripe_price:
            product.stripe_prices.add(new_stripe_price)
        else:
            product.stripe_prices.set(request.data['stripe_prices'])

        product.save()

        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = Product.objects.all().order_by('-id')
        price_filter = request.query_params.get('price')

        user = None
        try:
            user = User.objects.get(email=self.request.user)
        except User.DoesNotExist:
            print("Anonymous User")

        settings = Settings.objects.first()

        if not settings.shop_visible and not user.is_staff:
            all_free_products = []

            for product in queryset:
                if product.sale_price > 0:
                    pass

                stripe_prices = product.stripe_prices.all()

                price = 0
                for stripe_price in stripe_prices:
                    price += StripePrice.objects.get(
                        id=stripe_price.id).price_amount

                if price > 0:
                    pass
                else:
                    all_free_products.append(product)

            serializer = ProductSerializer(all_free_products, many=True)
            return Response(serializer.data)

        if (user is None) or (not user.is_staff):
            queryset = queryset.filter(visible=True)

        if price_filter:
            queryset = queryset.filter(active_price=price_filter)

        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)


class ProductDetailView(UpdateModelMixin, viewsets.ViewSet):
    permission_classes = [ProductPermissions]

    def partial_update(self, request, *args, **kwargs):
        queryset = Product.objects.all()
        product = queryset.get(pk=kwargs.get("pk"))

        free = request.data['active_price'] == 0 or request.data['active_price'] == "" or None
        use_existing_price = len(request.data['stripe_prices']) > 0
        create_stripe_price = not free and not use_existing_price

        if create_stripe_price:
            recurring = request.data['product_type'] == 'subscription'

            stripe_price = stripe.Price.create(
                unit_amount=int(float(request.data['active_price'])*100),
                currency="aud",
                recurring={
                    "interval": "month",
                    "interval_count": 2,
                    "usage_type": "metered"
                } if recurring else None,
                product_data={
                    "name": request.data['title'],
                })

            stripe_product = stripe.Product.retrieve(stripe_price.product)
            stripe.Product.modify(stripe_product.id, images=[
                "https://gdaypunch-static.s3.us-west-2.amazonaws.com/" + request.data['image']])

            new_stripe_price = StripePrice(
                price_amount=(stripe_price.unit_amount / 100),
                price_id=stripe_price.id,
                price_title=request.data['title'],
                price_type="recurring" if recurring else "one_time"
            )
            new_stripe_price.save()

            request.data['stripe_prices'] = [new_stripe_price.id]

        serializer = ProductSerializer(
            product, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
