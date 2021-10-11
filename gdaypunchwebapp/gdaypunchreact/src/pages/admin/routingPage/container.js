import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import Ui from "./ui";
import { selectUser } from "src/selectors/app";
import {
  selectOrdersSalesGraph,
  selectOrdersSalesGraphStatuses,
  selectOrdersSalesGraphTotal,
} from "src/selectors/admin";
import { fetchOrdersSalesGraph as fetchOrdersSalesGraphAction } from "src/actions/admin";

const mapState = createStructuredSelector({
  ordersSales: selectOrdersSalesGraph,
  orderSalesStatuses: selectOrdersSalesGraphStatuses,
  salesTotal: selectOrdersSalesGraphTotal,
  user: selectUser,
});

const mapDispatch = {
  fetchOrdersSalesGraph: fetchOrdersSalesGraphAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
