import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

import {
  selectEmailVerificationState,
  selectRegistrationError,
  selectUser,
} from "selectors/app";
import {
  doUpdateUserDetails,
  requestEmailVerification as requestEmailVerificationAction,
  updateRegistrationError,
} from "src/actions/user";

const mapState = createStructuredSelector({
  user: selectUser,
  emailVerificationState: selectEmailVerificationState,
  userUpdateError: selectRegistrationError,
});

const mapDispatch = {
  requestEmailVerification: requestEmailVerificationAction,
  updateUserDetails: doUpdateUserDetails,
  updateUserDetailsError: updateRegistrationError,
};

export default connect(mapState, mapDispatch)(Ui);
