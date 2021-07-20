import { pdfjs } from "react-pdf";
import {
  call,
  all,
  takeLatest,
  takeEvery,
  select,
  put,
} from "redux-saga/effects";
import {
  DO_GET_MANGA,
  DO_GET_FEATURED_MANGA,
  DO_LIKE_MANGA,
  DO_COMMENT_MANGA,
  DO_GET_COMMENTS,
  DO_LIKE_COMMENT,
  doGetComments,
  updateManga,
  updateComments,
  updateComment,
} from "actions/manga";
import { selectUser } from "selectors/app";
import { selectLikingManga } from "selectors/manga";
import { api } from "utils/api";
import { message } from "antd";

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

export function* getFeaturedManga() {
  const featuredMangaIds = [1, 2];
  const featuredManga = yield call(getMangaCollection, featuredMangaIds);

  yield featuredManga.forEach((manga) => put(updateManga(manga)));
}

export function* getMangaCollection(mangaIds) {
  const collection = yield all(mangaIds.map((manga) => call(getManga, manga)));
  return collection;
}

export function* getManga(id, updateProducts = false) {
  const mangaId = typeof id !== "number" ? id?.payload?.mangaId : id;

  const response = yield call(api, `manga/${mangaId}/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateManga(data, updateProducts));
    return data;
  } else {
    console.log("Manga fetch error", JSON.stringify(response));
  }
}

export function* likeManga(action) {
  const manga = yield select(selectLikingManga);
  const { id } = yield select(selectUser);

  const response = yield call(api, `like/`, {
    method: "POST",
    body: {
      manga,
      user: id,
    },
  });

  if (response && response.ok) {
    yield call(getManga, manga, action.payload.updateProducts);
  } else {
    console.log("Like error", JSON.stringify(response));
  }
}

export function* commentManga(action) {
  const { id } = yield select(selectUser);

  const response = yield call(api, `comment/`, {
    method: "POST",
    body: {
      content: action.payload.comment,
      manga: action.payload.mangaId,
      user: id,
    },
  });

  if (response && response.ok) {
    yield call(getComments, doGetComments(action.payload.mangaId));
  } else {
    if (response.data.detail.includes("throttled")) {
      message.warn(
        "Whoa there cowpoke! You're commenting too fast. Try again later."
      );
    }
    console.log("Comment error", JSON.stringify(response));
  }
}

export function* getComments(action) {
  const response = yield call(api, `comments/${action.payload.mangaId}/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateComments(data));
  } else {
    console.log("Manga Comments fetch error", JSON.stringify(response));
    yield put(updateComments([]));
  }
}

export function* getComment(commentId) {
  const response = yield call(api, `comment/${commentId}/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateComment(data));
  } else {
    console.log("Manga Comment fetch error", JSON.stringify(response));
  }
}

export function* likeComment(action) {
  const response = yield call(api, `comment-like/`, {
    method: "POST",
    body: action.payload,
  });

  if (response && response.ok) {
    const data = response.data;
    yield call(getComment, action.payload.comment);
  } else {
    console.log("Manga Like Comment error", JSON.stringify(response));
  }
}

export default function* mangaSaga() {
  yield all([
    takeLatest(DO_GET_MANGA, getManga),
    takeLatest(DO_GET_FEATURED_MANGA, getFeaturedManga),
    takeEvery(DO_LIKE_MANGA, likeManga),
    takeEvery(DO_COMMENT_MANGA, commentManga),
    takeEvery(DO_GET_COMMENTS, getComments),
    takeEvery(DO_LIKE_COMMENT, likeComment),
  ]);
}
