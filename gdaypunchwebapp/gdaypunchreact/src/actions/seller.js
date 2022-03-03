export const FETCH_SELLER_DETAILS = "account/FETCH_SELLER_DETAILS";
export const FETCHING_SELLER_DETAILS = "account/FETCHING_SELLER_DETAILS";
export const UPDATE_SELLER_DETAILS = "account/UPDATE_SELLER_DETAILS";
export const FINISHED_FETCHING_SELLER_DETAILS =
  "account/FINISHED_FETCHING_SELLER_DETAILS";
export const UPDATE_SELLER_DETAILS_ERRORS =
  "account/UPDATE_SELLER_DETAILS_ERRORS";
export const SUBMIT_SELLER_DETAILS = "account/SUBMIT_SELLER_DETAILS";
export const UPDATING_SELLER_DETAILS = "account/UPDATING_SELLER_DETAILS";
export const FINISHED_UPDATING_SELLER_DETAILS =
  "account/FINISHED_UPDATING_SELLER_DETAILS";

export const UPDATE_EDITING_SELLER_DETAILS_ERRORS =
  "account/UPDATE_EDITING_SELLER_DETAILS_ERRORS";

export const FETCH_SELLER_SALES = "account/FETCH_SELLER_SALES";
export const FETCHING_SELLER_SALES = "account/FETCHING_SELLER_SALES";
export const UPDATE_SELLER_SALES = "account/UPDATE_SELLER_SALES";
export const FINISHED_FETCHING_SELLER_SALES =
  "account/FINISHED_FETCHING_SELLER_SALES";
export const UPDATE_SELLER_SALES_ERRORS = "account/UPDATE_SELLER_SALES_ERRORS";
export const FETCH_SALE_STATUS_UPDATES = "account/FETCH_SALE_STATUS_UPDATES";
export const UPDATE_SALE_STATUS_UPDATES = "account/UPDATE_SALE_STATUS_UPDATES";
export const UPDATE_SALE_STATUS = "account/UPDATE_SALE_STATUS";
export const UPDATE_SALE_STATUS_REASON = "account/UPDATE_SALE_STATUS_REASON";
export const UPDATE_SALE_PARTIAL_REFUND_AMOUNT =
  "account/UPDATE_SALE_PARTIAL_REFUND_AMOUNT";
export const UPDATE_SALE = "account/UPDATE_SALE";
export const SET_SELECTED_SALE = "account/SET_SELECTED_SALE";

export const FETCH_PAYOUTS = "account/FETCH_PAYOUTS";
export const FETCHING_PAYOUTS = "account/FETCHING_PAYOUTS";
export const UPDATE_PAYOUTS = "account/UPDATE_PAYOUTS";
export const FINISHED_FETCHING_PAYOUTS = "account/FINISHED_FETCHING_PAYOUTS";
export const UPDATE_PAYOUTS_ERROR = "account/UPDATE_PAYOUTS_ERROR";

export const RESET_SELLER = "account/RESET_SELLER";

export const fetchSellerDetails = (sellerId) => ({
  type: FETCH_SELLER_DETAILS,
  payload: {
    sellerId,
  },
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

export const updateEditingSellerDetailsError = (errors) => ({
  type: UPDATE_EDITING_SELLER_DETAILS_ERRORS,
  payload: {
    errors,
  },
});

export const submitSellerDetails = (details) => ({
  type: SUBMIT_SELLER_DETAILS,
  payload: {
    details,
  },
});

export const updatingSellerDetails = () => ({
  type: UPDATING_SELLER_DETAILS,
});

export const finishedUpdatingSellerDetails = () => ({
  type: FINISHED_UPDATING_SELLER_DETAILS,
});

export const fetchSellerSales = (sellerId) => ({
  type: FETCH_SELLER_SALES,
  payload: {
    sellerId,
  },
});

export const fetchingSellerSales = () => ({
  type: FETCHING_SELLER_SALES,
});

export const updateSellerSales = (sales) => ({
  type: UPDATE_SELLER_SALES,
  payload: {
    sales,
  },
});

export const finishedFetchingSellerSales = () => ({
  type: FINISHED_FETCHING_SELLER_SALES,
});

export const updateSellerSalesError = (errors) => ({
  type: UPDATE_SELLER_SALES_ERRORS,
  payload: {
    errors,
  },
});

export const fetchSaleStatusUpdates = (orderId) => ({
  type: FETCH_SALE_STATUS_UPDATES,
  payload: {
    orderId,
  },
});

export const updateSaleStatusUpdates = (orderId, statusUpdates) => ({
  type: UPDATE_SALE_STATUS_UPDATES,
  payload: {
    orderId,
    statusUpdates,
  },
});

export const updateSaleStatus = (orderId, status, customerId) => ({
  type: UPDATE_SALE_STATUS,
  payload: {
    orderId,
    status,
    customerId, // Unused for Seller Sales
  },
});

export const updateSaleStatusReason = (reason) => ({
  type: UPDATE_SALE_STATUS_REASON,
  payload: {
    reason,
  },
});

export const updateSalePartialRefund = (amount) => ({
  type: UPDATE_SALE_PARTIAL_REFUND_AMOUNT,
  payload: {
    amount,
  },
});

export const updateSale = (order) => ({
  type: UPDATE_SALE,
  payload: {
    order,
  },
});

export const setSelectedSale = (orderId) => ({
  type: SET_SELECTED_SALE,
  payload: {
    orderId,
  },
});

export const fetchPayouts = () => ({
  type: FETCH_PAYOUTS,
});

export const fetchingPayouts = () => ({
  type: FETCHING_PAYOUTS,
});

export const updatePayouts = (payouts) => ({
  type: UPDATE_PAYOUTS,
  payload: {
    payouts,
  },
});

export const finishedFetchingPayouts = () => ({
  type: FINISHED_FETCHING_PAYOUTS,
});

export const updatePayoutsError = (errors) => ({
  type: UPDATE_PAYOUTS_ERROR,
  payload: {
    errors,
  },
});

export const resetSeller = () => ({
  type: RESET_SELLER,
});
