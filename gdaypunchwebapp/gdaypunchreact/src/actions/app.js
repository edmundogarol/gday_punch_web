export const SUBMIT_CONTACT_FORM = "app/SUBMIT_CONTACT_FORM";
export const UPDATE_CONTACT_FORM_ERRORS = "app/UPDATE_CONTACT_FORM_ERRORS";
export const UPDATE_CONTACT_FORM_SUBMITTED =
  "app/UPDATE_CONTACT_FORM_SUBMITTED";

export const submitContactForm = (form) => ({
  type: SUBMIT_CONTACT_FORM,
  payload: {
    form,
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
