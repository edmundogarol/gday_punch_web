import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectOrderState } from "selectors/admin";

import {
  setSelectedUser as setSelectedUserAction,
  setSelectedOrder as setSelectedOrderAction,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  ordersState: selectOrderState,
});

const mapDispatch = {
  setSelectedUser: setSelectedUserAction,
  setSelectedOrder: setSelectedOrderAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
