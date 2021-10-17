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
from .utils import get_readable_date_time


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
    last_ip = models.TextField(max_length=30, blank=False, null=True)

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

    @property
    def subscribed(self):
        try:
            customer = Customer.objects.get(user=self.id)

            if customer.subscribed not in [NOT_SUBSCRIBED, UNSUBSCRIBED]:
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

    @property
    def customer_payment_details(self):
        payment_details = None
        try:
            customer = Customer.objects.get(user=self.id)
            stripe_customer = StripeCustomer.objects.get(
                gp_customer=customer.id)

            if customer.dig_subscribed or customer.mag_subscribed:
                if customer.last_four:
                    payment_details = {
                        'last_four': customer.last_four,
                        'exp_month': customer.exp_month,
                        'exp_year': customer.exp_year
                    }

                else:
                    orders = Order.objects.filter(customer=stripe_customer.id)

                    for order in orders:
                        if DIG_SUBSCRIPTION in order.product_types or MAG_SUBSCRIPTION in order.product_types:
                            payment_details = {
                                'last_four': order.last_four,
                                'exp_month': order.exp_month,
                                'exp_year': order.exp_year
                            }
                            break

                return payment_details
            else:
                return None

        except Customer.DoesNotExist:
            return None
        except StripeCustomer.DoesNotExist:
            return None

    @property
    def stripe_customer_id(self):
        try:
            stripe_customer = StripeCustomer.objects.get(user=self.id)

            return stripe_customer.id
        except StripeCustomer.DoesNotExist:
            return None

    @property
    def readable_date_joined(self):
        local_tz = pytz.timezone('Australia/Sydney')
        local_dt = self.date_joined.replace(
            tzinfo=pytz.utc).astimezone(local_tz)

        return {
            'date': local_dt.strftime("%d %b %Y"),
            'time': local_dt.strftime("%I:%M %p")
        }

    @property
    def readable_last_login(self):
        local_tz = pytz.timezone('Australia/Sydney')
        local_dt = self.last_login.replace(
            tzinfo=pytz.utc).astimezone(local_tz)

        return {
            'date': local_dt.strftime("%d %b %Y"),
            'time': local_dt.strftime("%I:%M %p")
        }


class Manga(models.Model):
    title = models.TextField(max_length=50, blank=False)
    author = models.ForeignKey(User,  on_delete=models.PROTECT)
    pdf = models.TextField(max_length=100, blank=True)
    cover = models.TextField(max_length=100, blank=True)
    release_date = models.DateTimeField(null=True, blank=True)
    page_count = models.IntegerField(blank=True, default=0)
    japanese_reading = models.BooleanField(default=True)

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
        return self.author.author_name

    @property
    def pdf_live(self):
        user = None

        try:
            user = User.objects.get(email=get_current_user())
        except User.DoesNotExist:
            pass

        # Get Product
        product_manga = Product.manga.through.objects.filter(manga=self.id)
        product = product_manga.first().product

        # Staff access
        if user and user.is_staff:
            return self.pdf
        else:
            # Temporary fix to keep pdf's live in gdaypunch.com
            if product.sku in ["GPMMD1", "GPMMD4"]:
                return self.pdf

            if product.active_price == 0:
                return self.pdf

            try:
                if user:
                    customer = Customer.objects.get(user=user.id)
                    purchase = Purchase.objects.filter(
                        customer=customer.id).filter(product=product.id)

                    if customer.dig_subscribed and "GPMMD" in product.sku:
                        return self.pdf
                    if purchase:
                        return self.pdf
                else:
                    return None

            except Customer.DoesNotExist:
                return None
            except Purchase.DoesNotExist:
                return None

            return None


class Like(models.Model):
    manga = models.ForeignKey(Manga,  on_delete=models.PROTECT)
    user = models.ForeignKey(User,  on_delete=models.PROTECT)


class Comment(models.Model):
    content = models.TextField(max_length=500, blank=False)
    manga = models.ForeignKey(Manga,  on_delete=models.PROTECT)
    user = models.ForeignKey(User,  on_delete=models.PROTECT)

    @property
    def user_username(self):
        return self.user.username if self.user.username else self.user.email

    @property
    def likes(self):
        return CommentLike.objects.all().filter(comment=self.id).count()

    @property
    def user_likes(self):
        liked = CommentLike.objects.all().filter(
            user=get_current_user().id, comment=self.id).count()

        return liked > 0


