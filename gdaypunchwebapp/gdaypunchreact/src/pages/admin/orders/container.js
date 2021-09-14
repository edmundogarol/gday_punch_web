import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectOrderState } from "selectors/admin";

import {
  fetchContactEntries as fetchContactEntriesAction,
  deleteContactEntry as deleteContactEntryAction,
  fetchOrders as fetchOrdersAction,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  ordersState: selectOrderState,
});

const mapDispatch = {
  fetchOrders: fetchOrdersAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
