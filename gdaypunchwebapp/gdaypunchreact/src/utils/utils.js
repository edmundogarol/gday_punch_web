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
