import { createSelector } from "reselect";

const selectDomain = (state) => state.app;

export const selectUser = createSelector(selectDomain, ({ user }) => user);

export const selectLoginViewToggle = createSelector(
  selectDomain,
  ({ loginView }) => loginView
);

export const selectLoggedIn = createSelector(
  selectDomain,
  ({ user }) => user.logged_in || false
);

export const selectLoginError = createSelector(
  selectDomain,
  ({ loginError }) => loginError
);

export const selectLoginCheckFinished = createSelector(
  selectDomain,
  ({ loginCheckFinished }) => loginCheckFinished
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

export const selectSuggestRegistration = createSelector(
  selectDomain,
  ({ suggestRegistration }) => suggestRegistration || ""
);

export const selectContactState = createSelector(
  selectDomain,
  ({ contact }) => contact
);
