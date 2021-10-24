import { call, all, takeLatest, put } from "redux-saga/effects";

import { api } from "utils/api";
import {
  CUSTOMER_FETCH,
  CUSTOMER_SUBSCRIBE,
  customerSubscribeFinished,
  customerFetchFinished,
  customerFetching,
  customerUpdate,
} from "src/actions/customer";
import { checkLogin } from "./app";

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

export function* customerSubscribeCall(action) {
  const response = yield call(api, "customer/", {
    method: "POST",
    body: {
      ...action.payload.customer,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    yield call(checkLogin);
    yield put(customerSubscribeFinished(data));
  } else {
    console.log("Customer subscribe error", JSON.stringify(response));
  }
}

export default function* customerSaga() {
  yield all([
    takeLatest(CUSTOMER_FETCH, customerFetchCall),
    takeLatest(CUSTOMER_SUBSCRIBE, customerSubscribeCall),
  ]);
}
