export const DO_TWEET = "admin/DO_TWEET";
export const DO_UPDATE_TWEET_IMAGE = "admin/DO_UPDATE_TWEET_IMAGE";
export const DO_UPDATE_TWEET_STATUS = "admin/DO_UPDATE_TWEET_STATUS";
export const DO_UPDATE_RETWEET_URL = "admin/DO_UPDATE_RETWEET_URL";
export const TWEET_ERROR = "admin/TWEET_ERROR";
export const TWEET_LOADING = "admin/TWEET_LOADING";
export const TWEET_FINISHED = "admin/TWEET_FINISHED";
export const TWEET_RESET = "admin/TWEET_RESET";
export const SET_DELETING_TWEET = "admin/SET_DELETING_TWEET";

export const FETCH_PROMPTS = "admin/FETCH_PROMPTS";
export const UPDATE_PROMPTS = "admin/UPDATE_PROMPTS";
export const START_FETCHING_PROMPTS = "admin/START_FETCHING_PROMPTS";
export const FINISH_FETCHING_PROMPTS = "admin/FINISH_FETCHING_PROMPTS";
export const CREATE_PROMPT = "admin/CREATE_PROMPT";
export const SELECT_PROMPT = "admin/SELECT_PROMPT";
export const RESET_FETCHING_PROMPTS_STATUS =
  "admin/RESET_FETCHING_PROMPTS_STATUS";

export const doTweet = () => ({
  type: DO_TWEET,
});

export const startTweetLoading = () => ({
  type: TWEET_LOADING,
});

export const finishedTweet = (embedded) => ({
  type: TWEET_FINISHED,
  payload: {
    embedded,
  },
});

export const setDeletingTweet = (statusId) => ({
  type: SET_DELETING_TWEET,
  payload: {
    statusId,
  },
});

export const tweetError = (error) => ({
  type: TWEET_ERROR,
  payload: {
    error,
  },
});

export const doResetTweet = (embedded) => ({
  type: TWEET_RESET,
});

export const doUpdateTweetImage = (image) => ({
  type: DO_UPDATE_TWEET_IMAGE,
  payload: {
    image,
  },
});

export const doUpdateTweetStatus = (status = "") => ({
  type: DO_UPDATE_TWEET_STATUS,
  payload: {
    status,
  },
});

export const doUpdateReTweetUrl = (url) => ({
  type: DO_UPDATE_RETWEET_URL,
  payload: {
    url,
  },
});

export const fetchPrompts = (random) => ({
  type: FETCH_PROMPTS,
  payload: {
    random,
  },
});

export const startFetchingPrompts = () => ({
  type: START_FETCHING_PROMPTS,
});

export const finishFetchingPrompts = () => ({
  type: FINISH_FETCHING_PROMPTS,
});

export const updatePrompts = (prompts) => ({
  type: UPDATE_PROMPTS,
  payload: {
    prompts,
  },
});

export const createPrompt = (prompt) => ({
  type: CREATE_PROMPT,
  payload: {
    prompt,
  },
});

export const resetPromptFetch = () => ({
  type: RESET_FETCHING_PROMPTS_STATUS,
});

export const selectPrompt = (promptId) => ({
  type: SELECT_PROMPT,
  payload: {
    promptId,
  },
});
