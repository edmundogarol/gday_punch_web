export const FETCH_CART_ITEMS = "cart/FETCH_CART_ITEMS";
export const FETCHING_CART_ITEMS = "cart/FETCHING_CART_ITEMS";
export const FINISHED_FETCHING_CART_ITEMS = "cart/FINISHED_FETCHING_CART_ITEMS";
export const UPDATE_CART_ITEMS = "cart/UPDATE_CART_ITEMS";

export const fetchCartItems = () => ({
  type: FETCH_CART_ITEMS,
});

export const fetchingCartItems = () => ({
  type: FETCHING_CART_ITEMS,
});

export const finishedFetchingCartItems = () => ({
  type: FINISHED_FETCHING_CART_ITEMS,
});

export const updateCartItems = (items, addItems) => ({
  type: UPDATE_CART_ITEMS,
  payload: {
    items,
    addItems,
  },
});
