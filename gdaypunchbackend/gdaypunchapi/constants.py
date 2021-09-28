
# Product Types
PHYSICAL = 'physical'
DIGITAL = 'digital'
SUBSCRIPTION = 'subscription'
PHYSICAL_COLLECTION = 'physical_collection'
DIGITAL_COLLECTION = 'digital_collection'
MIXED_COLLECTION = 'mixed_collection'
# Admin required to created this product type
MAG_SUBSCRIPTION = 'mag_subscription'
# Admin required to created this product type
DIG_SUBSCRIPTION = 'dig_subscription'

# Manga => can belong to => multiple Products (eg. Digital, Dig_Subscription)
PRODUCT_TYPES = (
    (PHYSICAL, 'Physical'),
    (DIGITAL, 'Digital'),
    (SUBSCRIPTION, 'Subscription'),
    (PHYSICAL_COLLECTION, 'Physical Collection'),
    (DIGITAL_COLLECTION, 'Digital Collection'),
    (MIXED_COLLECTION, 'Mixed Collection'),
    (MAG_SUBSCRIPTION, 'Magazines Subscription'),
    (DIG_SUBSCRIPTION, 'Digitals Subscription'),
)

# Price Types
RECURRING = 'recurring'
ONE_TIME = 'one_time'

PRICE_TYPES = (
    (RECURRING, 'Recurring'),
    (ONE_TIME, 'One Time'),
)

# Order Statuses
PENDING = 'pending'
SHIPPED = 'shipped'
DECLINED = 'declined'
PURCHASED = 'purchased'
REFUNDED = 'refunded'
PARTIALLY_REFUNDED = 'partially_refunded'

ORDER_STATUSES = (
    (PENDING, 'Pending'),
    (SHIPPED, 'Shipped'),
    (DECLINED, 'Declined'),
    (PURCHASED, 'Purchased'),
    (REFUNDED, 'Refunded'),
    (PARTIALLY_REFUNDED, 'Partially Refunded'),
)

# Subscribe Event Types
SUBSCRIBED_ONLY = 'subscribed_only'
DOWNLOAD_SUBSCRIBED = 'download_subscribed'
PURCHASED_SUBSCRIBED = 'purchased_subscribed'
CHECKOUT_SUBSCRIBED = 'checkout_subscribed'
NOT_SUBSCRIBED = 'not_subscribed'

SUBSCRIPTION_EVENT_TYPE = (
    (SUBSCRIBED_ONLY, 'Subscribed Only'),
    (DOWNLOAD_SUBSCRIBED, 'Downloaded Resource and Subscribed'),
    (PURCHASED_SUBSCRIBED, 'Purchased and Subscribed'),
    (CHECKOUT_SUBSCRIBED, 'Subscribed at Checkout'),
    (NOT_SUBSCRIBED, 'Not Subscribed'),
)

# Fulfillment Type
SHIPPING = 'shipping'
ACCESS = 'access'

FULFILLMENT_TYPE = (
    (SHIPPING, 'Shipping'),
    (ACCESS, 'Access'),
)

# Coupon Types
PERCENT = 'percentage'
AMOUNT = 'amount'

COUPON_TYPES = (
    (PERCENT, 'Percentage'),
    (AMOUNT, 'Amount'),
)
