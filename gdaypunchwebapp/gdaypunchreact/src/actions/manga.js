export const DO_GET_MANGA = "manga/DO_GET_GP_MANGA";
export const DO_GET_FEATURED_MANGA = "manga/DO_GET_FEATURED_MANGA";
export const UPDATE_MANGA = "manga/UPDATE_MANGA";
export const DO_LIKE_MANGA = "manga/DO_LIKE_MANGA";
export const SET_READING_MANGA = "manga/SET_READING_MANGA";

export const doLikeManga = (manga) => ({
  type: DO_LIKE_MANGA,
  payload: {
    manga
  }
});

export const doGetManga = (mangaId) => ({
  type: DO_GET_MANGA,
  payload: {
    mangaId
  }
});

export const doGetFeaturedManga = () => ({
  type: DO_GET_FEATURED_MANGA,
});

export const updateManga = (manga) => ({
  type: UPDATE_MANGA,
  payload: {
    manga
  }
});

export const doSetReadingManga = (mangaId) => ({
  type: SET_READING_MANGA,
  payload: {
    mangaId
  }
})
