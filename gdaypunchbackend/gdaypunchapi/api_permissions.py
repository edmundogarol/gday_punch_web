from rest_framework.permissions import BasePermission

from .models import (
    User,
    Order,
    Comment,
    Like,
    Product,
    StripeCustomer,
    Customer,
    Save,
    Follow,
    Friend,
)


def staff(request):
    return request.user.is_authenticated and request.user.is_staff


# Only allow logged in users to create and edit their own comments (create, retrieve, partial, destroy)
class UserPermissions(BasePermission):
    def has_permission(self, request, view):
        if staff(request):
            return True
        elif view.action in ["create"]:
            return True
        elif view.action in ["retrieve", "partial_update"]:
            user_id = view.kwargs.get("pk")

            if request.user.is_authenticated:
                try:
                    user = User.objects.get(id=user_id)
                    return user.email.strip() == str(request.user).strip()
                except User.DoesNotExist:
                    return False
        else:
            return False


# Only allow logged in users to create and edit their own comments (create, retrieve, partial, destroy)
class CommentPermissions(BasePermission):
    def has_permission(self, request, view):
        if staff(request):
            return True
        elif view.action in ["create", "retrieve"]:
            return request.user.is_authenticated
        elif view.action in ["partial_update", "destroy"]:
            comment_id = view.kwargs.get("pk")

            if request.user.is_authenticated:
                try:
                    comment = Comment.objects.get(id=comment_id)
                    return comment.user.email.strip() == str(request.user).strip()
                except Comment.DoesNotExist:
                    return False
        else:
            return False


# Only allow authenticated users to get manga comments (retrieve)
class MangaCommentsPermissions(BasePermission):
    def has_permission(self, request, view):
        if staff(request):
            return True
        elif view.action in ["retrieve"]:
            return request.user.is_authenticated
        else:
            return False


# Allow any user to create customer but only authenticated to fetch their own (create, retrieve)
class CustomerPermissions(BasePermission):
    def has_permission(self, request, view):
        customer_id = view.kwargs.get("pk")

        if staff(request):
            return True
        elif view.action in ["create"]:
            return True
        elif view.action in ["retrieve"]:
            if request.user.is_authenticated:
                if customer_id == "null":
                    return False
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
        elif view.action in ["create"]:
            return request.user.is_authenticated
        elif view.action in ["destroy"]:
            like_id = view.kwargs.get("pk")

            if request.user.is_authenticated:
                try:
                    like = Like.objects.get(id=like_id)
                    return like.user.email.strip() == str(request.user).strip()
                except Like.DoesNotExist:
                    return False
        else:
            return False


# Only allow logged in users to create and delete their likes (create, destroy)
class FollowPermissions(BasePermission):
    def has_permission(self, request, view):
        if staff(request):
            return True
        elif view.action in ["create"]:
            return request.user.is_authenticated
        elif view.action in ["destroy"]:
            follow_id = view.kwargs.get("pk")

            if request.user.is_authenticated:
                try:
                    follow = Follow.objects.get(id=follow_id)
                    return follow.follower.email.strip() == str(request.user).strip()
                except Like.DoesNotExist:
                    return False
        else:
            return False


# /Current/ Allows all users to retrieve manga details
# TODO Need to make mangas endpoints only available through authenticated users / once gdaypunch.com replaces beta-gdaypunch
# Only allow logged in users to fetch single manga details (retrieve)
class MangaDetailPermissions(BasePermission):
    def has_permission(self, request, view):
        if staff(request):
            return True
        elif view.action in ["retrieve"]:
            # return request.user.is_authenticated
            return True
        else:
            return False


