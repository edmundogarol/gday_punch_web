import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Ui from "./ui";

import { updateCartItems as updateCartItemsAction } from "actions/cart";
import { setViewingProduct as setViewingProductAction } from "actions/products";

const mapState = createStructuredSelector({});

const mapDispatch = {
  updateCartItems: updateCartItemsAction,
  viewProduct: setViewingProductAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
