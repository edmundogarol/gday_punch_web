import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Ui from "./ui";

import {
  selectCartCount,
  selectCartTotal,
  selectProductList,
  selectUser,
} from "selectors/app";
import { toggleSideCart as toggleSideCartAction } from "actions/cart";
import { setViewingProduct as setViewingProductAction } from "actions/products";
import {
  paymentSubmit as paymentSubmitAction,
  paymentIntentFetch as paymentIntentFetchAction,
  paymentIntentCancel as paymentIntentCancelAction,
  paymentSuccessConfirm as paymentSuccessConfirmAction,
  paymentError as paymentErrorAction,
} from "actions/payment";
import {
  customerFetchFinished as customerFetchFinishedAction,
  customerFetch as customerFetchAction,
  customerSubscribe as customerSubscribeAction,
  customerUpdate as customerUpdateAction,
} from "actions/customer";
import { selectCustomerState } from "src/selectors/customer";
import { selectPaymentState } from "src/selectors/payment";

const mapState = createStructuredSelector({
  user: selectUser,
  productList: selectProductList,
  cartCount: selectCartCount,
  cartTotal: selectCartTotal,
  paymentState: selectPaymentState,
  customerState: selectCustomerState,
});

const mapDispatch = {
  toggleSideCart: toggleSideCartAction,
  viewProduct: setViewingProductAction,
  paymentSubmit: paymentSubmitAction,
  customerSubscribe: customerSubscribeAction,
  customerFetch: customerFetchAction,
  customerUpdate: customerUpdateAction,
  customerFetchFinished: customerFetchFinishedAction,
  paymentError: paymentErrorAction
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
