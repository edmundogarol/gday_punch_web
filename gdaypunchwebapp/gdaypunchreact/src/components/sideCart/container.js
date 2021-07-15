import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";

import {
  selectCartState,
  selectCartCount,
  selectCartTotal,
} from "selectors/app";
import {
  toggleSideCart as toggleSideCartAction,
  updateCartItemQuantity as updateCartItemQuantityAction,
  removeCartItem as removeCartItemAction,
} from "actions/cart";
import Ui from "./ui";

const mapState = createStructuredSelector({
  cartState: selectCartState,
  cartCount: selectCartCount,
  cartTotal: selectCartTotal,
});

const mapDispatch = {
  toggleSideCart: toggleSideCartAction,
  updateCartItemQuantity: updateCartItemQuantityAction,
  removeCartItem: removeCartItemAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
