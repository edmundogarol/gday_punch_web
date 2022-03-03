import {
  FETCHING_ACCOUNT_ORDERS,
  FINISHED_FETCHING_ACCOUNT_ORDERS,
  UPDATE_ACCOUNT_ORDERS,
  UPDATE_ACCOUNT_ORDERS_ERRORS,
} from "actions/account";
import {
  FETCHING_SELLER_DETAILS,
  FETCHING_SELLER_SALES,
  FINISHED_FETCHING_SELLER_DETAILS,
  FINISHED_FETCHING_SELLER_SALES,
  FINISHED_UPDATING_SELLER_DETAILS,
  SET_SELECTED_SALE,
  UPDATE_EDITING_SELLER_DETAILS_ERRORS,
  UPDATE_SALE,
  UPDATE_SALE_PARTIAL_REFUND_AMOUNT,
  UPDATE_SALE_STATUS_REASON,
  UPDATE_SALE_STATUS_UPDATES,
  UPDATE_SELLER_DETAILS,
  UPDATE_SELLER_DETAILS_ERRORS,
  UPDATE_SELLER_SALES,
  UPDATE_SELLER_SALES_ERRORS,
  UPDATING_SELLER_DETAILS,
  UPDATE_PAYOUTS,
  FETCHING_PAYOUTS,
  FINISHED_FETCHING_PAYOUTS,
  UPDATE_PAYOUTS_ERROR,
  RESET_SELLER,
} from "actions/seller";
import { arrayIdsMapToObject } from "utils/utils";

const INITIAL_STATE = {
  orders: {
    orderList: {},
    fetching: false,
    finished: false,
    errors: undefined,
  },
  seller: {
    sellerDetails: {
      id: undefined,
      use_paypal: true,
      paypal_email: "",
      bank_acc_name: "",
      bank_bsb: "",
      bank_acc: "",
    },
    fetchingSellerDetails: false,
    finishedFetchingSellerDetails: false,
    sellerDetailsError: undefined,
    updatingSellerDetails: false,
    finishedUpdatingSellerDetails: false,
    sellerDetailsUpdateError: undefined,

    count: 0,
    next: undefined,
    selected: undefined,
    orderList: {},
    fetchingSellerSales: false,
    finishedFetchingSellerSales: false,
    sellerSalesError: undefined,

    reason: undefined,
    partial_refund: undefined,

    payouts: {},
    fetchingPayouts: false,
    finishedFetchingPayouts: false,
    payoutError: undefined,
  },
};

