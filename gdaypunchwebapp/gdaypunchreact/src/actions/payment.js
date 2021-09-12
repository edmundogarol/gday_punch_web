export const PAYMENT_SUBMIT = "payment/PAYMENT_SUBMIT";
export const PAYMENT_PROCESSING = "payment/PAYMENT_PROCESSING";
export const PAYMENT_SUCCEEDED = "payment/PAYMENT_SUCCEEDED";
export const PAYMENT_ERROR = "payment/PAYMENT_ERROR";
export const PAYMENT_SUCCESS_CONFIRM = "payment/PAYMENT_SUCCESS_CONFIRM";

export const PAYMENT_INTENT_FETCH = "payment/PAYMENT_INTENT_FETCH";
export const PAYMENT_INTENT_UPDATE = "payment/PAYMENT_INTENT_UPDATE";
export const PAYMENT_INTENT_CANCEL = "payment/PAYMENT_INTENT_CANCEL";

export const PAYMENT_APPLY_COUPON = "payment/PAYMENT_APPLY_COUPON";
export const PAYMENT_COUPON_UPDATE = "payment/PAYMENT_COUPON_UPDATE";
export const PAYMENT_COUPON_APPLYING = "payment/PAYMENT_COUPON_APPLYING";
export const PAYMENT_COUPON_APPLYING_FINISHED =
  "payment/PAYMENT_COUPON_APPLYING_FINISHED";

export const paymentSubmit = (customerDetails, items) => ({
  type: PAYMENT_SUBMIT,
  payload: {
    customerDetails,
    items,
  },
});

export const paymentSuccessConfirm = (token) => ({
  type: PAYMENT_SUCCESS_CONFIRM,
  payload: {
    token,
  },
});

export const paymentProcessing = (processing) => ({
  type: PAYMENT_PROCESSING,
  payload: {
    processing,
  },
});

export const paymentSucceeded = () => ({
  type: PAYMENT_SUCCEEDED,
});

export const paymentError = () => ({
  type: PAYMENT_ERROR,
});

export const paymentIntentFetch = (items) => ({
  type: PAYMENT_INTENT_FETCH,
  payload: {
    items,
  },
});

export const paymentIntentUpdate = (clientSecret) => ({
  type: PAYMENT_INTENT_UPDATE,
  payload: {
    clientSecret,
  },
});

export const paymentIntentCancel = () => ({
  type: PAYMENT_INTENT_CANCEL,
});

export const paymentApplyCoupon = (coupon) => ({
  type: PAYMENT_APPLY_COUPON,
  payload: {
    coupon,
  },
});

export const updateCoupon = (coupon) => ({
  type: PAYMENT_COUPON_UPDATE,
  payload: {
    coupon,
  },
});

export const couponApplying = () => ({
  type: PAYMENT_COUPON_APPLYING,
});

export const couponApplyingFinished = () => ({
  type: PAYMENT_COUPON_APPLYING_FINISHED,
});
