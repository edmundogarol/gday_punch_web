import { call, put } from "redux-saga/effects";
import { message } from "antd";

import { gdayfetch, twitterFetch } from "./gdayfetch";
import { doCheckLogin, logoutSuccess } from "src/actions/user";

/**
 * Make an API call or yield a redirect to the login page.
 */
export function* api(...args) {
  try {
    let useFetch = gdayfetch;
    switch (args[1].fetchType) {
      case "twitter":
        useFetch = twitterFetch;
        break;
    }

    const response = yield call(useFetch, ...args);

    if (response.ok) {
      console.debug("Ok!", response);
    } else if (response.status === 403) {
      console.debug("Login required");

      if (
        args[3] &&
        !args[3].loggedOutNotification &&
        response.data.detail &&
        response.data.detail.includes(
          "Authentication credentials were not provided."
        )
      ) {
        message.error(
          `You have been logged out. Please log in again to continue.`,
          4
        );
        yield put(logoutSuccess());
        yield put(doCheckLogin());
      }
    } else if (response.status === 503) {
      console.error("Timeout", response);
    } else {
      console.error("Bad request", response);
    }

    return response;
  } catch (exc) {
    console.error("Error talking to Gday Punch:", exc);
    if (exc.offline) {
      console.error("You are offline.", exc);
    }

    return {
      ok: false,
      exception: true,
      status: exc.name,
      statusText: exc.toString(),
      data: exc,
    };
  }
}
