import { call, all, takeLatest, select, put, delay } from "redux-saga/effects";
import { message } from "antd";
import moment from "moment";
import { api } from "utils/api";
import { set } from "lodash";
import {
  DO_TWEET,
  SET_DELETING_TWEET,
  CREATE_PROMPT,
  SELECT_PROMPT,
  FETCH_PROMPTS,
  FETCH_PANEL_STYLE_PROMPT,
  FETCH_STRIPE_PRODUCTS,
  FETCH_ADMIN_PRODUCTS,
  CREATE_ADMIN_PRODUCT,
  DELETE_ADMIN_PRODUCT,
  REGISTER_STRIPE_PRICE,
  FETCH_STRIPE_PRICES,
  UPDATE_ADMIN_PRODUCT,
  FETCH_CONTACT_ENTRIES,
  DELETE_CONTACT_ENTRY,
  CREATE_STRIPE_PRICE,
  FETCH_COUPONS,
  CREATE_COUPON,
  FETCH_ORDERS,
  FETCH_ORDERS_STATUS_UPDATES,
  UPDATE_ORDER_STATUS,
  FETCH_USERS,
  FETCH_USERS_CUSTOMER_DETAILS,
  UPDATE_CUSTOMER_DETAILS,
  UPDATE_USER_DETAILS,
  startTweetLoading,
  finishedTweet,
  tweetError,
  updatePrompts,
  startFetchingPrompts,
  finishFetchingPrompts,
  startFetchingPanelStylePrompt,
  finishFetchingPanelStylePrompt,
  updatePanelStylePrompt,
  fetchingStripeProducts,
  finishedFetchingStripeProducts,
  updateStripeProducts,
  fetchingAdminProducts,
  finishedFetchingAdminProducts,
  updateAdminProducts,
  fetchingStripePrices,
  finishedFetchingStripePrices,
  updateStripePrices,
  fetchingContactEntries,
  finishedFetchingContactEntries,
  updateContactEntries,
  fetchingCoupons,
  finishedFetchingCoupons,
  updateCoupons,
  fetchingOrders,
  updateOrders,
  finishedFetchingOrders,
  updateOrderStatusUpdates,
  fetchOrderStatusUpdates,
  updateOrder,
  updateStatusReason,
  fetchingUsers,
  updateUsers,
  finishedFetchingUsers,
  updateUserCustomerDetails,
  fetchUserCustomerDetails,
  fetchUsers,
  FETCH_PRODUCTS_SIMPLE,
  updateProductsSimple,
  UPDATE_CUSTOMER_ACCESS_PRODUCTS,
} from "actions/admin";
import {
  selectPendingTweet,
  selectPendingDeletingTweet,
  selectOrdersNextPage,
  selectOrderStatusUpdateReason,
  selectPartialRefundAmount,
  selectUsersNextPage,
  selectUsersCount,
  selectUserDetails,
} from "selectors/admin";
import { fetchAllProductsCall } from "./products";
import { arrayIdsMapToObject } from "utils/utils";

const NO_MEDIA = "admin-sagas/NO_MEDIA";
const ERROR_TALKING_TO_GDAYPUNCH = "admin-sagas/ERROR_TALKING_TO_GDAYPUNCH";

export function* fetchUsersCall(action) {
  const { fetchNext, search } = action.payload;
  const next = yield select(selectUsersNextPage);

  yield put(fetchingUsers());
  const response = yield call(
    api,
    fetchNext ? next : `user/${search ? `?search=${search}` : ""}`,
    {
      method: "GET",
    }
  );

  if (response && response.ok) {
    const data = response.data;

    if (search) {
      const next = yield select(selectUsersNextPage);
      const count = yield select(selectUsersCount);

      set(data, "next", next); // Do not update count and next page if searching
      set(data, "count", count);
      yield put(updateUsers(data));
    } else {
      yield put(updateUsers(data));
    }

    yield put(finishedFetchingUsers());
  } else {
    yield put(finishedFetchingUsers());
    console.log("Users Fetch error", JSON.stringify(response));
  }
}

