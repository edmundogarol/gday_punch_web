import { createSelector } from "reselect";

const selectDomain = (state) => state.admin;

export const selectPendingTweet = createSelector(
  selectDomain,
  ({ pendingTweet }) => pendingTweet
);
