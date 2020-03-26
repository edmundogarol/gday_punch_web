from django.db import models
from django.contrib.auth.models import AbstractUser

class Role(models.Model):
  '''
  The Role entries are managed by the system,
  automatically created via a Django data migration.
  '''
  ARTIST = 1
  EDITOR = 2
  ADMIN = 3
  ROLE_CHOICES = (
      (ARTIST, 'artist'),
      (EDITOR, 'editor'),
      (ADMIN, 'admin'),
  )

  id = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, primary_key=True)

  def __str__(self):
      return self.get_id_display()

class User(AbstractUser):
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    roles = models.ManyToManyField(Role)