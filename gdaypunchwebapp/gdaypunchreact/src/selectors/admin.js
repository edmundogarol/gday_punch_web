import { createSelector } from "reselect";

const selectDomain = (state) => state.admin;

export const selectUsersState = createSelector(
  selectDomain,
  ({ users }) => users
);

export const selectUsersNextPage = createSelector(
  selectDomain,
  ({ users: { next } }) => next
);

export const selectPendingTweet = createSelector(
  selectDomain,
  ({ pendingTweet }) => pendingTweet
);

export const selectTweetError = createSelector(
  selectDomain,
  ({ tweetError }) => tweetError
);

export const selectTweetLoading = createSelector(
  selectDomain,
  ({ tweetLoading, tweetSuccess }) => ({
    tweetLoading,
    tweetSuccess,
  })
);

export const selectPendingDeletingTweet = createSelector(
  selectDomain,
  ({ pendingDeletingTweetId }) => ({ statusId: pendingDeletingTweetId })
);

export const selectEmbeddedTweetCode = createSelector(
  selectDomain,
  ({ embeddedTweet }) => ({ html: embeddedTweet.html, id: embeddedTweet.id })
);

export const selectPrompts = createSelector(
  selectDomain,
  ({ prompts }) => prompts
);

export const selectPanelStylePrompt = createSelector(
  selectDomain,
  ({ panelStylePrompt }) => panelStylePrompt
);

export const selectPromptStatuses = createSelector(
  selectDomain,
  ({ fetchingPrompts, fetchingPromptsSucess }) => ({
    fetchingPrompts,
    fetchingPromptsSucess,
  })
);

export const selectPanelStylePromptStatuses = createSelector(
  selectDomain,
  ({ fetchingPanelStylePrompt, fetchingPanelStylePromptSucess }) => ({
    fetchingPanelStylePrompt,
    fetchingPanelStylePromptSucess,
  })
);

export const selectProductsState = createSelector(
  selectDomain,
  ({ products }) => products
);

export const selectCurrentProduct = createSelector(
  selectDomain,
  ({ products: { editingProduct, adminProductList } }) =>
    adminProductList.find((product) => product.id == editingProduct)
);

export const selectContactsState = createSelector(
  selectDomain,
  ({ contacts }) => contacts
);

export const selectCouponState = createSelector(
  selectDomain,
  ({ coupons }) => coupons
);

export const selectOrderState = createSelector(
  selectDomain,
  ({ orders }) => orders
);

export const selectOrdersNextPage = createSelector(
  selectDomain,
  ({ orders: { next } }) => next
);

export const selectOrderStatusUpdateReason = createSelector(
  selectDomain,
  ({ orders: { reason } }) => reason
);

export const selectPartialRefundAmount = createSelector(
  selectDomain,
  ({ orders: { partial_refund } }) => partial_refund
);
