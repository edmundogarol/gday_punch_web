export const DO_LOGIN = "user/DO_LOGIN";
export const DO_LOGOUT = "user/DO_LOGOUT";
export const DO_CHECK_LOGIN = "user/DO_CHECK_LOGIN";
export const DO_REGISTRATION = "user/DO_REGISTRATION";
export const CLOSE_REGISTRATION = "user/CLOSE_REGISTRATION";
export const OPEN_REGISTRATION = "user/OPEN_REGISTRATION";
export const REGISTRATION_SUCCESS = "user/REGISTRATION_SUCCESS";
export const UPDATE_USER = "user/UPDATE_USER";
export const UPDATE_USER_DETAILS = "user/UPDATE_USER_DETAILS";
export const UPDATE_LOGIN_ERROR = "user/UPDATE_LOGIN_ERROR";
export const UPDATE_REGISTRATION_ERROR = "user/UPDATE_REGISTRATION_ERROR";
export const SUGGEST_REGISTER_TO_CONTINUE = "user/SUGGEST_REGISTER_TO_CONTINUE";

export const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: {
    user
  }
});

export const doUpdateUserDetails = (user) => ({
  type: UPDATE_USER_DETAILS,
  payload: {
    user
  }
});

export const registrationSuccess = () => ({
  type: REGISTRATION_SUCCESS
});

export const doSuggestRegister = (message) => ({
  type: SUGGEST_REGISTER_TO_CONTINUE,
  payload: {
    message
  }
});

export const updateLoginError = (error) => ({
  type: UPDATE_LOGIN_ERROR,
  payload: {
    error
  }
});

export const updateRegistrationError = (error) => ({
  type: UPDATE_REGISTRATION_ERROR,
  payload: {
    error
  }
});

export const openRegistration = () => ({
  type: OPEN_REGISTRATION
});

export const doCheckLogin = () => ({
  type: DO_CHECK_LOGIN
});

export const doLogin = ({ email, password }) => ({
  type: DO_LOGIN,
  payload: {
    email,
    password
  }
});

export const doLogout = () => ({
  type: DO_LOGOUT
});

export const doRegistration = ({ email, password }) => ({
  type: DO_REGISTRATION,
  payload: {
    email,
    password
  }
});

export const closeRegistration = () => ({
  type: CLOSE_REGISTRATION
});
