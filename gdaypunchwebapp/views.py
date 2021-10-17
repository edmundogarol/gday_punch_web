from django.shortcuts import render

from gdaypunchbackend.gdaypunchapi.models import (
    PageSEO
)


def index(request, id=0):
    page = None

    try:
        page = PageSEO.objects.get(permalink=request.path)
    except PageSEO.DoesNotExist:
        pass

    context = {
        'page': page
    }

    return render(request, 'index.html', context)
