import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectContactsState } from "selectors/admin";

import {
  fetchContactEntries as fetchContactEntriesAction,
  deleteContactEntry as deleteContactEntryAction,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  contactsState: selectContactsState,
});

const mapDispatch = {
  fetchContactEntries: fetchContactEntriesAction,
  deleteContactEntry: deleteContactEntryAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
