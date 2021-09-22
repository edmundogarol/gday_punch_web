import { call, all, takeLatest, put, delay } from "redux-saga/effects";
import { message } from "antd";

import { api } from "utils/api";
import { arrayIdsMapToObject } from "utils/utils";
import {
  fetchingViewingOrder,
  FETCH_VIEWING_ORDER,
  finishedFetchingViewingOrder,
  updateViewingOrder,
  viewingOrderError,
} from "src/actions/order";

export function* fetchinViewingOrderCall(action) {
  yield put(fetchingViewingOrder());

  let checkerCounter = 0;
  let response = yield call(
    api,
    `order-confirmation/${action.payload.orderSecret}/`,
    {
      method: "GET",
    }
  );

  while (response.data.error && checkerCounter < 5) {
    response = yield call(
      api,
      `order-confirmation/${action.payload.orderSecret}/`,
      {
        method: "GET",
      }
    );
    yield delay(2000);

    checkerCounter = checkerCounter + 1;
  }

  if (response && response.ok) {
    const data = response.data;
    yield put(updateViewingOrder(data));
    yield put(finishedFetchingViewingOrder());
  } else {
    console.log("Order fetch error", JSON.stringify(response));
    yield put(finishedFetchingViewingOrder());
    yield put(
      viewingOrderError(
        response.data.error ||
          "Something went wrong with retrieving this order. Please try again later"
      )
    );
  }
}

export default function* orderSaga() {
  yield all([takeLatest(FETCH_VIEWING_ORDER, fetchinViewingOrderCall)]);
}
