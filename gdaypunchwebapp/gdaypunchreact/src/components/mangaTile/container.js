import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Ui from "./ui";

import { updateCartItemQuantity as updateCartItemQuantityAction } from "actions/cart";
import { setViewingProduct as setViewingProductAction } from "actions/products";

const mapState = createStructuredSelector({});

const mapDispatch = {
  updateCartItemQuantity: updateCartItemQuantityAction,
  viewProduct: setViewingProductAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
