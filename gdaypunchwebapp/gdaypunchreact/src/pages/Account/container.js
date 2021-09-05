import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

import { selectUser } from "selectors/app";
import { submitContactForm as submitContactFormAction } from "actions/app";

const mapState = createStructuredSelector({
  user: selectUser,
});

const mapDispatch = {
  submitContactForm: submitContactFormAction,
};

export default connect(mapState, mapDispatch)(Ui);
