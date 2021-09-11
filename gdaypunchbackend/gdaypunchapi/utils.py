from rest_framework.permissions import (BasePermission)


class PostOnlyPermissions(BasePermission):
    def has_permission(self, request, view):
        WRITE_METHODS = ["POST", ]

        return (
            request.method in WRITE_METHODS or
            request.user and
            request.user.is_authenticated
        )


class AuthenticatedOrPostOnly(BasePermission):
    def has_permission(self, request, view):
        WRITE_METHODS = ["POST", ]
        READ_METHODS = ["GET", ]

        return (
            request.method in WRITE_METHODS or
            request.method in READ_METHODS and
            request.user and
            request.user.is_authenticated
        )
