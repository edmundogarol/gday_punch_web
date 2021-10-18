import re

from django.shortcuts import render

from gdaypunchbackend.gdaypunchapi.models import (
    PageSEO, Product
)

from gdaypunchbackend.settings import RESOURCE_URL

TAG_RE = re.compile(r'<[^>]+>')


def remove_tags(text):
    return TAG_RE.sub('', text)


def index(request, id=0):
    page = None
    product_id = None

    try:
        product_id = re.search(
            r'/product+/[0-9]+/*', request.path).group(0).replace("/product/", "").replace("/", "")
    except AttributeError:
        pass

    try:
        page = PageSEO.objects.get(permalink=request.path)
    except PageSEO.DoesNotExist:
        if product_id:

            try:
                product = Product.objects.get(id=product_id)

                page = {
                    'title': product.title + " | Gday Punch",
                    'img': product.image,
                    'description': remove_tags(product.description)
                }
            except Product.DoesNotExist:
                pass
        pass

    context = {
        'resource_url': RESOURCE_URL,
        'page': page
    }

    return render(request, 'index.html', context)
