import { call, all, takeLatest, select, put } from "redux-saga/effects";
import { message } from "antd";

import {
  FETCH_PRODUCTS,
  updateProducts,
  fetchingProducts,
  fetchedAllProducts,
  finishedFetchingProducts,
  fetchProducts,
} from "actions/app";
import {
  FETCH_VIEWING_PRODUCT,
  fetchingViewingProduct,
  finishedFetchingViewingProduct,
  SAVE_PRODUCT,
  UNSAVE_PRODUCT,
  DELETE_PRODUCT,
  deleteProductFromList,
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

export function* fetchAllProductsCall(action) {
  yield put(fetchingProducts());
  const response = yield call(
    api,
    `products/${
      action?.payload?.userId ? `?stall=${action.payload.userId}` : ""
    }`,
    {
      method: "GET",
    }
  );

  if (response && response.ok) {
    const data = response.data;

    yield put(updateProducts(arrayIdsMapToObject(data)));
    yield put(finishedFetchingProducts());
    if (!action?.payload?.userId) {
      yield put(fetchedAllProducts());
    }
  } else {
    console.log("All Products fetch error", JSON.stringify(response));
    yield put(finishedFetchingProducts());
  }
}

export function* saveProductCall(action) {
  const user = yield select(selectUser);

  const response = yield call(api, `product-save/`, {
    method: "POST",
    body: {
      user: user.id,
      product: action.payload.productId,
    },
  });

  if (response && response.ok) {
    yield call(fetchAllProductsCall);
  } else {
    console.log("Product save error", JSON.stringify(response));
    message.error(
      "There was a problem with saving this manga. Try again later."
    );
  }
}

export function* unsaveProductCall(action) {
  const response = yield call(api, `product-save/${action.payload.saveId}/`, {
    method: "DELETE",
  });

  if (response && response.ok) {
    yield call(fetchAllProductsCall);
  } else {
    console.log("Product save error", JSON.stringify(response));
    message.error(
      "There was a problem with trying to unsave this manga. Try again later."
    );
  }
}

export function* deleteProductCall(action) {
  const response = yield call(api, `products/${action.payload.product.id}/`, {
    method: "DELETE",
  });

  if (response && response.ok) {
    yield put(deleteProductFromList(action.payload.product.id));
    yield put(fetchProducts(action.payload.product.user));
  } else {
    console.log("Product delete error", JSON.stringify(response));
    message.error(
      response.data.error ||
        "There was a problem with trying to delete this manga. Try again later.",
      7
    );
  }
}

export default function* productSaga() {
  yield all([
    takeLatest(FETCH_PRODUCTS, fetchAllProductsCall),
    takeLatest(FETCH_VIEWING_PRODUCT, fetchViewingProductCall),
    takeLatest(SAVE_PRODUCT, saveProductCall),
    takeLatest(UNSAVE_PRODUCT, unsaveProductCall),
    takeLatest(DELETE_PRODUCT, deleteProductCall),
  ]);
}
