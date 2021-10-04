import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectProductsSimpleState } from "selectors/admin";

import Ui from "./ui";
import { updateCustomerAccessProducts as updateCustomerAccessProductsAction } from "src/actions/admin";

const mapState = createStructuredSelector({
  productsSimpleState: selectProductsSimpleState,
});

const mapDispatch = {
  updateCustomerAccessProducts: updateCustomerAccessProductsAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
