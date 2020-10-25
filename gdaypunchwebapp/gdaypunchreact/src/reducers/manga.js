import {
  DO_LIKE_MANGA,
  UPDATE_MANGA,
  SET_READING_MANGA,
  UPDATE_COMMENTS,
  UPDATE_COMMENT
} from "actions/manga";
import { remove } from "lodash";

const INITIAL_STATE = {
  manga: {},
  comments: [],
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
    case UPDATE_COMMENTS:
      return {
        ...state,
        comments: action.payload.comments
      };
    case UPDATE_COMMENT:
      remove(state.comments, (comment) => {
        return comment.id === action.payload.comment.id;
      });
      return {
        ...state,
        comments: [...state.comments, action.payload.comment]
      };
    default:
      return state;
  }
};
