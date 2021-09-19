import {
  call,
  all,
  takeLatest,
  takeEvery,
  select,
  put,
} from "redux-saga/effects";
import { message } from "antd";

import {
  FETCH_PRODUCTS,
  updateProducts,
  fetchingProducts,
  finishedFetchingProducts,
} from "actions/app";
import {
  FETCH_VIEWING_PRODUCT,
  fetchingViewingProduct,
  finishedFetchingViewingProduct,
} from "actions/products";
import { api } from "utils/api";
import { arrayIdsMapToObject } from "utils/utils";
import { selectUser } from "src/selectors/app";

export function* fetchProductsCall(action) {
  const fetchedProducts = yield all(
    action.payload.productIds.map((productId) => call(getProduct, productId))
  );

  const mappedProducts = arrayIdsMapToObject(fetchedProducts);
  yield put(updateProducts(mappedProducts));
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
    if (response.data.detail.includes("You do not have permission")) {
      message.error("This product is currently unavailable.");
      return undefined;
    }
  }
}

export function* fetchViewingProductCall(action) {
  yield put(fetchingViewingProduct());
  const fetchedProduct = yield call(getProduct, action.payload.productId);

  const mappedProducts = arrayIdsMapToObject([fetchedProduct]);

  yield put(updateProducts(mappedProducts));

  yield call(fetchAllProductsCall, true);
  yield put(finishedFetchingViewingProduct());
}

export function* fetchAllProductsCall(addItems = false) {
  yield put(fetchingProducts());
  const response = yield call(api, `products/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;

    yield put(updateProducts(arrayIdsMapToObject(data)));
    yield put(finishedFetchingProducts());
  } else {
    console.log("All Products fetch error", JSON.stringify(response));
    yield put(finishedFetchingProducts());
  }
}

export default function* productSaga() {
  yield all([
    takeLatest(FETCH_PRODUCTS, fetchAllProductsCall),
    takeLatest(FETCH_VIEWING_PRODUCT, fetchViewingProductCall),
  ]);
}
