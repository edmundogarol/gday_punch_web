import { createSelector } from "reselect";

const selectDomain = state => state.app;

export const selectLoggingIn = createSelector(selectDomain, ({ loggingIn }) => loggingIn);