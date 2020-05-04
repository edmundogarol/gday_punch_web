/**
 * Build the URL search params for a quer
 * @param {*} queryParams object of query parameters
 * @param {URLSearchParams?} searchParams optional URL search params
 */
export function buildSearchParams(queryParams, searchParams = null) {
  const finalParams = searchParams || new URLSearchParams();

  if (queryParams) {
    for (const key of Object.keys(queryParams)) {
      const value = queryParams[key];

      if (value instanceof Array) {
        value.forEach((elem) => finalParams.append(key, elem));
      } else {
        finalParams.append(key, value);
      }
    }
  }

  return finalParams;
}