export function* updateUserFieldCall(action) {
  const { user, userFields } = action.payload;

  const response = yield call(api, `user/${user.id}/`, {
    method: "PATCH",
    body: {
      ...userFields,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    const user = {
      ...data,
    };

    yield put(updateUsers({ results: [user] }));
    message.success(`Successfully updated user`);
  } else {
    console.log("Update user details error", JSON.stringify(response));
  }
}

export function* fetchProductsSimpleCall(action) {
  const response = yield call(api, `products-simple/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;

    yield put(updateProductsSimple(arrayIdsMapToObject(data)));
  } else {
    console.log("Products Simple fetch error", JSON.stringify(response));
    message.error(`Products Simple fetch error: ${JSON.stringify(response)}`);
  }
}

export function* updateCustomerFieldCall(action) {
  const { user, customerId, customerFields } = action.payload;

  const response = yield call(api, `customer/${customerId || "new"}/`, {
    method: "PATCH",
    body: {
      ...customerFields,
    },
  });

  if (response && response.ok) {
    const data = response.data;

    yield put(fetchUsers(undefined, user.email));
    yield delay(1000);

    if (!customerId) {
      const updatedUser = yield select(selectUserDetails(user.id));
      console.log({ updatedUser });
      yield put(fetchUserCustomerDetails(updatedUser.customer_id));
    } else {
      yield put(fetchUserCustomerDetails(customerId));
    }
    message.success(`Successfully updated customer`);
  } else {
    console.log("Update user details error", JSON.stringify(response));
    message.error(`Update user details error: ${JSON.stringify(response)}`);
  }
}

export function* fetchUserCustomerDetailsCall(action) {
  const { customerId } = action.payload;

  const response = yield call(api, `customer/${customerId}/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateUserCustomerDetails(data.user, data));
  } else {
    console.log("User Customer Details Fetch error", JSON.stringify(response));
  }
}

export function* updateCustomerAccessProductsCall(action) {
  const { updatedProducts, customerId } = action.payload;
  const productsToModify = updatedProducts.filter(
    (product) => product.removing || product.granting
  );

  const response = yield call(api, `update-purchases/`, {
    method: "POST",
    body: {
      customer: customerId,
      updated_products: productsToModify,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    message.success(
      `Successfully updated customer products accesses: ${productsToModify
        .map((prod) => prod.title)
        .join(", ")}`,
      7
    );
    yield put(fetchUserCustomerDetails(customerId));
  } else {
    console.log(
      "Update customer/product purchases error:",
      JSON.stringify(response)
    );
    message.error(
      `Update customer/product purchases error: ${JSON.stringify(response)}`
    );
  }
}

// export function* updateCustomerProductAccess(customer, product) {
//   const removing = product.removing;
//   const url = removing ? `${product.purchase_id}/` : "";

//   const response = yield call(api, `purchase/${url}`, {
//     method: removing ? "DELETE" : "POST",
//     body: {
//       customer,
//       product: product.id,
//     },
//   });

//   if (response && response.ok) {
//     const data = response.data;
//   } else {
//     console.log(
//       "Update customer/product purchase error:",
//       JSON.stringify(response)
//     );
//     message.error(
//       `Update customer/product purchase error: ${JSON.stringify(response)}`
//     );
//   }
// }

export function* tweetStatus(mediaId = undefined) {
  const { status } = yield select(selectPendingTweet);
  const response = yield call(api, "statuses/update", {
    fetchType: "twitter",
    method: "POST",
    mediaId,
    status,
  });

  if (response && response.ok) {
    const data = response.data;
    return data;
  } else {
    console.log("Tweet Status error", JSON.stringify(response));
  }
}

export function* retweetStatus() {
  const { status, retweetUrl } = yield select(selectPendingTweet);
  const response = yield call(api, "statuses/update", {
    fetchType: "twitter",
    method: "POST",
    retweetUrl,
    status,
  });

  if (response && response.ok) {
    const data = response.data;
    return data;
  } else {
    console.log("ReTweet Status error", JSON.stringify(response));
  }
}

export function* tweetImage() {
  const tweet = yield select(selectPendingTweet);

  if (tweet.image === undefined) return NO_MEDIA;

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const bas64Image = yield call(toBase64, tweet.image);
  const pngImage = bas64Image.replace("data:image/png;base64,", "");
  const jpgImage = pngImage.replace("data:image/jpeg;base64,", "");
  const image = jpgImage;

  const response = yield call(api, "media/upload", {
    fetchType: "twitter",
    method: "POST",
    image,
  });

  if (response && response.ok) {
    const data = response.data;
    if (tweet.status === undefined) {
      return NO_MEDIA;
    }
    return data;
  } else {
    console.log("Tweet Image error", JSON.stringify(response));
    if (
      response.status === "TypeError" &&
      response.statusText.includes("Failed to fetch")
    ) {
      return {
        type: ERROR_TALKING_TO_GDAYPUNCH,
        status:
          "Something went wrong talking to Gday Punch. Check that you are connected to the internet and try again",
      };
    }
    return response;
  }
}

export function* deleteTweet() {
  const statusId = (yield select(selectPendingDeletingTweet)).statusId;
  yield put(startTweetLoading());
  const response = yield call(api, "statuses/destroy", {
    fetchType: "twitter",
    method: "POST",
    statusId,
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(finishedTweet({ html: undefined, id: undefined }));
    return data;
  } else {
    console.log("Tweet Status error", JSON.stringify(response));
  }
}

export function* getEmbeddedTweet(embedId) {
  const response = yield call(api, "oembed", {
    fetchType: "twitter",
    method: "GET",
    embedId,
    status,
  });

  if (response && response.ok) {
    const data = response.data;
    return data;
  } else {
    console.log("Tweet Status error", JSON.stringify(response));
  }
}

export function* callTweet() {
  const tweet = yield select(selectPendingTweet);

  yield put(startTweetLoading());

  let image;
  if (tweet.image) {
    image = yield tweetImage();

    if (image.type === ERROR_TALKING_TO_GDAYPUNCH) {
      yield put(tweetError(image.status));
      return;
    } else if (!image.ok) {
      yield put(tweetError(image.statusText));
    }
  }

  let tweetResult;
  if (image === NO_MEDIA || image === undefined) {
    if (tweet.retweetUrl) {
      tweetResult = yield retweetStatus();
    } else {
      tweetResult = yield tweetStatus();
    }
  } else {
    tweetResult = yield tweetStatus(image.media_id_string);
  }

  const result = yield getEmbeddedTweet(tweetResult.id_str);

  if (result.html) {
    yield put(finishedTweet({ html: result.html, id: tweetResult.id_str }));
  }
}

export function* fetchPromptsCall(action) {
  yield put(startFetchingPrompts());
  const response = yield call(
    api,
    action?.payload?.random ? "prompts-selected/" : "prompts/", // prompts-selected, prompts-random
    {
      method: "GET",
    }
  );

  if (response && response.ok) {
    const data = response.data;

    if (!action?.payload?.random) {
      yield put(updatePrompts(data));
    } else {
      yield put(updatePrompts([data]));
    }
    yield put(finishFetchingPrompts());

    return data;
  } else {
    yield put(finishFetchingPrompts());
    console.log("Prompts Fetch error", JSON.stringify(response));
  }
}

export function* fetchPanelStylePromptCall() {
  yield put(startFetchingPanelStylePrompt());
  const response = yield call(api, "prompts-random/", {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;

    yield put(updatePanelStylePrompt([data]));
    yield put(finishFetchingPanelStylePrompt());

    return data;
  } else {
    yield put(finishFetchingPanelStylePrompt());
    console.log("Panel Style Prompt Fetch error", JSON.stringify(response));
  }
}

export function* createPromptCall(action) {
  const response = yield call(api, `prompts/`, {
    method: "POST",
    body: {
      ...action.payload.prompt,
    },
  });

  if (response && response.ok) {
    yield call(fetchPromptsCall);
  } else {
    console.log("Create Prompt error", JSON.stringify(response));
  }
}

export function* selectPromptCall(action) {
  const response = yield call(api, `prompts/${action.payload.promptId}/`, {
    method: "PATCH",
    body: {},
  });

  if (response && response.ok) {
    yield call(fetchPromptsCall);
  } else {
    console.log("Select Prompt error", JSON.stringify(response));
  }
}

export function* fetchStripeProductsCall() {
  yield put(fetchingStripeProducts());
  const response = yield call(api, "stripe-products/", {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;

    yield put(updateStripeProducts(data));
    yield put(finishedFetchingStripeProducts());
    return data;
  } else {
    yield put(finishedFetchingStripeProducts());
    console.log("Stripe Products Fetch error", JSON.stringify(response));
  }
}

export function* createStripePriceCall(action) {
  const response = yield call(api, "price/", {
    method: "POST",
    body: {
      ...action.payload.price,
    },
  });

  if (response && response.ok) {
    const data = response.data;

    yield call(fetchStripeProductsCall);
    return data;
  } else {
    console.log("Creaate Stripe Price error", JSON.stringify(response));
  }
}

export function* fetchAdminProductsCall() {
  yield put(fetchingAdminProducts());
  const response = yield call(api, "products/", {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateAdminProducts(data));
    yield put(finishedFetchingAdminProducts());

    return data;
  } else {
    yield put(finishedFetchingAdminProducts());
    console.log("Admin Products Fetch error", JSON.stringify(response));
  }
}

export function* createProductCall(action) {
  const response = yield call(api, `products/`, {
    method: "POST",
    body: {
      ...action.payload.product,
    },
  });

  if (response && response.ok) {
    message.success("Successfully Created Product");
    yield call(fetchAdminProductsCall);
    yield call(fetchStripePricesCall);

    if (action.payload.history) {
      action.payload.history.push("/admin/products/");
    }
  } else {
    console.log("Create Product error", JSON.stringify(response));

    if (response.data) {
      Object.values(response.data).map((error) =>
        message.warn({
          content: error,
          className: "antd-message-capitalize",
          style: {
            textTransform: "capitalize",
          },
        })
      );
    } else {
      message.error(`Create Product Error: ${response.status}`);
    }
  }
}

export function* updateProductCall(action) {
  const response = yield call(api, `product/${action.payload.product.id}/`, {
    method: "PATCH",
    body: {
      ...action.payload.product,
    },
  });

  if (response && response.ok) {
    yield call(fetchAdminProductsCall);
    yield call(fetchAllProductsCall);
    yield call(fetchStripePricesCall);
    action.payload.history.push("/admin/products/");
  } else {
    console.log("Update Product error", JSON.stringify(response));
    Object.values(response.data).map((error) =>
      message.warn({
        content: error,
        className: "antd-message-capitalize",
        style: {
          textTransform: "capitalize",
        },
      })
    );
  }
}

export function* deleteProductCall(action) {
  const response = yield call(api, `products/${action.payload.productId}/`, {
    method: "DELETE",
  });

  if (response && response.ok) {
    yield call(fetchAdminProductsCall);
  } else {
    console.log("Delete Product error", JSON.stringify(response));
    Object.values(response.data).map((error) =>
      message.warn({
        content: error,
        className: "antd-message-capitalize",
        style: {
          textTransform: "capitalize",
        },
      })
    );
  }
}

export function* registerStripePriceCall(action) {
  const response = yield call(api, `stripe-prices/`, {
    method: "POST",
    body: {
      ...action.payload.stripePrice,
    },
  });

  if (response && response.ok) {
    yield call(fetchStripeProductsCall);
  } else {
    console.log("Register Stripe Price error", JSON.stringify(response));
    Object.values(response.data).map((error) =>
      message.warn({
        content: error,
        className: "antd-message-capitalize",
        style: {
          textTransform: "capitalize",
        },
      })
    );
  }
}

export function* fetchStripePricesCall() {
  yield put(fetchingStripePrices());
  const response = yield call(api, "stripe-prices/", {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateStripePrices(data));
    yield put(finishedFetchingStripePrices());

    return data;
  } else {
    yield put(finishedFetchingStripePrices());
    console.log("Stripe Prices Fetch error", JSON.stringify(response));
  }
}

export function* fetchContactEntriesCall() {
  yield put(fetchingContactEntries());
  const response = yield call(api, "contact/", {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateContactEntries(data));
    yield put(finishedFetchingContactEntries());
  } else {
    yield put(finishedFetchingContactEntries());
    console.log("Contact Entries Fetch error", JSON.stringify(response));
  }
}

export function* deleteContactEntryCall(action) {
  const response = yield call(api, `contact/${action.payload.entryId}/`, {
    method: "DELETE",
  });

  if (response && response.ok) {
    yield call(fetchContactEntriesCall);
  } else {
    console.log("Delete Contact Entry error", JSON.stringify(response));
    Object.values(response.data).map((error) =>
      message.warn({
        content: error,
        className: "antd-message-capitalize",
        style: {
          textTransform: "capitalize",
        },
      })
    );
  }
}

export function* fetchCouponsCall() {
  yield put(fetchingCoupons());
  const response = yield call(api, "coupons/", {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateCoupons(data));
    yield put(finishedFetchingCoupons());
  } else {
    yield put(finishedFetchingCoupons());
    console.log("Coupons Fetch error", JSON.stringify(response));
  }
}

export function* createCouponCall(action) {
  const response = yield call(api, "coupons/", {
    method: "POST",
    body: {
      ...action.payload.coupon,
      expiry_date: moment(action.payload.coupon.expiry_date).format(
        "YYYY-MM-DD"
      ),
    },
  });

  if (response && response.ok) {
    const data = response.data;
    yield call(fetchCouponsCall);
  } else {
    console.log("Create coupon error", JSON.stringify(response));
  }
}

export function* fetchOrdersCall(action) {
  const next = yield select(selectOrdersNextPage);

  yield put(fetchingOrders());
  const response = yield call(
    api,
    action.payload.fetchNext ? next : `orders/`,
    {
      method: "GET",
    }
  );

  if (response && response.ok) {
    const data = response.data;
    yield put(updateOrders(data));
    yield put(finishedFetchingOrders());
  } else {
    yield put(finishedFetchingOrders());
    console.log("Orders Fetch error", JSON.stringify(response));
  }
}

export function* fetchOrderStatusUpdatesCall(action) {
  const { orderId } = action.payload;

  const response = yield call(api, `orders-status/${orderId}/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateOrderStatusUpdates(orderId, data));
  } else {
    console.log("Order Status Updates Fetch error", JSON.stringify(response));
  }
}

export function* fetchOrderDetails(orderId) {
  const response = yield call(api, `order/${orderId}/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateOrder(data));
  } else {
    console.log("Order details fetch error", JSON.stringify(response));
  }
}

export function* updateOrderStatusCall(action) {
  const { orderId, status, customerId } = action.payload;
  const reason = yield select(selectOrderStatusUpdateReason);
  const amount = yield select(selectPartialRefundAmount);

  const response = yield call(api, `orders-status/`, {
    method: "POST",
    body: {
      order: orderId,
      status,
      reasons: reason,
      partial_refund: status === "partially_refunded" ? amount : undefined,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(fetchOrderStatusUpdates(orderId));
    yield call(fetchOrderDetails, orderId);
    yield put(updateStatusReason(undefined));

    if (customerId) {
      yield put(fetchUserCustomerDetails(customerId));
    }
  } else {
    console.log("Order Status Update error", JSON.stringify(response));
    message.error(`Order status update error: ${response.data}`);
  }
}

export default function* adminSaga() {
  yield all([
    takeLatest(DO_TWEET, callTweet),
    takeLatest(SET_DELETING_TWEET, deleteTweet),
    takeLatest(FETCH_PROMPTS, fetchPromptsCall),
    takeLatest(CREATE_PROMPT, createPromptCall),
    takeLatest(SELECT_PROMPT, selectPromptCall),
    takeLatest(FETCH_PANEL_STYLE_PROMPT, fetchPanelStylePromptCall),
    takeLatest(CREATE_STRIPE_PRICE, createStripePriceCall),
    takeLatest(FETCH_STRIPE_PRODUCTS, fetchStripeProductsCall),
    takeLatest(FETCH_ADMIN_PRODUCTS, fetchAdminProductsCall),
    takeLatest(CREATE_ADMIN_PRODUCT, createProductCall),
    takeLatest(DELETE_ADMIN_PRODUCT, deleteProductCall),
    takeLatest(REGISTER_STRIPE_PRICE, registerStripePriceCall),
    takeLatest(FETCH_STRIPE_PRICES, fetchStripePricesCall),
    takeLatest(UPDATE_ADMIN_PRODUCT, updateProductCall),
    takeLatest(FETCH_CONTACT_ENTRIES, fetchContactEntriesCall),
    takeLatest(DELETE_CONTACT_ENTRY, deleteContactEntryCall),
    takeLatest(FETCH_COUPONS, fetchCouponsCall),
    takeLatest(CREATE_COUPON, createCouponCall),
    takeLatest(FETCH_ORDERS, fetchOrdersCall),
    takeLatest(FETCH_ORDERS_STATUS_UPDATES, fetchOrderStatusUpdatesCall),
    takeLatest(UPDATE_ORDER_STATUS, updateOrderStatusCall),
    takeLatest(FETCH_USERS, fetchUsersCall),
    takeLatest(FETCH_USERS_CUSTOMER_DETAILS, fetchUserCustomerDetailsCall),
    takeLatest(UPDATE_USER_DETAILS, updateUserFieldCall),
    takeLatest(UPDATE_CUSTOMER_DETAILS, updateCustomerFieldCall),
    takeLatest(FETCH_PRODUCTS_SIMPLE, fetchProductsSimpleCall),
    takeLatest(
      UPDATE_CUSTOMER_ACCESS_PRODUCTS,
      updateCustomerAccessProductsCall
    ),
  ]);
}
