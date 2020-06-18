import { call, all, takeLatest, select, put } from "redux-saga/effects";
import {
  DO_TWEET,
  SET_DELETING_TWEET,
  startTweetLoading,
  finishedTweet,
  tweetError
} from "actions/admin";
import {
  selectPendingTweet,
  selectPendingDeletingTweet
} from "selectors/admin";
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
    return data;
  } else {
    console.log("Tweet Status error", JSON.stringify(response));
  }
}

export function* retweetStatus() {
  const { status, retweetUrl } = yield select(selectPendingTweet);
  const response = yield call(api, "statuses/update", {
    fetchType: "twitter",
    method: "POST",
    retweetUrl,
    status
  });

  if (response && response.ok) {
    const data = response.data;
    return data;
  } else {
    console.log("ReTweet Status error", JSON.stringify(response));
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

export function* deleteTweet() {
  const statusId = (yield select(selectPendingDeletingTweet)).statusId;
  yield put(startTweetLoading());
  const response = yield call(api, "statuses/destroy", {
    fetchType: "twitter",
    method: "POST",
    statusId
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(finishedTweet({ html: undefined, id: undefined }));
    return data;
  } else {
    console.log("Tweet Status error", JSON.stringify(response));
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
    return data;
  } else {
    console.log("Tweet Status error", JSON.stringify(response));
  }
}

export function* callTweet() {
  const tweet = yield select(selectPendingTweet);

  yield put(startTweetLoading());

  let image;
  if (tweet.image) {
    image = yield tweetImage();

    if (image.type === ERROR_TALKING_TO_GDAYPUNCH) {
      yield put(tweetError(image.status));
      return;
    } else if (!image.ok) {
      yield put(tweetError(image.statusText));
    }
  }

  let tweetResult;
  if (image === NO_MEDIA || image === undefined) {
    if (tweet.retweetUrl) {
      tweetResult = yield retweetStatus();
    } else {
      tweetResult = yield tweetStatus();
    }
  } else {
    tweetResult = yield tweetStatus(image.media_id_string);
  }

  const result = yield getEmbeddedTweet(tweetResult.id_str);

  if (result.html) {
    yield put(finishedTweet({ html: result.html, id: tweetResult.id_str }));
  }
}

export default function* adminSaga() {
  yield all([
    takeLatest(DO_TWEET, callTweet),
    takeLatest(SET_DELETING_TWEET, deleteTweet)
  ]);
}
