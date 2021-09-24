import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

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
import { selectAccountOrdersState } from "src/selectors/account";
import { fetchAccountOrders as fetchAccountOrdersAction } from "src/actions/account";

const mapState = createStructuredSelector({
  user: selectUser,
  emailVerificationState: selectEmailVerificationState,
  userUpdateError: selectRegistrationError,
  ordersState: selectAccountOrdersState,
});

const mapDispatch = {
  requestEmailVerification: requestEmailVerificationAction,
  updateUserDetails: doUpdateUserDetails,
  updateUserDetailsError: updateRegistrationError,
  fetchAccountOrders: fetchAccountOrdersAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
