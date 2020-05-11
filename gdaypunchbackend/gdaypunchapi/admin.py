from django.contrib import admin

# Register your models here.
from .models import User, Role, Manga, Like

admin.site.register(User)
admin.site.register(Role)
admin.site.register(Manga)
admin.site.register(Like)
