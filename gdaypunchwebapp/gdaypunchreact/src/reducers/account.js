import {
  FETCHING_ACCOUNT_ORDERS,
  FINISHED_FETCHING_ACCOUNT_ORDERS,
  UPDATE_ACCOUNT_ORDERS,
  UPDATE_ACCOUNT_ORDERS_ERRORS,
} from "src/actions/account";

const INITIAL_STATE = {
  orders: {
    orderList: [],
    fetching: false,
    finished: false,
    errors: undefined,
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
    default:
      return state;
  }
};
