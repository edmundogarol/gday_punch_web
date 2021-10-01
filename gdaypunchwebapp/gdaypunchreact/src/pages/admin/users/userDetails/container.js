import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectOrderState } from "selectors/admin";

import { setSelectedUser as setSelectedUserAction } from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({});

const mapDispatch = {
  setSelectedUser: setSelectedUserAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
