import {
  UPLOADING_MANGA,
  UPLOADING_MANGA_ERROR,
  UPLOADING_MANGA_FINISHED,
  UPLOAD_MANGA_PROGRESS,
} from "actions/manga";

import {
  FETCHING_STALL_DATA,
  FETCHING_STALL_DATA_FINISHED,
  FETCHING_STALL_DATA_ERROR,
  RESET_STALL_CHECKS,
} from "actions/user";

const INITIAL_STATE = {
  uploading: false,
  uploadingFinished: false,
  uploadingErrors: undefined,
  uploadProgress: 0,

  fetching: false,
  fetchingFinished: false,
  fetchingErrors: undefined,
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
        uploading: false,
        uploadingErrors: { ...state.uploadingErrors, ...payload.error },
      };
    case UPLOAD_MANGA_PROGRESS:
      return {
        ...state,
        uploadProgress: payload.progress,
      };
    case FETCHING_STALL_DATA:
      return {
        ...state,
        fetching: true,
        fetchingFinished: false,
      };
    case FETCHING_STALL_DATA_FINISHED:
      return {
        ...state,
        fetching: false,
        fetchingFinished: true,
      };
    case FETCHING_STALL_DATA_ERROR:
      return {
        ...state,
        fetching: false,
        fetchingErrors: payload.error,
      };
    case RESET_STALL_CHECKS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
