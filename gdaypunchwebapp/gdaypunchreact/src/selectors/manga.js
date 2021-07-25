import { createSelector } from "reselect";

const selectDomain = (state) => state.app;

export const selectComments = createSelector(
  selectDomain,
  ({ reader: { comments } }) => {
    return comments.sort((commentA, commentB) => commentA.id - commentB.id);
  }
);

export const selectReadingManga = createSelector(
  selectDomain,
  ({ products: { productList }, reader: { mangaId } }) => {
    const product = Object.values(productList).find(
      (product) => product.manga_details.id === mangaId
    );
    return product ? product.manga_details : undefined;
  }
);
