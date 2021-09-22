export const DO_TWEET = "admin/DO_TWEET";
export const DO_UPDATE_TWEET_IMAGE = "admin/DO_UPDATE_TWEET_IMAGE";
export const DO_UPDATE_TWEET_STATUS = "admin/DO_UPDATE_TWEET_STATUS";
export const DO_UPDATE_RETWEET_URL = "admin/DO_UPDATE_RETWEET_URL";
export const TWEET_ERROR = "admin/TWEET_ERROR";
export const TWEET_LOADING = "admin/TWEET_LOADING";
export const TWEET_FINISHED = "admin/TWEET_FINISHED";
export const TWEET_RESET = "admin/TWEET_RESET";
export const SET_DELETING_TWEET = "admin/SET_DELETING_TWEET";

export const FETCH_PROMPTS = "admin/FETCH_PROMPTS";
export const UPDATE_PROMPTS = "admin/UPDATE_PROMPTS";
export const START_FETCHING_PROMPTS = "admin/START_FETCHING_PROMPTS";
export const FINISH_FETCHING_PROMPTS = "admin/FINISH_FETCHING_PROMPTS";
export const CREATE_PROMPT = "admin/CREATE_PROMPT";
export const SELECT_PROMPT = "admin/SELECT_PROMPT";
export const UPDATE_PANEL_STYLE_PROMPT = "admin/UPDATE_PANEL_STYLE_PROMPT";
export const FETCH_PANEL_STYLE_PROMPT = "admin/FETCH_PANEL_STYLE_PROMPT";
export const RESET_FETCHING_PROMPTS_STATUS =
  "admin/RESET_FETCHING_PROMPTS_STATUS";
export const START_FETCHING_PANEL_STYLE_PROMPT =
  "admin/START_FETCHING_PANEL_STYLE_PROMPT";
export const FINISH_FETCHING_PANEL_STYLE_PROMPT =
  "admin/FINISH_FETCHING_PANEL_STYLE_PROMPT";

export const FETCH_ADMIN_PRODUCTS = "admin/FETCH_ADMIN_PRODUCTS";
export const FETCHING_ADMIN_PRODUCTS = "admin/FETCHING_ADMIN_PRODUCTS";
export const FINISHED_FETCHING_ADMIN_PRODUCTS =
  "admin/FINISHED_FETCHING_ADMIN_PRODUCTS";
export const UPDATE_ADMIN_PRODUCTS = "admin/UPDATE_ADMIN_PRODUCTS";
export const CREATE_ADMIN_PRODUCT = "admin/CREATE_ADMIN_PRODUCT";
export const DELETE_ADMIN_PRODUCT = "admin/DELETE_ADMIN_PRODUCT";
export const SET_EDITING_PRODUCT = "admin/SET_EDITING_PRODUCT";
export const UPDATE_ADMIN_PRODUCT = "admin/UPDATE_ADMIN_PRODUCT";

export const FETCH_STRIPE_PRODUCTS = "admin/FETCH_STRIPE_PRODUCTS";
export const FETCHING_STRIPE_PRODUCTS = "admin/FETCHING_STRIPE_PRODUCTS";
export const FINISHED_FETCHING_STRIPE_PRODUCTS =
  "admin/FINISHED_FETCHING_STRIPE_PRODUCTS";
export const UPDATE_STRIPE_PRODUCTS = "admin/UPDATE_STRIPE_PRODUCTS";

export const CREATE_STRIPE_PRICE = "admin/CREATE_STRIPE_PRICE";
export const FETCH_STRIPE_PRICES = "admin/FETCH_STRIPE_PRICES";
export const REGISTER_STRIPE_PRICE = "admin/REGISTER_STRIPE_PRICE";
export const FETCHING_STRIPE_PRICES = "admin/FETCHING_STRIPE_PRICES";
export const FINISHED_FETCHING_STRIPE_PRICES =
  "admin/FINISHED_FETCHING_STRIPE_PRICES";
export const UPDATE_STRIPE_PRICES = "admin/UPDATE_STRIPE_PRICES";

export const FETCH_CONTACT_ENTRIES = "admin/FETCH_CONTACT_ENTRIES";
export const FETCHING_CONTACT_ENTRIES = "admin/FETCHING_CONTACT_ENTRIES";
export const FINISHED_FETCHING_CONTACT_ENTRIES =
  "admin/FINISHED_FETCHING_CONTACT_ENTRIES";
