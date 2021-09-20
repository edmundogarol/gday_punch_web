import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import Ui from "./ui";
import { fetchViewingOrderAction } from "src/actions/order";
import { selectViewingOrderState } from "src/selectors/orders";

const mapState = createStructuredSelector({
  viewingOrderState: selectViewingOrderState,
});

const mapDispatch = {
  fetchViewingOrder: fetchViewingOrderAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
