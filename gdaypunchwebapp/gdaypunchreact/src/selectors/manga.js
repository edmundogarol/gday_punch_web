import { createSelector } from "reselect";

const selectDomain = (state) => state.app;

export const selectComments = createSelector(
  selectDomain,
  ({ users: { list }, reader: { comments } }) => {
    const commentsUsingSystemUsers = comments.map((comment) => ({
      ...comment,
      author: list[comment.author.id],
    }));

    return commentsUsingSystemUsers.sort(
      (commentA, commentB) => commentA.id - commentB.id
    );
  }
);

export const selectReadingManga = createSelector(
  selectDomain,
  ({ products: { productList }, reader: { mangaId } }) => {
    const product = Object.values(productList).find(
      (product) => product.manga_details.id === mangaId
    );
    return product
      ? { ...product.manga_details, product_id: product.id }
      : undefined;
  }
);
