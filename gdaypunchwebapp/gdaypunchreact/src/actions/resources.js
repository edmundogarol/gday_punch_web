export const DOWNLOAD_MANUSCRIPT_REQUEST =
  "resources/DOWNLOAD_MANUSCRIPT_REQUEST";
export const DOWNLOAD_MANUSCRIPT_REQUESTING =
  "resources/DOWNLOAD_MANUSCRIPT_REQUESTING";
export const DOWNLOAD_MANUSCRIPT_REQUEST_FINISHED =
  "resources/DOWNLOAD_MANUSCRIPT_REQUEST_FINISHED";
export const DOWNLOAD_MANUSCRIPT_REQUEST_ERRORS =
  "resources/DOWNLOAD_MANUSCRIPT_REQUEST_ERRORS";
export const RESET_DOWNLOAD_MANUSCRIPT_REQUEST =
  "resources/RESET_DOWNLOAD_MANUSCRIPT_REQUEST";

export const downloadManuscriptRequest = (email) => ({
  type: DOWNLOAD_MANUSCRIPT_REQUEST,
  payload: {
    email,
  },
});

export const downloadManuscriptRequesting = () => ({
  type: DOWNLOAD_MANUSCRIPT_REQUESTING,
});

export const downloadManuscriptRequestFinished = () => ({
  type: DOWNLOAD_MANUSCRIPT_REQUEST_FINISHED,
});

export const downloadManuscriptRequestErrors = (errors) => ({
  type: DOWNLOAD_MANUSCRIPT_REQUEST_ERRORS,
  payload: {
    errors,
  },
});

export const resetDownloadManuscriptRequest = () => ({
  type: RESET_DOWNLOAD_MANUSCRIPT_REQUEST,
});
