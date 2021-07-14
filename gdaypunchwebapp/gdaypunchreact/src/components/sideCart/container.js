import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";

import { selectCartState } from "selectors/app";
import { toggleSideCart as toggleSideCartAction } from "src/actions/cart";
import Ui from "./ui";

const mapState = createStructuredSelector({
  cartState: selectCartState,
});

const mapDispatch = {
  toggleSideCart: toggleSideCartAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
