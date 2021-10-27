export const FETCH_VIEWING_PRODUCT = "products/FETCH_VIEWING_PRODUCT";
export const FETCHING_VIEWING_PRODUCT = "products/FETCHING_VIEWING_PRODUCT";
export const FINISHED_FETCHING_VIEWING_PRODUCT =
  "products/FINISHED_FETCHING_VIEWING_PRODUCT";
export const SET_VIEWING_PRODUCT = "products/SET_VIEWING_PRODUCT";

export const SAVE_PRODUCT = "products/SAVE_PRODUCT";
export const UNSAVE_PRODUCT = "products/UNSAVE_PRODUCT";
export const DELETE_PRODUCT = "products/DELETE_PRODUCT";

export const fetchViewingProduct = (productId) => ({
  type: FETCH_VIEWING_PRODUCT,
  payload: {
    productId,
  },
});

export const setViewingProduct = (productId) => ({
  type: SET_VIEWING_PRODUCT,
  payload: {
    productId,
  },
});

export const fetchingViewingProduct = () => ({
  type: FETCHING_VIEWING_PRODUCT,
});

export const finishedFetchingViewingProduct = () => ({
  type: FINISHED_FETCHING_VIEWING_PRODUCT,
});

export const saveProduct = (productId) => ({
  type: SAVE_PRODUCT,
  payload: {
    productId,
  },
});

export const unsaveProduct = (saveId) => ({
  type: UNSAVE_PRODUCT,
  payload: {
    saveId,
  },
});

export const deleteProduct = (product) => ({
  type: DELETE_PRODUCT,
  payload: {
    product,
  },
});
