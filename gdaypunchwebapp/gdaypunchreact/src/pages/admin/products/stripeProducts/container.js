import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectProductsState } from "selectors/admin";

import {
  fetchStripeProducts as fetchStripeProductsAction,
  registerStripePrice as registerStripePriceAction,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  productsState: selectProductsState,
});

const mapDispatch = {
  fetchStripeProducts: fetchStripeProductsAction,
  registerStripePrice: registerStripePriceAction,
};

export default connect(mapState, mapDispatch)(Ui);
