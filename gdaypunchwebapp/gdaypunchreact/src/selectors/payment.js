import { createSelector } from "reselect";

const selectDomain = (state) => state.payment;

export const selectPaymentClientSecret = createSelector(
  selectDomain,
  ({ clientSecret }) => clientSecret
);

export const selectPaymentState = createSelector(
  selectDomain,
  (paymentState) => paymentState
);
