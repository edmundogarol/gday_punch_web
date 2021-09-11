import { call, all, takeLatest, put } from "redux-saga/effects";
import { message } from "antd";

import { api } from "utils/api";
import {
  customerFetchFinished,
  customerFetching,
  customerUpdate,
  CUSTOMER_FETCH,
} from "src/actions/customer";

export function* customerFetchCall(action) {
  yield put(customerFetching());
  const response = yield call(api, `customer/${action.payload.customerId}/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(customerUpdate(data));
    yield put(customerFetchFinished());
  } else {
    yield put(customerFetchFinished());
    console.log("Customer Fetch error", JSON.stringify(response));
  }
}

export default function* customerSaga() {
  yield all([takeLatest(CUSTOMER_FETCH, customerFetchCall)]);
}
