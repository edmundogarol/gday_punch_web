import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Ui from "./ui";

import {
  selectCartCount,
  selectCartTotal,
  selectPaymentClientSecret,
  selectProductList,
} from "selectors/app";
import { toggleSideCart as toggleSideCartAction } from "actions/cart";
import { setViewingProduct as setViewingProductAction } from "actions/products";
import {
  paymentSubmit as paymentSubmitAction,
  paymentIntentFetch as paymentIntentFetchAction,
  paymentIntentCancel as paymentIntentCancelAction,
} from "actions/payment";

const mapState = createStructuredSelector({
  productList: selectProductList,
  cartCount: selectCartCount,
  cartTotal: selectCartTotal,
  clientSecret: selectPaymentClientSecret,
});

const mapDispatch = {
  toggleSideCart: toggleSideCartAction,
  viewProduct: setViewingProductAction,
  paymentSubmit: paymentSubmitAction,
  paymentIntentFetch: paymentIntentFetchAction,
  paymentIntentCancel: paymentIntentCancelAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
