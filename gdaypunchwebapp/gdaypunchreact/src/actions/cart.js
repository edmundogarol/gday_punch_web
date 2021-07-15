export const FETCH_CART_ITEMS = "cart/FETCH_CART_ITEMS";
export const FETCHING_CART_ITEMS = "cart/FETCHING_CART_ITEMS";
export const FINISHED_FETCHING_CART_ITEMS = "cart/FINISHED_FETCHING_CART_ITEMS";
export const UPDATE_CART_ITEMS = "cart/UPDATE_CART_ITEMS";
export const UPDATE_CART_ITEM_QUANTITY = "cart/UPDATE_CART_ITEM_QUANTITY";
export const REMOVE_CART_ITEM = "cart/REMOVE_CART_ITEM";
export const TOGGLE_SIDE_CART = "cart/TOGGLE_SIDE_CART";

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

export const updateCartItemQuantity = (productId, quantity) => ({
  type: UPDATE_CART_ITEM_QUANTITY,
  payload: {
    productId,
    quantity,
  },
});

export const removeCartItem = (productId) => ({
  type: REMOVE_CART_ITEM,
  payload: {
    productId,
  },
});

export const toggleSideCart = (open) => ({
  type: TOGGLE_SIDE_CART,
  payload: {
    open,
  },
});
