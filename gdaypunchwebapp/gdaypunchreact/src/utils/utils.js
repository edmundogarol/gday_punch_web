/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */

import { set } from "lodash";
import { SELLER_PERCENTAGE_FEE, SELLER_FLAT_FEE } from "constants";
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

export function getGdayPunchResourceUrl(asset) {
  let staticURL =
    process.env.NODE_ENV === "development"
      ? "/static"
      : "https://gdaypunch-resources.s3.ap-southeast-2.amazonaws.com";

  return `${staticURL}/${asset}`;
}

export function hasPrivilege(user, privilege) {
  if (!user.id) return false;

  const superUser = user.privileges.includes("super");
  if (superUser) return true;

  return user.privileges.includes(privilege);
}

export function arrayIdsMapToObject(list) {
  let finalObject = {};

  if (!list || !list.length || list[0] === undefined) return finalObject;

  list.map((element) => set(finalObject, element.id, element));
  return finalObject;
}

export function scrollToTop() {
  window.scrollTo(0, 0);
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

export function removeHtml(inputtxt) {
  return inputtxt.replaceAll(/<[^>]*>/gi, "").trim();
}

export function skuValidator(inputtxt) {
  var sku = /^[a-zA-Z0-9_]*$/;
  return inputtxt && inputtxt.length ? inputtxt.match(sku) : true;
}

export function priceValidator(inputtxt) {
  var validNumber = /^\d*\.?\d*$/;
  return inputtxt && inputtxt.length ? inputtxt.match(validNumber) : false;
}

export function descriptionValidator(inputtxt) {
  return inputtxt.length > 30;
}

export function noLinkValidator(inputtxt) {
  return !inputtxt.includes("<a href=");
}

export function sanitiseTooManyNewLines(inputtxt, noEnters) {
  return inputtxt.replaceAll(
    /(<p><br><\/p>){2,}/gi,
    noEnters ? "" : "<p><br></p>"
  );
}

export function titleValidator(inputtxt) {
  return inputtxt.replaceAll(" ", "").length > 0;
}

export function nameValidator(inputtxt) {
  return inputtxt.replaceAll(" ", "").length > 1;
}

export function generatePermaLink(product) {
  let prefix = "";
  if (product.user === 1) {
    prefix = "gday-punch-";
  }
  return (
    prefix + product.title.toLowerCase().split(" ").join("-").replace("#", "")
  );
}

export function makeSafeUrl(text) {
  if (!text) return;
  return encodeURIComponent(text.toLowerCase().replaceAll(" ", "-"));
}

export function bankValidator(bsbInput, accInput) {
  return (
    bsbInput.replaceAll(" ", "").length > 5 &&
    accInput.replaceAll(" ", "").length > 8
  );
}

export function getSellerFee(paid) {
  const tenPercentOfAmount = paid * (SELLER_PERCENTAGE_FEE / 100);
  return tenPercentOfAmount + SELLER_FLAT_FEE;
}
