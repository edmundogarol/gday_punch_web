import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Ui from "./ui";

import {
  selectCartState,
  selectCartCount,
  selectCartTotal,
  selectProductList,
  selectDiscountAmount,
} from "selectors/app";
import {
  toggleSideCart as toggleSideCartAction,
  updateCartItemQuantity as updateCartItemQuantityAction,
  removeCartItem as removeCartItemAction,
} from "actions/cart";
import { setViewingProduct as setViewingProductAction } from "actions/products";
import { selectPaymentState } from "src/selectors/payment";

const mapState = createStructuredSelector({
  paymentState: selectPaymentState,
  cartState: selectCartState,
  productList: selectProductList,
  cartCount: selectCartCount,
  cartTotal: selectCartTotal,
  discountAmount: selectDiscountAmount,
});

const mapDispatch = {
  toggleSideCart: toggleSideCartAction,
  updateCartItemQuantity: updateCartItemQuantityAction,
  removeCartItem: removeCartItemAction,
  viewProduct: setViewingProductAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
