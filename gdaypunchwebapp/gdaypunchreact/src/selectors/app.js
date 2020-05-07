import { createSelector } from "reselect";

const selectDomain = (state) => state.app;

export const selectRegisterationToggle = createSelector(
  selectDomain,
  ({ registrationToggle }) => registrationToggle
);

export const selectPendingLogin = createSelector(
  selectDomain,
  ({ pendingLogin }) => pendingLogin
);

export const selectPendingRegistration = createSelector(
  selectDomain,
  ({ pendingRegistration }) => pendingRegistration
);
