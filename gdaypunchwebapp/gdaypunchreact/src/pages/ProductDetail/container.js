import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { openRegistration, doSuggestRegister } from "actions/user";
import { selectProductsState, selectLoggedIn, selectUser } from "selectors/app";
import {
  fetchViewingProduct as fetchViewingProductAction,
  setViewingProduct as setViewingProductAction,
} from "actions/products";
import { updateCartItemQuantity as updateCartItemQuantityAction } from "actions/cart";

import Ui from "./ui";

const mapState = createStructuredSelector({
  user: selectUser,
  productState: selectProductsState,
  loggedIn: selectLoggedIn,
});

const mapDispatch = {
  fetchViewingProduct: fetchViewingProductAction,
  setViewingProduct: setViewingProductAction,
  updateCartItemQuantity: updateCartItemQuantityAction,
  openRegister: openRegistration,
  suggestRegister: doSuggestRegister,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
