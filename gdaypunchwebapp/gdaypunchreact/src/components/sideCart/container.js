import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Ui from "./ui";

import {
  selectCartState,
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

const mapState = createStructuredSelector({
  cartState: selectCartState,
  productList: selectProductList,
  cartCount: selectCartCount,
  cartTotal: selectCartTotal,
});

const mapDispatch = {
  toggleSideCart: toggleSideCartAction,
  updateCartItemQuantity: updateCartItemQuantityAction,
  removeCartItem: removeCartItemAction,
  viewProduct: setViewingProductAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