export const UPDATE_CONTACT_ENTRIES = "admin/UPDATE_CONTACT_ENTRIES";
export const DELETE_CONTACT_ENTRY = "admin/DELETE_CONTACT_ENTRY";

export const FETCH_COUPONS = "admin/FETCH_COUPONS";
export const FETCHING_COUPONS = "admin/FETCHING_COUPONS";
export const FINISHED_FETCHING_COUPONS = "admin/FINISHED_FETCHING_COUPONS";
export const UPDATE_COUPONS = "admin/UPDATE_COUPONS";
export const CREATE_COUPON = "admin/CREATE_COUPON";

export const FETCH_ORDERS = "admin/FETCH_ORDERS";
export const UPDATE_ORDERS = "admin/UPDATE_ORDERS";
export const FETCHING_ORDERS = "admin/FETCHING_ORDERS";
export const FINISHED_FETCHING_ORDERS = "admin/FINISHED_FETCHING_ORDERS";
export const FETCH_ORDERS_STATUS_UPDATES = "admin/FETCH_ORDERS_STATUS_UPDATES";
export const UPDATE_ORDER_STATUS_UPDATES = "admin/UPDATE_ORDER_STATUS_UPDATES";
export const SET_SELECTED_ORDER = "admin/SET_SELECTED_ORDER";
export const UPDATE_ORDER = "admin/UPDATE_ORDER";
export const UPDATE_ORDER_STATUS = "admin/UPDATE_ORDER_STATUS";
export const UPDATE_STATUS_REASON = "admin/UPDATE_STATUS_REASON";
export const UPDATE_PARTIAL_REFUND_AMOUNT =
  "admin/UPDATE_PARTIAL_REFUND_AMOUNT";

export const doTweet = () => ({
  type: DO_TWEET,
});

export const startTweetLoading = () => ({
  type: TWEET_LOADING,
});

export const finishedTweet = (embedded) => ({
  type: TWEET_FINISHED,
  payload: {
    embedded,
  },
});

export const setDeletingTweet = (statusId) => ({
  type: SET_DELETING_TWEET,
  payload: {
    statusId,
  },
});

export const tweetError = (error) => ({
  type: TWEET_ERROR,
  payload: {
    error,
  },
});

export const doResetTweet = (embedded) => ({
  type: TWEET_RESET,
});

export const doUpdateTweetImage = (image) => ({
  type: DO_UPDATE_TWEET_IMAGE,
  payload: {
    image,
  },
});

export const doUpdateTweetStatus = (status = "") => ({
  type: DO_UPDATE_TWEET_STATUS,
  payload: {
    status,
  },
});

export const doUpdateReTweetUrl = (url) => ({
  type: DO_UPDATE_RETWEET_URL,
  payload: {
    url,
  },
});

export const fetchPrompts = (random) => ({
  type: FETCH_PROMPTS,
  payload: {
    random,
  },
});

export const startFetchingPrompts = () => ({
  type: START_FETCHING_PROMPTS,
});

export const finishFetchingPrompts = () => ({
  type: FINISH_FETCHING_PROMPTS,
});

export const updatePrompts = (prompts) => ({
  type: UPDATE_PROMPTS,
  payload: {
    prompts,
  },
});

export const fetchPanelStylePrompt = () => ({
  type: FETCH_PANEL_STYLE_PROMPT,
});

export const startFetchingPanelStylePrompt = () => ({
  type: START_FETCHING_PANEL_STYLE_PROMPT,
});

export const finishFetchingPanelStylePrompt = () => ({
  type: FINISH_FETCHING_PANEL_STYLE_PROMPT,
});

export const updatePanelStylePrompt = (prompt) => ({
  type: UPDATE_PANEL_STYLE_PROMPT,
  payload: {
    prompt,
  },
});

export const createPrompt = (prompt) => ({
  type: CREATE_PROMPT,
  payload: {
    prompt,
  },
});

export const resetPromptFetch = () => ({
  type: RESET_FETCHING_PROMPTS_STATUS,
});

export const selectPrompt = (promptId) => ({
  type: SELECT_PROMPT,
  payload: {
    promptId,
  },
});

export const fetchAdminProducts = () => ({
  type: FETCH_ADMIN_PRODUCTS,
});

export const fetchStripeProducts = () => ({
  type: FETCH_STRIPE_PRODUCTS,
});

export const fetchingAdminProducts = () => ({
  type: FETCHING_ADMIN_PRODUCTS,
});

export const fetchingStripeProducts = () => ({
  type: FETCHING_STRIPE_PRODUCTS,
});

