import {
  call,
  all,
  takeLatest,
  takeEvery,
  select,
  put,
} from "redux-saga/effects";
import { message } from "antd";

import { FETCH_HOME_PRODUCTS, updateHomeProducts } from "actions/home";
import {
  FETCH_VIEWING_PRODUCT,
  updateViewingProduct,
  fetchingViewingProduct,
  finishedFetchingViewingProduct,
} from "actions/products";
import { api } from "utils/api";

export function* fetchProductsCall(action) {
  const fetchedProducts = yield all(
    action.payload.productIds.map((productId) => call(getProduct, productId))
  );

  switch (action.type) {
    case FETCH_HOME_PRODUCTS: {
      yield put(updateHomeProducts(fetchedProducts));
    }
  }
}

export function* getProduct(productId) {
  const response = yield call(api, `products/${productId}/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    return data;
  } else {
    console.log("Product fetch error", JSON.stringify(response));
  }
}

export function* fetchViewingProductCall(action) {
  yield put(fetchingViewingProduct());
  const fetchedProduct = yield call(getProduct, action.payload.productId);

  yield put(updateViewingProduct(fetchedProduct));
  yield put(finishedFetchingViewingProduct());
}

export function* fetchAllProductsCall() {
  const response = yield call(api, `products/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateHomeProducts(data));
  } else {
    console.log("All Products fetch error", JSON.stringify(response));
  }
}

export default function* productSaga() {
  yield all([
    takeLatest(FETCH_HOME_PRODUCTS, fetchAllProductsCall),
    takeLatest(FETCH_VIEWING_PRODUCT, fetchViewingProductCall),
  ]);
}
