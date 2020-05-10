import { createSelector } from "reselect";

const selectDomain = (state) => state.app;

export const selectLoginViewToggle = createSelector(
  selectDomain,
  ({ loginView }) => loginView
);

export const selectLoggedIn = createSelector(
  selectDomain,
  ({ user }) => user.logged_in
);

export const selectLoginError = createSelector(
  selectDomain,
  ({ loginError }) => loginError
);

export const selectRegistrationError = createSelector(
  selectDomain,
  ({ registrationError }) => registrationError
);

export const selectPendingLogin = createSelector(
  selectDomain,
  ({ pendingLogin }) => pendingLogin
);

export const selectPendingRegistration = createSelector(
  selectDomain,
  ({ pendingRegistration }) => pendingRegistration
);
