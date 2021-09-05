import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

import { selectEmailVerificationState, selectUser } from "selectors/app";
import { requestEmailVerification as requestEmailVerificationAction } from "src/actions/user";

const mapState = createStructuredSelector({
  user: selectUser,
  emailVerificationState: selectEmailVerificationState,
});

const mapDispatch = {
  requestEmailVerification: requestEmailVerificationAction,
};

export default connect(mapState, mapDispatch)(Ui);
