import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Ui from "./ui";

import {
  selectCartCount,
  selectCartTotal,
  selectPaymentClientSecret,
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
} from "actions/payment";
import {
  customerFetchFinished as customerFetchFinishedAction,
  customerFetch as customerFetchAction,
  customerSubscribe as customerSubscribeAction,
  customerUpdate as customerUpdateAction,
} from "actions/customer";
import { selectCustomerState } from "src/selectors/customer";

const mapState = createStructuredSelector({
  user: selectUser,
  productList: selectProductList,
  cartCount: selectCartCount,
  cartTotal: selectCartTotal,
  clientSecret: selectPaymentClientSecret,
  customerState: selectCustomerState,
});

const mapDispatch = {
  toggleSideCart: toggleSideCartAction,
  viewProduct: setViewingProductAction,
  paymentSubmit: paymentSubmitAction,
  paymentIntentFetch: paymentIntentFetchAction,
  paymentIntentCancel: paymentIntentCancelAction,
  customerSubscribe: customerSubscribeAction,
  paymentSuccessConfirm: paymentSuccessConfirmAction,
  customerFetch: customerFetchAction,
  customerUpdate: customerUpdateAction,
  customerFetchFinished: customerFetchFinishedAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
