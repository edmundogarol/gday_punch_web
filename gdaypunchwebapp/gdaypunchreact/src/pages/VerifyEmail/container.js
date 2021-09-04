import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import Ui from "./ui";

import { selectEmailVerificationState, selectUser } from "selectors/app";
import { verifyEmail as verifyEmailAction } from "src/actions/user";

const mapState = createStructuredSelector({
  userState: selectUser,
  emailVerificationState: selectEmailVerificationState,
});

const mapDispatch = {
  verifyEmail: verifyEmailAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
