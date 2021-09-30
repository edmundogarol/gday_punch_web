import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectUsersState } from "selectors/admin";

import {
  fetchUsers as fetchUsersAction,
  fetchUserCustomerDetails as fetchUserCustomerDetailsAction,
  setSelectedUser as setSelectedUserAction,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  usersState: selectUsersState,
});

const mapDispatch = {
  fetchUsers: fetchUsersAction,
  fetchUserCustomerDetails: fetchUserCustomerDetailsAction,
  setSelectedUser: setSelectedUserAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
