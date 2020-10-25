import { call, all, takeLatest, select, put } from "redux-saga/effects";
import {
  DO_LOGIN,
  DO_LOGOUT,
  DO_REGISTRATION,
  DO_CHECK_LOGIN,
  UPDATE_USER_DETAILS,
  doCheckLogin,
  doLogin,
  updateUser,
  registrationSuccess,
  updateLoginError,
  updateRegistrationError
} from "actions/user";
import { doGetFeaturedManga } from "actions/manga";
import {
  selectPendingRegistration,
  selectPendingLogin,
  selectUser
} from "selectors/app";
import { api } from "utils/api";
import { message } from "antd";

export function* register() {
  const pendingRegistration = yield select(selectPendingRegistration);

  const response = yield call(api, "user/", {
    method: "POST",
    body: pendingRegistration
  });

  if (response && response.ok) {
    const data = response.data;
    const user = {
      logged_in: data.logged_in,
      ...data.user
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
      username: action.payload.user.username
    } 
  });

  if (response && response.ok) {
    const data = response.data;
    const user = {
      ...data
    }

    yield put(updateUser(user));
    message.success(`Successfully updated username to: ${user.username}`)
  } else {
    console.log("Update user details error", JSON.stringify(response));
    yield put(updateRegistrationError(response.data))
  }
}

export function* checkLogin() {
  const response = yield call(api, "login-check/", {
    method: "GET"
  });

  if (response && response.ok) {
    const data = response.data;
    const user = {
      logged_in: data.logged_in,
      ...data.user
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
    body: pendingLogin
  });

  if (response && response.ok) {
    const data = response.data;
    const user = {
      logged_in: data.logged_in,
      ...data.user
    };
    yield put(updateUser(user));
    yield put(doGetFeaturedManga());
  } else {
    console.log("Login error", JSON.stringify(response));
    yield put(updateLoginError(response.data));
  }
}

export function* logout() {
  const response = yield call(api, "logout/", {
    method: "GET"
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateUser(data));
    yield put(doCheckLogin());
    yield put(doGetFeaturedManga());
  } else {
    console.log("Log Out error", JSON.stringify(response));
  }
}

export default function* appSaga() {
  yield all([
    takeLatest(UPDATE_USER_DETAILS, patchUser),
    takeLatest(DO_LOGIN, login),
    takeLatest(DO_LOGOUT, logout),
    takeLatest(DO_REGISTRATION, register),
    takeLatest(DO_CHECK_LOGIN, checkLogin)
  ]);
}
