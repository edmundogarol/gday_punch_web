import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectOrderState } from "selectors/admin";

import {
  setSelectedUser as setSelectedUserAction,
  setSelectedOrder as setSelectedOrderAction,
  updateUserDetails as updateUserDetailsAction,
  updateCustomerDetails as updateCustomerDetailsAction,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  ordersState: selectOrderState,
});

const mapDispatch = {
  setSelectedUser: setSelectedUserAction,
  setSelectedOrder: setSelectedOrderAction,
  updateUserDetails: updateUserDetailsAction,
  updateCustomerDetails: updateCustomerDetailsAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
