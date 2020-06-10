import {
  DO_UPDATE_TWEET_IMAGE,
  DO_UPDATE_TWEET_STATUS,
  TWEET_LOADING,
  TWEET_FINISHED,
  TWEET_RESET
} from "actions/admin";

const INITIAL_STATE = {
  tweetLoading: false,
  tweetSuccess: false,
  pendingTweet: {
    image: undefined,
    status: undefined
  },
  embeddedTweet: undefined
};

export const adminReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;

  switch (action.type) {
    case TWEET_LOADING:
      return {
        ...state,
        tweetLoading: true
      };
    case TWEET_FINISHED:
      return {
        ...state,
        embeddedTweet: payload.embedded,
        tweetLoading: false,
        tweetSuccess: true,
        pendingTweet: {
          image: undefined,
          status: undefined
        }
      };
    case TWEET_RESET:
      return {
        ...state,
        tweetSuccess: false
      };
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
