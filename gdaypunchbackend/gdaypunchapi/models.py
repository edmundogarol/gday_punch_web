from django.db import models
from django.contrib.auth.models import AbstractUser


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


class User(AbstractUser):
    first_name = models.TextField(max_length=50, blank=False)
    last_name = models.TextField(max_length=50, blank=False)
    username = models.TextField(max_length=50, blank=False, unique=True)
    email = models.TextField(max_length=50, blank=False)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    roles = models.ManyToManyField(Role, blank=False)
    # is_staff, is_active, date_joined, 