import {
  DO_UPDATE_TWEET_IMAGE,
  DO_UPDATE_TWEET_STATUS,
  DO_UPDATE_RETWEET_URL,
  TWEET_ERROR,
  TWEET_LOADING,
  TWEET_FINISHED,
  TWEET_RESET,
  SET_DELETING_TWEET,
  UPDATE_PROMPTS,
  START_FETCHING_PROMPTS,
  FINISH_FETCHING_PROMPTS,
  RESET_FETCHING_PROMPTS_STATUS,
} from "actions/admin";

const INITIAL_STATE = {
  tweetLoading: false,
  tweetSuccess: false,
  tweetError: undefined,
  pendingTweet: {
    image: undefined,
    status: undefined,
    retweetUrl: undefined,
  },
  pendingDeletingTweetId: undefined,
  embeddedTweet: {
    html: undefined,
    id: undefined,
  },
  prompts: [],
  fetchingPrompts: false,
  fetchingPromptsSucess: false,
};

export const adminReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;

  switch (action.type) {
    case TWEET_ERROR:
      return {
        ...state,
        tweetLoading: false,
        tweetError: payload.error,
      };
    case TWEET_LOADING:
      return {
        ...state,
        tweetLoading: true,
      };
    case TWEET_FINISHED:
      return {
        ...state,
        embeddedTweet: payload.embedded,
        tweetLoading: false,
        tweetSuccess: true,
        pendingTweet: {
          image: undefined,
          status: undefined,
        },
      };
    case TWEET_RESET:
      return {
        ...state,
        tweetSuccess: false,
      };
    case SET_DELETING_TWEET:
      return {
        ...state,
        pendingDeletingTweetId: payload.statusId,
      };
    case DO_UPDATE_TWEET_IMAGE:
      return {
        ...state,
        pendingTweet: {
          ...state.pendingTweet,
          image: payload.image,
        },
      };
    case DO_UPDATE_RETWEET_URL:
      return {
        ...state,
        pendingTweet: {
          ...state.pendingTweet,
          retweetUrl: payload.url,
        },
      };
    case DO_UPDATE_TWEET_STATUS:
      return {
        ...state,
        pendingTweet: {
          ...state.pendingTweet,
          status: payload.status,
        },
      };
    case UPDATE_PROMPTS:
      return {
        ...state,
        ...payload,
      };
    case START_FETCHING_PROMPTS:
      return {
        ...state,
        fetchingPrompts: true,
        fetchingPromptsSucess: false,
      };
    case FINISH_FETCHING_PROMPTS:
      return {
        ...state,
        fetchingPrompts: false,
        fetchingPromptsSucess: true,
      };
    case RESET_FETCHING_PROMPTS_STATUS:
      return {
        ...state,
        fetchingPromptsSucess: false,
      };
    default:
      return state;
  }
};
