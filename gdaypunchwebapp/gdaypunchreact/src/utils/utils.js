import { set } from "lodash";

/**
 * Retrieves an img Module with default data image base64
 *
 * @param {string} name of img to retrieve
 */
export function getResourceImage(resource) {
  return require(`../../public/static/resources/${resource}`).default;
}

export function getGdayPunchStaticUrl(asset) {
  let staticURL =
    process.env.NODE_ENV === "development"
      ? "/static"
      : "https://gdaypunch-static.s3.us-west-2.amazonaws.com";

  return `${staticURL}/${asset}`;
}

export function arrayIdsMapToObject(list) {
  let finalObject = {};

  if (!list || !list.length || list[0] === undefined) return finalObject;

  list.map((element) => set(finalObject, element.id, element));
  return finalObject;
}

export function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

export function phoneValidator(inputtxt) {
  var phoneno = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  if (inputtxt.match(phoneno)) {
    return true;
  }
  return false;
}

export function emailValidator(inputtxt) {
  var email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (inputtxt.match(email)) {
    return true;
  }
  return false;
}
