import {
  FETCHING_VIEWING_ORDER,
  FINISHED_FETCHING_VIEWING_ORDER,
  RESET_VIEWING_ORDER,
  UPDATE_VIEWING_ORDER,
  UPDATE_VIEWING_ORDER_ERRORS,
} from "src/actions/order";

const INITIAL_STATE = {
  viewingOrder: {
    order: {},
    fetching: false,
    finished: false,
    errors: undefined,
  },
};

export const ordersReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;

  switch (action.type) {
    case UPDATE_VIEWING_ORDER:
      return {
        ...state,
        viewingOrder: {
          ...state.viewingOrder,
          order: payload.order,
        },
      };
    case FETCHING_VIEWING_ORDER:
      return {
        ...state,
        viewingOrder: {
          ...state.viewingOrder,
          fetching: true,
          finished: false,
        },
      };
    case FINISHED_FETCHING_VIEWING_ORDER:
      return {
        ...state,
        viewingOrder: {
          ...state.viewingOrder,
          fetching: false,
          finished: true,
        },
      };
    case UPDATE_VIEWING_ORDER_ERRORS:
      return {
        ...state,
        viewingOrder: {
          ...state.viewingOrder,
          errors: payload.errors,
        },
      };
    case RESET_VIEWING_ORDER:
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};
