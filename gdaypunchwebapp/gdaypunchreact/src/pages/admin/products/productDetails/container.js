import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectProductsState, selectCurrentProduct } from "selectors/admin";

import {
  fetchStripePrices as fetchStripePricesAction,
  updateAdminProduct as updateAdminProductAction
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  productsState: selectProductsState,
  currentProduct: selectCurrentProduct,
});

const mapDispatch = {
  fetchStripePrices: fetchStripePricesAction,
  updateAdminProduct: updateAdminProductAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