class CommentLike(models.Model):
    comment = models.ForeignKey(Comment,  on_delete=models.PROTECT)
    user = models.ForeignKey(User,  on_delete=models.PROTECT)


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
        max_length=20, blank=False, default=ONE_TIME)
    month_interval = models.IntegerField(blank=True, default=1)


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

        price = 0
        for stripe_price in self.stripe_prices.all():
            price += stripe_price.price_amount

        return price

    @property
    def manga_details(self):
        mangas = self.manga.all()

        details = {}
        for manga in mangas:
            details = {
                "id": manga.id,
                "title": manga.title,
                "author": manga.author.author_name,
                "release_date": manga.release_date,
                "age_rating": manga.age_rating,
                "likes": manga.likes,
                "comments": manga.comments,
                "user_likes": manga.user_likes,
                "pdf_live": manga.pdf_live
            }

        return details

    @property
    def user_string(self):
        return self.user.author_name

    @property
    def purchased(self):
        if str(get_current_user()) == "AnonymousUser":
            return False

        try:
            user = User.objects.get(email=get_current_user())

            customer = Customer.objects.get(user=user.id)

            purchase = Purchase.objects.filter(
                customer=customer.id).filter(product=self.id)

            if purchase.first() is not None:
                if self.product_type == MAG_SUBSCRIPTION:
                    return customer.mag_subscribed

                if (self.product_type == DIG_SUBSCRIPTION):
                    return customer.dig_subscribed

                return True
            else:
                if self.product_type == MAG_SUBSCRIPTION:
                    return customer.mag_subscribed

                # TODO Is this giving access to the temporary public gpmm/1/ url in beta-gdaypunch?
                if (self.product_type == DIG_SUBSCRIPTION) or ('GPMMD' in self.sku):
                    return customer.dig_subscribed

                return False
        except Customer.DoesNotExist:
            return False
        except Purchase.DoesNotExist:
            return False

    @property
    def subscription_interval(self):
        interval = None
        for stripe_price in self.stripe_prices.all():
            interval = stripe_price.month_interval

        return interval

    @property
    def saved(self):
        if str(get_current_user()) == "AnonymousUser":
            return False

        if self.product_type != "digital":
            return False

        try:
            user = User.objects.get(email=get_current_user())
            save = Save.objects.filter(user=user.id).filter(product=self.id)

            if save.first() is not None:
                return save.first().id
            else:
                return False

        except Save.DoesNotExist:
            return False

    @property
    def saves(self):
        if str(get_current_user()) == "AnonymousUser":
            return None

        user = User.objects.get(email=get_current_user())
        if not user.is_staff:
            return None

        return Save.objects.all().filter(product=self.id).count()

    @property
    def saved_date(self):
        if str(get_current_user()) == "AnonymousUser":
            return None

        if self.product_type != "digital":
            return None

        try:
            user = User.objects.get(email=get_current_user())
            save = Save.objects.filter(user=user.id).filter(product=self.id)

            if save.first() is not None:
                return save.first().saved_date
            else:
                return None

        except Save.DoesNotExist:
            return None


class Save(models.Model):
    product = models.ForeignKey(
        Product,  on_delete=models.PROTECT, blank=False, null=False)
    user = models.ForeignKey(
        User,  on_delete=models.PROTECT, blank=False, null=False)
    saved_date = models.DateTimeField(
        null=True, blank=True, default=timezone.now)


