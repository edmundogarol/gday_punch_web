import { createSelector } from "reselect";

const selectDomain = (state) => state.stall;

export const selectStallState = createSelector(
  selectDomain,
  (stallState) => stallState
);
