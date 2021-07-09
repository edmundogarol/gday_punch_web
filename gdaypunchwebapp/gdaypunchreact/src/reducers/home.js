import {
  FETCHING_HOME_PRODUCTS,
  FINISHED_FETCHING_HOME_PRODUCTS,
  UPDATE_HOME_PRODUCTS,
} from "actions/home";

const INITIAL_STATE = {
  products: {
    productList: [],
    fetchingProducts: false,
    finishedFetchingProducts: false,
  },
};

export const homeReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;

  switch (action.type) {
    case UPDATE_HOME_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          productList: payload.products,
        },
      };
    case FETCHING_HOME_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          fetchingProducts: true,
          finishedFetchingProducts: false,
        },
      };
    case FINISHED_FETCHING_HOME_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          fetchingProducts: false,
          finishedFetchingProducts: true,
        },
      };
    default:
      return state;
  }
};
