import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import Ui from "./ui";

import { selectResetPasswordState } from "selectors/app";
import {
  resetPassword as resetPasswordAction,
  resetPasswordSubmitted as resetPasswordSubmittedAction,
  resetPasswordVerify as resetPasswordVerifyAction,
} from "src/actions/user";

const mapState = createStructuredSelector({
  resetPasswordState: selectResetPasswordState,
});

const mapDispatch = {
  resetPassword: resetPasswordAction,
  resetPasswordSubmitted: resetPasswordSubmittedAction,
  resetPasswordVerify: resetPasswordVerifyAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
