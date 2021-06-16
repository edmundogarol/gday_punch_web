import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectProductsState } from "selectors/admin";

import {
  fetchAdminProducts as fetchAdminProductsAction,
  createAdminProduct as createAdminProductAction,
  deleteAdminProduct as deleteAdminProductAction,
  setEditProduct as setEditProductAction,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  productsState: selectProductsState,
});

const mapDispatch = {
  fetchProducts: fetchAdminProductsAction,
  createAdminProduct: createAdminProductAction,
  deleteAdminProduct: deleteAdminProductAction,
  setEditProduct: setEditProductAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
