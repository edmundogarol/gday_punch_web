from rest_framework.permissions import (BasePermission)

from .models import Customer, User, Order


def staff(request):
    return request.user.is_authenticated and request.user.is_staff


# Only allow logged in users to create and edit their own comments (create, partial, destroy)
class CommentPermissions(BasePermission):

    def has_permission(self, request, view):
        if staff(request):
            return True
        elif view.action in ['create', 'partial_update', 'destroy']:
            return request.user.is_authenticated
        else:
            return False


# Only allow authenticated users to get manga comments (retrieve)
class MangaCommentsPermissions(BasePermission):

    def has_permission(self, request, view):
        if staff(request):
            return True
        elif view.action in ['retrieve']:
            return request.user.is_authenticated
        else:
            return False


# Allow any user to create customer but only authenticated to fetch their own (create, retrieve)
class CustomerPermissions(BasePermission):

    def has_permission(self, request, view):
        customer_id = view.kwargs.get('pk')

        if staff(request):
            return True
        elif view.action in ['create']:
            return True
        elif view.action in ['retrieve']:
            if request.user.is_authenticated:
                try:
                    customer = Customer.objects.get(id=customer_id)
                    return customer.user.email.strip() == str(request.user).strip()
                except Customer.DoesNotExist:
                    return False
        else:
            return False


# Only allow logged in users to create and delete their likes (create, destroy)
class LikePermissions(BasePermission):

    def has_permission(self, request, view):
        if staff(request):
            return True
        elif view.action in ['create', 'destroy']:
            return request.user.is_authenticated
        else:
            return False


# /Current/ Allows all users to retrieve manga details
# TODO Need to make mangas endpoints only available through authenticated users
# Only allow logged in users to fetch single manga details (retrieve)
class MangaDetailPermissions(BasePermission):

    def has_permission(self, request, view):
        if staff(request):
            return True
        elif view.action in ['retrieve']:
            # return request.user.is_authenticated
            return True
        else:
            return False


# Only allow authenticated users to get their orders (retrieve)
class OrdersByUserPermissions(BasePermission):

    def has_permission(self, request, view):
        order_id = view.kwargs.get('pk')

        if staff(request):
            return True
        elif view.action in ['retrieve']:
            if request.user.is_authenticated:
                try:
                    order = Order.objects.get(id=order_id)
                    customer = Customer.objects.get(id=order.customer.id)
                    return customer.user.email.strip() == str(request.user).strip()
                except Customer.DoesNotExist:
                    return False
                except Order.DoesNotExist:
                    return False
        else:
            return False


# class CommentLikePermissions(BasePermission):
#     def has_permission(self, request, view):
#         WRITE_METHODS = ["POST", ]

#         if staff(request):
#             return True
#         elif request.method in WRITE_METHODS:
#             return request.user.is_authenticated
#         elif view.action in ['create', 'update', 'partial_update', 'destroy', 'list', 'retrieve']:
#             return request.user.is_authenticated
#         else:
#             return False
