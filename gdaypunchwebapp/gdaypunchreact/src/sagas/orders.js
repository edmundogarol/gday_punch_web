import { call, all, takeLatest, put } from "redux-saga/effects";
import { message } from "antd";

import { api } from "utils/api";
import { arrayIdsMapToObject } from "utils/utils";
import {
  fetchingViewingOrder,
  FETCH_VIEWING_ORDER,
  finishedFetchingViewingOrder,
  viewingOrderError,
} from "src/actions/order";

export function* fetchinViewingOrderCall(action) {
  yield put(fetchingViewingOrder());
  const response = yield call(
    api,
    `order-confirmation/${action.payload.orderSecret}`,
    {
      method: "GET",
    }
  );

  if (response && response.ok) {
    const data = response.data;
    yield put(finishedFetchingViewingOrder(data));
  } else {
    console.log("Order fetch error", JSON.stringify(response));
    yield put(finishedFetchingViewingOrder(undefined));
    yield put(viewingOrderError(response.data));
  }
}

export default function* productSaga() {
  yield all([takeLatest(FETCH_VIEWING_ORDER, fetchinViewingOrderCall)]);
}
