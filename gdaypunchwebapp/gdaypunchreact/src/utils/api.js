import { call } from "redux-saga/effects";

import { gdayfetch, twitterFetch } from "./gdayfetch";

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
