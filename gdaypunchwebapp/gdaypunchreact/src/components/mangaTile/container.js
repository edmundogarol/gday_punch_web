import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Ui from "./ui";

import { updateCartItems as updateCartItemsAction } from "actions/cart";

const mapState = createStructuredSelector({});

const mapDispatch = {
  updateCartItems: updateCartItemsAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
