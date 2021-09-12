
# Product Types
PHYSICAL = 'physical'
DIGITAL = 'digital'
SUBSCRIPTION = 'subscription'
PRODUCT_TYPES = (
    (PHYSICAL, 'Physical'),
    (DIGITAL, 'Digital'),
    (SUBSCRIPTION, 'Subscription'),
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

# Coupon Types
PERCENT = 'percentage'
AMOUNT = 'amount'

COUPON_TYPES = (
    (PERCENT, 'Percentage'),
    (AMOUNT, 'Amount'),
)
