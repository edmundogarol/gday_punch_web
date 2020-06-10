import { createSelector } from "reselect";

const selectDomain = (state) => state.admin;

export const selectPendingTweet = createSelector(
  selectDomain,
  ({ pendingTweet }) => pendingTweet
);

export const selectTweetLoading = createSelector(
  selectDomain,
  ({ tweetLoading, tweetSuccess }) => ({
    tweetLoading,
    tweetSuccess
  })
);

export const selectEmbeddedTweetCode = createSelector(
  selectDomain,
  ({ embeddedTweet }) => embeddedTweet
);
