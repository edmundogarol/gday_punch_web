import { call, all, takeLatest, select, put } from "redux-saga/effects";
import { message } from "antd";

import {
  DO_LOGIN,
  DO_LOGOUT,
  DO_REGISTRATION,
  DO_CHECK_LOGIN,
  UPDATE_USER_DETAILS,
  RESET_PASSWORD_VERIFY,
  RESET_PASSWORD,
  RESET_PASSWORD_SUBMIT_NEW,
  doCheckLogin,
  doLogin,
  logoutSuccess,
  updateUser,
  registrationSuccess,
  updateLoginError,
  updateRegistrationError,
  resetPasswordSubmitted,
  updateResetPasswordErrors,
  resetPasswordVerificationToken,
} from "actions/user";
import {
  SUBMIT_CONTACT_FORM,
  fetchProducts,
  updateContactFormErrors,
  contactFormSubmitted,
} from "actions/app";
import {
  FETCH_CART_ITEMS,
  updateCartItems,
  fetchingCartItems,
  finishedFetchingCartItems,
} from "actions/cart";
import {
  paymentError,
  paymentIntentUpdate,
  paymentProcessing,
  paymentSucceeded,
  PAYMENT_INTENT_CANCEL,
  PAYMENT_INTENT_FETCH,
  PAYMENT_SUBMIT,
} from "src/actions/payment";
import {
  selectPendingRegistration,
  selectPendingLogin,
  selectUser,
  selectPaymentClientSecret,
} from "selectors/app";
import { api } from "utils/api";
import {
  customerSubscribeFinished,
  CUSTOMER_SUBSCRIBE,
} from "src/actions/customer";

export function* register() {
  const pendingRegistration = yield select(selectPendingRegistration);

  const response = yield call(api, "user/", {
    method: "POST",
    body: pendingRegistration,
  });

  if (response && response.ok) {
    const data = response.data;
    const user = {
      logged_in: data.logged_in,
      ...data.user,
    };
    yield put(updateUser(user));
    yield put(doLogin(pendingRegistration));
    yield put(registrationSuccess());
  } else {
    console.log("Registration error", JSON.stringify(response));
    yield put(updateRegistrationError(response.data));
  }
}

