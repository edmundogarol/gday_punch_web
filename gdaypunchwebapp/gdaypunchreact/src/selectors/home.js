import { createSelector } from "reselect";

const selectDomain = (state) => state.home;

export const selectHomeProductsState = createSelector(
  selectDomain,
  ({ products }) => products
);

export const selectHomeProductList = createSelector(
  selectDomain,
  ({ products: { productList } }) => productList
);
