from django.contrib.auth.models import Group
from rest_framework import serializers
from django.contrib.auth import login
from rest_framework.response import Response
from .models import (
    User,
    Manga,
    Like,
    Comment,
    CommentLike,
    Prompt,
    StripeCustomer,
    Product,
    Privileges,
    StripePrice,
    Contact,
    Customer,
    ResetPasswordSession,
    Order,
    Coupon,
    OrderStatusUpdate,
    Save,
    Purchase,
    VotingRound,
    VotingItem,
    Settings,
    Follow,
    Friend,
    Seller,
    Payout,
    PayoutUpdate,
)


class PrivilegeSerializer(serializers.ModelSerializer):
    def to_representation(self, value):
        return value.name

    class Meta:
        model = Privileges
        fields = ["id", "name"]


class UserSerializer(serializers.ModelSerializer):
    privileges = PrivilegeSerializer(many=True)

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "username",
            "email",
            "bio",
            "privileges",
            "verified",
            "location",
            "birth_date",
            "roles",
            "password",
            "id",
            "is_staff",
            "subscribed",
            "customer_id",
            "stripe_customer_id",
            "readable_last_login",
            "readable_date_joined",
            "customer_payment_details",
            "last_ip",
            "image",
            "image_public",
            "cover",
            "last_login",
            "author_details",
            "seller_id",
        )
        extra_kwargs = {"password": {"write_only": True}}


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = "__all__"


class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = "__all__"


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class MangaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manga
        fields = (
            "id",
            "title",
            "author",
            "pdf_live",
            "likes",
            "user_likes",
            "comments",
            "author_name",
            "page_count",
            "japanese_reading",
            "author_details",
        )


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ("manga", "user")


class CommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = ("comment", "user")


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("id", "user", "content", "manga", "likes", "user_likes", "author")


class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = ("id", "prompt", "meta", "user", "promptType", "is_selected")


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = (
            "id",
            "user",
            "subscribed",
            "phone_number",
            "email",
            "first_name",
            "last_name",
            "address_line_1",
            "address_line_2",
            "city",
            "state",
            "postcode",
            "country",
            "last_3_purchases",
            "mag_subscribed",
            "dig_subscribed",
            "owned_access_count",
            "owned_access_products",
        )


class StripeCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StripeCustomer
        fields = ("id", "customer_id", "user", "stripe_email", "gp_customer")


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "id",
            "title",
            "description",
            "image",
            "product_type",
            "active_price",
            "sale_price",
            "visible",
            "stock",
            "stripe_prices",
            "manga_details",
            "sku",
            "manga",
            "user",
            "user_string",
            "purchased",
            "subscription_interval",
            "saved",
            "saved_date",
            "saves",
            "user_avatar",
            "editable",
        )


class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = ("id", "product", "customer")


class ProductSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id", "title")


class SaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Save
        fields = ("product", "user")


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            "id",
            "customer",
            "amount",
            "products_total_price",
            "products_qty",
            "number",
            "date_created",
            "status",
            "email",
            "first_name",
            "last_name",
            "address_line_1",
            "address_line_2",
            "city",
            "state",
            "postcode",
            "country",
            "phone_number",
            "billing_same_address",
            "billing_email",
            "billing_first_name",
            "billing_last_name",
            "billing_address_line_1",
            "billing_address_line_2",
            "billing_city",
            "billing_state",
            "billing_postcode",
            "billing_country",
            "billing_number",
            "last_four",
            "exp_month",
            "exp_year",
            "product_qty_details",
            "fulfillment_type",
            "coupon",
            "readable_date",
            "coupon_details",
            "tax",
            "statuses",
            "secret",
        )


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusUpdate
        fields = (
            "id",
            "order",
            "status",
            "description",
            "update_date",
            "readable_date",
        )


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = (
            "id",
            "name",
            "date_created",
            "description",
            "expiry_date",
            "coupon_type",
            "amount",
        )


class StripePriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StripePrice
        fields = ("id", "price_id", "price_amount", "price_title", "price_type")


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ("id", "name", "email", "reason", "content", "date_created")


class ResetPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetPasswordSession
        fields = ("id", "user", "token", "created_date")


class VotingRoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = VotingRound
        fields = "__all__"


class VotingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = VotingItem
        fields = "__all__"


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = "__all__"


class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = (
            "id",
            "user",
            "paypal_email",
            "bank_acc_name",
            "bank_bsb",
            "bank_acc",
            "use_paypal",
            "next_payout",
            "total_sales",
            "last_payout_date",
            "payout_due_date",
        )


class PayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout
        fields = (
            "id",
            "seller",
            "amount",
            "start_order",
            "end_order",
            "readable_date",
            "status",
            "description",
        )


class PayoutUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayoutUpdate
        fields = "__all__"
