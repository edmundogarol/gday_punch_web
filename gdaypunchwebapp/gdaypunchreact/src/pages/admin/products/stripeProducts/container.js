import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectProductsState } from "selectors/admin";

import { fetchStripeProducts as fetchStripeProductsAction } from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  productsState: selectProductsState,
});

const mapDispatch = {
  fetchStripeProducts: fetchStripeProductsAction,
};

export default connect(mapState, mapDispatch)(Ui);
