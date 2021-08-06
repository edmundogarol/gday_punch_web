import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Ui from "./ui";

import {
  selectCartCount,
  selectCartTotal,
  selectProductList,
} from "selectors/app";
import { toggleSideCart as toggleSideCartAction } from "actions/cart";
import { setViewingProduct as setViewingProductAction } from "actions/products";

const mapState = createStructuredSelector({
  productList: selectProductList,
  cartCount: selectCartCount,
  cartTotal: selectCartTotal,
});

const mapDispatch = {
  toggleSideCart: toggleSideCartAction,
  viewProduct: setViewingProductAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
