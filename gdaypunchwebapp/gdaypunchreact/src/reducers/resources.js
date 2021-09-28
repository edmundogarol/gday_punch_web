import {
  DOWNLOAD_MANUSCRIPT_REQUESTING,
  DOWNLOAD_MANUSCRIPT_REQUEST_ERRORS,
  DOWNLOAD_MANUSCRIPT_REQUEST_FINISHED,
} from "src/actions/resources";

const INITIAL_STATE = {
  downloadManuscript: {
    requesting: false,
    finished: false,
    errors: undefined,
  },
};

export const resourcesReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;

  switch (action.type) {
    case DOWNLOAD_MANUSCRIPT_REQUESTING:
      return {
        ...state,
        downloadManuscript: {
          ...state.downloadManuscript,
          requesting: true,
          finished: false,
        },
      };
    case DOWNLOAD_MANUSCRIPT_REQUEST_FINISHED:
      return {
        ...state,
        downloadManuscript: {
          ...state.downloadManuscript,
          requesting: false,
          finished: true,
        },
      };
    case DOWNLOAD_MANUSCRIPT_REQUEST_ERRORS:
      return {
        ...state,
        downloadManuscript: {
          ...state.downloadManuscript,
          errors: payload.errors,
        },
      };
    default:
      return state;
  }
};
