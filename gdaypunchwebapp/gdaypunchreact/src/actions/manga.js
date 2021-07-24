export const DO_GET_MANGA = "manga/DO_GET_GP_MANGA";
export const DO_GET_FEATURED_MANGA = "manga/DO_GET_FEATURED_MANGA";
export const UPDATE_MANGA = "manga/UPDATE_MANGA";
export const DO_LIKE_MANGA = "manga/DO_LIKE_MANGA";
export const DO_COMMENT_MANGA = "manga/DO_COMMENT_MANGA";
export const DO_GET_COMMENTS = "manga/DO_GET_COMMENTS";
export const DO_LIKE_COMMENT = "manga/DO_LIKE_COMMENT";
export const UPDATE_COMMENTS = "manga/UPDATE_COMMENTS";
export const UPDATE_COMMENT = "manga/UPDATE_COMMENT";
export const SET_READING_MANGA = "manga/SET_READING_MANGA";

export const doGetManga = (mangaId) => ({
  type: DO_GET_MANGA,
  payload: {
    mangaId,
  },
});

export const updateManga = (manga, updateProducts = false) => ({
  type: UPDATE_MANGA,
  payload: {
    manga,
    updateProducts,
  },
});

export const doSetReadingManga = (mangaId) => ({
  type: SET_READING_MANGA,
  payload: {
    mangaId,
  },
});

export const doLikeManga = (mangaId) => ({
  type: DO_LIKE_MANGA,
  payload: {
    mangaId,
  },
});

export const doCommentManga = (comment, mangaId) => ({
  type: DO_COMMENT_MANGA,
  payload: {
    comment,
    mangaId,
  },
});

export const doLikeComment = (comment, user) => ({
  type: DO_LIKE_COMMENT,
  payload: {
    comment,
    user,
  },
});

export const doGetComments = (mangaId) => ({
  type: DO_GET_COMMENTS,
  payload: {
    mangaId,
  },
});

export const updateComments = (comments) => ({
  type: UPDATE_COMMENTS,
  payload: {
    comments,
  },
});

export const updateComment = (comment) => ({
  type: UPDATE_COMMENT,
  payload: {
    comment,
  },
});

export const doGetFeaturedManga = () => ({
  type: DO_GET_FEATURED_MANGA,
});
