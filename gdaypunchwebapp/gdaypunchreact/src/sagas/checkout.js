import { call, all, takeLatest, put, select } from "redux-saga/effects";
import { message } from "antd";

import {
  PAYMENT_SUBMIT,
  PAYMENT_SUCCESS_CONFIRM,
  PAYMENT_INTENT_CANCEL,
  paymentIntentUpdate,
  paymentProcessing,
  PAYMENT_APPLY_COUPON,
  couponApplying,
  couponApplyingFinished,
  updateCoupon,
  paymentSucceeded,
  paymentError,
} from "src/actions/payment";

import { api } from "utils/api";
import { selectCoupon, selectPaymentClientSecret } from "src/selectors/payment";
import { fetchAllProductsCall } from "./products";

export function* paymentSubmitCall(action) {
  yield put(paymentProcessing(true));

  const coupon = yield select(selectCoupon);

  const response = yield call(api, "payment-submit/create/", {
    method: "POST",
    body: {
      customer_details: action.payload.customerDetails,
      items: action.payload.items,
      coupon,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(paymentIntentUpdate(data.clientSecret));
    yield put(paymentSucceeded());
  } else {
    console.log("Payment Submit error", JSON.stringify(response));
    yield put(paymentError(response.data));
    yield call(fetchAllProductsCall);
  }
}

export function* paymentSuccessConfirmCall(action) {
  const response = yield call(api, "payment-submit/confirm/", {
    method: "POST",
    body: {
      token: action.payload.token,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    console.log(data);
  } else {
    console.log("Payment Success Confirm error", JSON.stringify(response));
  }
}

export function* paymentIntentCancelCall() {
  const clientSecret = yield select(selectPaymentClientSecret);

  if (!clientSecret) return;

  const response = yield call(api, "payment-intent/", {
    method: "DELETE",
    body: {
      payment_intent_id: clientSecret.match(/^.*?(?=_secret)/)[0],
    },
  });

  if (response && response.ok) {
    yield put(paymentIntentUpdate(undefined));
  } else {
    console.log("Payment Intent Fetch error", JSON.stringify(response));
  }
}

export function* paymentApplyCouponCall(action) {
  yield put(couponApplying());

  const response = yield call(api, "coupon/apply/", {
    method: "POST",
    body: {
      coupon: action.payload.coupon.name,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    message.success("Coupon applied successfully!", 3);
    yield put(updateCoupon(data));
    yield put(couponApplyingFinished());
  } else {
    message.error("Invalid Coupon Code.", 3);
    console.log("Coupon apply error", JSON.stringify(response));
    yield put(couponApplyingFinished());
  }
}

export default function* checkoutSaga() {
  yield all([
    takeLatest(PAYMENT_SUBMIT, paymentSubmitCall),
    takeLatest(PAYMENT_INTENT_CANCEL, paymentIntentCancelCall),
    takeLatest(PAYMENT_SUCCESS_CONFIRM, paymentSuccessConfirmCall),
    takeLatest(PAYMENT_APPLY_COUPON, paymentApplyCouponCall),
  ]);
}
