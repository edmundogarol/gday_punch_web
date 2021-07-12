import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

import { selectContactState } from "selectors/app";
import {
  submitContactForm as submitContactFormAction,
  contactFormSubmitted as contactFormSubmittedAction,
} from "actions/app";

const mapState = createStructuredSelector({
  contactState: selectContactState,
});

const mapDispatch = {
  submitContactForm: submitContactFormAction,
  contactFormSubmitted: contactFormSubmittedAction,
};

export default connect(mapState, mapDispatch)(Ui);
