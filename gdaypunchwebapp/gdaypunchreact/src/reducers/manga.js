import {
  SET_READING_MANGA,
  UPDATE_COMMENTS,
  UPDATE_COMMENT,
} from "actions/manga";
import { remove } from "lodash";

const INITIAL_STATE = {
  comments: [],
  featuredMangaIds: [1, 2],
  readingManga: undefined,
};

export const mangaReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_READING_MANGA:
      return {
        ...state,
        readingManga: action.payload.mangaId,
      };
    case UPDATE_COMMENTS:
      return {
        ...state,
        comments: action.payload.comments,
      };
    case UPDATE_COMMENT:
      remove(state.comments, (comment) => {
        return comment.id === action.payload.comment.id;
      });
      return {
        ...state,
        comments: [...state.comments, action.payload.comment],
      };
    default:
      return state;
  }
};
