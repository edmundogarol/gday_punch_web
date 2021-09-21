import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import Ui from "./ui";

const mapState = createStructuredSelector({});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(withRouter(Ui));
