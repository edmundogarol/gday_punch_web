import {
  PAYMENT_COUPON_APPLYING,
  PAYMENT_COUPON_APPLYING_FINISHED,
  PAYMENT_COUPON_UPDATE,
  PAYMENT_INTENT_UPDATE,
} from "src/actions/payment";

const INITIAL_STATE = {
  clientSecret: undefined,
  coupon: {
    name: "",
    coupon_type: undefined, // percent, amount
    amount: 0,
  },
  applyingCoupon: false,
  applyingCouponFinished: false,
};

export const paymentReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;

  switch (action.type) {
    case PAYMENT_INTENT_UPDATE:
      return {
        ...state,
        clientSecret: payload.clientSecret,
      };
    case PAYMENT_COUPON_UPDATE:
      return {
        ...state,
        coupon: {
          ...state.coupon,
          ...payload.coupon,
        },
      };
    case PAYMENT_COUPON_APPLYING:
      return {
        ...state,
        applyingCoupon: true,
        applyingCouponFinished: false,
      };
    case PAYMENT_COUPON_APPLYING_FINISHED:
      return {
        ...state,
        applyingCoupon: false,
        applyingCouponFinished: true,
      };
    default:
      return state;
  }
};
