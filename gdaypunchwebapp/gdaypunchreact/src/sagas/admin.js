import { call, all, takeLatest, select, put } from "redux-saga/effects";
import {
  DO_TWEET,
  startTweetLoading,
  finishedTweet,
  tweetError
} from "actions/admin";
import { selectPendingTweet } from "selectors/admin";
import { api } from "utils/api";

const NO_MEDIA = "admin-sagas/NO_MEDIA";
const ERROR_TALKING_TO_GDAYPUNCH = "admin-sagas/ERROR_TALKING_TO_GDAYPUNCH";

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
  const pngImage = bas64Image.replace("data:image/png;base64,", "");
  const jpgImage = pngImage.replace("data:image/jpeg;base64,", "");
  const image = jpgImage;

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
    if (
      response.status === "TypeError" &&
      response.statusText.includes("Failed to fetch")
    ) {
      return {
        type: ERROR_TALKING_TO_GDAYPUNCH,
        status:
          "Something went wrong talking to Gday Punch. Check that you are connected to the internet and try again"
      };
    }
    return response;
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

  if (image.type === ERROR_TALKING_TO_GDAYPUNCH) {
    yield put(tweetError(image.status));
    return;
  } else if (!image.ok) {
    yield put(tweetError(image.statusText));
  }

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
