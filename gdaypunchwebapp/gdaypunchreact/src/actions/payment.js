export const PAYMENT_SUBMIT = "payment/PAYMENT_SUBMIT";
export const PAYMENT_PROCESSING = "payment/PAYMENT_PROCESSING";
export const PAYMENT_SUCCEEDED = "payment/PAYMENT_SUCCEEDED";
export const PAYMENT_ERROR = "payment/PAYMENT_ERROR";
export const PAYMENT_SUCCESS_CONFIRM = "payment/PAYMENT_SUCCESS_CONFIRM";

export const PAYMENT_INTENT_FETCH = "payment/PAYMENT_INTENT_FETCH";
export const PAYMENT_INTENT_UPDATE = "payment/PAYMENT_INTENT_UPDATE";
export const PAYMENT_INTENT_CANCEL = "payment/PAYMENT_INTENT_CANCEL";

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
