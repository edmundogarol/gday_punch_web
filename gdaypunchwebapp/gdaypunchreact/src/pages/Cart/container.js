import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectCartState } from "selectors/app";
import {
  fetchCartItems as fetchCartItemsAction,
  updateCartItems as updateCartItemsAction,
} from "actions/cart";

import Ui from "./ui";

const mapState = createStructuredSelector({
  cartState: selectCartState,
});

const mapDispatch = {
  fetchCartItems: fetchCartItemsAction,
  updateCartItems: updateCartItemsAction,
};

export default connect(mapState, mapDispatch)(Ui);
