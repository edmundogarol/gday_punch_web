import {
  call,
  all,
  takeLatest,
  takeEvery,
  select,
  put,
} from "redux-saga/effects";
import { message } from "antd";

import { api } from "utils/api";
import { FETCH_PRODUCTS, fetchProducts } from "actions/products";

export function* fetchProductsCall() {
  const response = yield call(api, `stripe-products/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    consoe.log(data);
    return data;
  } else {
    console.log("Products fetch error", JSON.stringify(response));
  }
}

export default function* productsSaga() {
  yield all([takeLatest(FETCH_PRODUCTS, fetchProductsCall)]);
}
