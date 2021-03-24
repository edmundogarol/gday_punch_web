from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework import exceptions
from django.db.models import Count
from django_currentuser.middleware import (
    get_current_user, get_current_authenticated_user)
from django_currentuser.db.models import CurrentUserField


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


class User(AbstractBaseUser, PermissionsMixin):
    email = models.TextField(max_length=50, blank=False, unique=True)
    first_name = models.TextField(max_length=50, blank=True)
    last_name = models.TextField(max_length=50, blank=True)
    username = models.TextField(max_length=50, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    roles = models.ManyToManyField(Role, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'


class Manga(models.Model):
    title = models.TextField(max_length=50, blank=False)
    author = models.ForeignKey(User,  on_delete=models.PROTECT)
    pdf = models.TextField(max_length=100, blank=True)
    cover = models.TextField(max_length=100, blank=True)

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
        user = User.objects.get(email=get_current_user())
        liked = Like.objects.all().filter(user=user, manga=self.id).count()
        if liked > 0:
            return True
        else:
            return False


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
        if liked > 0:
            return True
        else:
            return False


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

    def __str__(self):
        return self.get_id_display()


class Collection(models.Model):
    owner = models.ForeignKey(User,  on_delete=models.PROTECT)
    name = models.TextField(max_length=50, blank=False)
    mangas = models.ManyToManyField(Manga, blank=False)
    collectionType = models.ForeignKey(
        CollectionType,  on_delete=models.PROTECT)


class Prompt(models.Model):
    prompt = models.TextField(max_length=50, blank=False)
    user = models.ForeignKey(User,  on_delete=models.PROTECT, blank=True)
    meta = models.TextField(max_length=50, blank=False)
