export const CUSTOMER_SUBSCRIBE = "customer/CUSTOMER_SUBSCRIBE";
export const CUSTOMER_SUBSCRIBE_FINISHED =
  "customer/CUSTOMER_SUBSCRIBE_FINISHED";

export const customerSubscribe = (customer) => ({
  type: CUSTOMER_SUBSCRIBE,
  payload: {
    customer,
  },
});

export const customerSubscribeFinished = () => ({
  type: CUSTOMER_SUBSCRIBE_FINISHED,
});
