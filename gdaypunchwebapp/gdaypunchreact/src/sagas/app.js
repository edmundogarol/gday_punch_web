import {
  call,
  all,
  takeEvery,
  takeLatest,
  select,
  put
} from "redux-saga/effects";
import { DO_LOGIN, DO_REGISTRATION, updateUser } from "actions/user";
import { selectPendingRegistration, selectPendingLogin } from "selectors/app";
import { api } from "utils/api";

export function* register() {
  const pendingRegistration = yield select(selectPendingRegistration);

  const response = yield call(api, "user/", {
    method: "POST",
    body: pendingRegistration
  });

  if (response && response.ok) {
    const data = response.data;
    yield put(updateUser(data));
    console.log("Response Data", data);
  } else {
    console.log("Registration error", JSON.stringify(response));
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
    yield put(updateUser(data));
    console.log("Logged in user", data);
  } else {
    console.log("Login error", JSON.stringify(response));
  }
}

export default function* appSaga() {
  yield all([
    takeLatest(DO_LOGIN, login),
    takeLatest(DO_REGISTRATION, register)
  ]);
}
