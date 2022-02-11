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
  UPDATE_EDITING_SELLER_DETAILS_ERRORS,
  UPDATE_SELLER_DETAILS,
  UPDATE_SELLER_DETAILS_ERRORS,
  UPDATE_SELLER_SALES,
  UPDATE_SELLER_SALES_ERRORS,
  UPDATING_SELLER_DETAILS,
} from "actions/seller";

const INITIAL_STATE = {
  orders: {
    orderList: [],
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
    sellerSales: [],
    fetchingSellerSales: false,
    finishedFetchingSellerSales: false,
    sellerSalesError: undefined,
    updatingSellerDetails: false,
    finishedUpdatingSellerDetails: false,
    sellerDetailsUpdateError: undefined,
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
      return {
        ...state,
        seller: {
          ...state.seller,
          sellerSales: payload.sales,
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
    default:
      return state;
  }
};
