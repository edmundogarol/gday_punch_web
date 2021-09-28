import { call, all, takeLatest, put } from "redux-saga/effects";
import { message } from "antd";

import { api } from "utils/api";
import {
  downloadManuscriptRequestErrors,
  downloadManuscriptRequestFinished,
  downloadManuscriptRequesting,
  DOWNLOAD_MANUSCRIPT_REQUEST,
  resetDownloadManuscriptRequest,
} from "src/actions/resources";

export function* downloadManuscriptRequestCall(action) {
  yield put(downloadManuscriptRequesting());

  const response = yield call(api, `manga-manuscript/`, {
    method: "POST",
    body: {
      email: action.payload.email,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    message.success(data.detail, 3);
    yield put(downloadManuscriptRequestFinished());
    yield put(downloadManuscriptRequestErrors(undefined));
  } else {
    if (response.data.error) {
      message.error(response.data.error, 3);
    } else {
      message.error("Something went wrong. Please try again later.", 3);
    }
    console.log("Download Manuscript request error", JSON.stringify(response));
    yield put(downloadManuscriptRequestFinished());
    yield put(downloadManuscriptRequestErrors(response.data.error));
  }
}

export default function* resourcesSaga() {
  yield all([
    takeLatest(DOWNLOAD_MANUSCRIPT_REQUEST, downloadManuscriptRequestCall),
  ]);
}
