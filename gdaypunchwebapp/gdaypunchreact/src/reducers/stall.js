import {
  FETCHING_USER_MANGA,
  FETCHING_USER_MANGA_ERROR,
  FETCHING_USER_MANGA_FINISHED,
  UPLOADING_MANGA,
  UPLOADING_MANGA_ERROR,
  UPLOADING_MANGA_FINISHED,
} from "actions/manga";

const INITIAL_STATE = {
  uploading: false,
  uploadingFinished: false,
  uploadingErrors: undefined,

  user: {
    manga: {},
    fetching: false,
    fetchingFinished: false,
    fetchingErrors: undefined,
  },
};

export const stallReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;

  switch (action.type) {
    case UPLOADING_MANGA:
      return {
        ...state,
        uploading: true,
        uploadingFinished: false,
      };
    case UPLOADING_MANGA_FINISHED:
      return {
        ...state,
        uploading: false,
        uploadingFinished: true,
      };
    case UPLOADING_MANGA_ERROR:
      return {
        ...state,
        uploadingErrors: payload.error,
      };
    case FETCHING_USER_MANGA:
      return {
        ...state,
        user: {
          ...state.user,
          fetching: true,
          fetchingFinished: false,
        },
      };
    case FETCHING_USER_MANGA_FINISHED:
      return {
        ...state,
        user: {
          ...state.user,
          fetching: false,
          fetchingFinished: true,
        },
      };
    case FETCHING_USER_MANGA_ERROR:
      return {
        ...state,
        user: {
          ...state.user,
          fetchingErrors: payload.error,
        },
      };
    default:
      return state;
  }
};
