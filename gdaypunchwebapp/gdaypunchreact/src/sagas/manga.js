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
  DO_GET_MANGA,
  DO_GET_FEATURED_MANGA,
  DO_LIKE_MANGA,
  updateManga
} from "actions/manga";
import { selectUser } from "selectors/app";
import { selectLikingManga, selectAllMangaIds, selectManga } from "selectors/manga";
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

export function* getFeaturedManga() {
  const featuredMangaIds = [1, 2];
  const featuredManga = yield call(getMangaCollection, featuredMangaIds);

  yield featuredManga.forEach((manga) => put(updateManga(manga)));
}

export function* getMangaCollection(mangaIds) {
  const availableIds = yield select(selectAllMangaIds);
  const filteredIds = mangaIds.filter(id => {
    return availableIds.indexOf(id) < 0
  });

  const collection = yield all(filteredIds.map((manga) => call(getManga, manga)));
  return collection;
}

export function* getManga(id) {
  const mangaId = typeof id !== "number" ? id?.payload?.mangaId : id;
  const availableIds = yield select(selectAllMangaIds);

  if(availableIds.includes(parseInt(mangaId, 10))) return yield select(selectManga(mangaId))

  const response = yield call(api, `manga/${mangaId}/`, {
    method: "GET"
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateManga(data));
    return data;
  } else {
    console.log("Manga fetch error", JSON.stringify(response));
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
    yield put(getManga(id));
  } else {
    console.log("Like error", JSON.stringify(response));
  }
}

export default function* mangaSaga() {
  yield all([
    takeLatest(DO_GET_MANGA, getManga),
    takeLatest(DO_GET_FEATURED_MANGA, getFeaturedManga),
    takeEvery(DO_LIKE_MANGA, likeManga)
  ]);
}
