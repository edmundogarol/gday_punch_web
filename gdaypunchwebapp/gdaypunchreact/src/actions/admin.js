export const DO_TWEET = "admin/DO_TWEET";
export const DO_UPDATE_TWEET_IMAGE = "admin/DO_UPDATE_TWEET_IMAGE";
export const DO_UPDATE_TWEET_STATUS = "admin/DO_UPDATE_TWEET_STATUS";
export const TWEET_LOADING = "admin/TWEET_LOADING";
export const TWEET_FINISHED = "admin/TWEET_FINISHED";
export const TWEET_RESET = "admin/TWEET_RESET";

export const doTweet = () => ({
  type: DO_TWEET
});

export const startTweetLoading = () => ({
  type: TWEET_LOADING
});

export const finishedTweet = (embedded) => ({
  type: TWEET_FINISHED,
  payload: {
    embedded
  }
});

export const doResetTweet = (embedded) => ({
  type: TWEET_RESET
});

export const doUpdateTweetImage = (image) => ({
  type: DO_UPDATE_TWEET_IMAGE,
  payload: {
    image
  }
});

export const doUpdateTweetStatus = (status) => ({
  type: DO_UPDATE_TWEET_STATUS,
  payload: {
    status
  }
});
