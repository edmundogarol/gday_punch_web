export const DO_TWEET = "admin/DO_TWEET";
export const DO_UPDATE_TWEET_IMAGE = "admin/DO_UPDATE_TWEET_IMAGE";
export const DO_UPDATE_TWEET_STATUS = "admin/DO_UPDATE_TWEET_STATUS";

export const doTweet = () => ({
  type: DO_TWEET
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
