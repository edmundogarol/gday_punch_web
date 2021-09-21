export const FETCH_VIEWING_ORDER = "orders/FETCH_VIEWING_ORDER";
export const UPDATE_VIEWING_ORDER = "orders/UPDATE_VIEWING_ORDER";
export const FETCHING_VIEWING_ORDER = "orders/FETCHING_VIEWING_ORDER";
export const FINISHED_FETCHING_VIEWING_ORDER =
  "orders/FINISHED_FETCHING_VIEWING_ORDER";
export const UPDATE_VIEWING_ORDER_ERRORS = "orders/UPDATE_VIEWING_ORDER_ERRORS";
export const RESET_VIEWING_ORDER = "orders/RESET_VIEWING_ORDER";

export const fetchViewingOrder = (orderSecret) => ({
  type: FETCH_VIEWING_ORDER,
  payload: {
    orderSecret,
  },
});

export const updateViewingOrder = (order) => ({
  type: UPDATE_VIEWING_ORDER,
  payload: {
    order,
  },
});

export const fetchingViewingOrder = () => ({
  type: FETCHING_VIEWING_ORDER,
});

export const finishedFetchingViewingOrder = () => ({
  type: FINISHED_FETCHING_VIEWING_ORDER,
});

export const viewingOrderError = (errors) => ({
  type: UPDATE_VIEWING_ORDER_ERRORS,
  payload: {
    errors,
  },
});

export const resetViewingOrder = () => ({
  type: RESET_VIEWING_ORDER,
});
