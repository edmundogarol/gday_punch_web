import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Ui from "./ui";

const mapState = createStructuredSelector({});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(withRouter(Ui));
