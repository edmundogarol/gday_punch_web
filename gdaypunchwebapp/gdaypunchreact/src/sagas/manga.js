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
  DO_LIKE_MANGA,
  DO_COMMENT_MANGA,
  DO_GET_COMMENTS,
  DO_LIKE_COMMENT,
  doGetComments,
  updateManga,
  updateComments,
  updateComment,
  UNLIKE_MANGA,
  UPLOAD_MANGA,
  uploadingManga,
  uploadingMangaFinished,
  uploadingMangaError,
} from "actions/manga";
import { selectUser } from "selectors/app";
import { api } from "utils/api";
import { message } from "antd";
import { fetchProducts } from "actions/app";

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

export function* getManga(id) {
  const mangaId = typeof id !== "number" ? id?.payload?.mangaId : id;

  const response = yield call(api, `manga/${mangaId}/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateManga(data));
    return data;
  } else {
    console.log("Manga fetch error", JSON.stringify(response));
  }
}

export function* likeManga(action) {
  const { mangaId } = action.payload;

  const response = yield call(api, `like/`, {
    method: "POST",
    body: {
      manga: mangaId,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateManga(data));
    yield put(fetchProducts(data.author));
  } else {
    console.log("Like error", JSON.stringify(response));
  }
}

export function* unlikeManga(action) {
  const { likeId } = action.payload;

  const response = yield call(api, `like/${likeId}/`, {
    method: "DELETE",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateManga(data));
    yield put(fetchProducts(data.author));
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
    yield call(getComment, action.payload.comment);
  } else {
    console.log("Manga Like Comment error", JSON.stringify(response));
  }
}

export function* uploadMangaCall(action) {
  yield put(uploadingManga());
  const { id: userId } = yield select(selectUser);
  const { manga } = action.payload;

  let form_data;
  form_data = new FormData();

  if (manga.manga) {
    const blobFetch = yield call(fetch, manga.manga);
    const blob = yield blobFetch.blob();

    form_data.append(
      "manga",
      blob,
      `${userId}_${manga.title.toLowerCase()}_manga.pdf`
    );
  }
  if (manga.image) {
    const blobFetch = yield call(fetch, manga.image);
    const blob = yield blobFetch.blob();

    form_data.append(
      "image",
      blob,
      `${userId}_${manga.title.toLowerCase()}_image.png`
    );
  }

  Object.keys(manga).map((key) => {
    if (key !== "manga" && key !== "image" && !!manga[key])
      form_data.append(key, manga[key]);
  });

  const response = yield call(api, `products/`, {
    method: "POST",
    body: form_data,
    contentType: null,
  });

  if (response && response.ok) {
    message.success("Successfully Uploaded Manga");
    yield put(fetchProducts(userId));
    yield put(uploadingMangaFinished());
  } else {
    console.log("Upload Manga error", JSON.stringify(response));
    if (response.data) {
      yield put(uploadingMangaError(response.data));
      Object.values(response.data).map((error) =>
        message.warn({
          content: error,
          className: "antd-message-capitalize",
          style: {
            textTransform: "capitalize",
          },
        })
      );
    } else {
      message.error(`Upload Manga Error: ${response.status}`);
    }
  }
}

export default function* mangaSaga() {
  yield all([
    takeLatest(DO_GET_MANGA, getManga),
    takeEvery(DO_LIKE_MANGA, likeManga),
    takeEvery(UNLIKE_MANGA, unlikeManga),
    takeEvery(DO_COMMENT_MANGA, commentManga),
    takeEvery(DO_GET_COMMENTS, getComments),
    takeEvery(DO_LIKE_COMMENT, likeComment),
    takeEvery(UPLOAD_MANGA, uploadMangaCall),
  ]);
}
