import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectOrderState } from "selectors/admin";

import {
  fetchOrders as fetchOrdersAction,
  setSelectedOrder as setSelectedOrderAction,
  fetchOrderStatusUpdates,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  ordersState: selectOrderState,
});

const mapDispatch = {
  fetchOrders: fetchOrdersAction,
  fetchOrderStatuses: fetchOrderStatusUpdates,
  setSelectedOrder: setSelectedOrderAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
