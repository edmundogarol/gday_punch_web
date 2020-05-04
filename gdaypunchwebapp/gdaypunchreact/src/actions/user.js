export const DO_LOGIN = "user/DO_LOGIN";

export const doLogin = ({ username, password }) => ({
  type: DO_LOGIN,
  payload: {
    username,
    password
  }
});
