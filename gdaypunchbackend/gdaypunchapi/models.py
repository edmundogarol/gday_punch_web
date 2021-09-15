import json
import random
import pytz
from datetime import datetime

from rest_framework import exceptions

from django.db import models
from django.utils import timezone
from django.db.models import Count
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.postgres.fields import ArrayField
from django_currentuser.middleware import (
    get_current_user, get_current_authenticated_user)
from django_currentuser.db.models import CurrentUserField

from .constants import *


class Settings(models.Model):
    shop_visible = models.BooleanField(default=True)


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        try:
            validate_email(email)
        except ValidationError as e:
            raise exceptions.ValidationError(
                {
                    'email': 'Invalid format. Check and try again.'
                })
        else:
            email = self.normalize_email(email)
            user = self.model(
                email=email,
                **extra_fields
            )
            user.set_password(password)
            user.save(using=self._db)
            return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class Role(models.Model):
    ARTIST = 1
    EDITOR = 2
    ADMIN = 3
    ROLE_CHOICES = (
        (ARTIST, 'artist'),
        (EDITOR, 'editor'),
        (ADMIN, 'admin'),
    )

    id = models.PositiveSmallIntegerField(
        choices=ROLE_CHOICES, primary_key=True)

    def __str__(self):
        return self.get_id_display()


class Privileges(models.Model):
    SUPER = 1
    ADMIN = 2
    PROMPTS = 3
    PRODUCTS = 4
    TWITTER = 5
    INSTAGRAM = 6
    PRIVILEGES = (
        (SUPER, 'super'),
        (ADMIN, 'admin'),
        (PROMPTS, 'prompts'),
        (PRODUCTS, 'products'),
        (TWITTER, 'twitter'),
        (INSTAGRAM, 'instagram'),
    )

    id = models.PositiveSmallIntegerField(
        choices=PRIVILEGES, primary_key=True)
    name = models.TextField(max_length=20, blank=True)

    def __str__(self):
        return self.get_name_display()


