import { call, all, select, takeLatest, put } from "redux-saga/effects";
import { message } from "antd";

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
  fetchSaleStatusUpdates,
  FETCH_SALE_STATUS_UPDATES,
  FETCH_SELLER_DETAILS,
  FETCH_SELLER_SALES,
  finishedFetchingSellerDetails,
  finishedFetchingSellerSales,
  finishedUpdatingSellerDetails,
  SUBMIT_SELLER_DETAILS,
  updateSale,
  updateSaleStatusReason,
  updateSaleStatusUpdates,
  updateSellerDetails,
  updateSellerDetailsError,
  updateSellerSales,
  updateSellerSalesError,
  UPDATE_SALE_STATUS,
  updatingSellerDetails,
} from "actions/seller";
import { updateUsers } from "actions/app";
import { selectUser } from "selectors/app";
import {
  selectSalePartialRefundAmount,
  selectSaleStatusUpdateReason,
} from "selectors/account";

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
    console.log("Seller details submit error", JSON.stringify(response));
    yield put(updateSellerDetailsError(response.data));
  }
}

export function* fetchSaleStatusUpdatesCall(action) {
  const { seller_id } = yield select(selectUser);
  const { orderId } = action.payload;

  const response = yield call(
    api,
    `orders-status/${orderId}/?seller=${seller_id}`,
    {
      method: "GET",
    }
  );

  if (response && response.ok) {
    const data = response.data;
    yield put(updateSaleStatusUpdates(orderId, data));
  } else {
    console.log("Sale Status Updates Fetch error", JSON.stringify(response));
  }
}

export function* fetchSaleDetails(orderId) {
  const { seller_id } = yield select(selectUser);
  const response = yield call(api, `order/${orderId}/?seller=${seller_id}`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateSale(data));
  } else {
    console.log("Sale details fetch error", JSON.stringify(response));
  }
}

export function* updateSaleStatusCall(action) {
  const { orderId, status } = action.payload;
  const { seller_id } = yield select(selectUser);
  const reason = yield select(selectSaleStatusUpdateReason);
  const amount = yield select(selectSalePartialRefundAmount);

  const response = yield call(
    api,
    `orders-status/?seller=${seller_id}&order=${orderId}`,
    {
      method: "POST",
      body: {
        order: orderId,
        status,
        reasons: reason,
        partial_refund: status === "partially_refunded" ? amount : undefined,
      },
    }
  );

  if (response && response.ok) {
    // const data = response.data;
    // yield put(fetchSaleStatusUpdates(orderId));
    yield call(fetchSaleDetails, orderId);
    yield put(updateSaleStatusReason(undefined));
  } else {
    console.log("Sale Status Update error", JSON.stringify(response));
    message.error(`Sale status update error: ${response.data}`);
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
    takeLatest(FETCH_SALE_STATUS_UPDATES, fetchSaleStatusUpdatesCall),
    takeLatest(UPDATE_SALE_STATUS, updateSaleStatusCall),
  ]);
}
