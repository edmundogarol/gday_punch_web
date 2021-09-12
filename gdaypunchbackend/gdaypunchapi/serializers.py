from django.contrib.auth.models import Group
from rest_framework import serializers
from django.contrib.auth import login
from rest_framework.response import Response
from .models import (
    User, Manga, Like, Comment, CommentLike, Prompt,
    StripeCustomer, Product, Privileges, StripePrice,
    Contact, Customer, ResetPasswordSession, Order,
    Coupon
)


class PrivilegeSerializer(serializers.ModelSerializer):

    def to_representation(self, value):
        return value.name

    class Meta:
        model = Privileges
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    privileges = PrivilegeSerializer(many=True)

    class Meta:
        model = User
        fields = ("first_name", "last_name", "username", "email", "bio", "privileges", "verified",
                  "location", "birth_date", "roles", "password", "id", "is_staff", "subscribed",
                  "customer_id")
        extra_kwargs = {'password': {'write_only': True}}


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class MangaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manga
        fields = ("id", "title", "author", "pdf", "cover", "likes", "user_likes",
                  "comments")


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
        fields = ("id", "content", "manga", "user",
                  "user_username", "likes", "user_likes")


class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = ("id", "prompt", "meta", "user", "promptType", "is_selected")


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ("id", "user", "subscribed", "phone_number", "email", "first_name", "last_name",
                  "address_line_1", "address_line_2", "city", "state", "postcode", "country")


class StripeCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StripeCustomer
        fields = ("id", "customer_id", "user", "stripe_email", "gp_customer")


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id", "title", "description", "image", "product_type", "active_price",
                  "sale_price", "visible", "stock", "stripe_prices", "manga_details", "sku",
                  "manga", "user", "user_string")


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ("id", "customer", "products_qty", "number", "date_created", "status",
                  "email", "first_name", "last_name", "address_line_1", "address_line_2", "city",
                  "state", "postcode", "country", "phone_number", "billing_same_address", "billing_email",
                  "billing_first_name", "billing_last_name", "billing_address_line_1", "billing_address_line_2",
                  "billing_city", "billing_state", "billing_postcode", "billing_country", "billing_number",
                  "last_four", "exp_month", "exp_year")


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ("id", "name", "date_created",
                  "expiry_date", "coupon_type", "amount")


class StripePriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StripePrice
        fields = ("id", "price_id", "price_amount",
                  "price_title", "price_type")


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ("id", "name", "email", "reason", "content", "date_created")


class ResetPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetPasswordSession
        fields = ("id", "user", "token", "created_date")
