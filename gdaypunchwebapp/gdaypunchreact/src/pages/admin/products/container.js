import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectProductsState } from "selectors/admin";

import {
  fetchAdminProducts as fetchAdminProductsAction,
  createAdminProduct as createAdminProductAction,
  deleteAdminProduct as deleteAdminProductAction,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  productsState: selectProductsState,
});

const mapDispatch = {
  fetchProducts: fetchAdminProductsAction,
  createAdminProduct: createAdminProductAction,
  deleteAdminProduct: deleteAdminProductAction,
};

export default connect(mapState, mapDispatch)(Ui);
