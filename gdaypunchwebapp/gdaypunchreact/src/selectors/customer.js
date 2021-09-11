import { createSelector } from "reselect";

const selectDomain = (state) => state.customer;

export const selectCustomerState = createSelector(
  selectDomain,
  (customerState) => customerState
);
