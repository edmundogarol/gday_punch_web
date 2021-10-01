import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import Ui from "./ui";
import { selectUser } from "src/selectors/app";

const mapState = createStructuredSelector({
  user: selectUser,
});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(withRouter(Ui));
