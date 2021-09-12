import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Ui from "./ui";

import {
  selectCartCount,
  selectCartTotal,
  selectProductList,
} from "selectors/app";
import {
  toggleSideCart as toggleSideCartAction,
  updateCartItemQuantity as updateCartItemQuantityAction,
  removeCartItem as removeCartItemAction,
} from "actions/cart";
import { setViewingProduct as setViewingProductAction } from "actions/products";
import {
  paymentApplyCoupon,
  updateCoupon as updateCouponAction,
} from "src/actions/payment";
import { selectPaymentState } from "src/selectors/payment";

const mapState = createStructuredSelector({
  paymentState: selectPaymentState,
  productList: selectProductList,
  cartCount: selectCartCount,
  cartTotal: selectCartTotal,
});

const mapDispatch = {
  updateCoupon: updateCouponAction,
  applyCoupon: paymentApplyCoupon,
  toggleSideCart: toggleSideCartAction,
  updateCartItemQuantity: updateCartItemQuantityAction,
  removeCartItem: removeCartItemAction,
  viewProduct: setViewingProductAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
