import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectOrderState } from "selectors/admin";

import {
  setSelectedOrder as setSelectedOrderAction,
  updateOrderStatus as updateOrderStatusAction,
  updatePartialRefund as updatePartialRefundAction,
  updateStatusReason as updateStatusReasonAction,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  ordersState: selectOrderState,
});

const mapDispatch = {
  updateStatusReason: updateStatusReasonAction,
  setSelectedOrder: setSelectedOrderAction,
  updateOrderStatus: updateOrderStatusAction,
  updatePartialRefund: updatePartialRefundAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
