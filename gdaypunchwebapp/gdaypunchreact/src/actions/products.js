export const FETCH_VIEWING_PRODUCT = "products/FETCH_VIEWING_PRODUCT";
export const FETCHING_VIEWING_PRODUCT = "products/FETCHING_VIEWING_PRODUCT";
export const FINISHED_FETCHING_VIEWING_PRODUCT =
  "products/FINISHED_FETCHING_VIEWING_PRODUCT";
export const UPDATE_VIEWING_PRODUCT = "products/UPDATE_VIEWING_PRODUCT";
export const SET_VIEWING_PRODUCT = "products/SET_VIEWING_PRODUCT";

export const fetchViewingProduct = (productId) => ({
  type: FETCH_VIEWING_PRODUCT,
  payload: {
    productId,
  },
});

export const setViewingProduct = (product) => ({
  type: SET_VIEWING_PRODUCT,
  payload: {
    product,
  },
});

export const updateViewingProduct = (product) => ({
  type: UPDATE_VIEWING_PRODUCT,
  payload: {
    product,
  },
});

export const fetchingViewingProduct = () => ({
  type: FETCHING_VIEWING_PRODUCT,
});

export const finishedFetchingViewingProduct = () => ({
  type: FINISHED_FETCHING_VIEWING_PRODUCT,
});