export function* patchUser(action) {
  const currentUser = yield select(selectUser);

  const response = yield call(api, `user/${currentUser.id}/`, {
    method: "PATCH",
    body: {
      username: action.payload.user.username,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    const user = {
      ...data,
    };

    yield put(updateUser(user));
    message.success(`Successfully updated username to: ${user.username}`);
  } else {
    console.log("Update user details error", JSON.stringify(response));
    yield put(updateRegistrationError(response.data));
  }
}

export function* checkLogin() {
  const response = yield call(api, "login-check/", {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    const user = {
      logged_in: data.logged_in,
      ...data.user,
    };
    yield put(updateUser(user));
  } else {
    console.log("Login check error", JSON.stringify(response));
    yield put(updateLoginError(response.data));
  }
}

export function* login() {
  const pendingLogin = yield select(selectPendingLogin);

  const form = new FormData();
  form.append("email", pendingLogin.email);
  form.append("password", pendingLogin.password);

  const response = yield call(api, "login/", {
    method: "POST",
    body: pendingLogin,
  });

  if (response && response.ok) {
    const data = response.data;
    const user = {
      logged_in: data.logged_in,
      ...data.user,
    };
    yield put(updateUser(user));
    yield put(fetchProducts());
  } else {
    console.log("Login error", JSON.stringify(response));
    yield put(updateLoginError(response.data));
  }
}

export function* logout() {
  const response = yield call(api, "logout/", {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(logoutSuccess());
    yield put(doCheckLogin());
    yield put(fetchProducts());
  } else {
    console.log("Log Out error", JSON.stringify(response));
  }
}

export function* submitContactFormCall(action) {
  const response = yield call(api, "contact/", {
    method: "POST",
    body: action.payload.form,
  });

  if (response && response.ok) {
    const data = response.data;
    message.success(`Contact Form Submitted.`);
    yield put(contactFormSubmitted(true));
  } else {
    const data = response.data;
    console.log("Contact error", JSON.stringify(response));
    message.error(`Submitting contact form failed. Please try again.`);
    yield put(updateContactFormErrors(data));
  }
}

export function* resetPasswordCall(action) {
  const response = yield call(api, "reset-password/", {
    method: "POST",
    body: {
      email: action.payload.email || null,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    message.success(`Reset Password Submitted.`);
    yield put(resetPasswordSubmitted(true));
  } else {
    const data = response.data;
    console.log("Reset Password error", JSON.stringify(response));
    message.error(
      `Submitting Reset Password request failed. Please try again.`
    );
    yield put(updateResetPasswordErrors(data));
  }
}

export function* resetPasswordVerifyCall(action) {
  const response = yield call(api, "reset-password/verify/", {
    method: "POST",
    body: {
      consumer: action.payload.consumer,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(resetPasswordVerificationToken(data["verified-token"]));
    action.payload.history.push("/password-reset-confirm/");
  } else {
    const data = response.data;
    console.log("Reset Password verification error", JSON.stringify(response));
    message.error(`Error: ${data.error}`, 4);
  }
}

export function* resetPasswordSubmitNewCall(action) {
  const response = yield call(api, "reset-password/submit/", {
    method: "POST",
    body: {
      new_password: action.payload.newPassword || null,
      confirm_password: action.payload.confirmPassword || null,
      verified_token: action.payload.verifiedToken || null,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(resetPasswordSubmitted(true));
    yield put(updateResetPasswordErrors({}));
  } else {
    const data = response.data;
    console.log("Reset Password submit error", JSON.stringify(response));
    message.error(`Error: ${Object.values(data.error)[0]}`, 4);
    yield put(updateResetPasswordErrors(data));
    yield put(resetPasswordSubmitted(true, true));
  }
}

export function* fetchCartItemsCall() {
  yield put(fetchingCartItems());
  const response = yield call(api, "cart/", {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateCartItems(data));
    yield put(finishedFetchingCartItems());
  } else {
    yield put(finishedFetchingCartItems());
    console.log("Cart Items Fetch error", JSON.stringify(response));
  }
}

export function* paymentIntentCancelCall() {
  const clientSecret = yield select(selectPaymentClientSecret);

  if (!clientSecret) return;

  const response = yield call(api, "payment-intent/", {
    method: "DELETE",
    body: {
      payment_intent_id: clientSecret.match(/^.*?(?=_secret)/)[0],
    },
  });

  if (response && response.ok) {
    yield put(paymentIntentUpdate(undefined));
  } else {
    console.log("Payment Intent Fetch error", JSON.stringify(response));
  }
}

export function* paymentSubmitCall(action) {
  yield put(paymentProcessing(true));

  const response = yield call(api, "payment-submit/", {
    method: "POST",
    body: {
      customer_details: action.payload.customerDetails,
      items: action.payload.items,
    },
  });

  if (response && response.ok) {
    const data = response.data;
    console.log(data);
    yield put(paymentIntentUpdate(data.clientSecret));
  } else {
    console.log("Payment Submit error", JSON.stringify(response));
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

export default function* appSaga() {
  yield all([
    takeLatest(UPDATE_USER_DETAILS, patchUser),
    takeLatest(DO_LOGIN, login),
    takeLatest(DO_LOGOUT, logout),
    takeLatest(DO_REGISTRATION, register),
    takeLatest(DO_CHECK_LOGIN, checkLogin),
    takeLatest(SUBMIT_CONTACT_FORM, submitContactFormCall),
    takeLatest(FETCH_CART_ITEMS, fetchCartItemsCall),
    takeLatest(PAYMENT_SUBMIT, paymentSubmitCall),
    takeLatest(PAYMENT_INTENT_CANCEL, paymentIntentCancelCall),
    takeLatest(CUSTOMER_SUBSCRIBE, customerSubscribeCall),
    takeLatest(RESET_PASSWORD, resetPasswordCall),
    takeLatest(RESET_PASSWORD_VERIFY, resetPasswordVerifyCall),
    takeLatest(RESET_PASSWORD_SUBMIT_NEW, resetPasswordSubmitNewCall),
  ]);
}
