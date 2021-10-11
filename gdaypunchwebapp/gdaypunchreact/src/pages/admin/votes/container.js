import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectVotingDashboardState } from "selectors/admin";

import { fetchVotingDashboard as fetchVotingDashboardAction } from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  votingDashboardState: selectVotingDashboardState,
});

const mapDispatch = {
  fetchVotingDashboard: fetchVotingDashboardAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