class Customer(models.Model):
    user = models.ForeignKey(
        User,  on_delete=models.PROTECT, blank=True, null=True)
    subscribed = models.TextField(
        max_length=30, choices=SUBSCRIPTION_EVENT_TYPE, default=PURCHASED_SUBSCRIBED)
    mag_subscribed = models.BooleanField(default=False)
    dig_subscribed = models.BooleanField(default=False)
    date_created = models.DateTimeField(
        null=True, blank=True, default=timezone.now)
    email = models.TextField(max_length=100, unique=True, blank=False)
    first_name = models.TextField(max_length=50, blank=False)
    last_name = models.TextField(max_length=50, blank=False)
    address_line_1 = models.TextField(max_length=50, blank=True)
    address_line_2 = models.TextField(max_length=50, blank=True)
    city = models.TextField(max_length=50, blank=True)
    state = models.TextField(max_length=50, blank=True)
    postcode = models.TextField(max_length=50, blank=True)
    country = models.TextField(max_length=50, blank=True)
    phone_number = models.TextField(max_length=50, blank=True)
    last_four = models.TextField(max_length=10, blank=True)
    exp_month = models.TextField(max_length=10, blank=True)
    exp_year = models.TextField(max_length=10, blank=True)

    @property
    def owned_access_count(self):
        purchases = Purchase.objects.filter(
            customer=self.id).distinct('product')
        digital_access = []

        for purchase in purchases:
            if purchase.product.product_type == DIGITAL:
                digital_access.append(purchase.product.id)

        return len(digital_access)

    @property
    def owned_access_products(self):
        purchases = Purchase.objects.filter(
            customer=self.id).distinct('product')
        digital_access = []

        for purchase in purchases:
            if purchase.product.product_type == DIGITAL:
                digital_access.append({
                    'purchase_id': purchase.id,
                    'id': purchase.product.id,
                    'title': purchase.product.title,
                })

        return digital_access

    @property
    def last_3_purchases(self):
        if str(get_current_user()) == "AnonymousUser":
            return None

        user = User.objects.get(email=get_current_user())
        if not user.is_staff:
            return None

        try:
            stripe_customer = StripeCustomer.objects.get(gp_customer=self.id)
            last_3 = Order.objects.filter(
                customer=stripe_customer.id).order_by('-id')[:3:-1]

            if last_3:

                orders = []
                for order in last_3:

                    orders.append({
                        'id': order.id,
                        'key': order.id,
                        'email': order.email,
                        'number': order.number,
                        'coupon': order.coupon,
                        'amount': order.amount,
                        'status': order.status,
                        'secret': order.secret,
                        'tax': order.tax,
                        'coupon_details': order.coupon_details,
                        'total_shippable_items': order.total_shippable_items,
                        'readable_date': order.readable_date,
                        'product_qty_details': order.product_qty_details,
                        'fulfillment_type': order.fulfillment_type,
                        'products_total_price': order.products_total_price,
                        'coupon_details': order.coupon_details,
                        'first_name': order.first_name,
                        'last_name': order.last_name,
                        'address_line_1': order.address_line_1,
                        'address_line_2': order.address_line_2,
                        'city': order.city,
                        'state': order.state,
                        'postcode': order.postcode,
                        'country': order.country,
                        'phone_number': order.phone_number,
                        'billing_same_address': order.billing_same_address,
                        'billing_email': order.billing_email,
                        'billing_first_name': order.billing_first_name,
                        'billing_last_name': order.billing_last_name,
                        'billing_address_line_1': order.billing_address_line_1,
                        'billing_address_line_2': order.billing_address_line_2,
                        'billing_city': order.billing_city,
                        'billing_state': order.billing_state,
                        'billing_postcode': order.billing_postcode,
                        'billing_country': order.billing_country,
                        'billing_number': order.billing_number,
                        'last_four': order.last_four,
                        'exp_month': order.exp_month,
                        'exp_year': order.exp_year,
                        'statuses': order.statuses
                    })

                return orders if orders else None

        except StripeCustomer.DoesNotExist:
            return None


class Purchase(models.Model):
    product = models.ForeignKey(
        Product,  on_delete=models.PROTECT, blank=False, null=False)
    customer = models.ForeignKey(
        Customer,  on_delete=models.PROTECT, blank=False, null=False)


class StripeCustomer(models.Model):
    customer_id = models.TextField(max_length=50, blank=False)
    user = models.ForeignKey(
        User,  on_delete=models.PROTECT, blank=True, null=True)
    stripe_email = models.TextField(max_length=70, blank=False)
    gp_customer = models.ForeignKey(
        Customer,  on_delete=models.PROTECT, blank=True, null=True)
    stripe_subscription_id = models.TextField(
        max_length=100, blank=False, null=True)


