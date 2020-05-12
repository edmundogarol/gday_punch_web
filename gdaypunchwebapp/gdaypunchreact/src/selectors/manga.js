import { createSelector } from "reselect";

const selectDomain = (state) => state.manga;

export const selectUserManga = createSelector(
  selectDomain,
  ({ userManga }) => userManga
);

export const selectLikingManga = createSelector(
  selectDomain,
  ({ likingManga }) => likingManga
);
