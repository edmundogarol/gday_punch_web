# User privileges
SUPER = 1
ADMIN = 2
PROMPTS = 3
PRODUCTS = 4
TWITTER = 5
INSTAGRAM = 6
SHOP_TESTER = 7

PRIVILEGES = (
    (SUPER, "super"),
    (ADMIN, "admin"),
    (PROMPTS, "prompts"),
    (PRODUCTS, "products"),
    (TWITTER, "twitter"),
    (INSTAGRAM, "instagram"),
    (SHOP_TESTER, "shop_tester"),
)

# User list ordering (Admin)
BY_ID = "by_id"
BY_LAST_LOGIN = "by_last_login"

USER_LIST_ORDER = ((BY_ID, "By Id"), (BY_LAST_LOGIN, "By Last Login"))

NO_SKU = "NO_SKU"

# Product Types
PHYSICAL = "physical"
DIGITAL = "digital"
SUBSCRIPTION = "subscription"
PHYSICAL_COLLECTION = "physical_collection"
DIGITAL_COLLECTION = "digital_collection"
MIXED_COLLECTION = "mixed_collection"
# Admin required to created this product type
MAG_SUBSCRIPTION = "mag_subscription"
# Admin required to created this product type
DIG_SUBSCRIPTION = "dig_subscription"

# Manga => can belong to => multiple Products (eg. Digital, Dig_Subscription)
PRODUCT_TYPES = (
    (PHYSICAL, "Physical"),
    (DIGITAL, "Digital"),
    (SUBSCRIPTION, "Subscription"),
    (PHYSICAL_COLLECTION, "Physical Collection"),
    (DIGITAL_COLLECTION, "Digital Collection"),
    (MIXED_COLLECTION, "Mixed Collection"),
    (MAG_SUBSCRIPTION, "Magazines Subscription"),
    (DIG_SUBSCRIPTION, "Digitals Subscription"),
)

# Price Types
RECURRING = "recurring"
ONE_TIME = "one_time"

PRICE_TYPES = (
    (RECURRING, "Recurring"),
    (ONE_TIME, "One Time"),
)

# Order Statuses
PENDING = "pending"
SHIPPED = "shipped"
DECLINED = "declined"
PURCHASED = "purchased"
REFUNDED = "refunded"
PARTIALLY_REFUNDED = "partially_refunded"

ORDER_STATUSES = (
    (PENDING, "Pending"),
    (SHIPPED, "Shipped"),
    (DECLINED, "Declined"),
    (PURCHASED, "Purchased"),
    (REFUNDED, "Refunded"),
    (PARTIALLY_REFUNDED, "Partially Refunded"),
)

# Subscribe Event Types
SUBSCRIBED_ONLY = "subscribed_only"
DOWNLOAD_SUBSCRIBED = "download_subscribed"
PURCHASED_SUBSCRIBED = "purchased_subscribed"
CHECKOUT_SUBSCRIBED = "checkout_subscribed"
NOT_SUBSCRIBED = "not_subscribed"
UNSUBSCRIBED = "unsubscribed"

SUBSCRIPTION_EVENT_TYPE = (
    (SUBSCRIBED_ONLY, "Subscribed Only"),
    (DOWNLOAD_SUBSCRIBED, "Downloaded Resource and Subscribed"),
    (PURCHASED_SUBSCRIBED, "Purchased and Subscribed"),
    (CHECKOUT_SUBSCRIBED, "Subscribed at Checkout"),
    (NOT_SUBSCRIBED, "Not Subscribed"),
    (UNSUBSCRIBED, "Unsubscribed"),
)

# Fulfillment Type
SHIPPING = "shipping"
ACCESS = "access"

FULFILLMENT_TYPE = (
    (SHIPPING, "Shipping"),
    (ACCESS, "Access"),
)

# Coupon Types
PERCENT = "percentage"
AMOUNT = "amount"

COUPON_TYPES = (
    (PERCENT, "Percentage"),
    (AMOUNT, "Amount"),
)

# Purchase Reasons
FRIEND = "friend"
SALES_CALL = "sales_call"
WEB_SEARCH = "web_search"
AMAA_GROUP = "amaa_group"
FB_PAGE = "fb_page"
IG_PROFILE = "ig_profile"
TW_PROFILE = "tw_profile"
YT_CHANNEL = "yt_channel"
TT_ACCOUNT = "tt_account"
FB_AD = "fb_ad"
IG_AD = "ig_ad"
LIBRARY = "library"
SCHOOL = "school"
ONLINE_STORE = "online_store"
COMIC_STORE = "comic_store"
BOOK_STORE = "book_store"
POSTERS_FLYERS = "posters_flyers"
OTHER_REASON = "other_reason"

PURCHASE_REASONS = (
    (FRIEND, "Friend"),
    (SALES_CALL, "Sales Call"),
    (WEB_SEARCH, "Web Search"),
    (AMAA_GROUP, "Anime and Manga Artists Australia Group"),
    (FB_PAGE, "Facebook Page"),
    (IG_PROFILE, "Instagram Profile"),
    (TW_PROFILE, "Twitter Profile"),
    (YT_CHANNEL, "YouTube Channel"),
    (TT_ACCOUNT, "TikTok Account"),
    (FB_AD, "Facebook Ad"),
    (IG_AD, "Instagram Ad"),
    (LIBRARY, "Library"),
    (SCHOOL, "School"),
    (ONLINE_STORE, "Online Store"),
    (COMIC_STORE, "Comic Store"),
    (BOOK_STORE, "Book Store"),
    (POSTERS_FLYERS, "Posters and Flyers"),
    (OTHER_REASON, "Other"),
)

# Payout status updates
PAYOUT_SCHEDULED = "scheduled"
PAYOUT_PROCESSING = "processing"
PAYOUT_SUCCEEDED = "succeeded"
PAYOUT_FAILED = "failed"
PAYOUT_RETRYING = "retrying"

PAYOUT_STATUSES = (
    (PAYOUT_PROCESSING, "Payout Processing"),
    (PAYOUT_SUCCEEDED, "Payout Succeeded"),
    (PAYOUT_FAILED, "Payout Failed"),
    (PAYOUT_RETRYING, "Payout Retrying"),
)
