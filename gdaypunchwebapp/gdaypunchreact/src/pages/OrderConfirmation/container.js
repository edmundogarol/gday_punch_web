import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import Ui from "./ui";
import {
  fetchViewingOrder as fetchViewingOrderAction,
  resetViewingOrder as resetViewingOrderAction,
} from "src/actions/order";
import { selectViewingOrderState } from "src/selectors/orders";
import { selectPaymentSuccess } from "src/selectors/payment";
import { fetchProducts as fetchProductsAction } from "src/actions/app";
import { resetPayment as resetPaymentAction } from "src/actions/payment";

const mapState = createStructuredSelector({
  viewingOrderState: selectViewingOrderState,
  paymentSuccess: selectPaymentSuccess,
});

const mapDispatch = {
  fetchViewingOrder: fetchViewingOrderAction,
  resetViewingOrder: resetViewingOrderAction,
  fetchProducts: fetchProductsAction,
  resetPayment: resetPaymentAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
