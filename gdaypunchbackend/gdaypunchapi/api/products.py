import os
import stripe
import logging

from django.db.utils import IntegrityError
from django.db.models.deletion import ProtectedError

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.mixins import UpdateModelMixin
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from ..constants import *
from ..utils import AdminOnly
from ..model_utils import create_default_sku
from ..api_permissions import ProductPermissions, SavePermissions
from ..models import (
    Settings,
    User,
    Product,
    StripePrice,
    Save,
    Manga,
    Like,
    Comment,
    CommentLike,
    Purchase,
)
from ..serializers import (
    ProductSerializer,
    StripePriceSerializer,
    SaveSerializer,
    ProductSimpleSerializer,
)

from gdaypunchbackend.settings import STRIPE_API_KEY, LOCAL_DEV

stripe.api_key = STRIPE_API_KEY


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [ProductPermissions]
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        user = None

        if request.data.get("image", None):
            parser_classes = (MultiPartParser, FormParser)

        product_type = request.data.get("product_type", None)
        sku = request.data.get("sku", None)
        active_price = request.data.get("active_price", 0)
        manga = request.data.get("manga", None)
        visible = request.data.get("visible", False)
        stock = request.data.get("stock", 1)
        sale_price = request.data.get("sale_price", 0)
        stripe_prices = request.data.get("stripe_prices", [])

        if str(self.request.user) != "AnonymousUser":
            user = User.objects.get(email=self.request.user)

        if not user.is_staff and (
            product_type == MAG_SUBSCRIPTION or product_type == DIG_SUBSCRIPTION
        ):
            return Response(
                {"error": "Unauthorised to create this product"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if sku and "GPMM" in sku and not user.is_staff:
            return Response(
                {
                    "sku": "SKU contains a reserved combination 'GPMM'. Remove this and try again."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        free = active_price is None or active_price == 0 or active_price == ""
        use_existing_price = len(stripe_prices) > 0 if stripe_prices else False
        create_stripe_price = not free and not use_existing_price

        print(active_price, create_stripe_price)

        if create_stripe_price:
            recurring = False
            month_interval = request.data.get("month_interval")

            # Subscription done manually through Admin portal (Per release)
            if product_type == SUBSCRIPTION:
                recurring = True
            elif product_type == DIG_SUBSCRIPTION:
                recurring = True
                month_interval = 1
            else:
                month_interval = 0

            stripe_price = stripe.Price.create(
                unit_amount=int(float(active_price) * 100),
                currency="aud",
                recurring={
                    "interval": "month",
                    "interval_count": month_interval if month_interval else 1,
                }
                if recurring
                else None,
                product_data={
                    "name": request.data["title"],
                },
            )

            new_stripe_price = StripePrice(
                price_amount=(stripe_price.unit_amount / 100),
                price_id=stripe_price.id,
                price_title=request.data["title"],
                price_type=RECURRING if recurring else ONE_TIME,
                month_interval=month_interval,
            )
            new_stripe_price.save()

        current_user = User.objects.get(email=self.request.user)

        if LOCAL_DEV:
            request.data["image_public"] = None

        try:
            product = Product.objects.create(
                description=request.data["description"],
                title=request.data["title"],
                image_store=request.data["image"],
                image_store_public=request.data["image_public"],
                sale_price=sale_price,
                visible=True if manga else visible,
                stock=1 if manga else stock,
                sku=sku if sku else create_default_sku(),
                product_type=product_type,
                user=current_user,
            )

            if manga:
                manga = Manga.objects.create(
                    author=current_user,
                    title=request.data["title"],
                    pdf=request.data["manga"],
                    release_date=request.data["release_date"],
                    age_rating=request.data["age_rating"],
                    page_count=request.data["page_count"],
                    japanese_reading=request.data["japanese_reading"] == "japanese",
                )

                product.manga.add(manga)
                product.save()

            if create_stripe_price:
                stripe_product = stripe.Product.retrieve(stripe_price.product)
                stripe.Product.modify(
                    stripe_product.id,
                    images=[product.image_store_public.name],
                )

            if create_stripe_price:
                product.stripe_prices.add(new_stripe_price)
            else:
                product.stripe_prices.set(stripe_prices)

            product.save()

            serializer = ProductSerializer(product)
            return Response(serializer.data)

        except KeyError as e:
            logging.exception("ProductViewSet.create.KeyError", str(e))

            return Response(
                {"error": "Missing {} field".format(e)},
                status=status.HTTP_406_NOT_ACCEPTABLE,
            )

        except IntegrityError as e:
            logging.exception("ProductViewSet.create.IntegrityError", str(e))

            if "(title)" in str(e):
                return Response(
                    {
                        "title": "Manga or Product with this title already exists. Try a different title"
                    },
                    status=status.HTTP_406_NOT_ACCEPTABLE,
                )
            elif "(sku)" in str(e):
                return Response(
                    {
                        "sku": "Manga or Product with this sku already exists. Try a different sku"
                    },
                    status=status.HTTP_406_NOT_ACCEPTABLE,
                )
            else:
                return Response(
                    {"detail": str(e)},
                    status=status.HTTP_406_NOT_ACCEPTABLE,
                )

    def destroy(self, request, *args, **kwargs):
        try:
            product = Product.objects.get(pk=kwargs.get("pk"))
        except Product.DoesNotExist:
            return Response(
                {"error": "Product does not exist."}, status=status.HTTP_404_NOT_FOUND
            )

        purchases = Purchase.objects.all().filter(product=product.id)
        if purchases:
            return Response(
                {
                    "error": "This product cannot be deleted as it has been purchased or has another user granted access to it."
                },
                status=status.HTTP_409_CONFLICT,
            )

        for manga in product.manga.all():
            manga = Manga.objects.get(id=manga.id)

            likes = Like.objects.all().filter(manga=manga.id)
            for like in likes:
                like.delete()

            comments = Comment.objects.all().filter(manga=manga.id)
            for comment in comments:

                commentLikes = CommentLike.objects.all().filter(comment=comment.id)
                for comLike in commentLikes:
                    comLike.delete()

                comment.delete()

            manga.pdf.delete()
            manga.delete()

        saves = Save.objects.all().filter(product=product.id)
        for save in saves:
            save.delete()

        product.image_store.delete()
        product.image_store_public.delete()
        product.delete()

        return Response(
            {"success": "Product deleted."}, status=status.HTTP_202_ACCEPTED
        )

    def list(self, request, *args, **kwargs):
        queryset = Product.objects.all().order_by("-id")
        price_filter = request.query_params.get("price")
        user = None

        user_id = request.query_params.get("stall")

        # Show ALL items if super user or shop_tester
        try:
            user = User.objects.get(email=self.request.user)

            if (
                user.privileges.filter(name="super").exists()
                or user.privileges.filter(name="shop_tester").exists()
            ):
                # Stall filter
                if user_id:
                    user = User.objects.get(pk=user_id)
                    queryset = queryset.filter(user=user.id)
                else:
                    pass

                serializer = ProductSerializer(queryset, many=True)
                return Response(serializer.data)

        except User.DoesNotExist:
            print("Anonymous User")

        settings = Settings.objects.first()

        # Shop is turned off
        if not settings.shop_visible:
            visible_products = []

            # Show digital product if user owns or is free
            for product in queryset:
                if product.purchased:
                    if product.product_type in [
                        DIGITAL,
                        DIG_SUBSCRIPTION,
                        MAG_SUBSCRIPTION,
                    ]:
                        visible_products.append(product)
                elif product.active_price > 0:
                    pass
                else:
                    visible_products.append(product)

            # Stall filter
            if user_id:
                new_visible_products = []
                for v_prod in visible_products:
                    if v_prod.user.id == user_id:
                        new_visible_products.append(v_prod)

                serializer = ProductSerializer(new_visible_products, many=True)
                return Response(serializer.data)
            else:
                serializer = ProductSerializer(visible_products, many=True)
                return Response(serializer.data)

        # Shop is turned on
        else:
            queryset = queryset.filter(visible=True)

        # Stall filter
        if user_id:
            user = User.objects.get(pk=user_id)
            queryset = queryset.filter(user=user.id)
        else:
            pass

        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)


class ProductSimpleListView(APIView):
    permission_classes = [AdminOnly]

    def get(self, request, format=None):
        queryset = Product.objects.all().order_by("-id")
        queryset = queryset.filter(product_type=DIGITAL)
        serializer = ProductSimpleSerializer(queryset, many=True)
        return Response(serializer.data)


class ProductDetailView(UpdateModelMixin, viewsets.ViewSet):
    permission_classes = [ProductPermissions]

    def partial_update(self, request, *args, **kwargs):
        user = None
        product_type = request.data["product_type"]
        month_interval = request.data.get("month_interval")

        if str(self.request.user) != "AnonymousUser":
            user = User.objects.get(email=self.request.user)

        if not user.is_staff and (
            product_type == MAG_SUBSCRIPTION or product_type == DIG_SUBSCRIPTION
        ):
            return Response(
                {"error": "Unauthorised to create this product"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        queryset = Product.objects.all()
        product = queryset.get(pk=kwargs.get("pk"))

        free = (
            request.data["active_price"] == 0
            or request.data["active_price"] == ""
            or None
        )
        use_existing_price = len(request.data["stripe_prices"]) > 0
        create_stripe_price = not free and not use_existing_price

        if create_stripe_price:
            recurring = False

            # if product_type == MAG_SUBSCRIPTION: Subscription done manually through Admin portal (Per release)
            if product_type == SUBSCRIPTION:
                recurring = True
            if product_type == DIG_SUBSCRIPTION:
                recurring = True
                month_interval = 1

            stripe_price = stripe.Price.create(
                unit_amount=int(float(request.data["active_price"]) * 100),
                currency="aud",
                recurring={
                    "interval": "month",
                    "interval_count": month_interval if month_interval else 1,
                }
                if recurring
                else None,
                product_data={
                    "name": request.data["title"],
                },
            )

            stripe_product = stripe.Product.retrieve(stripe_price.product)
            stripe.Product.modify(
                stripe_product.id,
                images=[
                    "https://gdaypunch-static.s3.us-west-2.amazonaws.com/"
                    + request.data["image"]
                ],
            )

            new_stripe_price = StripePrice(
                price_amount=(stripe_price.unit_amount / 100),
                price_id=stripe_price.id,
                price_title=request.data["title"],
                price_type=RECURRING if recurring else ONE_TIME,
                month_interval=month_interval,
            )
            new_stripe_price.save()

            request.data["stripe_prices"] = [new_stripe_price.id]

        for price in product.stripe_prices.all():
            if price.month_interval != month_interval:
                current_price = StripePrice.objects.get(id=price.id)
                current_price.month_interval = month_interval
                current_price.save()

        serializer = ProductSerializer(product, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class SaveViewSet(ModelViewSet):
    queryset = Save.objects.all()
    serializer_class = SaveSerializer

    # Only allow logged in users to like comments (create)
    permission_classes = [SavePermissions]
