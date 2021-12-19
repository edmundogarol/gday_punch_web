export const DO_GET_MANGA = "manga/DO_GET_GP_MANGA";
export const UPDATE_MANGA = "manga/UPDATE_MANGA";
export const DO_LIKE_MANGA = "manga/DO_LIKE_MANGA";
export const UNLIKE_MANGA = "manga/UNLIKE_MANGA";
export const DO_COMMENT_MANGA = "manga/DO_COMMENT_MANGA";
export const DO_GET_COMMENTS = "manga/DO_GET_COMMENTS";
export const DO_LIKE_COMMENT = "manga/DO_LIKE_COMMENT";
export const UPDATE_COMMENTS = "manga/UPDATE_COMMENTS";
export const UPDATE_COMMENT = "manga/UPDATE_COMMENT";
export const SET_READING_MANGA = "manga/SET_READING_MANGA";
export const RECORD_VIEW = "manga/RECORD_VIEW";

export const UPLOAD_MANGA = "manga/UPLOAD_MANGA";
export const UPLOADING_MANGA = "manga/UPLOADING_MANGA";
export const UPLOADING_MANGA_FINISHED = "manga/UPLOADING_MANGA_FINISHED";
export const UPLOADING_MANGA_ERROR = "manga/UPLOADING_MANGA_ERROR";
export const UPLOAD_MANGA_PROGRESS = "manga/UPLOAD_MANGA_PROGRESS";

export const doGetManga = (mangaId) => ({
  type: DO_GET_MANGA,
  payload: {
    mangaId,
  },
});

export const uploadManga = (manga, history) => ({
  type: UPLOAD_MANGA,
  payload: {
    manga,
    history,
  },
});

export const uploadingManga = () => ({
  type: UPLOADING_MANGA,
});

export const uploadingMangaFinished = () => ({
  type: UPLOADING_MANGA_FINISHED,
});

export const uploadingMangaError = (error) => ({
  type: UPLOADING_MANGA_ERROR,
  payload: {
    error,
  },
});

export const setUploadProgress = (progress) => ({
  type: UPLOAD_MANGA_PROGRESS,
  payload: {
    progress,
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

export const unlikeManga = (likeId) => ({
  type: UNLIKE_MANGA,
  payload: {
    likeId,
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

export const recordView = (mangaId) => ({
  type: RECORD_VIEW,
  payload: {
    mangaId,
  },
});
