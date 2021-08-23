import Cookies from "js-cookie";
import { buildSearchParams } from "./urls";
import oauthSignature from "oauth-signature";
import uuid from "uuid";
import moment from "moment";

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
  const composedURL = new URL(
    url.includes("api-auth") ? url : `api/${url}`,
    window.location.origin
  );

  const {
    contentType = APPLICATION_JSON,
    accept = APPLICATION_JSON,
    params: queryParams,
    ...inputParams
  } = params;

  const finalParams = {
    credentials: "same-origin",
    ...inputParams,
  };

  buildSearchParams(queryParams, composedURL.searchParams);

  const csrftoken = Cookies.get("csrftoken");

  finalParams.headers = {
    ...finalParams.headers,
    "Content-Type": contentType,
    Accept: accept,
    "X-CSRFToken": csrftoken,
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
      statusText: "Not Acceptable",
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

export async function twitterFetch(url, params = {}) {
  const {
    method,
    image,
    status,
    mediaId,
    embedId,
    statusId,
    retweetUrl,
    accept = APPLICATION_JSON,
  } = params;

  const embeddedURL = `https://twitter.com/GdayManga/status/${embedId}`;
  let twitterPrefix;
  let twitterPostfix;

  if (image) {
    twitterPrefix = "upload";
    twitterPostfix = "?media_category=tweet_image";
  } else if (embedId) {
    twitterPrefix = "publish";
    twitterPostfix = `?url=${embeddedURL}`;
  } else if (statusId) {
    twitterPrefix = "api";
    twitterPostfix = `${statusId}.json`;
  } else {
    twitterPrefix = "api";
    twitterPostfix = "";
  }

  const proxyURL = "https://whispering-forest-13965.herokuapp.com/";

  let composedURL = `https://${twitterPrefix}.twitter.com/1.1/${url}.json${twitterPostfix}`;
  let finalURL = `${proxyURL}${composedURL}`;

  if (embedId) {
    composedURL = `https://${twitterPrefix}.twitter.com/${url}${twitterPostfix}`;
    finalURL = `${proxyURL}${composedURL}`;
  } else if (statusId) {
    composedURL = `https://${twitterPrefix}.twitter.com/1.1/${url}/${twitterPostfix}`;
    finalURL = `${proxyURL}${composedURL}`;
  }

  const consumerKey = "Dd07RFYLVLKnXy1CKWSJL0ha2";
  const consumerSecret = "7XDw7HIOgztqfmaRuXFN1SfYrbMotHoBEjh7lXHHFZosOvRdbj";
  const accessToken = "1142234078919311362-gdwcvwJxXEIfWqxoPmOeYQ9KAofE1M";
  const tokenSecret = "jbcL9C8YOkMzO3EohNqcGWiwunzuwsWVCvALQgYxPX2wZ";

  let parameters = {
    oauth_consumer_key: consumerKey,
    oauth_token: accessToken,
    oauth_nonce: uuid.v1(),
    oauth_timestamp: Math.floor(moment.now() / 1000),
    oauth_signature_method: "HMAC-SHA1",
    oauth_version: "1.0",
  };

  if (image) {
    parameters = {
      ...parameters,
      media_data: image,
      media_category: "tweet_image",
    };
  } else if (mediaId) {
    parameters = {
      ...parameters,
      media_ids: mediaId,
      status,
    };
  } else if (embedId) {
    parameters = {
      ...parameters,
      url: embeddedURL,
    };
  } else if (statusId) {
    parameters = {
      ...parameters,
      id: statusId,
    };
  } else if (retweetUrl) {
    parameters = {
      ...parameters,
      status,
      attachment_url: retweetUrl,
    };
  } else {
    parameters = {
      ...parameters,
      status,
    };
  }

  const signature = oauthSignature.generate(
    method,
    composedURL,
    parameters,
    consumerSecret,
    tokenSecret
  );

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append(
    "Authorization",
    `OAuth oauth_consumer_key="${consumerKey}",` +
      `oauth_token="${accessToken}",` +
      `oauth_signature_method="HMAC-SHA1",` +
      `oauth_timestamp="${parameters.oauth_timestamp}",` +
      `oauth_nonce="${parameters.oauth_nonce}",` +
      `oauth_version="1.0",` +
      `oauth_signature="${signature}"`
  );
  myHeaders.append(
    "Cookie",
    'personalization_id="v1_XKUrdmH0V7Q8V0/kmY+p/w=="; guest_id=v1%3A159137791765994236; lang=en'
  );

  const urlencoded = new URLSearchParams();

  if (image) {
    urlencoded.append("media_data", image);
  } else if (mediaId) {
    urlencoded.append("status", status);
    urlencoded.append("media_ids", mediaId);
  } else if (statusId) {
    urlencoded.append("id", statusId);
  } else if (retweetUrl) {
    urlencoded.append("status", status);
    urlencoded.append("attachment_url", retweetUrl);
  } else {
    urlencoded.append("status", status);
  }

  const requestOptions = {
    method,
    headers: myHeaders,
    redirect: "follow",
  };

  if (!embedId) requestOptions.body = urlencoded;

  const response = await fetch(finalURL, requestOptions).catch((exc) => {
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
      statusText: "Not Acceptable",
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
