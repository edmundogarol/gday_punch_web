import {
  DO_LIKE_MANGA,
  UPDATE_MANGA,
  SET_READING_MANGA,
} from "actions/manga";

const INITIAL_STATE = {
  manga: {},
  featuredMangaIds: [1, 2],
  readingManga: undefined,
  likingManga: undefined
};

export const mangaReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_MANGA:
      return {
        ...state,
        manga: {
          ...state.manga,
          [action.payload.manga.id]: action.payload.manga
        }
      };
    case SET_READING_MANGA:
      return {
        ...state,
        readingManga: action.payload.mangaId
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
