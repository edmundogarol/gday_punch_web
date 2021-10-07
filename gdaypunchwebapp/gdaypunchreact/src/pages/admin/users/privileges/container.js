import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import Ui from "./ui";
import { updateUserPrivileges as updateUserPrivilegesAction } from "src/actions/admin";

const mapState = createStructuredSelector({});

const mapDispatch = {
  updateUserPrivileges: updateUserPrivilegesAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
