import { DO_UPDATE_TWEET_IMAGE, DO_UPDATE_TWEET_STATUS } from "actions/admin";

const INITIAL_STATE = {
  pendingTweet: {
    image: undefined,
    status: undefined
  }
};

export const adminReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;

  switch (action.type) {
    case DO_UPDATE_TWEET_IMAGE:
      return {
        ...state,
        pendingTweet: {
          ...state.pendingTweet,
          image: payload.image
        }
      };
    case DO_UPDATE_TWEET_STATUS:
      return {
        ...state,
        pendingTweet: {
          ...state.pendingTweet,
          status: payload.status
        }
      };
    default:
      return state;
  }
};
