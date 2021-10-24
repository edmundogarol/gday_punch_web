export const TOGGLE_NAV_MINIFIED = "app/TOGGLE_NAV_MINIFIED";
export const FETCH_PRODUCTS = "app/FETCH_PRODUCTS";
export const FETCHING_PRODUCTS = "app/FETCHING_PRODUCTS";
export const FINISHED_FETCHING_PRODUCTS = "app/FINISHED_FETCHING_PRODUCTS";
export const UPDATE_PRODUCTS = "app/UPDATE_PRODUCTS";

export const SUBMIT_CONTACT_FORM = "app/SUBMIT_CONTACT_FORM";
export const UPDATE_CONTACT_FORM_ERRORS = "app/UPDATE_CONTACT_FORM_ERRORS";
export const UPDATE_CONTACT_FORM_SUBMITTED =
  "app/UPDATE_CONTACT_FORM_SUBMITTED";

export const toggleNavMinified = (minified) => ({
  type: TOGGLE_NAV_MINIFIED,
  payload: {
    minified,
  },
});

export const fetchProducts = () => ({
  type: FETCH_PRODUCTS,
});

export const fetchingProducts = () => ({
  type: FETCHING_PRODUCTS,
});

export const finishedFetchingProducts = () => ({
  type: FINISHED_FETCHING_PRODUCTS,
});

export const updateProducts = (products, adding) => ({
  type: UPDATE_PRODUCTS,
  payload: {
    products,
    adding,
  },
});

export const submitContactForm = (form, subscriptionType) => ({
  type: SUBMIT_CONTACT_FORM,
  payload: {
    form,
    subscriptionType,
  },
});

export const updateContactFormErrors = (errors) => ({
  type: UPDATE_CONTACT_FORM_ERRORS,
  payload: {
    errors,
  },
});

export const contactFormSubmitted = (submitted) => ({
  type: UPDATE_CONTACT_FORM_SUBMITTED,
  payload: {
    submitted,
  },
});
