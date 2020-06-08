import { call, all, takeLatest, select } from "redux-saga/effects";
import { DO_TWEET } from "actions/admin";
import { selectPendingTweet } from "selectors/admin";
import { api } from "utils/api";

export function* tweet() {
  const tweet = yield select(selectPendingTweet);
  const response = yield call(api, "statuses/update", {
    fetchType: "twitter",
    method: "POST",
    ...tweet
  });

  if (response && response.ok) {
    const data = response.data;
    console.log("data", data);
  } else {
    console.log("Tweet error", JSON.stringify(response));
  }
}

export default function* adminSaga() {
  yield all([takeLatest(DO_TWEET, tweet)]);
}
