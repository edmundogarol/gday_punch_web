import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectProductsState } from "selectors/admin";

import {} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  productsState: selectProductsState,
});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(Ui);
