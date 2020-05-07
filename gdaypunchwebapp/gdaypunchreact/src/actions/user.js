export const DO_LOGIN = "user/DO_LOGIN";
export const DO_REGISTRATION = "user/DO_REGISTRATION";
export const CLOSE_REGISTRATION = "user/CLOSE_REGISTRATION";
export const OPEN_REGISTRATION = "user/OPEN_REGISTRATION";
export const UPDATE_USER = "user/UPDATE_USER";

export const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: {
    user
  }
});

export const openRegistration = () => ({
  type: OPEN_REGISTRATION
});

export const doLogin = ({ email, password }) => ({
  type: DO_LOGIN,
  payload: {
    email,
    password
  }
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
