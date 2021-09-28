import { createSelector } from "reselect";

const selectDomain = (state) => state.resources;

export const selectDownloadManuscriptState = createSelector(
  selectDomain,
  ({ downloadManuscript }) => downloadManuscript
);
