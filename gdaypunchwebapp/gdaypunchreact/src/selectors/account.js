import { createSelector } from "reselect";

const selectDomain = (state) => state.account;

export const selectAccountOrdersState = createSelector(
  selectDomain,
  ({ orders }) => orders
);
