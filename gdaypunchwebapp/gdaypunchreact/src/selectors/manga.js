import { createSelector } from "reselect";

const selectDomain = (state) => state.manga;

export const selectFeaturedMangaIds = createSelector(
  selectDomain,
  ({ featuredMangaIds }) => featuredMangaIds
);

export const selectFeaturedManga = createSelector(
  selectDomain,
  ({ manga, featuredMangaIds }) => featuredMangaIds.map((id) => manga[id])
);

export const selectAllMangaIds = createSelector(
  selectDomain,
  ({ manga }) => Object.keys(manga).map(key => parseInt(key, 10))
);

export const selectLikingManga = createSelector(
  selectDomain,
  ({ likingManga }) => likingManga
);

export const selectManga = (mangaId) =>
  createSelector(selectDomain, ({ manga }) => manga[mangaId]);

export const selectReadingManga = createSelector(
  selectDomain,
  ({ readingManga, manga }) => manga[readingManga]
);
