import { pdfjs } from "react-pdf";
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
  DO_GET_GP_MANGA,
  doGetUserManga,
  updateUserManga,
  updateGPManga
} from "actions/manga";
import { selectUser } from "selectors/app";
import { selectLikingManga } from "selectors/manga";
import { api } from "utils/api";

export function* getGPManga() {
  // const loadingPDF = yield call(pdfjs.getDocument, {
  //   url:
  //     "https://gdaypunch-static.s3-us-west-2.amazonaws.com/compressed_gpmm-1-digital-compressed-s.pdf",
  //   length: 2000000,
  //   rangeChunkSize: 2000000
  // });

  // loadingPDF.onProgress((pdf) => {
  //   console.log("pdf", pdf);
  //   put(updateGPManga(pdf));
  // })
}

export function* getUserManga() {
  // const { id = 1 } = yield select(selectUser);
  const id = 1; // Load main user to get Escape manga details

  const response = yield call(api, `manga/${id}/`, {
    method: "GET"
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateUserManga(data));
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
  } else {
    console.log("Like error", JSON.stringify(response));
  }
}

export default function* mangaSaga() {
  yield all([
    takeLatest(DO_GET_GP_MANGA, getGPManga),
    takeLatest(DO_GET_USER_MANGA, getUserManga),
    takeEvery(DO_LIKE_MANGA, likeManga)
  ]);
}
