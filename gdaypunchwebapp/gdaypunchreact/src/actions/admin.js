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
export const UPDATE_PANEL_STYLE_PROMPT = "admin/UPDATE_PANEL_STYLE_PROMPT";
export const FETCH_PANEL_STYLE_PROMPT = "admin/FETCH_PANEL_STYLE_PROMPT";
export const RESET_FETCHING_PROMPTS_STATUS =
  "admin/RESET_FETCHING_PROMPTS_STATUS";
export const START_FETCHING_PANEL_STYLE_PROMPT =
  "admin/START_FETCHING_PANEL_STYLE_PROMPT";
export const FINISH_FETCHING_PANEL_STYLE_PROMPT =
  "admin/FINISH_FETCHING_PANEL_STYLE_PROMPT";

export const FETCH_ADMIN_PRODUCTS = "admin/FETCH_ADMIN_PRODUCTS";
export const FETCHING_ADMIN_PRODUCTS = "admin/FETCHING_ADMIN_PRODUCTS";
export const FINISHED_FETCHING_ADMIN_PRODUCTS =
  "admin/FINISHED_FETCHING_ADMIN_PRODUCTS";
export const UPDATE_ADMIN_PRODUCTS = "admin/UPDATE_ADMIN_PRODUCTS";
export const CREATE_ADMIN_PRODUCT = "admin/CREATE_ADMIN_PRODUCT";
export const DELETE_ADMIN_PRODUCT = "admin/DELETE_ADMIN_PRODUCT";

export const FETCH_STRIPE_PRODUCTS = "admin/FETCH_STRIPE_PRODUCTS";
export const FETCHING_STRIPE_PRODUCTS = "admin/FETCHING_STRIPE_PRODUCTS";
export const FINISHED_FETCHING_STRIPE_PRODUCTS =
  "admin/FINISHED_FETCHING_STRIPE_PRODUCTS";
export const UPDATE_STRIPE_PRODUCTS = "admin/UPDATE_STRIPE_PRODUCTS";

export const SET_EDITING_PRODUCT = "admin/SET_EDITING_PRODUCT";

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

export const fetchPanelStylePrompt = () => ({
  type: FETCH_PANEL_STYLE_PROMPT,
});

export const startFetchingPanelStylePrompt = () => ({
  type: START_FETCHING_PANEL_STYLE_PROMPT,
});

export const finishFetchingPanelStylePrompt = () => ({
  type: FINISH_FETCHING_PANEL_STYLE_PROMPT,
});

export const updatePanelStylePrompt = (prompt) => ({
  type: UPDATE_PANEL_STYLE_PROMPT,
  payload: {
    prompt,
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

export const fetchAdminProducts = () => ({
  type: FETCH_ADMIN_PRODUCTS,
});

export const fetchStripeProducts = () => ({
  type: FETCH_STRIPE_PRODUCTS,
});

export const fetchingAdminProducts = () => ({
  type: FETCHING_ADMIN_PRODUCTS,
});

export const fetchingStripeProducts = () => ({
  type: FETCHING_STRIPE_PRODUCTS,
});

export const finishedFetchingAdminProducts = () => ({
  type: FINISHED_FETCHING_ADMIN_PRODUCTS,
});

export const finishedFetchingStripeProducts = () => ({
  type: FINISHED_FETCHING_STRIPE_PRODUCTS,
});

export const updateAdminProducts = (products) => ({
  type: UPDATE_ADMIN_PRODUCTS,
  payload: {
    products,
  },
});

export const updateStripeProducts = (products) => ({
  type: UPDATE_STRIPE_PRODUCTS,
  payload: {
    products,
  },
});

export const createAdminProduct = (product) => ({
  type: CREATE_ADMIN_PRODUCT,
  payload: {
    product,
  },
});

export const deleteAdminProduct = (productId) => ({
  type: DELETE_ADMIN_PRODUCT,
  payload: {
    productId,
  },
});

export const setEditProduct = (productId) => ({
  type: SET_EDITING_PRODUCT,
  payload: {
    productId,
  },
});
