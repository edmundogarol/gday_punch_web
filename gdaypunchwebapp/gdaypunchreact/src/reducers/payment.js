import {
  PAYMENT_COUPON_APPLYING,
  PAYMENT_COUPON_APPLYING_FINISHED,
  PAYMENT_COUPON_UPDATE,
  PAYMENT_ERROR,
  PAYMENT_FINISHED,
  PAYMENT_INTENT_UPDATE,
  PAYMENT_PROCESSING,
  PAYMENT_SUCCEEDED,
  RESET_PAYMENT,
} from "src/actions/payment";

const INITIAL_STATE = {
  clientSecret: undefined,
  orderNumber: undefined,
  coupon: {
    name: "",
    coupon_type: undefined, // percent, amount
    amount: 0,
  },
  applyingCoupon: false,
  applyingCouponFinished: false,

  success: false,
  processing: false,
  finished: false,
  errors: undefined,
};

export const paymentReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;

  switch (action.type) {
    case PAYMENT_INTENT_UPDATE:
      return {
        ...state,
        clientSecret: payload.clientSecret,
        orderNumber: payload.order_number,
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
    case PAYMENT_PROCESSING:
      return {
        ...state,
        processing: true,
        finished: false,
      };
    case PAYMENT_FINISHED:
      return {
        ...state,
        processing: false,
        finished: true,
      };
    case PAYMENT_SUCCEEDED:
      return {
        ...INITIAL_STATE,
        orderNumber: state.orderNumber,
        success: true,
      };
    case PAYMENT_ERROR:
      return {
        ...state,
        processing: false,
        finished: true,
        errors: action.payload.errors,
      };
    case RESET_PAYMENT:
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};
