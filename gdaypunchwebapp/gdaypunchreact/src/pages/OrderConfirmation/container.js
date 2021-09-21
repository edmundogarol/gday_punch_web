import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import Ui from "./ui";
import {
  fetchViewingOrder as fetchViewingOrderAction,
  updateViewingOrder as updateViewingOrderAction,
} from "src/actions/order";
import { selectViewingOrderState } from "src/selectors/orders";
import { selectPaymentSuccess } from "src/selectors/payment";

const mapState = createStructuredSelector({
  viewingOrderState: selectViewingOrderState,
  paymentSuccess: selectPaymentSuccess,
});

const mapDispatch = {
  fetchViewingOrder: fetchViewingOrderAction,
  updateViewingOrder: updateViewingOrderAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
