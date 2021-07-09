export const FETCH_HOME_PRODUCTS = "home/FETCH_HOME_PRODUCTS";
export const FETCHING_HOME_PRODUCTS = "home/FETCHING_HOME_PRODUCTS";
export const FINISHED_FETCHING_HOME_PRODUCTS =
  "home/FINISHED_FETCHING_HOME_PRODUCTS";
export const UPDATE_HOME_PRODUCTS = "home/UPDATE_HOME_PRODUCTS";

export const fetchAdminProducts = (productIds) => ({
  type: FETCH_HOME_PRODUCTS,
  payload: {
    productIds,
  },
});

export const fetchingAdminProducts = () => ({
  type: FETCHING_HOME_PRODUCTS,
});

export const finishedFetchingAdminProducts = () => ({
  type: FINISHED_FETCHING_HOME_PRODUCTS,
});

export const updateHomeProducts = (products) => ({
  type: UPDATE_HOME_PRODUCTS,
  payload: {
    products,
  },
});
