export const DO_GET_USER_MANGA = "manga/DO_GET_USER_MANGA";
export const DO_GET_GP_MANGA = "manga/DO_GET_GP_MANGA";
export const UPDATE_GP_MANGA = "manga/UPDATE_GP_MANGA";
export const UPDATE_USER_MANGA = "manga/UPDATE_USER_MANGA";
export const DO_LIKE_MANGA = "manga/DO_LIKE_MANGA";

export const doLikeManga = (manga) => ({
  type: DO_LIKE_MANGA,
  payload: {
    manga
  }
});

export const doGetGPManga = () => ({
  type: DO_GET_GP_MANGA
});

export const doGetUserManga = () => ({
  type: DO_GET_USER_MANGA
});

export const updateUserManga = (manga) => ({
  type: UPDATE_USER_MANGA,
  payload: {
    manga
  }
});

export const updateGPManga = (gpManga) => ({
  type: UPDATE_GP_MANGA,
  payload: {
    gpManga
  }
});