export const finishedFetchingAdminProducts = () => ({
  type: FINISHED_FETCHING_ADMIN_PRODUCTS,
});

export const finishedFetchingStripeProducts = () => ({
  type: FINISHED_FETCHING_STRIPE_PRODUCTS,
});

export const updateAdminProducts = (products) => ({
  type: UPDATE_ADMIN_PRODUCTS,
  payload: {
    products,
  },
});

export const updateStripeProducts = (products) => ({
  type: UPDATE_STRIPE_PRODUCTS,
  payload: {
    products,
  },
});

export const createAdminProduct = (product, history) => ({
  type: CREATE_ADMIN_PRODUCT,
  payload: {
    product,
    history,
  },
});

export const updateAdminProduct = (product, history) => ({
  type: UPDATE_ADMIN_PRODUCT,
  payload: {
    product,
    history,
  },
});

export const deleteAdminProduct = (productId) => ({
  type: DELETE_ADMIN_PRODUCT,
  payload: {
    productId,
  },
});

export const setEditProduct = (productId) => ({
  type: SET_EDITING_PRODUCT,
  payload: {
    productId,
  },
});

export const createStripePrice = (price) => ({
  type: CREATE_STRIPE_PRICE,
  payload: {
    price,
  },
});

export const registerStripePrice = (stripePrice) => ({
  type: REGISTER_STRIPE_PRICE,
  payload: {
    stripePrice,
  },
});

export const fetchStripePrices = () => ({
  type: FETCH_STRIPE_PRICES,
});

export const fetchingStripePrices = () => ({
  type: FETCHING_STRIPE_PRICES,
});

export const finishedFetchingStripePrices = () => ({
  type: FINISHED_FETCHING_STRIPE_PRICES,
});

export const updateStripePrices = (prices) => ({
  type: UPDATE_STRIPE_PRICES,
  payload: {
    prices,
  },
});

export const fetchContactEntries = () => ({
  type: FETCH_CONTACT_ENTRIES,
});

export const fetchingContactEntries = () => ({
  type: FETCHING_CONTACT_ENTRIES,
});

export const finishedFetchingContactEntries = () => ({
  type: FINISHED_FETCHING_CONTACT_ENTRIES,
});

export const updateContactEntries = (entries) => ({
  type: UPDATE_CONTACT_ENTRIES,
  payload: {
    entries,
  },
});

export const deleteContactEntry = (entryId) => ({
  type: DELETE_CONTACT_ENTRY,
  payload: {
    entryId,
  },
});

export const fetchCoupons = () => ({
  type: FETCH_COUPONS,
});

export const updateCoupons = (coupons) => ({
  type: UPDATE_COUPONS,
  payload: {
    coupons,
  },
});

export const fetchingCoupons = () => ({
  type: FETCHING_COUPONS,
});

export const finishedFetchingCoupons = () => ({
  type: FINISHED_FETCHING_COUPONS,
});

export const createCoupon = (coupon) => ({
  type: CREATE_COUPON,
  payload: {
    coupon,
  },
});

export const fetchOrders = (fetchNext) => ({
  type: FETCH_ORDERS,
  payload: {
    fetchNext,
  },
});

export const updateOrders = (orders) => ({
  type: UPDATE_ORDERS,
  payload: {
    orders,
  },
});

export const fetchingOrders = () => ({
  type: FETCHING_ORDERS,
});

export const finishedFetchingOrders = () => ({
  type: FINISHED_FETCHING_ORDERS,
});

export const fetchOrderStatusUpdates = (orderId) => ({
  type: FETCH_ORDERS_STATUS_UPDATES,
  payload: {
    orderId,
  },
});

export const updateOrderStatusUpdates = (orderId, statusUpdates) => ({
  type: UPDATE_ORDER_STATUS_UPDATES,
  payload: {
    orderId,
    statusUpdates,
  },
});

export const updateOrderStatus = (orderId, status) => ({
  type: UPDATE_ORDER_STATUS,
  payload: {
    orderId,
    status,
  },
});

export const updateStatusReason = (reason) => ({
  type: UPDATE_STATUS_REASON,
  payload: {
    reason,
  },
});

export const updatePartialRefund = (amount) => ({
  type: UPDATE_PARTIAL_REFUND_AMOUNT,
  payload: {
    amount,
  },
});

export const updateOrder = (order) => ({
  type: UPDATE_ORDER,
  payload: {
    order,
  },
});

export const setSelectedOrder = (orderId) => ({
  type: SET_SELECTED_ORDER,
  payload: {
    orderId,
  },
});