export const accountReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;

  switch (action.type) {
    case UPDATE_ACCOUNT_ORDERS:
      return {
        ...state,
        orders: {
          ...state.orders,
          orderList: payload.orders,
        },
      };
    case FETCHING_ACCOUNT_ORDERS:
      return {
        ...state,
        orders: {
          ...state.orders,
          fetching: true,
          finished: false,
        },
      };
    case FINISHED_FETCHING_ACCOUNT_ORDERS:
      return {
        ...state,
        orders: {
          ...state.orders,
          fetching: false,
          finished: true,
        },
      };
    case UPDATE_ACCOUNT_ORDERS_ERRORS:
      return {
        ...state,
        orders: {
          ...state.orders,
          errors: payload.errors,
        },
      };
    case UPDATE_SELLER_DETAILS:
      return {
        ...state,
        seller: {
          ...state.seller,
          sellerDetails: {
            ...state.seller.sellerDetails,
            ...payload.details,
          },
        },
      };
    case UPDATING_SELLER_DETAILS:
      return {
        ...state,
        seller: {
          ...state.seller,
          updatingSellerDetails: true,
          finishedUpdatingSellerDetails: false,
        },
      };
    case FINISHED_UPDATING_SELLER_DETAILS:
      return {
        ...state,
        seller: {
          ...state.seller,
          updatingSellerDetails: false,
          finishedUpdatingSellerDetails: true,
        },
      };
    case FETCHING_SELLER_DETAILS:
      return {
        ...state,
        seller: {
          ...state.seller,
          fetchingSellerDetails: true,
          finishedFetchingSellerDetails: false,
        },
      };
    case FINISHED_FETCHING_SELLER_DETAILS:
      return {
        ...state,
        seller: {
          ...state.seller,
          fetchingSellerDetails: false,
          finishedFetchingSellerDetails: true,
        },
      };
    case UPDATE_SELLER_DETAILS_ERRORS:
      return {
        ...state,
        seller: {
          ...state.seller,
          sellerDetailsError: payload.errors,
        },
      };
    case UPDATE_EDITING_SELLER_DETAILS_ERRORS:
      return {
        ...state,
        seller: {
          ...state.seller,
          sellerDetailsUpdateError: payload.errors,
        },
      };
    case UPDATE_SELLER_SALES:
      const { results, count, next } = action.payload.sales;

      return {
        ...state,
        seller: {
          ...state.seller,
          next,
          count,
          orderList: {
            ...state.seller.orderList,
            ...arrayIdsMapToObject(results),
          },
        },
      };
    case FETCHING_SELLER_SALES:
      return {
        ...state,
        seller: {
          ...state.seller,
          fetchingSellerSales: true,
          finishedFetchingSellerSales: false,
        },
      };
    case FINISHED_FETCHING_SELLER_SALES:
      return {
        ...state,
        seller: {
          ...state.seller,
          fetchingSellerSales: false,
          finishedFetchingSellerSales: true,
        },
      };
    case UPDATE_SELLER_SALES_ERRORS:
      return {
        ...state,
        seller: {
          ...state.seller,
          sellerSalesError: payload.errors,
        },
      };
    case UPDATE_SALE_STATUS_UPDATES:
      return {
        ...state,
        seller: {
          ...state.seller,
          orderList: {
            ...state.seller.orderList,
            [action.payload.orderId]: {
              ...state.seller.orderList[action.payload.orderId],
              statuses: action.payload.statusUpdates,
            },
          },
        },
      };
    case UPDATE_SALE:
      return {
        ...state,
        seller: {
          ...state.seller,
          orderList: {
            ...state.seller.orderList,
            [action.payload.order.id]: {
              ...state.seller.orderList[action.payload.order.id],
              ...action.payload.order,
            },
          },
        },
      };
    case UPDATE_SALE_STATUS_REASON:
      return {
        ...state,
        seller: {
          ...state.seller,
          reason: action.payload.reason,
        },
      };
    case UPDATE_SALE_PARTIAL_REFUND_AMOUNT:
      return {
        ...state,
        seller: {
          ...state.seller,
          partial_refund: action.payload.amount,
        },
      };
    case SET_SELECTED_SALE:
      return {
        ...state,
        seller: {
          ...state.seller,
          selected: action.payload.orderId,
        },
      };
    case UPDATE_PAYOUTS:
      return {
        ...state,
        seller: {
          ...state.seller,
          payouts: {
            ...state.seller.payouts,
            ...arrayIdsMapToObject(action.payload.payouts),
          },
        },
      };
    case FETCHING_PAYOUTS:
      return {
        ...state,
        seller: {
          ...state.seller,
          fetchingPayouts: true,
          finishedFetchingPayouts: false,
        },
      };
    case FINISHED_FETCHING_PAYOUTS:
      return {
        ...state,
        seller: {
          ...state.seller,
          fetchingPayouts: false,
          finishedFetchingPayouts: true,
        },
      };
    case UPDATE_PAYOUTS_ERROR:
      return {
        ...state,
        seller: {
          ...state.seller,
          payoutError: payload.errors,
        },
      };
    case RESET_SELLER:
      return {
        ...state,
        seller: INITIAL_STATE.seller,
      };
    default:
      return state;
  }
};
