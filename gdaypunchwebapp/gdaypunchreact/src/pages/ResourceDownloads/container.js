import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

import {
  downloadManuscriptRequest as downloadManuscriptRequestAction,
  resetDownloadManuscriptRequest as resetDownloadManuscriptRequestAction,
} from "src/actions/resources";
import { selectDownloadManuscriptState } from "src/selectors/resources";
import { selectUser } from "src/selectors/app";

const mapState = createStructuredSelector({
  user: selectUser,
  downloadManuscriptState: selectDownloadManuscriptState,
});

const mapDispatch = {
  downloadManuscriptRequest: downloadManuscriptRequestAction,
  resetDownloadManuscriptRequest: resetDownloadManuscriptRequestAction,
};

export default connect(mapState, mapDispatch)(Ui);
