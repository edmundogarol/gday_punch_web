export const DO_REGISTRATION = "user/DO_REGISTRATION";
export const CLOSE_REGISTRATION = "user/CLOSE_REGISTRATION";
export const OPEN_REGISTRATION = "user/OPEN_REGISTRATION";

export const openRegistration = () => ({
  type: OPEN_REGISTRATION
});

export const doRegistration = ({ username, password }) => ({
  type: DO_REGISTRATION,
  payload: {
    username,
    password
  }
});

export const closeRegistration = () => ({
  type: CLOSE_REGISTRATION
});
