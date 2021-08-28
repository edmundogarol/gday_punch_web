import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import Ui from "./ui";

import { selectResetPasswordState } from "selectors/app";
import {
  resetPasswordSubmitNew as resetPasswordSubmitNewAction,
  resetPasswordSubmitted as resetPasswordSubmittedAction,
  updateResetPasswordErrors as updateResetPasswordErrorsAction,
} from "src/actions/user";

const mapState = createStructuredSelector({
  resetPasswordState: selectResetPasswordState,
});

const mapDispatch = {
  resetPasswordSubmitNew: resetPasswordSubmitNewAction,
  updateResetPasswordErrors: updateResetPasswordErrorsAction,
  resetPasswordSubmitted: resetPasswordSubmittedAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
