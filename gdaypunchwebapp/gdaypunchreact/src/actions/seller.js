export const FETCH_SELLER_DETAILS = "account/FETCH_SELLER_DETAILS";
export const FETCHING_SELLER_DETAILS = "account/FETCHING_SELLER_DETAILS";
export const UPDATE_SELLER_DETAILS = "account/UPDATE_SELLER_DETAILS";
export const FINISHED_FETCHING_SELLER_DETAILS =
  "account/FINISHED_FETCHING_SELLER_DETAILS";
export const UPDATE_SELLER_DETAILS_ERRORS =
  "account/UPDATE_SELLER_DETAILS_ERRORS";
export const RESET_SELLER_DETAILS = "account/RESET_SELLER_DETAILS";

export const fetchSellerDetails = () => ({
  type: FETCH_SELLER_DETAILS,
});

export const fetchingSellerDetails = () => ({
  type: FETCHING_SELLER_DETAILS,
});

export const updateSellerDetails = (details) => ({
  type: UPDATE_SELLER_DETAILS,
  payload: {
    details,
  },
});

export const finishedFetchingSellerDetails = () => ({
  type: FINISHED_FETCHING_SELLER_DETAILS,
});

export const updateSellerDetailsError = (errors) => ({
  type: UPDATE_SELLER_DETAILS_ERRORS,
  payload: {
    errors,
  },
});

export const resetSellerDetails = () => ({
  type: RESET_SELLER_DETAILS,
});
