import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

// import {} from "selectors/prompts";

// import {} from "actions/prompts";

const mapState = createStructuredSelector({});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(Ui);
