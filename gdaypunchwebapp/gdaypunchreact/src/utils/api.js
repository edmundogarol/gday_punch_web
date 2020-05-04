import { call } from "redux-saga/effects";

import { gdayfetch } from "./gdayfetch";

/**
 * Make an API call or yield a redirect to the login page.
 */
export function* api(...args) {
  try {
    const response = yield call(gdayfetch, ...args);

    if (response.ok) {
    } else if (response.status === 403) {
      console.debug("Login required");
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
      data: exc
    };
  }
}
