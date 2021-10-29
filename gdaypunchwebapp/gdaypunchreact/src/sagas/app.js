import { call, all, takeLatest, select, put } from "redux-saga/effects";
import { message } from "antd";
import moment from "moment";

import {
  DO_LOGIN,
  DO_LOGOUT,
  DO_REGISTRATION,
  DO_CHECK_LOGIN,
  UPDATE_USER_DETAILS,
  RESET_PASSWORD_VERIFY,
  RESET_PASSWORD,
  RESET_PASSWORD_SUBMIT_NEW,
  VERIFY_EMAIL,
  REQUEST_EMAIL_VERIFICATION,
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
  verifyingEmail,
  emailVerified,
  verifyingEmailFinished,
  requestingEmailVerification,
  requestEmailVerificationFinished,
  updatingUser,
  updatingUserFinished,
  updateUserError,
  FETCH_FOLLOWINGS,
  updateFollowings,
  FETCH_STALL_DATA,
  fetchingStallData,
  updateStallData,
  fetchingStallDataFinished,
  fetchingStallDataError,
} from "actions/user";
import {
  SUBMIT_CONTACT_FORM,
  fetchProducts,
  updateContactFormErrors,
  contactFormSubmitted,
} from "actions/app";
import {
  FETCH_CART_ITEMS,
  fetchingCartItems,
  finishedFetchingCartItems,
} from "actions/cart";
import {
  selectPendingRegistration,
  selectPendingLogin,
  selectUser,
} from "selectors/app";
import { api } from "utils/api";
import {
  castingVote,
  castingVoteError,
  castingVoteFinished,
  CAST_VOTE,
  fetchingVotingItems,
  fetchVotingItems,
  FETCH_VOTING_ITEMS,
  finishedFetchingVotingItems,
  updateVotingItems,
} from "src/actions/voting";

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
    message.success(
      "Sign up success. Please check your email to verify your account to start reading manga!",
      5
    );
  } else {
    console.log("Registration error", JSON.stringify(response));
    yield put(updateRegistrationError(response.data));
  }
}

export function* patchUser(action) {
  const { user } = action.payload;

  yield put(updatingUser());
  const currentUser = yield select(selectUser);
  let form_data;

  form_data = new FormData();

  if (user.image) {
    const blobFetch = yield call(fetch, user.image);
    const blob = yield blobFetch.blob();

    form_data.append(
      "image",
      blob,
      `${currentUser.id}_${(
        currentUser.username || currentUser.email
      ).toLowerCase()}_${moment(moment.now()).format("YYMMDDhhmmss")}.png`
    );
  }
  if (user.cover) {
    const blobFetch = yield call(fetch, user.cover);
    const blob = yield blobFetch.blob();

    form_data.append(
      "cover",
      blob,
      `${currentUser.id}_${(
        currentUser.username || currentUser.email
      ).toLowerCase()}_${moment(moment.now()).format("YYMMDDhhmmss")}.png`
    );
  }

  Object.keys(action.payload.user).map((key) => {
    if (key === "image" || key === "cover") return;
    form_data.append(key, action.payload.user[key]);
  });

  const response = yield call(api, `user/${currentUser.id}/`, {
    method: "PATCH",
    body: form_data || { ...action.payload.user },
    // Use null here so gtfetch knows to remove contentType setting
    contentType: null,
  });

  if (response && response.ok) {
    const data = response.data;
    const user = {
      ...data,
    };

    yield put(updateUser(user));
    yield put(updatingUserFinished());
    message.success(`Successfully updated profile`);
    yield put(updateUserError(undefined));
  } else {
    console.log("Update user details error", JSON.stringify(response));
    yield put(updatingUserFinished());
    yield put(updateUserError(response.data));
  }
}

