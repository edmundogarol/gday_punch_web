import Cookies from "js-cookie";
import { buildSearchParams } from "./urls";

const APPLICATION_JSON = "application/json";

/**
 * Gday Punch Web App fetch wrapper.
 *
 * `params` includes a couple of extra items:
 *
 *   * contentType - content type for the request
 *      - Set undefined to let fetch detect and set boundaries
 *   * accept - accept type for the request
 *   * params - query params
 *
 * @param {URL|string} url
 * @param {*} params fetch params
 */
export async function gdayfetch(url, params = {}) {
  console.log("params", params);
  const composedURL = new URL(`api/${url}`, window.location.origin);
  const {
    contentType = APPLICATION_JSON,
    accept = APPLICATION_JSON,
    params: queryParams,
    ...inputParams
  } = params;

  const finalParams = {
    // Default values
    credentials: "same-origin",
    ...inputParams
  };

  buildSearchParams(queryParams, composedURL.searchParams);

  // Get the CSRF-Token from the session it needs to be included as a header.
  const csrftoken = Cookies.get("csrftoken");

  finalParams.headers = {
    ...finalParams.headers,
    "Content-Type": contentType,
    Accept: accept,
    "X-CSRFToken": csrftoken
  };

  finalParams.body = JSON.stringify(finalParams.body);

  const response = await fetch(composedURL, finalParams).catch((exc) => {
    throw exc;
  });

  const responseContentType = response.headers.get("content-type");

  if (!responseContentType) {
    return response;
  }

  if (response.ok && !responseContentType.startsWith(accept)) {
    console.warn(`Expected ${accept} got ${responseContentType}`);
    return {
      ...response,
      ok: false,
      exception: true,
      status: 406,
      statusText: "Not Acceptable"
    };
  }

  if (responseContentType.startsWith(APPLICATION_JSON)) {
    response.data = await response.json();

    if (response.ok) {
      response.rawData = response.data;
    }
  }

  return response;
}

export default gdayfetch;
