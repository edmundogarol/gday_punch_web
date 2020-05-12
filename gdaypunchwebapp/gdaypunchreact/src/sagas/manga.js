import {
  call,
  all,
  takeLatest,
  takeEvery,
  select,
  put
} from "redux-saga/effects";
import {
  DO_GET_USER_MANGA,
  DO_LIKE_MANGA,
  doGetUserManga,
  updateUserManga
} from "actions/manga";
import { selectUser } from "selectors/app";
import { selectLikingManga } from "selectors/manga";
import { api } from "utils/api";

export function* getUserManga() {
  // const { id = 1 } = yield select(selectUser);
  const id = 1; // Load main user to get Escape manga details

  const response = yield call(api, `manga/${id}/`, {
    method: "GET"
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateUserManga(data));
    console.log("User Manga Data", data);
  } else {
    console.log("User Manga error", JSON.stringify(response));
  }
}

export function* likeManga() {
  const manga = yield select(selectLikingManga);
  const { id } = yield select(selectUser);

  const response = yield call(api, `like/`, {
    method: "POST",
    body: {
      manga,
      user: id
    }
  });

  if (response && response.ok) {
    const data = response.data;
    // yield put(updateUserManga(data));
    // TODO Temporary refresher of manga
    yield put(doGetUserManga());
    console.log("Like data", data);
  } else {
    console.log("Like error", JSON.stringify(response));
  }
}

export default function* mangaSaga() {
  yield all([
    takeLatest(DO_GET_USER_MANGA, getUserManga),
    takeEvery(DO_LIKE_MANGA, likeManga)
  ]);
}
