import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUser } from "selectors/app";

import Ui from "./ui";

const mapState = createStructuredSelector({
  user: selectUser,
});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(Ui);
