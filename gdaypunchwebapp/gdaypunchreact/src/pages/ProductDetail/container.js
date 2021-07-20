import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectProductsState } from "selectors/app";
import {
  fetchViewingProduct as fetchViewingProductAction,
  setViewingProduct as setViewingProductAction,
} from "actions/products";
import { updateCartItemQuantity as updateCartItemQuantityAction } from "actions/cart";

import Ui from "./ui";

const mapState = createStructuredSelector({
  productState: selectProductsState,
});

const mapDispatch = {
  fetchViewingProduct: fetchViewingProductAction,
  setViewingProduct: setViewingProductAction,
  updateCartItemQuantity: updateCartItemQuantityAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
