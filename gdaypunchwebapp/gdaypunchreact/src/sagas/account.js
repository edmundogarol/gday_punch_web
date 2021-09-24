import { call, all, takeLatest, put, delay } from "redux-saga/effects";
import { message } from "antd";

import { api } from "utils/api";
import { arrayIdsMapToObject } from "utils/utils";
import {
  fetchingAccountOrders,
  FETCH_ACCOUNT_ORDERS,
  finishedFetchingAccountOrders,
  updateAccountOrders,
  updateAccountOrdersError,
} from "src/actions/account";

export function* fetchingAccountOrdersCall(action) {
  yield put(fetchingAccountOrders());

  const response = yield call(api, `orders/${action.payload.stripeCustomer}/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateAccountOrders(data));
    yield put(finishedFetchingAccountOrders());
  } else {
    console.log("Account orders fetch error", JSON.stringify(response));
    yield put(finishedFetchingAccountOrders());
    yield put(updateAccountOrdersError(response.data));
  }
}

export default function* accountSaga() {
  yield all([takeLatest(FETCH_ACCOUNT_ORDERS, fetchingAccountOrdersCall)]);
}
