export const DO_LOGIN = "user/DO_LOGIN";
export const DO_LOGOUT = "user/DO_LOGOUT";
export const DO_CHECK_LOGIN = "user/DO_CHECK_LOGIN";
export const DO_REGISTRATION = "user/DO_REGISTRATION";
export const LOGOUT_SUCESS = "user/LOGOUT_SUCESS";
export const UPDATE_LOGIN_ERROR = "user/UPDATE_LOGIN_ERROR";
export const CLEAR_LOGIN_ERROR = "user/CLEAR_LOGIN_ERROR";

export const CLOSE_REGISTRATION = "user/CLOSE_REGISTRATION";
export const OPEN_REGISTRATION = "user/OPEN_REGISTRATION";
export const REGISTRATION_SUCCESS = "user/REGISTRATION_SUCCESS";
export const UPDATE_REGISTRATION_ERROR = "user/UPDATE_REGISTRATION_ERROR";
export const SUGGEST_REGISTER_TO_CONTINUE = "user/SUGGEST_REGISTER_TO_CONTINUE";

export const UPDATE_USER = "user/UPDATE_USER";
export const UPDATE_USER_DETAILS = "user/UPDATE_USER_DETAILS";

export const RESET_PASSWORD = "user/RESET_PASSWORD";
export const UPDATE_RESET_PASSWORD_ERRORS = "user/UPDATE_RESET_PASSWORD_ERRORS";
export const RESET_PASSWORD_SUBMITTED = "user/RESET_PASSWORD_SUBMITTED";
export const RESET_PASSWORD_VERIFY = "user/RESET_PASSWORD_VERIFY";
export const RESET_PASSWORD_VERIFICATION_TOKEN =
  "user/RESET_PASSWORD_VERIFICATION_TOKEN";
export const RESET_PASSWORD_SUBMIT_NEW = "user/RESET_PASSWORD_SUBMIT_NEW";

export const VERIFY_EMAIL = "user/VERIFY_EMAIL";
export const VERIFYING_EMAIL = "user/VERIFYING_EMAIL";
export const VERIFYING_EMAIL_FINISHED = "user/VERIFYING_EMAIL_FINISHED";
export const EMAIL_VERIFIED = "user/EMAIL_VERIFIED";

export const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: {
    user,
  },
});

export const doUpdateUserDetails = (user) => ({
  type: UPDATE_USER_DETAILS,
  payload: {
    user,
  },
});

export const registrationSuccess = () => ({
  type: REGISTRATION_SUCCESS,
});

export const doSuggestRegister = (message) => ({
  type: SUGGEST_REGISTER_TO_CONTINUE,
  payload: {
    message,
  },
});

export const updateLoginError = (error) => ({
  type: UPDATE_LOGIN_ERROR,
  payload: {
    error,
  },
});

export const clearLoginError = () => ({
  type: CLEAR_LOGIN_ERROR,
});

export const updateRegistrationError = (error) => ({
  type: UPDATE_REGISTRATION_ERROR,
  payload: {
    error,
  },
});

export const openRegistration = () => ({
  type: OPEN_REGISTRATION,
});

export const doCheckLogin = () => ({
  type: DO_CHECK_LOGIN,
});

export const doLogin = ({ email, password }) => ({
  type: DO_LOGIN,
  payload: {
    email,
    password,
  },
});

export const doLogout = () => ({
  type: DO_LOGOUT,
});

export const logoutSuccess = () => ({
  type: LOGOUT_SUCESS,
});

export const doRegistration = ({ email, password }) => ({
  type: DO_REGISTRATION,
  payload: {
    email,
    password,
  },
});

export const closeRegistration = () => ({
  type: CLOSE_REGISTRATION,
});

export const resetPassword = (email) => ({
  type: RESET_PASSWORD,
  payload: {
    email,
  },
});

export const resetPasswordSubmitNew = (
  newPassword,
  confirmPassword,
  verifiedToken
) => ({
  type: RESET_PASSWORD_SUBMIT_NEW,
  payload: {
    newPassword,
    confirmPassword,
    verifiedToken,
  },
});

export const updateResetPasswordErrors = (errors) => ({
  type: UPDATE_RESET_PASSWORD_ERRORS,
  payload: {
    errors,
  },
});

export const resetPasswordSubmitted = (submitted, keepErrors) => ({
  type: RESET_PASSWORD_SUBMITTED,
  payload: {
    submitted,
    keepErrors,
  },
});

export const resetPasswordVerify = (consumer, history) => ({
  type: RESET_PASSWORD_VERIFY,
  payload: {
    consumer,
    history,
  },
});

export const resetPasswordVerificationToken = (token) => ({
  type: RESET_PASSWORD_VERIFICATION_TOKEN,
  payload: {
    token,
  },
});

export const verifyEmail = (token) => ({
  type: VERIFY_EMAIL,
  payload: {
    token,
  },
});

export const verifyingEmail = () => ({
  type: VERIFYING_EMAIL,
});

export const verifyingEmailFinished = (error) => ({
  type: VERIFYING_EMAIL_FINISHED,
  payload: {
    error,
  },
});

export const emailVerified = (user) => ({
  type: EMAIL_VERIFIED,
  payload: {
    user,
  },
});
