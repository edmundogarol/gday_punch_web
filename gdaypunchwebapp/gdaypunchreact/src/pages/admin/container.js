import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectLoginCheckFinished, selectUser } from "selectors/app";

import Ui from "./ui";

const mapState = createStructuredSelector({
  user: selectUser,
  loginCheckFinished: selectLoginCheckFinished,
});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(Ui);
