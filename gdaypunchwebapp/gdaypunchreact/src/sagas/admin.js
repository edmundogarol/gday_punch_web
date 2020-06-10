import { call, all, takeLatest, select, put } from "redux-saga/effects";
import { DO_TWEET, startTweetLoading, finishedTweet } from "actions/admin";
import { selectPendingTweet } from "selectors/admin";
import { api } from "utils/api";

const NO_MEDIA = "admin-sagas/NO_MEDIA";

export function* tweetStatus(mediaId = undefined) {
  const { status } = yield select(selectPendingTweet);
  const response = yield call(api, "statuses/update", {
    fetchType: "twitter",
    method: "POST",
    mediaId,
    status
  });

  if (response && response.ok) {
    const data = response.data;
    console.log("data", data);
    return data;
  } else {
    console.log("Tweet Status error", JSON.stringify(response));
  }
}

export function* tweetImage() {
  const tweet = yield select(selectPendingTweet);

  if (tweet.image === undefined) return NO_MEDIA;

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const bas64Image = yield call(toBase64, tweet.image);
  const image = bas64Image.replace("data:image/png;base64,", "");

  const response = yield call(api, "media/upload", {
    fetchType: "twitter",
    method: "POST",
    image
  });

  if (response && response.ok) {
    const data = response.data;
    if (tweet.status === undefined) {
      return NO_MEDIA;
    }
    return data;
  } else {
    console.log("Tweet Image error", JSON.stringify(response));
  }
}

export function* getEmbeddedTweet(embedId) {
  const response = yield call(api, "oembed", {
    fetchType: "twitter",
    method: "GET",
    embedId,
    status
  });

  if (response && response.ok) {
    const data = response.data;
    console.log("data", data);
    return data;
  } else {
    console.log("Tweet Status error", JSON.stringify(response));
  }
}

export function* callTweet() {
  yield put(startTweetLoading());
  const image = yield tweetImage();

  let tweet;
  if (image === NO_MEDIA) {
    tweet = yield tweetStatus();
  } else {
    tweet = yield tweetStatus(image.media_id_string);
  }

  const result = yield getEmbeddedTweet(tweet.id_str);

  if (result.html) yield put(finishedTweet(result.html));
}

export default function* adminSaga() {
  yield all([takeLatest(DO_TWEET, callTweet)]);
}
