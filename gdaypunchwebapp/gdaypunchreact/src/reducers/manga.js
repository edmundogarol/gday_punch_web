import { UPDATE_USER_MANGA, DO_LIKE_MANGA } from "actions/manga";

const INITIAL_STATE = {
  userManga: {},
  likingManga: undefined
};

export const mangaReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_USER_MANGA:
      return {
        ...state,
        userManga: {
          ...state.userManga,
          [action.payload.manga.id]: action.payload.manga
        }
      };
    case DO_LIKE_MANGA:
      return {
        ...state,
        likingManga: action.payload.manga
      };
    default:
      return state;
  }
};
