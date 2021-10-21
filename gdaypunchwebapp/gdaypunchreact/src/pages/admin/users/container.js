import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectSettings, selectUsersState } from "selectors/admin";

import {
  fetchUsers as fetchUsersAction,
  fetchUserCustomerDetails as fetchUserCustomerDetailsAction,
  setSelectedUser as setSelectedUserAction,
  adminCreateUser as adminCreateUserAction,
  fetchSettings as fetchSettingsAction,
  changeSettings as changeSettingsAction,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  usersState: selectUsersState,
  settingsState: selectSettings,
});

const mapDispatch = {
  fetchUsers: fetchUsersAction,
  fetchUserCustomerDetails: fetchUserCustomerDetailsAction,
  setSelectedUser: setSelectedUserAction,
  adminCreateUser: adminCreateUserAction,
  fetchSettings: fetchSettingsAction,
  changeSettings: changeSettingsAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