class Order(models.Model):
    customer = models.ForeignKey(
        StripeCustomer,  on_delete=models.PROTECT, blank=False, null=True)
    amount = models.FloatField(blank=False, default=0)
    products_qty = models.TextField(max_length=500, blank=False, default='{}')
    number = models.TextField(max_length=20, blank=True)
    purchase = models.ForeignKey(
        Purchase,  on_delete=models.PROTECT, blank=True, null=True)
    secret = models.TextField(max_length=30, blank=False, null=True)
    date_created = models.DateTimeField(
        null=False, blank=False, default=timezone.now)
    status = models.TextField(
        max_length=30, choices=ORDER_STATUSES, default=PENDING)
    coupon = models.TextField(max_length=20, blank=True, null=True)
    email = models.TextField(max_length=100, blank=False)
    first_name = models.TextField(max_length=50, blank=False)
    last_name = models.TextField(max_length=50, blank=False)
    address_line_1 = models.TextField(max_length=50, blank=True)
    address_line_2 = models.TextField(max_length=50, blank=True)
    city = models.TextField(max_length=50, blank=True)
    state = models.TextField(max_length=50, blank=True)
    postcode = models.TextField(max_length=50, blank=True)
    country = models.TextField(max_length=50, blank=True)
    phone_number = models.TextField(max_length=20, blank=True)
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
        items = json.loads(self.products_qty.replace("\'", "\""))
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
                        'type': product.product_type,
                        'total': int(item['qty']) * product.active_price
                    },
                    'qty': item['qty']
                })

        return item_details

    @property
    def product_types(self):
        items = json.loads(self.products_qty.replace("\'", "\""))
        item_details = []

        for item in items:
            product = Product.objects.get(id=item['id'])

            item_details.append(product.product_type)

        return item_details

    @property
    def total_shippable_items(self):
        items = json.loads(self.products_qty.replace("\'", "\""))
        total = 0

        for item in items:
            product = Product.objects.get(id=item['id'])

            if product.product_type != "digital":
                total = total + item['qty']

        return total

    @property
    def coupon_details(self):
        if self.coupon:
            coupon = Coupon.objects.get(name=self.coupon)

            description = None
            discount_amount = 0

            if coupon.coupon_type == "percentage":
                discount_amount = (coupon.amount / 100) * \
                    self.products_total_price
            else:
                discount_amount = coupon.amount

            return {
                'description': coupon.description,
                'discount_amount': discount_amount
            }

        return {
            'description': None,
            'discount_amount': 0
        }

    @property
    def tax(self):
        if self.coupon:
            return (self.products_total_price - self.coupon_details['discount_amount']) / 11

        return self.products_total_price / 11

    @property
    def products_total_price(self):
        items = json.loads(self.products_qty.replace("\'", "\""))
        total = 0

        for item in items:
            product = Product.objects.get(id=item['id'])
            total = total + (product.active_price * item['qty'])

        return total

    @property
    def fulfillment_type(self):
        fulfillment = ACCESS
        items = json.loads(self.products_qty.replace("\'", "\""))

        for item in items:
            product = Product.objects.get(id=item['id'])

            if product.product_type in [PHYSICAL, MAG_SUBSCRIPTION]:
                fulfillment = SHIPPING

        return fulfillment

    @property
    def readable_date(self):
        local_tz = pytz.timezone('Australia/Sydney')
        local_dt = self.date_created.replace(
            tzinfo=pytz.utc).astimezone(local_tz)

        return {
            'date': local_dt.strftime("%d %b %Y"),
            'time': local_dt.strftime("%I:%M %p")
        }

    @property
    def statuses(self):
        statuses = []
        queryset = OrderStatusUpdate.objects.filter(
            order=self.id).order_by('-id')

        for update in queryset:
            statuses.append({
                'id': update.id,
                'status': update.status,
                'description': update.description,
                'update_date': update.update_date,
                'readable_date': update.readable_date
            })

        return statuses


class OrderStatusUpdate(models.Model):
    status = models.TextField(
        max_length=30, choices=ORDER_STATUSES, default=PENDING)
    update_date = models.DateTimeField(
        null=True, blank=True, default=timezone.now)
    description = models.TextField(max_length=300, blank=True)
    order = models.ForeignKey(
        Order,  on_delete=models.PROTECT, blank=False, null=False)

    @property
    def readable_date(self):
        return get_readable_date_time(self.update_date)


