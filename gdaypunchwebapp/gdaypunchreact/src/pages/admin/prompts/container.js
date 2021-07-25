import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectPrompts, selectPromptStatuses } from "selectors/admin";

import {
  fetchPrompts as fetchPromptsAction,
  createPrompt as createPromptAction,
  selectPrompt as selectPromptAction,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  prompts: selectPrompts,
  promptStatuses: selectPromptStatuses,
});

const mapDispatch = {
  createPrompt: createPromptAction,
  fetchPrompts: fetchPromptsAction,
  selectPrompt: selectPromptAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
