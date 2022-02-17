import { createSelector } from "reselect";

const selectDomain = (state) => state.account;

export const selectAccountOrdersState = createSelector(
  selectDomain,
  ({ orders }) => orders
);

export const selectSellerState = createSelector(
  selectDomain,
  ({ seller }) => seller
);

export const selectSaleStatusUpdateReason = createSelector(
  selectDomain,
  ({ seller: { reason } }) => reason
);

export const selectSalePartialRefundAmount = createSelector(
  selectDomain,
  ({ seller: { partial_refund } }) => partial_refund
);
