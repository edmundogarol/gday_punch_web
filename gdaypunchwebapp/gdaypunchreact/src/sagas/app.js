import { call, all, takeEvery, select } from "redux-saga/effects";
import { DO_REGISTRATION } from "actions/user";
import { selectPendingRegistration } from "selectors/app";
import { api } from "utils/api";

export function* register() {
  console.log("Register in saga");
  const pendingRegistration = yield select(selectPendingRegistration);

  const response = yield call(api, "users/", {
    method: "POST",
    body: pendingRegistration
  });

  if (response && response.ok) {
    const data = yield response.json();
    // yield put(updateUser(data));
    console.log("Response Data", data);
  } else {
    console.log("Registration error", JSON.stringify(response));
  }
}

export default function* appSaga() {
  yield all([takeEvery(DO_REGISTRATION, register)]);
}