# Only allow authenticated users to get their orders (retrieve)
class OrdersByUserPermissions(BasePermission):
    def has_permission(self, request, view):
        customer_id = view.kwargs.get("pk")

        if staff(request):
            return True
        elif view.action in ["retrieve"]:
            if request.user.is_authenticated:
                if customer_id == "null":
                    return False
                try:
                    stripe_customer = StripeCustomer.objects.get(id=customer_id)
                    return (
                        stripe_customer.user.email.strip() == str(request.user).strip()
                    )
                except StripeCustomer.DoesNotExist:
                    return False
                except Order.DoesNotExist:
                    return False
        else:
            return False


# Only allow authenticated users to get their order (retrieve)
class OrderDetailsPermissions(BasePermission):
    def has_permission(self, request, view):
        order_id = view.kwargs.get("pk")

        if staff(request):
            return True
        elif view.action in ["retrieve"]:
            if request.user.is_authenticated:
                try:
                    order = Order.objects.get(id=order_id)
                    stripe_customer = StripeCustomer.objects.get(id=order.customer)

                    return (
                        stripe_customer.user.email.strip() == str(request.user).strip()
                    )
                except StripeCustomer.DoesNotExist:
                    return False
                except Order.DoesNotExist:
                    return False
        else:
            return False


# Only allow authenticated users to get their order's status updates (retrieve)
class OrderStatusUpdatesPermissions(BasePermission):
    def has_permission(self, request, view):
        order_id = view.kwargs.get("pk")

        if staff(request):
            return True
        elif view.action in ["retrieve"]:
            if request.user.is_authenticated:
                try:
                    order = Order.objects.get(id=order_id)
                    stripe_customer = StripeCustomer.objects.get(id=order.customer)

                    return (
                        stripe_customer.user.email.strip() == str(request.user).strip()
                    )
                except StripeCustomer.DoesNotExist:
                    return False
                except Order.DoesNotExist:
                    return False
        else:
            return False


# Only allow authenticated users to get and edit their products (retrieve, update, partial_update)
# Allow all users to get list of visible products (list)
class ProductPermissions(BasePermission):
    def has_permission(self, request, view):
        product_id = view.kwargs.get("pk")
        WRITE_METHODS = [
            "POST",
        ]

        if request.method in WRITE_METHODS or staff(request):
            return True
        elif view.action in ["create", "list"]:
            return True
        elif view.action in ["retrieve"]:
            try:
                product = Product.objects.get(id=product_id)
                return product.visible
            except Product.DoesNotExist:
                return True
        elif view.action in ["update", "partial_update", "destroy"]:
            if request.user.is_authenticated:
                try:
                    product = Product.objects.get(id=product_id)
                    return product.user.email.strip() == str(request.user).strip()
                except Product.DoesNotExist:
                    return False
        else:
            return False


# Only allow authenticated users to get and edit their products (retrieve, update, partial_update)
# Allow all users to get list of visible products (list)
class FollowingPermissions(BasePermission):
    def has_permission(self, request, view):
        follower = view.kwargs.get("pk")

        if staff(request):
            return True
        elif view.action in ["list", "retrieve"]:
            return True
        else:
            return False


# Clean non-useable retrieve endpoints
class PromptsPermissions(BasePermission):
    def has_permission(self, request, view):
        if staff(request):
            return True
        elif view.action in ["list"]:
            return True
        else:
            return False


class CommentLikePermissions(BasePermission):
    def has_permission(self, request, view):

        if staff(request):
            return True
        elif view.action in ["create", "destroy"]:
            return request.user.is_authenticated
        elif view.action in ["update", "partial_update", "list", "retrieve"]:
            return False
        else:
            return False


class SavePermissions(BasePermission):
    def has_permission(self, request, view):

        if staff(request):
            return True
        elif view.action in ["create"]:
            return request.user.is_authenticated
        elif view.action in ["destroy"]:
            save_id = view.kwargs.get("pk")

            if request.user.is_authenticated:
                try:
                    save = Save.objects.get(id=save_id)
                    return save.user.email.strip() == str(request.user).strip()
                except Save.DoesNotExist:
                    return False
        elif view.action in ["update", "partial_update", "list", "retrieve"]:
            return False
        else:
            return False
