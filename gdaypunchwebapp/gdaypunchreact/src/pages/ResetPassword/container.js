import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

import { selectResetPasswordState } from "selectors/app";
import {
  resetPassword as resetPasswordAction,
  resetPasswordSubmitted as resetPasswordSubmittedAction,
} from "src/actions/user";

const mapState = createStructuredSelector({
  resetPasswordState: selectResetPasswordState,
});

const mapDispatch = {
  resetPassword: resetPasswordAction,
  resetPasswordSubmitted: resetPasswordSubmittedAction,
};

export default connect(mapState, mapDispatch)(Ui);
