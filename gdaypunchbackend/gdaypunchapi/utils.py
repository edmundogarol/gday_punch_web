import os
import pytz

from rest_framework.permissions import (BasePermission)

if 'DEVENV' in os.environ:
    log = True
else:
    log = False


def devprint(message):
    if log:
        print(message)


def get_readable_date_time(date):
    local_tz = pytz.timezone('Australia/Sydney')
    local_dt = date.replace(tzinfo=pytz.utc).astimezone(local_tz)

    return {
        'date': local_dt.strftime("%d/%m/%y"),
        'time': local_dt.strftime("%I:%M %p")
    }


def staff(request):
    return request.user.is_authenticated and request.user.is_staff


class PostOnly(BasePermission):
    def has_permission(self, request, view):
        WRITE_METHODS = ["POST", ]

        return request.method in WRITE_METHODS or staff(request)


class AdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        READ_METHODS = ["GET", ]

        if request.method in READ_METHODS or staff(request):
            return True
        else:
            return False


class AuthenticatedOrPostOnly(BasePermission):
    def has_permission(self, request, view):
        WRITE_METHODS = ["POST", ]

        if request.method in WRITE_METHODS or staff(request):
            return True
        elif view.action in ['create', 'update', 'partial_update', 'destroy', 'list', 'retrieve']:
            return request.user.is_authenticated
        else:
            return False


class AdminOnly(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff


class AuthenticatedCreateOnly(BasePermission):
    def has_permission(self, request, view):
        if staff(request):
            return True
        elif view.action in ['create']:
            return request.user.is_authenticated
        elif view.action in ['list', 'retrieve', 'update', 'partial_update', 'destroy']:
            return False
        else:
            return False


class AuthenticatedCreateAndEditOnly(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.is_staff:
            return True
        elif view.action in ['create', 'update', 'partial_update', 'destroy']:
            return request.user.is_authenticated
        elif view.action in ['list', 'retrieve']:
            return False
        else:
            return False
