export const DO_TWEET = "admin/DO_TWEET";

export const doTweet = (tweet) => ({
  type: DO_TWEET,
  payload: {
    tweet
  }
});
