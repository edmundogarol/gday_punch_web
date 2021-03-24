import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

import {
  selectTweetLoading,
  selectEmbeddedTweetCode,
  selectTweetError,
  selectPendingTweet,
} from "selectors/admin";

import {
  doTweet,
  doResetTweet,
  doUpdateTweetImage,
  doUpdateTweetStatus,
  doUpdateReTweetUrl,
  setDeletingTweet,
} from "actions/admin";

const mapState = createStructuredSelector({
  tweetState: selectTweetLoading,
  embeddedTweet: selectEmbeddedTweetCode,
  tweetError: selectTweetError,
  pendingTweet: selectPendingTweet,
});

const mapDispatch = {
  tweet: doTweet,
  updateTweetImage: doUpdateTweetImage,
  updateTweetStatus: doUpdateTweetStatus,
  updateReTweetUrl: doUpdateReTweetUrl,
  resetTweet: doResetTweet,
  deleteTweet: setDeletingTweet,
};

export default connect(mapState, mapDispatch)(Ui);
