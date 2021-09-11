import {
  CUSTOMER_FETCHING,
  CUSTOMER_FETCH_FINISHED,
  CUSTOMER_SUBSCRIBE_FINISHED,
  CUSTOMER_UPDATE,
} from "actions/customer";

const INITIAL_STATE = {
  customer: undefined,
  fetching: false,
  fetchingFinished: false,
  subscribeCallFinished: false,
};

export const customerReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;

  switch (action.type) {
    case CUSTOMER_SUBSCRIBE_FINISHED:
      return {
        ...state,
        subscribeCallFinished: payload.finished,
      };
    case CUSTOMER_FETCHING:
      return {
        ...state,
        fetching: true,
        fetchingFinished: false,
      };
    case CUSTOMER_FETCH_FINISHED:
      return {
        ...state,
        fetching: false,
        fetchingFinished: true,
      };
    case CUSTOMER_UPDATE:
      return {
        ...state,
        customer: payload.customer,
      };
    default:
      return state;
  }
};
