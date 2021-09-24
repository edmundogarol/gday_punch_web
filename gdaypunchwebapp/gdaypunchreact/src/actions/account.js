export const FETCH_ACCOUNT_ORDERS = "account/FETCH_ACCOUNT_ORDERS";
export const UPDATE_ACCOUNT_ORDERS = "account/UPDATE_ACCOUNT_ORDERS";
export const FETCHING_ACCOUNT_ORDERS = "account/FETCHING_ACCOUNT_ORDERS";
export const FINISHED_FETCHING_ACCOUNT_ORDERS =
  "account/FINISHED_FETCHING_ACCOUNT_ORDERS";
export const UPDATE_ACCOUNT_ORDERS_ERRORS =
  "account/UPDATE_ACCOUNT_ORDERS_ERRORS";
export const RESET_ACCOUNT_ORDERS = "account/RESET_ACCOUNT_ORDERS";

export const fetchAccountOrders = (stripeCustomer) => ({
  type: FETCH_ACCOUNT_ORDERS,
  payload: {
    stripeCustomer,
  },
});

export const updateAccountOrders = (orders) => ({
  type: UPDATE_ACCOUNT_ORDERS,
  payload: {
    orders,
  },
});

export const fetchingAccountOrders = () => ({
  type: FETCHING_ACCOUNT_ORDERS,
});

export const finishedFetchingAccountOrders = () => ({
  type: FINISHED_FETCHING_ACCOUNT_ORDERS,
});

export const updateAccountOrdersError = (errors) => ({
  type: UPDATE_ACCOUNT_ORDERS_ERRORS,
  payload: {
    errors,
  },
});

export const resetAccountOrders = () => ({
  type: RESET_ACCOUNT_ORDERS,
});