class Coupon(models.Model):
    name = models.TextField(max_length=20, blank=False)
    coupon_type = models.TextField(
        max_length=30, choices=COUPON_TYPES, default=PERCENT)
    amount = models.FloatField(blank=False, default=0)
    date_created = models.DateTimeField(
        null=False, blank=False, default=timezone.now)
    expiry_date = models.DateTimeField(null=True, blank=True)

    @property
    def description(self):
        if self.coupon_type == "percentage":
            return "{} {}% off".format(self.name, str(self.amount))
        else:
            return "{} A${:.2f} off".format(self.name, self.amount)


class PageSEO(models.Model):
    permalink = models.TextField(max_length=100, blank=True)
    title = models.TextField(max_length=100, blank=True)
    img = models.TextField(max_length=100, blank=True)
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
        null=True, blank=True, default=timezone.now)


class ResetPasswordSession(models.Model):
    user = models.ForeignKey(
        User,  on_delete=models.PROTECT, blank=False, null=True)
    token = models.TextField(max_length=70, blank=False)
    verified_token = models.TextField(
        max_length=70, blank=False, null=True)
    created_date = models.DateTimeField(
        null=False, blank=False, default=timezone.now)


class VotingItem(models.Model):
    title = models.TextField(max_length=70, blank=False)
    author = models.TextField(max_length=70, blank=False)
    img = models.TextField(max_length=70, blank=False)


class VotingRound(models.Model):
    issue = models.IntegerField(blank=False)
    created_date = models.DateTimeField(
        null=False, blank=False, default=timezone.now)
    product = models.ForeignKey(
        Product,  on_delete=models.PROTECT, blank=False, null=False)
    item1 = models.ForeignKey(
        VotingItem,  on_delete=models.PROTECT, related_name='item1_voting_round_set', blank=False, null=True)
    item2 = models.ForeignKey(
        VotingItem,  on_delete=models.PROTECT, related_name='item2_voting_round_set', blank=False, null=True)
    item3 = models.ForeignKey(
        VotingItem,  on_delete=models.PROTECT, related_name='item3_voting_round_set', blank=False, null=True)
    item4 = models.ForeignKey(
        VotingItem,  on_delete=models.PROTECT, related_name='item4_voting_round_set', blank=False, null=True)
    item5 = models.ForeignKey(
        VotingItem,  on_delete=models.PROTECT, related_name='item5_voting_round_set', blank=False, null=True)
    item6 = models.ForeignKey(
        VotingItem,  on_delete=models.PROTECT, related_name='item6_voting_round_set', blank=False, null=True)
    item7 = models.ForeignKey(
        VotingItem,  on_delete=models.PROTECT, related_name='item7_voting_round_set', blank=False, null=True)
    item8 = models.ForeignKey(
        VotingItem,  on_delete=models.PROTECT, related_name='item8_voting_round_set', blank=False, null=True)
    item9 = models.ForeignKey(
        VotingItem,  on_delete=models.PROTECT, related_name='item9_voting_round_set', blank=False, null=True)
    item10 = models.ForeignKey(
        VotingItem,  on_delete=models.PROTECT, related_name='item10_voting_round_set', blank=False, null=True)


class Vote(models.Model):
    customer = models.ForeignKey(
        Customer,  on_delete=models.PROTECT, blank=False, null=True)
    voting_round = models.ForeignKey(
        VotingRound,  on_delete=models.PROTECT, blank=False, null=True)
    item1 = models.IntegerField(blank=False, null=True)
    item2 = models.IntegerField(blank=False, null=True)
    item3 = models.IntegerField(blank=False, null=True)
    item4 = models.IntegerField(blank=False, null=True)
    item5 = models.IntegerField(blank=False, null=True)
    item6 = models.IntegerField(blank=False, null=True)
    item7 = models.IntegerField(blank=False, null=True)
    item8 = models.IntegerField(blank=False, null=True)
    item9 = models.IntegerField(blank=False, null=True)
    item10 = models.IntegerField(blank=False, null=True)
    purchase_reason = models.TextField(
        max_length=30, choices=PURCHASE_REASONS, default=ONLINE_STORE)
    created_date = models.DateTimeField(
        null=False, blank=False, default=timezone.now)

    @property
    def readable_date(self):
        return get_readable_date_time(self.created_date)
