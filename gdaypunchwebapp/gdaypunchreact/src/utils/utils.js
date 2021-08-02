import { set } from "lodash";
/**
 * Retrieves an img Module with default data image base64
 *
 * @param {string} name of img to retrieve
 */
export function getImageModule(url) {
  return require(`../../public/static/images/${url}`).default;
}

export function getCoverImage(url) {
  return require(`../../public/${url}`).default;
}

export function getGdayPunchStaticUrl(url) {
  return `https://gdaypunch-static.s3.us-west-2.amazonaws.com/${url}`;
}

export function arrayIdsMapToObject(list) {
  let finalObject = {};
  list.map((element) => set(finalObject, element.id, element));
  return finalObject;
}

export function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
