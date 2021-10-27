import random


def generate_random_sku():
    sku = ""
    random_array = random.sample(range(10, 1000), 2)
    for elem in random_array:
        sku = sku + str(elem)

    return sku


def get_new_sku():
    from .models import Product

    sku = None

    while sku is None:
        try:
            new_sku = generate_random_sku()
            existing_product = Product.objects.get(sku=new_sku)
        except Product.DoesNotExist:
            sku = new_sku

    return sku


def create_default_sku():
    return "DEFAULT_" + get_new_sku()
