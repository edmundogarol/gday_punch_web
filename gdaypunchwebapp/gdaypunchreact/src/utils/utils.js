import { set } from "lodash";
/**
 * Retrieves an img Module with default data image base64
 *
 * @param {string} name of img to retrieve
 */
export function getImageModule(url) {
  return require(`../../public/static/images/${url}`).default;
}

export function getResourceImageModule(url) {
  return require(`../../public/static/resources/${url}`).default;
}

export function getCoverImage(url) {
  return require(`../../public/${url}`).default;
}

export function getGdayPunchStaticUrl(url) {
  return `https://gdaypunch-static.s3.us-west-2.amazonaws.com/${url}`;
}

export function arrayIdsMapToObject(list) {
  let finalObject = {};

  if (list[0] === undefined) return finalObject;

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
