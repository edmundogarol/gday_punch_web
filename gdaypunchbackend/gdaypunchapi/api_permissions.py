from rest_framework.permissions import (BasePermission)


def staff(request):
    return request.user.is_authenticated and request.user.is_staff


# Only allow logged in users to create and edit their own comments (create)
class CommentPermissions(BasePermission):

    def has_permission(self, request, view):
        if staff(request):
            return True
        elif view.action in ['create', 'partial_update', 'destroy']:
            return request.user.is_authenticated
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
