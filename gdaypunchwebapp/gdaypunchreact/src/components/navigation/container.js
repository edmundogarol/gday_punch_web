import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { doLogout, openRegistration, closeRegistration } from "actions/user";
import {
  selectUser,
  selectLoginViewToggle,
  selectLoggedIn,
} from "selectors/app";
import Ui from "./ui";

const mapState = createStructuredSelector({
  user: selectUser,
  loggedIn: selectLoggedIn,
  loginView: selectLoginViewToggle,
});

const mapDispatch = {
  logout: doLogout,
  openRegister: openRegistration,
  closeRegister: closeRegistration,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