export function* checkLogin() {
  const response = yield call(api, "login-check/", {
    method: "GET",
    loggedOutNotification: false,
  });

  if (response && response.ok) {
    const data = response.data;
    const user = {
      logged_in: data.logged_in,
      is_staff: data.is_staff,
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
      is_staff: data.is_staff,
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
    // const data = response.data;
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
    // const data = response.data;
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
    // const data = response.data;
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
    // const data = response.data;
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

export function* verifyEmailCall(action) {
  yield put(verifyingEmail());
  const response = yield call(api, "verify-account/email/", {
    method: "POST",
    body: {
      token: action.payload.token,
    },
  });

  if (response && response.ok) {
    // const data = response.data;

    yield put(emailVerified());
    yield put(verifyingEmailFinished());
    yield put(doCheckLogin());
  } else {
    const data = response.data;
    console.log("Email verification error", JSON.stringify(response));
    if (data && data.error) {
      message.error(`Error: ${data.error}`, 4);
    } else {
      message.error("Email verification request error", 4);
    }
    yield put(verifyingEmailFinished("Email verification error"));
  }
}

export function* requestEmailVerificationCall() {
  yield put(requestingEmailVerification());
  const response = yield call(api, "request-verification/email/", {
    method: "POST",
  });

  if (response && response.ok) {
    // const data = response.data;

    yield put(requestEmailVerificationFinished());
    yield put(doCheckLogin());
  } else {
    const data = response.data;
    console.log("Email verification request error", JSON.stringify(response));
    if (data && data.error) {
      message.error(`Error: ${data.error}`, 4);
    } else {
      message.error("Email verification request error", 4);
    }
    yield put(
      requestEmailVerificationFinished("Email verification request error")
    );
  }
}

export function* fetchCartItemsCall() {
  yield put(fetchingCartItems());
  const response = yield call(api, "cart/", {
    method: "GET",
  });

  if (response && response.ok) {
    // const data = response.data;
    yield put(finishedFetchingCartItems());
  } else {
    yield put(finishedFetchingCartItems());
    console.log("Cart Items Fetch error", JSON.stringify(response));
  }
}

export function* fetchVotingItemsCall() {
  yield put(fetchingVotingItems());
  const response = yield call(api, "voting-details/", {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;

    const details = {
      items: data.items,
      issueNo: data.issue_number,
      cast: data.cast,
      disabled: data.disabled,
    };
    yield put(updateVotingItems(details));
    yield put(finishedFetchingVotingItems());
  } else {
    yield put(finishedFetchingVotingItems());
    message.error(
      "Voting system has not loaded correctly. Please try again later.",
      4
    );
    yield put(
      castingVoteError(
        response.data ||
          "Voting system has not loaded correctly. Please try again later."
      )
    );
    console.log("Voting Items Fetch error", JSON.stringify(response));
  }
}

export function* castVoteCall(action) {
  const { vote, purchaseReason } = action.payload;
  yield put(castingVote());
  const response = yield call(api, "voting-cast/", {
    method: "POST",
    body: {
      vote,
      purchase_reason: purchaseReason,
    },
  });

  if (response && response.ok) {
    // const data = response.data;
    yield put(fetchVotingItems());
    yield put(castingVoteFinished());
  } else {
    yield put(castingVoteFinished());
    message.error("Something wrong has occured. Please try again later.", 4);
    yield put(
      castingVoteError(
        response.data || "Something wrong has occured. Please try again later."
      )
    );
    console.log("Cast vote error", JSON.stringify(response));
  }
}

export function* fetchFollowingsCall(action) {
  const { payload } = action;

  yield put(fetchingVotingItems());
  const response = yield call(api, `following/${payload.userId}/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;

    yield put(updateFollowings(payload.userId, data));
  } else {
    message.error(
      "Fetching account-follows problem. Please try again later.",
      4
    );
    console.log("Account follows Fetch error", JSON.stringify(response));
  }
}

export function* fetchStallDataCall(action) {
  const { payload } = action;

  yield put(fetchingStallData());
  const response = yield call(api, `stall/${payload.userId}/`, {
    method: "GET",
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(fetchingStallDataFinished());
    yield put(updateStallData(data));
  } else {
    message.error(
      "Fetching user stall encountered a problem. Please try again later.",
      4
    );
    console.log("Stall fetch error", JSON.stringify(response));
    yield put(fetchingStallDataError(response.data));
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
    takeLatest(RESET_PASSWORD, resetPasswordCall),
    takeLatest(RESET_PASSWORD_VERIFY, resetPasswordVerifyCall),
    takeLatest(RESET_PASSWORD_SUBMIT_NEW, resetPasswordSubmitNewCall),
    takeLatest(VERIFY_EMAIL, verifyEmailCall),
    takeLatest(REQUEST_EMAIL_VERIFICATION, requestEmailVerificationCall),
    takeLatest(FETCH_VOTING_ITEMS, fetchVotingItemsCall),
    takeLatest(CAST_VOTE, castVoteCall),
    takeLatest(FETCH_FOLLOWINGS, fetchFollowingsCall),
    takeLatest(FETCH_STALL_DATA, fetchStallDataCall),
  ]);
}
