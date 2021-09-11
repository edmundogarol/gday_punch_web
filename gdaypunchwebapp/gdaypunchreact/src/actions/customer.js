export const CUSTOMER_SUBSCRIBE = "customer/CUSTOMER_SUBSCRIBE";
export const CUSTOMER_SUBSCRIBE_FINISHED =
  "customer/CUSTOMER_SUBSCRIBE_FINISHED";

export const CUSTOMER_FETCH = "customer/CUSTOMER_FETCH";
export const CUSTOMER_FETCHING = "customer/CUSTOMER_FETCHING";
export const CUSTOMER_FETCH_FINISHED = "customer/CUSTOMER_FETCH_FINISHED";
export const CUSTOMER_UPDATE = "customer/CUSTOMER_UPDATE";

export const customerSubscribe = (customer) => ({
  type: CUSTOMER_SUBSCRIBE,
  payload: {
    customer,
  },
});

export const customerSubscribeFinished = (finished = true) => ({
  type: CUSTOMER_SUBSCRIBE_FINISHED,
  payload: {
    finished,
  },
});

export const customerFetch = (customerId) => ({
  type: CUSTOMER_FETCH,
  payload: {
    customerId,
  },
});

export const customerFetching = () => ({
  type: CUSTOMER_FETCHING,
});

export const customerFetchFinished = () => ({
  type: CUSTOMER_FETCH_FINISHED,
});

export const customerUpdate = (customer) => ({
  type: CUSTOMER_UPDATE,
  payload: {
    customer,
  },
});
