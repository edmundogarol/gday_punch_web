import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  fetchPrompts as fetchPromptsAction,
  resetPromptFetch as resetPromptFetchAction,
  fetchPanelStylePrompt as fetchPanelStylePromptAction,
} from "actions/admin";

import {
  selectPrompts,
  selectPromptStatuses,
  selectPanelStylePrompt,
  selectPanelStylePromptStatuses,
} from "selectors/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  prompts: selectPrompts,
  promptStatuses: selectPromptStatuses,
  stylePanelPrompt: selectPanelStylePrompt,
  stylePanelPromptStatuses: selectPanelStylePromptStatuses,
});

const mapDispatch = {
  fetchPrompts: fetchPromptsAction,
  resetPromptFetch: resetPromptFetchAction,
  fetchPanelStylePrompt: fetchPanelStylePromptAction,
};

export default connect(mapState, mapDispatch)(Ui);
