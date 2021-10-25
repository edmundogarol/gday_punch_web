import { call, all, takeLatest, put } from "redux-saga/effects";

import { api } from "utils/api";
import {
  fetchingAccountOrders,
  FETCH_ACCOUNT_ORDERS,
  finishedFetchingAccountOrders,
  updateAccountOrders,
  updateAccountOrdersError,
} from "src/actions/account";
import { FOLLOW_USER, UNFOLLOW_USER } from "actions/user";
import { updateUsers } from "actions/app";

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

export function* followUserCall(action) {
  const { userId } = action.payload;

  const response = yield call(api, `follow/`, {
    method: "POST",
    body: {
      user: userId,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateUsers([data]));
  } else {
    console.log("Follow error", JSON.stringify(response));
  }
}

export function* unfollowUserCall(action) {
  const { followId } = action.payload;

  const response = yield call(api, `follow/${followId}/`, {
    method: "DELETE",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateUsers([data]));
  } else {
    console.log("Unfollow error", JSON.stringify(response));
  }
}

export default function* accountSaga() {
  yield all([
    takeLatest(FETCH_ACCOUNT_ORDERS, fetchingAccountOrdersCall),
    takeLatest(FOLLOW_USER, followUserCall),
    takeLatest(UNFOLLOW_USER, unfollowUserCall),
  ]);
}
