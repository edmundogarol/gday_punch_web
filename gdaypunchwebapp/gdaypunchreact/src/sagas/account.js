import { call, all, takeLatest, put } from "redux-saga/effects";

import { api } from "utils/api";
import {
  fetchingAccountOrders,
  FETCH_ACCOUNT_ORDERS,
  finishedFetchingAccountOrders,
  updateAccountOrders,
  updateAccountOrdersError,
} from "actions/account";
import { FOLLOW_USER, UNFOLLOW_USER } from "actions/user";
import {
  fetchingSellerDetails,
  fetchingSellerSales,
  FETCH_SELLER_DETAILS,
  FETCH_SELLER_SALES,
  finishedFetchingSellerDetails,
  finishedFetchingSellerSales,
  finishedUpdatingSellerDetails,
  SUBMIT_SELLER_DETAILS,
  updateSellerDetails,
  updateSellerDetailsError,
  updateSellerSales,
  updateSellerSalesError,
  updatingSellerDetails,
} from "actions/seller";
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

export function* fetchSellerDetailsCall(action) {
  yield put(fetchingSellerDetails());

  const response = yield call(api, `seller/${action.payload.sellerId}/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateSellerDetails(data));
    yield put(finishedFetchingSellerDetails());
  } else {
    console.log("Seller details fetch error", JSON.stringify(response));
    yield put(finishedFetchingSellerDetails());
    yield put(updateSellerDetailsError(response.data));
  }
}

export function* fetchSellerSalesCall(action) {
  yield put(fetchingSellerSales());

  const response = yield call(
    api,
    `orders/me/?seller=${action.payload.sellerId}`,
    {
      method: "GET",
    }
  );

  if (response && response.ok) {
    const data = response.data;
    yield put(updateSellerSales(data));
    yield put(finishedFetchingSellerSales());
  } else {
    console.log("Seller sales fetch error", JSON.stringify(response));
    yield put(finishedFetchingSellerSales());
    yield put(updateSellerSalesError(response.data));
  }
}

export function* submitSellerDetailsCall(action) {
  yield put(updatingSellerDetails());

  const response = yield call(
    api,
    `seller/${
      action.payload.details.seller_id
        ? `${action.payload.details.seller_id}/`
        : ""
    }`,
    {
      method: action.payload.details.seller_id ? "PATCH" : "POST",
      body: {
        ...action.payload.details,
      },
    }
  );

  if (response && response.ok) {
    const data = response.data;
    yield put(updateSellerDetails(data));
    yield put(finishedUpdatingSellerDetails());
  } else {
    yield put(finishedUpdatingSellerDetails());
    console.log("Follow error", JSON.stringify(response));
    yield put(updateSellerDetailsError(response.data));
  }
}

export default function* accountSaga() {
  yield all([
    takeLatest(FETCH_ACCOUNT_ORDERS, fetchingAccountOrdersCall),
    takeLatest(FOLLOW_USER, followUserCall),
    takeLatest(UNFOLLOW_USER, unfollowUserCall),
    takeLatest(FETCH_SELLER_DETAILS, fetchSellerDetailsCall),
    takeLatest(FETCH_SELLER_SALES, fetchSellerSalesCall),
    takeLatest(SUBMIT_SELLER_DETAILS, submitSellerDetailsCall),
  ]);
}
