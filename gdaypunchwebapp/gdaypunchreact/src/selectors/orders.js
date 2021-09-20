import { createSelector } from "reselect";

const selectDomain = (state) => state.orders;

export const selectViewingOrderState = createSelector(
  selectDomain,
  ({ viewingOrder }) => viewingOrder
);
