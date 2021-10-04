import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectProductsSimpleState } from "selectors/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  productsSimpleState: selectProductsSimpleState,
});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(withRouter(Ui));
