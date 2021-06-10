import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectProductsState } from "selectors/admin";

import {
  fetchAdminProducts as fetchAdminProductsAction,
  fetchStripeProducts as fetchStripeProductsAction,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  productsState: selectProductsState,
});

const mapDispatch = {
  fetchProducts: fetchAdminProductsAction,
  fetchStripeProducts: fetchStripeProductsAction,
};

export default connect(mapState, mapDispatch)(Ui);