class User(AbstractBaseUser, PermissionsMixin):
    email = models.TextField(max_length=50, blank=False, unique=True)
    first_name = models.TextField(max_length=50, blank=True)
    last_name = models.TextField(max_length=50, blank=True)
    username = models.TextField(max_length=50, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=30, blank=True)
    birth_date = models.DateTimeField(null=True, blank=True)
    roles = models.ManyToManyField(Role, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True)
    privileges = models.ManyToManyField(Privileges, blank=True)
    verified = models.TextField(max_length=50, blank=False, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    @property
    def author_name(self):
        full_name = self.first_name + " " + self.last_name

        if full_name is not " ":
            return full_name
        elif self.username is not "":
            return self.username
        else:
            return self.email

        return full_name

    @property
    def subscribed(self):
        try:
            customer = Customer.objects.get(user=self.id)

            if customer.subscribed is not 'not_subscribed':
                return True
            else:
                return False
        except Customer.DoesNotExist:
            return False

    @property
    def customer_id(self):
        try:
            customer = Customer.objects.get(user=self.id)

            return customer.id
        except Customer.DoesNotExist:
            return None


class Manga(models.Model):
    title = models.TextField(max_length=50, blank=False)
    author = models.ForeignKey(User,  on_delete=models.PROTECT)
    pdf = models.TextField(max_length=100, blank=True)
    cover = models.TextField(max_length=100, blank=True)
    release_date = models.DateTimeField(null=True, blank=True)

    ALL_AGES = 'all_ages'
    TEENS = 'teens'
    YOUNG_ADULTS = 'young_adults'
    ADULTS = 'adults'
    AGE_RATINGS = (
        (ALL_AGES, 'All Ages'),
        (TEENS, 'Teens'),
        (YOUNG_ADULTS, 'Young Adults'),
        (ADULTS, 'Adults'),
    )

    age_rating = models.TextField(
        max_length=30, choices=AGE_RATINGS, default=TEENS)

    def __str__(self):
        return self.title

    @property
    def likes(self):
        return Like.objects.all().filter(manga=self.id).count()

    @property
    def comments(self):
        return Comment.objects.all().filter(manga=self.id).count()

    @property
    def user_likes(self):
        if str(get_current_user()) == "AnonymousUser":
            return False

        user = User.objects.get(email=get_current_user())
        liked = Like.objects.all().filter(user=user, manga=self.id).count()
        if liked > 0:
            return True
        else:
            return False

    @property
    def author_name(self):
        return User.objects.get(email=self.author).author_name


class Like(models.Model):
    manga = models.ForeignKey(Manga,  on_delete=models.PROTECT)
    user = models.ForeignKey(User,  on_delete=models.PROTECT)


class Comment(models.Model):
    content = models.TextField(max_length=500, blank=False)
    manga = models.ForeignKey(Manga,  on_delete=models.PROTECT)
    user = models.ForeignKey(User,  on_delete=models.PROTECT)

    @property
    def user_username(self):
        user = User.objects.get(email=self.user)
        return user.username

    @property
    def likes(self):
        return CommentLike.objects.all().filter(comment=self.id).count()

    @property
    def user_likes(self):
        user = User.objects.get(email=get_current_user())
        liked = CommentLike.objects.all().filter(user=user, comment=self.id).count()
        return liked > 0


class CommentLike(models.Model):
    comment = models.ForeignKey(Comment,  on_delete=models.PROTECT)
    user = models.ForeignKey(User,  on_delete=models.PROTECT)


class CollectionType(models.Model):
    ISSUE = 1
    MANGA = 2
    ILLUSTRATION = 3
    COLLECTION_TYPES = (
        (ISSUE, 'issue'),
        (MANGA, 'manga'),
        (ILLUSTRATION, 'illustration'),
    )

    id = models.PositiveSmallIntegerField(
        choices=COLLECTION_TYPES, primary_key=True)
    name = models.TextField(max_length=20, blank=True)

    def __str__(self):
        return self.get_id_display()


class Collection(models.Model):
    owner = models.ForeignKey(User,  on_delete=models.PROTECT)
    name = models.TextField(max_length=50, blank=False)
    mangas = models.ManyToManyField(Manga, blank=False)
    collectionType = models.ForeignKey(
        CollectionType,  on_delete=models.PROTECT)


class PromptType(models.Model):
    SUBJECT = 1
    PANEL_STYLE = 2
    PANEL_FRAMING = 3
    PROMPT_TYPES = (
        (SUBJECT, 'subject'),
        (PANEL_STYLE, 'panel_style'),
        (PANEL_FRAMING, 'panel_framing'),
    )

    id = models.PositiveSmallIntegerField(
        choices=PROMPT_TYPES, primary_key=True)
    name = models.TextField(max_length=20, blank=True)

    def __str__(self):
        return str(self.get_id_display())


class Prompt(models.Model):
    prompt = models.TextField(max_length=50, blank=False)
    user = models.ForeignKey(
        User,  on_delete=models.PROTECT, blank=True, null=True)
    meta = models.TextField(max_length=50, blank=False)
    is_selected = models.BooleanField(default=False)
    promptType = models.ForeignKey(
        PromptType,  on_delete=models.PROTECT)
    last_selected = models.DateTimeField(null=True, blank=True)


class StripePrice(models.Model):
    price_amount = models.FloatField(blank=False)
    price_id = models.TextField(max_length=50, blank=False)
    price_title = models.TextField(max_length=50, blank=False)
    price_type = models.TextField(
        max_length=20, blank=False, default="one_time")


class Product(models.Model):
    description = models.TextField(max_length=1000, blank=True)
    title = models.TextField(max_length=70, blank=True, unique=True)
    image = models.TextField(max_length=100, blank=True)
    sale_price = models.FloatField(blank=True)
    visible = models.BooleanField(default=False)
    stock = models.IntegerField(blank=True)
    product_type = models.TextField(
        max_length=30, choices=PRODUCT_TYPES, default=PHYSICAL)
    stripe_prices = models.ManyToManyField(StripePrice, blank=True)
    created_date = models.DateTimeField(
        null=True, blank=True, default=timezone.now)
    sku = models.TextField(max_length=30, blank=True)
    manga = models.ManyToManyField(Manga, blank=True)
    user = models.ForeignKey(
        User,  on_delete=models.PROTECT, blank=True, null=True)

    @property
    def active_price(self):
        if self.sale_price > 0:
            return self.sale_price

        product = Product.objects.get(id=self.id)
        stripe_prices = product.stripe_prices.all()

        price = 0
        for stripe_price in stripe_prices:
            price += StripePrice.objects.get(id=stripe_price.id).price_amount

        return price

    @property
    def manga_details(self):
        product = Product.objects.get(id=self.id)
        mangas = product.manga.all()

        details = {}
        for manga in mangas:
            current_manga = Manga.objects.get(id=manga.id)

            details = {
                "id": current_manga.id,
                "title": current_manga.title,
                "author": User.objects.get(id=current_manga.author_id).author_name,
                "release_date": current_manga.release_date,
                "age_rating": current_manga.age_rating,
                "likes": current_manga.likes,
                "comments": current_manga.comments,
                "user_likes": current_manga.user_likes,
                "pdf": current_manga.pdf
            }

        return details

    @ property
    def user_string(self):
        user = User.objects.get(email=self.user)
        return user.author_name


class Customer(models.Model):
    SUBSCRIBED_ONLY = 'subscribed_only'
    PURCHASED_SUBSCRIBED = 'purchased_subscribed'
    CHECKOUT_SUBSCRIBED = 'checkout_subscribed'
    NOT_SUBSCRIBED = 'not_subscribed'
    SUBSCRIPTION_TYPE = (
        (SUBSCRIBED_ONLY, 'Subscribed Only'),
        (PURCHASED_SUBSCRIBED, 'Purchased and Subscribed'),
        (CHECKOUT_SUBSCRIBED, 'Subscribed at Checkout'),
        (NOT_SUBSCRIBED, 'Not Subscribed'),
    )

    user = models.ForeignKey(
        User,  on_delete=models.PROTECT, blank=True, null=True)
    subscribed = models.TextField(
        max_length=30, choices=SUBSCRIPTION_TYPE, default=SUBSCRIBED_ONLY)
    date_created = models.DateTimeField(
        null=True, blank=True, default=timezone.now)
    email = models.TextField(max_length=100, unique=True, blank=False)
    first_name = models.TextField(max_length=50, blank=False)
    last_name = models.TextField(max_length=50, blank=False)
    address_line_1 = models.TextField(max_length=50, blank=False)
    address_line_2 = models.TextField(max_length=50, blank=True)
    city = models.TextField(max_length=50, blank=False)
    state = models.TextField(max_length=50, blank=False)
    postcode = models.TextField(max_length=50, blank=False)
    country = models.TextField(max_length=50, blank=False)
    phone_number = models.TextField(max_length=50, blank=False)


class StripeCustomer(models.Model):
    customer_id = models.TextField(max_length=50, blank=False)
    user = models.ForeignKey(
        User,  on_delete=models.PROTECT, blank=True, null=True)
    stripe_email = models.TextField(max_length=70, blank=False)
    gp_customer = models.ForeignKey(
        Customer,  on_delete=models.PROTECT, blank=True, null=True)


class Order(models.Model):
    customer = models.ForeignKey(
        StripeCustomer,  on_delete=models.PROTECT, blank=False, null=True)
    amount = models.FloatField(blank=False, default=0)
    products_qty = models.TextField(max_length=500, blank=False, default='{}')
    number = models.TextField(max_length=20, blank=True)
    date_created = models.DateTimeField(null=False, blank=False)
    status = models.TextField(
        max_length=30, choices=ORDER_STATUSES, default=PENDING)
    coupon = models.TextField(max_length=20, blank=True, null=True)
    email = models.TextField(max_length=100, blank=False)
    first_name = models.TextField(max_length=50, blank=False)
    last_name = models.TextField(max_length=50, blank=False)
    address_line_1 = models.TextField(max_length=50, blank=False)
    address_line_2 = models.TextField(max_length=50, blank=True)
    city = models.TextField(max_length=50, blank=False)
    state = models.TextField(max_length=50, blank=False)
    postcode = models.TextField(max_length=50, blank=False)
    country = models.TextField(max_length=50, blank=False)
    phone_number = models.TextField(max_length=20, blank=False)
    billing_same_address = models.BooleanField(default=True)
    billing_email = models.TextField(max_length=100, blank=True, null=True)
    billing_first_name = models.TextField(max_length=50, blank=True)
    billing_last_name = models.TextField(max_length=50, blank=True, null=True)
    billing_address_line_1 = models.TextField(max_length=50, blank=True)
    billing_address_line_2 = models.TextField(max_length=50, blank=True)
    billing_city = models.TextField(max_length=50, blank=True)
    billing_state = models.TextField(max_length=50, blank=True)
    billing_postcode = models.TextField(max_length=50, blank=True)
    billing_country = models.TextField(max_length=50, blank=True)
    billing_number = models.TextField(max_length=20, blank=True)
    last_four = models.TextField(max_length=10, blank=False)
    exp_month = models.TextField(max_length=10, blank=False)
    exp_year = models.TextField(max_length=10, blank=False)

    @property
    def product_qty_details(self):
        order = Order.objects.get(id=self.id)
        items = json.loads(order.products_qty.replace("\'", "\""))
        item_details = []

        for item in items:
            product = Product.objects.get(id=item['id'])

            item_details.append(
                {
                    'id': product.id,
                    'product': {
                        'title': product.title,
                        'price': product.active_price,
                        'image': product.image,
                        'sku': product.sku,
                    },
                    'qty': item['qty']
                })

        return item_details

    @property
    def products_total_price(self):
        order = Order.objects.get(id=self.id)
        items = json.loads(order.products_qty.replace("\'", "\""))
        total = 0

        for item in items:
            product = Product.objects.get(id=item['id'])
            total = total + (product.active_price * item['qty'])

        return total

    @property
    def fulfillment_type(self):
        fulfillment = SHIPPING
        order = Order.objects.get(id=self.id)
        items = json.loads(order.products_qty.replace("\'", "\""))

        for item in items:
            product = Product.objects.get(id=item['id'])

            if product.product_type != PHYSICAL:
                fulfillment = ACCESS

        return fulfillment

    @property
    def readable_date(self):
        order = Order.objects.get(id=self.id)

        local_tz = pytz.timezone('Australia/Sydney')
        local_dt = order.date_created.replace(
            tzinfo=pytz.utc).astimezone(local_tz)

        return {
            'date': local_dt.strftime("%a %d %b %Y"),
            'time': local_dt.strftime("%I:%M %p")
        }


class OrderStatusUpdate(models.Model):
    status = models.TextField(
        max_length=30, choices=ORDER_STATUSES, default=PENDING)
    update_date = models.DateTimeField(null=True, blank=True)
    order = models.ForeignKey(
        Order,  on_delete=models.PROTECT, blank=False, null=False)


class Coupon(models.Model):
    name = models.TextField(max_length=20, blank=False)
    coupon_type = models.TextField(
        max_length=30, choices=COUPON_TYPES, default=PERCENT)
    amount = models.FloatField(blank=False, default=0)
    date_created = models.DateTimeField(null=False, blank=False)
    expiry_date = models.DateTimeField(null=True, blank=True)


class ProductSEO(models.Model):
    permalink = models.TextField(max_length=100, blank=True)
    title = models.TextField(max_length=100, blank=True)
    product = models.ForeignKey(
        Product,  on_delete=models.PROTECT, blank=False, null=True)
    description = models.TextField(max_length=500, blank=True)


class ProductReview(models.Model):
    name = models.TextField(max_length=50, blank=False)
    email = models.TextField(max_length=50, blank=False)
    product = models.ForeignKey(
        Product,  on_delete=models.PROTECT, blank=False, null=True)
    rating = models.IntegerField(blank=False)
    purchase_date = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(max_length=500, blank=True)


class Contact(models.Model):
    GENERAL = 'general'
    ORDER = 'order'
    ADVERTISING = 'advertising'
    SUBSCRIPTION = 'subscription'
    SUBSCRIPTION_CANCELLATION = 'subscription_cancellation'
    UNSUBSCRIBE = 'unsubscribe'
    CONTACT_REASONS = (
        (GENERAL, 'General'),
        (ORDER, 'Order'),
        (ADVERTISING, 'Advertising'),
        (SUBSCRIPTION, 'Subscription'),
        (SUBSCRIPTION_CANCELLATION, 'SubCancellation'),
        (UNSUBSCRIBE, 'EmailUnsubscribe'),
    )

    name = models.TextField(max_length=50, blank=False)
    email = models.TextField(max_length=50, blank=False)
    reason = models.TextField(
        max_length=30, choices=CONTACT_REASONS, default=GENERAL)
    content = models.TextField(max_length=1000, blank=True)
    date_created = models.DateTimeField(
        null=True, blank=True, default=datetime.now())


class ResetPasswordSession(models.Model):
    user = models.ForeignKey(
        User,  on_delete=models.PROTECT, blank=False, null=True)
    token = models.TextField(max_length=70, blank=False)
    verified_token = models.TextField(max_length=70, blank=False, null=True)
    created_date = models.DateTimeField(null=False, blank=False)
