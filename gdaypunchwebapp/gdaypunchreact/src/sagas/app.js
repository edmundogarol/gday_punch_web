import { call, all, takeEvery } from "redux-saga/effects";
import { DO_LOGIN } from "actions/user";
import { api } from "utils/api";

export function* login() {
  console.log("Log in saga");

  const response = yield call(api, "users/", {
    method: "GET"
  });

  if (response && response.ok) {
    const data = yield response.json();
    // yield put(updateLogin(data));
    console.log("Response Data", data);
  } else {
    console.log("Login error", JSON.stringify(response));
  }
}

export default function* appSaga() {
  yield all([takeEvery(DO_LOGIN, login)]);
}
